import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const baseUrl = process.env.BROWSER_QA_BASE_URL ?? "http://127.0.0.1:4317";
const outputDir = resolve(process.env.BROWSER_QA_OUTPUT_DIR ?? ".browser-qa");
const axeSource = await readFile(resolve("node_modules", "axe-core", "axe.min.js"), "utf8");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
];

const { access } = await import("node:fs/promises");
let browserExecutable;
for (const candidate of chromeCandidates) {
  try {
    await access(candidate);
    browserExecutable = candidate;
    break;
  } catch {}
}
if (!browserExecutable) throw new Error("No supported local Chromium browser found");

const debugPort = await new Promise((resolvePort, reject) => {
  const probe = createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    if (!address || typeof address === "string") return reject(new Error("Could not allocate a debugging port"));
    probe.close(() => resolvePort(address.port));
  });
});

const profileDir = await mkdtemp(join(tmpdir(), "seo-ai-agent-browser-qa-"));
await mkdir(outputDir, { recursive: true });
const browserProcess = spawn(browserExecutable, [
  "--headless=new",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDir}`,
  "--no-first-run",
  "--disable-default-apps",
  "--disable-extensions",
  "--disable-background-networking",
  "--hide-scrollbars",
  "about:blank"
], { stdio: "ignore", windowsHide: true });

const waitForDebugger = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error("Chromium debugging endpoint did not start");
};

let socket;
const errors = [];
const axeResults = [];
try {
  await waitForDebugger();
  const targetResponse = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(baseUrl)}`, { method: "PUT" });
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.text);
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") errors.push(message.params.entry.text);
  });

  const command = (method, params = {}) => new Promise((resolveCommand, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve: resolveCommand, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitForPage = async () => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const ready = await evaluate("document.readyState === 'complete' && Boolean(document.querySelector('h1'))");
      if (ready) return;
      await new Promise((resolveWait) => setTimeout(resolveWait, 100));
    }
    throw new Error("Page did not become ready");
  };
  const navigate = async (path, viewport) => {
    await command("Emulation.setDeviceMetricsOverride", viewport);
    await command("Page.navigate", { url: `${baseUrl}${path}` });
    await waitForPage();
    await new Promise((resolveWait) => setTimeout(resolveWait, 700));
    await evaluate("scrollTo(0, 0); true");
  };
  const screenshot = async (name) => {
    const capture = await command("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    const file = resolve(outputDir, name);
    await writeFile(file, Buffer.from(capture.data, "base64"));
    return file;
  };
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const pressKey = async (key, code = key) => {
    await command("Input.dispatchKeyEvent", { type: "keyDown", key, code });
    await command("Input.dispatchKeyEvent", { type: "keyUp", key, code });
  };
  const runAxe = async (label) => {
    await evaluate(`${axeSource}\n;true`);
    const result = JSON.parse(await evaluate(`(async () => JSON.stringify(await axe.run(document, { resultTypes: ["violations"] })))()`));
    const violations = result.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length, targets: nodes.map((node) => node.target.join(" ")) }));
    axeResults.push({ label, violations });
    assert(violations.length === 0, `${label}: Axe violations: ${violations.map((item) => `${item.id} (${item.impact}, ${item.nodes}: ${item.targets.join(" | ")})`).join(", ")}`);
  };

  await command("Page.enable");
  await command("Runtime.enable");
  await command("Log.enable");
  await command("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });

  const desktopViewport = { width: 1536, height: 1024, deviceScaleFactor: 1, mobile: false };

  await navigate("/", desktopViewport);
  const desktop = JSON.parse(await evaluate(`JSON.stringify({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelector("h1")?.textContent.trim(),
    noindex: document.querySelector('meta[name="robots"]')?.content,
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    primaryCta: document.querySelector('.hero .button-primary')?.textContent.trim()
  })`));
  const performance = JSON.parse(await evaluate(`JSON.stringify((() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    return {
      responseEndMs: Math.round(navigation.responseEnd),
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadMs: Math.round(navigation.loadEventEnd),
      firstContentfulPaintMs: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
      resourceCount: resources.length,
      encodedBytes: Math.round(resources.reduce((sum, item) => sum + (item.encodedBodySize || 0), 0))
    };
  })())`));
  assert(performance.loadMs > 0 && performance.loadMs < 3000, "Local homepage load timing exceeded 3000 ms");
  assert(performance.firstContentfulPaintMs > 0 && performance.firstContentfulPaintMs < 3000, "Local homepage FCP timing exceeded 3000 ms");
  assert(performance.encodedBytes < 2_000_000, "Local homepage encoded resources exceeded 2 MB");
  assert(desktop.lang === "de", "Desktop document language is not de");
  assert(desktop.h1 === "Der SEO Agent Skill, den du sofort benutzen kannst.", "Desktop h1 mismatch");
  assert(desktop.noindex == null, "Indexable homepage still exposes a robots meta directive");
  assert(desktop.scrollWidth <= desktop.viewport, "Desktop horizontal overflow detected");
  await runAxe("homepage desktop");
  const desktopScreenshot = await screenshot("homepage-desktop.png");
  await evaluate("document.activeElement?.blur(); document.body.setAttribute('tabindex', '-1'); document.body.focus(); true");
  await pressKey("Tab");
  const firstKeyboardTarget = await evaluate("document.activeElement?.className ?? ''");
  assert(String(firstKeyboardTarget).includes("skip-link"), "First keyboard target is not the skip link");
  await pressKey("Enter");
  const skipLinkTarget = await evaluate("document.activeElement?.id ?? ''");
  assert(skipLinkTarget === "main-content", "Skip link did not move focus to main content");
  const keyboard = { firstKeyboardTarget, skipLinkTarget };

  await navigate("/faehigkeiten", desktopViewport);
  const capabilities = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector("h1")?.textContent.trim(),
    capabilityCards: document.querySelectorAll(".capability-grid article").length,
    contextterDisclosure: document.body.textContent.includes("Contextter und diese Website werden gemeinsam betrieben"),
    mcpDisclosure: document.body.textContent.includes("seo-mcp.de und seo-ai-agent.de werden im selben Contextter-Portfolio von Matthias Ramahi betrieben"),
    contextterLink: document.querySelector('a[href="https://contextter.com/"]')?.href,
    mcpLink: document.querySelector('a[href="https://seo-mcp.de/capabilities"]')?.href,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(capabilities.h1 === "Fähigkeiten zählen erst mit Evidenz.", "Capabilities h1 mismatch");
  assert(capabilities.capabilityCards === 5, "Capabilities page must expose five task-oriented fields");
  assert(capabilities.contextterDisclosure && capabilities.mcpDisclosure, "Capabilities ownership disclosure is incomplete");
  assert(capabilities.contextterLink && capabilities.mcpLink, "Capabilities contextual links are missing");
  assert(capabilities.scrollWidth <= capabilities.viewport, "Capabilities horizontal overflow detected");
  await runAxe("capabilities desktop");
  const capabilitiesScreenshot = await screenshot("capabilities-desktop.png");

  await navigate("/mcp-fuer-seo-agenten", desktopViewport);
  const mcp = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector("h1")?.textContent.trim(),
    principles: document.querySelectorAll(".mcp-principles li").length,
    endpointUnavailable: document.body.textContent.includes("kein öffentlicher Contextter-MCP-Endpunkt"),
    connectDisabled: document.body.textContent.includes("Der SEO Agent Skill benötigt keine Verbindung"),
    contextterLink: document.querySelector('a[href="https://contextter.com/"]')?.href,
    mcpLink: document.querySelector('a[href="https://seo-mcp.de/capabilities"]')?.href,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(mcp.h1 === "MCP macht Daten erreichbar. Nicht automatisch richtig.", "MCP page h1 mismatch");
  assert(mcp.principles === 5, "MCP page must expose five principles");
  assert(mcp.endpointUnavailable && mcp.connectDisabled, "MCP readiness boundary is incomplete");
  assert(mcp.contextterLink && mcp.mcpLink, "MCP informational links are missing");
  assert(mcp.scrollWidth <= mcp.viewport, "MCP page horizontal overflow detected");
  await runAxe("MCP desktop");
  const mcpScreenshot = await screenshot("mcp-desktop.png");

  await navigate("/seo-agent-kosten", desktopViewport);
  const costCalculator = JSON.parse(await evaluate(`(async () => {
    const runs = document.querySelector('[name="runs"]');
    const review = document.querySelector('[name="reviewMinutes"]');
    runs.value = '20';
    review.value = '15';
    runs.dispatchEvent(new Event('input', { bubbles: true }));
    review.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 50));
    return JSON.stringify({
      h1: document.querySelector('h1')?.textContent.trim(),
      total: document.querySelector('[data-total]')?.textContent.trim(),
      fields: document.querySelectorAll('.cost-form input').length,
      local: document.body.textContent.includes('Keine Übertragung'),
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    });
  })()`));
  assert(costCalculator.h1 === "SEO-Agent-Kosten beginnen vor dem ersten Lauf.", "Cost calculator h1 mismatch");
  assert(costCalculator.total.includes("542,80"), "Cost calculator did not update the expected total");
  assert(costCalculator.fields === 7 && costCalculator.local, "Cost calculator fields or local boundary missing");
  assert(costCalculator.scrollWidth <= costCalculator.viewport, "Cost calculator horizontal overflow detected");
  await runAxe("cost calculator desktop");
  const costScreenshot = await screenshot("cost-calculator-desktop.png");

  await navigate("/fehlerbehandlung-seo-agenten", desktopViewport);
  const failureHandling = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    rows: document.querySelectorAll('.failure-table article').length,
    contract: document.body.textContent.includes('max_retries_per_step'),
    primarySource: document.querySelector('a[href="https://airc.nist.gov/airmf-resources/playbook/manage/"]')?.href,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(failureHandling.h1 === "Ein guter SEO-Agent weiß, wann er stoppen muss.", "Failure handling h1 mismatch");
  assert(failureHandling.rows === 6 && failureHandling.contract && failureHandling.primarySource, "Failure handling matrix, contract, or source missing");
  assert(failureHandling.scrollWidth <= failureHandling.viewport, "Failure handling horizontal overflow detected");
  await runAxe("failure handling desktop");
  const failureScreenshot = await screenshot("failure-handling-desktop.png");
  await navigate("/agenten-vergleich", desktopViewport);
  const comparison = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    approaches: document.querySelectorAll('.approach-table article').length,
    gates: document.querySelectorAll('.comparison-gates article').length,
    selectionSteps: document.querySelectorAll('.selection-path li').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(comparison.h1 === "Erst den Risikorahmen wählen. Dann das System.", "Comparison h1 mismatch");
  assert(comparison.approaches === 3 && comparison.gates === 4 && comparison.selectionSteps === 3, "Comparison decision content is incomplete");
  assert(comparison.scrollWidth <= comparison.viewport, "Comparison horizontal overflow detected");
  await runAxe("comparison desktop");
  const comparisonScreenshot = await screenshot("comparison-desktop.png");
  await navigate("/aufgaben", desktopViewport);
  const library = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector("h1")?.textContent.trim(),
    taskRows: document.querySelectorAll(".task-library-item").length,
    openRows: document.querySelectorAll(".task-library-item[open]").length,
    ownerDisclosure: document.body.textContent.includes("Contextter erhält keinen automatischen Siegerstatus"),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(library.h1 === "Drei Aufgaben. Klar begrenzt.", "Task library h1 mismatch");
  assert(library.taskRows === 3, "Task library does not expose three tasks");
  assert(library.openRows === 1, "Task library default expansion state changed");
  assert(library.ownerDisclosure, "Task library ownership boundary is missing");
  assert(library.scrollWidth <= library.viewport, "Task library horizontal overflow detected");
  await runAxe("task library desktop");
  const libraryScreenshot = await screenshot("library-desktop.png");

  await navigate("/seo-agent-skill?task=keyword-opportunities", desktopViewport);
  const interaction = JSON.parse(await evaluate(`(async () => {
    const task = document.querySelector('[data-skill-form] [name="task"]');
    task.value = 'internal-links';
    task.dispatchEvent(new Event('change', { bubbles: true }));
    const domain = document.querySelector('[data-skill-form] [name="domain"]');
    domain.value = 'https://example.com';
    domain.dispatchEvent(new Event('input', { bubbles: true }));
    const focus = document.querySelector('[data-skill-form] [name="focus"]');
    focus.value = 'Kategorie-Seiten zuerst';
    focus.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('[data-skill-form]').requestSubmit();
    await new Promise((resolve) => setTimeout(resolve, 30));
    return JSON.stringify({
      output: document.querySelector('[data-skill-output]').textContent,
      labels: document.querySelectorAll('[data-skill-form] label').length,
      hasCopy: Boolean(document.querySelector('[data-copy-skill]')),
      hasDownload: Boolean(document.querySelector('[data-download-skill]')),
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth
    });
  })()`));
  assert(interaction.output.includes("Finde nachvollziehbare interne Linkchancen") && interaction.output.includes("https://example.com") && interaction.output.includes("Kategorie-Seiten zuerst"), "Skill Generator did not update the generated skill");
  assert(interaction.output.includes("Erfinde keine Rankings") && interaction.labels === 3, "Skill Generator is not simple or evidence bounded");
  assert(interaction.hasCopy && interaction.hasDownload, "Skill Generator actions are incomplete");
  assert(interaction.scrollWidth <= interaction.viewport, "Skill Generator horizontal overflow detected");
  await runAxe("skill generator desktop");
  const builderScreenshot = await screenshot("seo-agent-skill-desktop.png");

  await navigate("/benchmarks", desktopViewport);
  const benchmarkHub = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    runs: document.querySelectorAll('.published-run').length,
    gates: document.querySelectorAll('.gate-list > div').length,
    gscNotProven: document.body.textContent.includes('Authentifizierte Search Console') && document.body.textContent.includes('NOT PROVEN'),
    providerBudgetBlocked: document.body.textContent.includes('Provider- und Arbeitskostenbudget') && document.body.textContent.includes('Nicht fixiert'),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(benchmarkHub.h1 === "Zwei ausgeführte Läufe. Noch keine Rangliste.", "Benchmark hub h1 mismatch");
  assert(benchmarkHub.runs === 2 && benchmarkHub.gates === 8, "Benchmark hub run or gate count mismatch");
  assert(benchmarkHub.gscNotProven && benchmarkHub.providerBudgetBlocked, "Benchmark hub GSC or provider-budget gate missing");
  assert(benchmarkHub.scrollWidth <= benchmarkHub.viewport, "Benchmark hub desktop horizontal overflow detected");
  await runAxe("benchmark hub desktop");
  const benchmarkHubScreenshot = await screenshot("benchmark-hub-desktop.png");

  await navigate("/benchmarks/2026-08-22-technische-audit-triage", desktopViewport);
  const runEvidence = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    owner: document.body.textContent.includes('Matthias Ramahi'),
    reviewMissing: document.body.textContent.includes('Nicht unabhängig menschlich reviewed'),
    noRanking: document.body.textContent.includes('Der Lauf misst keine Rankings'),
    rawRows: document.querySelectorAll('.raw-observation-table > div:not(.raw-observation-head)').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(runEvidence.h1 === "Technische Audit-Triage · R1", "Run page h1 mismatch");
  assert(runEvidence.owner && runEvidence.reviewMissing && runEvidence.noRanking, "Run evidence disclosure is incomplete");
  assert(runEvidence.rawRows === 14, "Run page does not expose 14 raw observations");
  assert(runEvidence.scrollWidth <= runEvidence.viewport, "Run page horizontal overflow detected");
  await runAxe("run evidence desktop");
  const runScreenshot = await screenshot("run-evidence-desktop.png");

  await navigate("/benchmarks/2026-08-22-interne-link-evidenz", desktopViewport);
  const linkRunEvidence = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    partial: document.body.textContent.includes('PARTIAL'),
    reviewMissing: document.body.textContent.includes('Nicht unabhängig menschlich reviewed'),
    candidates: document.querySelectorAll('.finding-ledger > article').length,
    evidencePassed: document.body.textContent.includes('10 / 10 bestanden'),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(linkRunEvidence.h1 === "Interne Link-Evidenz · R1", "Link run page h1 mismatch");
  assert(linkRunEvidence.partial && linkRunEvidence.reviewMissing && linkRunEvidence.evidencePassed, "Link run partial/review evidence is incomplete");
  assert(linkRunEvidence.candidates === 10, "Link run page does not expose ten candidates");
  assert(linkRunEvidence.scrollWidth <= linkRunEvidence.viewport, "Link run desktop horizontal overflow detected");
  await runAxe("link run evidence desktop");
  const linkRunScreenshot = await screenshot("link-run-evidence-desktop.png");

  await navigate("/datenschutz", desktopViewport);
  const legal = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    noTracking: document.body.textContent.includes('Keine Analyse, Cookies oder Formulare'),
    localBuilder: document.body.textContent.includes('ausschließlich im Arbeitsspeicher des Browsers'),
    localCalculator: document.body.textContent.includes('SEO-Agent-Kostenrechner'),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(legal.h1 === "Datenschutz", "Privacy page h1 mismatch");
  assert(legal.noTracking && legal.localBuilder && legal.localCalculator, "Privacy implementation truth is incomplete");
  assert(legal.scrollWidth <= legal.viewport, "Privacy page horizontal overflow detected");
  await runAxe("privacy desktop");
  const legalScreenshot = await screenshot("datenschutz-desktop.png");

  await navigate("/benchmarks", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const benchmarkHubMobile = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    runs: document.querySelectorAll('.published-run').length,
    gates: document.querySelectorAll('.gate-list > div').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(benchmarkHubMobile.h1 === "Zwei ausgeführte Läufe. Noch keine Rangliste.", "Mobile benchmark hub h1 mismatch");
  assert(benchmarkHubMobile.runs === 2 && benchmarkHubMobile.gates === 8, "Mobile benchmark hub run or gate count mismatch");
  assert(benchmarkHubMobile.scrollWidth <= benchmarkHubMobile.viewport, "Mobile benchmark hub horizontal overflow detected");
  await runAxe("benchmark hub mobile");
  const benchmarkHubMobileScreenshot = await screenshot("benchmark-hub-mobile.png");

  await navigate("/benchmarks/2026-08-22-interne-link-evidenz", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const linkRunMobile = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    candidates: document.querySelectorAll('.finding-ledger > article').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(linkRunMobile.h1 === "Interne Link-Evidenz · R1" && linkRunMobile.candidates === 10, "Mobile link run content is incomplete");
  assert(linkRunMobile.scrollWidth <= linkRunMobile.viewport, "Mobile link run horizontal overflow detected");
  await runAxe("link run evidence mobile");
  const linkRunMobileScreenshot = await screenshot("link-run-evidence-mobile.png");

  await navigate("/seo-agent-kosten", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const costMobile = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    fields: document.querySelectorAll('.cost-form input').length,
    total: document.querySelector('[data-total]')?.textContent.trim(),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(costMobile.h1 === "SEO-Agent-Kosten beginnen vor dem ersten Lauf.", "Mobile cost calculator h1 mismatch");
  assert(costMobile.fields === 7 && costMobile.total, "Mobile cost calculator is incomplete");
  assert(costMobile.scrollWidth <= costMobile.viewport, "Mobile cost calculator horizontal overflow detected");
  await runAxe("cost calculator mobile");
  const costMobileScreenshot = await screenshot("cost-calculator-mobile.png");
  await navigate("/seo-agent-skill", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const builderMobile = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
    fields: document.querySelectorAll('[data-skill-form] label').length,
    output: document.querySelector('[data-skill-output]')?.textContent
  })`));
  assert(builderMobile.h1 === "Dein bester SEO Agent Skill. In 30 Sekunden.", "Mobile Skill Generator h1 mismatch");
  assert(builderMobile.scrollWidth <= builderMobile.viewport, "Mobile Skill Generator horizontal overflow detected");
  assert(builderMobile.fields === 3 && builderMobile.output.includes("SEO Agent Skill"), "Mobile Skill Generator is incomplete");
  await runAxe("skill generator mobile");
  const builderMobileScreenshot = await screenshot("seo-agent-skill-mobile.png");

  await navigate("/", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mobile = JSON.parse(await evaluate(`JSON.stringify({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    mobileMenuVisible: getComputedStyle(document.querySelector('.mobile-menu')).display !== 'none',
    desktopNavHidden: getComputedStyle(document.querySelector('.desktop-nav')).display === 'none',
    h1: document.querySelector('h1')?.textContent.trim()
  })`));
  assert(mobile.viewport === 390, "Mobile viewport mismatch");
  assert(mobile.scrollWidth <= mobile.viewport, "Mobile horizontal overflow detected");
  assert(mobile.mobileMenuVisible && mobile.desktopNavHidden, "Mobile navigation breakpoint failed");
  await runAxe("homepage mobile");
  const mobileScreenshot = await screenshot("homepage-mobile.png");

  await navigate("/en", desktopViewport);
  const englishHome = JSON.parse(await evaluate(`JSON.stringify({
    lang: document.documentElement.lang,
    h1: document.querySelector('h1')?.textContent.trim(),
    alternateGerman: document.querySelector('link[hreflang="de"]')?.href,
    alternateEnglish: document.querySelector('link[hreflang="en"]')?.href,
    languageSwitch: document.querySelector('.language-switch')?.getAttribute('href'),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(englishHome.lang === "en" && englishHome.h1 === "The SEO Agent Skill you can use right away.", "English homepage language or h1 mismatch");
  assert(englishHome.alternateGerman === "https://seo-ai-agent.de/" && englishHome.alternateEnglish === "https://seo-ai-agent.de/en", "English homepage hreflang pair mismatch");
  assert(englishHome.languageSwitch === "/", "English homepage language switch is not path-paired");
  assert(englishHome.scrollWidth <= englishHome.viewport, "English homepage desktop overflow detected");
  await runAxe("English homepage desktop");
  const englishHomeScreenshot = await screenshot("homepage-en-desktop.png");

  await navigate("/en/workflows", desktopViewport);
  const englishWorkflows = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    workflows: document.querySelectorAll('.workflow-list article').length,
    steps: document.querySelectorAll('.execution-path li').length,
    contextterDisclosure: document.body.textContent.includes('Contextter and SEO AI Agent share the same operator'),
    connectClaim: document.body.textContent.includes('no public MCP endpoint is claimed'),
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(englishWorkflows.h1 === "From an SEO job to a reusable skill.", "English workflows h1 mismatch");
  assert(englishWorkflows.workflows === 4 && englishWorkflows.steps === 5, "English workflows count mismatch");
  assert(englishWorkflows.contextterDisclosure && englishWorkflows.connectClaim, "English workflow ownership or MCP boundary missing");
  assert(englishWorkflows.scrollWidth <= englishWorkflows.viewport, "English workflows desktop overflow detected");
  await runAxe("English workflows desktop");
  const englishWorkflowsScreenshot = await screenshot("workflows-en-desktop.png");

  await navigate("/en/seo-agent-skill?task=keyword-opportunities", desktopViewport);
  await command("Runtime.evaluate", { expression: `(() => { const root = document.querySelector('[data-seo-skill-generator]'); const select = root.querySelector('[name="task"]'); select.value = 'content-opportunity'; select.dispatchEvent(new Event('change', { bubbles: true })); const domain = root.querySelector('[name="domain"]'); domain.value = 'https://example.com'; domain.dispatchEvent(new Event('input', { bubbles: true })); })()` });
  const englishBuilder = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    output: document.querySelector('[data-skill-output]')?.textContent,
    fields: document.querySelectorAll('[data-skill-form] label').length,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(englishBuilder.h1 === "Your best SEO Agent Skill. In 30 seconds.", "English Skill Generator h1 mismatch");
  assert(englishBuilder.output.includes('Find real content gaps') && englishBuilder.output.includes('https://example.com'), "English Skill Generator did not update output");
  assert(englishBuilder.fields === 3 && englishBuilder.output.includes('Never invent rankings'), "English Skill Generator is not simple or evidence bounded");
  assert(englishBuilder.scrollWidth <= englishBuilder.viewport, "English Skill Generator desktop overflow detected");
  await runAxe("English skill generator desktop");
  const englishBuilderScreenshot = await screenshot("seo-agent-skill-en-desktop.png");

  await navigate("/en", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const englishMobile = JSON.parse(await evaluate(`JSON.stringify({
    h1: document.querySelector('h1')?.textContent.trim(),
    menu: getComputedStyle(document.querySelector('.mobile-menu')).display,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth
  })`));
  assert(englishMobile.h1 === "The SEO Agent Skill you can use right away." && englishMobile.menu !== "none", "English mobile homepage or navigation failed");
  assert(englishMobile.scrollWidth <= englishMobile.viewport, "English homepage mobile overflow detected");
  await runAxe("English homepage mobile");
  const englishMobileScreenshot = await screenshot("homepage-en-mobile.png");

  assert(errors.length === 0, `Browser console/runtime errors: ${errors.join(" | ")}`);
  console.log(JSON.stringify({ browserExecutable, desktop, performance, keyboard, capabilities, mcp, costCalculator, failureHandling, comparison, library, interaction, benchmarkHub, runEvidence, linkRunEvidence, legal, benchmarkHubMobile, linkRunMobile, costMobile, builderMobile, mobile, englishHome, englishWorkflows, englishBuilder, englishMobile, axeResults, screenshots: [desktopScreenshot, capabilitiesScreenshot, mcpScreenshot, costScreenshot, failureScreenshot, comparisonScreenshot, libraryScreenshot, builderScreenshot, benchmarkHubScreenshot, runScreenshot, linkRunScreenshot, legalScreenshot, benchmarkHubMobileScreenshot, linkRunMobileScreenshot, costMobileScreenshot, builderMobileScreenshot, mobileScreenshot, englishHomeScreenshot, englishWorkflowsScreenshot, englishBuilderScreenshot, englishMobileScreenshot], errors }, null, 2));
} finally {
  if (socket?.readyState === WebSocket.OPEN) socket.close();
  browserProcess.kill();
  await new Promise((resolveWait) => setTimeout(resolveWait, 300));
  await rm(profileDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 150 });
}
