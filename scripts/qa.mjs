import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const domain = "seo-ai-agent.de";
const origin = `https://${domain}`;
const pageRoutes = [
  "/", "/workflows", "/seo-agent-skill", "/aufgaben",
  "/aufgaben/technische-audit-triage", "/aufgaben/keyword-chancen-priorisieren",
  "/aufgaben/interne-links-begruenden", "/benchmarks",
  "/benchmarks/2026-08-22-technische-audit-triage",
  "/benchmarks/2026-08-22-interne-link-evidenz", "/agenten-vergleich",
  "/faehigkeiten", "/mcp-fuer-seo-agenten", "/seo-agent-kosten",
  "/fehlerbehandlung-seo-agenten", "/methodik-und-konflikte",
  "/quellen-und-rechte", "/impressum", "/datenschutz",
  "/en", "/en/workflows", "/en/seo-agent-skill", "/en/tasks",
  "/en/tasks/technical-audit-triage", "/en/tasks/prioritize-keyword-opportunities",
  "/en/tasks/justify-internal-links", "/en/runs",
  "/en/runs/2026-08-22-technical-audit-triage",
  "/en/runs/2026-08-22-internal-link-evidence", "/en/capabilities",
  "/en/mcp-for-seo-agents", "/en/agent-comparison", "/en/seo-agent-costs",
  "/en/failure-handling", "/en/methodology", "/en/sources-and-rights",
  "/en/legal-notice", "/en/privacy"
];
const collectionRoutes = new Set(["/workflows", "/aufgaben", "/benchmarks", "/faehigkeiten", "/en/workflows", "/en/tasks", "/en/runs", "/en/capabilities"]);
const runRoute = "/benchmarks/2026-08-22-technische-audit-triage";
const linkRunRoute = "/benchmarks/2026-08-22-interne-link-evidenz";
const languagePairs = [
  ["/", "/en"], ["/workflows", "/en/workflows"], ["/seo-agent-skill", "/en/seo-agent-skill"], ["/aufgaben", "/en/tasks"],
  ["/aufgaben/technische-audit-triage", "/en/tasks/technical-audit-triage"], ["/aufgaben/keyword-chancen-priorisieren", "/en/tasks/prioritize-keyword-opportunities"], ["/aufgaben/interne-links-begruenden", "/en/tasks/justify-internal-links"],
  ["/benchmarks", "/en/runs"], [runRoute, "/en/runs/2026-08-22-technical-audit-triage"], [linkRunRoute, "/en/runs/2026-08-22-internal-link-evidence"],
  ["/faehigkeiten", "/en/capabilities"], ["/mcp-fuer-seo-agenten", "/en/mcp-for-seo-agents"], ["/agenten-vergleich", "/en/agent-comparison"], ["/seo-agent-kosten", "/en/seo-agent-costs"], ["/fehlerbehandlung-seo-agenten", "/en/failure-handling"],
  ["/methodik-und-konflikte", "/en/methodology"], ["/quellen-und-rechte", "/en/sources-and-rights"], ["/impressum", "/en/legal-notice"], ["/datenschutz", "/en/privacy"]
];

const failures = [];
const routeFile = (route) => route === "/" ? resolve(dist, "index.html") : resolve(dist, route.slice(1), "index.html");
const check = (passed, message) => { if (!passed) failures.push(message); };
const pageHtml = new Map();
const schemaByRoute = new Map();

for (const route of pageRoutes) {
  const file = routeFile(route);
  await access(file);
  const html = await readFile(file, "utf8");
  pageHtml.set(route, html);
  const expectedLanguage = route === "/en" || route.startsWith("/en/") ? "en" : "de";
  check(html.includes(`<html lang="${expectedLanguage}">`), `${route}: document language must be ${expectedLanguage}`);
  check(!/<meta\s+name="robots"/i.test(html), `${route}: indexable canonical page must not contain a robots meta directive`);
  check(!/noindex/i.test(html.split("</head>", 1)[0]), `${route}: noindex remains in the document head`);
  check(html.includes(`href="${origin}${route === "/" ? "/" : route}"`), `${route}: canonical URL is missing or wrong`);
  check(html.includes('rel="sitemap" href="/sitemap-index.xml"'), `${route}: sitemap discovery link is missing`);
  check((html.match(/<h1\b/g) ?? []).length === 1, `${route}: expected exactly one h1`);
  check(!/\{\{[^}]+\}\}|__[_A-Z]+__/.test(html), `${route}: unresolved template token found`);
  check(!/Testsieger|bester SEO-Agent|unabhängige Bewertung/i.test(html), `${route}: prohibited winner or independence claim found`);
  for (const socialTag of [
    `property="og:image" content="${origin}/social-card.png"`,
    'property="og:image:width" content="1200"',
    'property="og:image:height" content="630"',
    'name="twitter:card" content="summary_large_image"',
    `name="twitter:image" content="${origin}/social-card.png"`
  ]) check(html.includes(socialTag), `${route}: social card metadata missing: ${socialTag}`);

  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  check(scripts.length === 1, `${route}: expected exactly one JSON-LD block`);
  if (scripts.length === 1) {
    try {
      const schema = JSON.parse(scripts[0][1]);
      const graph = Array.isArray(schema["@graph"]) ? schema["@graph"] : [];
      schemaByRoute.set(route, graph);
      const pageType = collectionRoutes.has(route) ? "CollectionPage" : "WebPage";
      check(graph.some((node) => node["@type"] === pageType && node.url === `${origin}${route === "/" ? "/" : route}`), `${route}: ${pageType} schema missing or URL mismatch`);
      const websites = graph.filter((node) => node["@type"] === "WebSite");
      check(route === "/" ? websites.length === 1 : websites.length === 0, `${route}: WebSite schema must exist only on root`);
    } catch (error) {
      failures.push(`${route}: invalid JSON-LD: ${error.message}`);
    }
  }
}

for (const [route, html] of pageHtml) {
  const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathname = href.split(/[?#]/, 1)[0];
    if (/\.[a-z0-9]+$/i.test(pathname)) {
      try { await access(resolve(dist, pathname.slice(1))); }
      catch { failures.push(`${route}: broken internal artifact link ${href}`); }
      continue;
    }
    const normalized = pathname.replace(/\/$/, "") || "/";
    try { await access(routeFile(normalized)); }
    catch { failures.push(`${route}: broken internal link ${href}`); }
  }
}

for (const [deRoute, enRoute] of languagePairs) {
  const deHtml = pageHtml.get(deRoute);
  const enHtml = pageHtml.get(enRoute);
  const deUrl = `${origin}${deRoute === "/" ? "/" : deRoute}`;
  const enUrl = `${origin}${enRoute}`;
  for (const [route, html] of [[deRoute, deHtml], [enRoute, enHtml]]) {
    check(html.includes(`rel="alternate" hreflang="de" href="${deUrl}"`), `${route}: German hreflang target mismatch`);
    check(html.includes(`rel="alternate" hreflang="en" href="${enUrl}"`), `${route}: English hreflang target mismatch`);
    check(html.includes(`rel="alternate" hreflang="x-default" href="${deUrl}"`), `${route}: x-default hreflang target mismatch`);
  }
}

const allSchemas = [...schemaByRoute.values()].flat();
check(allSchemas.filter((node) => node["@type"] === "WebSite").length === 1, "schema: expected exactly one WebSite entity across the site");
check(allSchemas.filter((node) => node["@type"] === "Dataset").length === 2, "schema: Dataset must exist only for the two real reproducible runs");
check((schemaByRoute.get(runRoute) ?? []).some((node) => node["@type"] === "Dataset" && node.creator?.name === "Matthias Ramahi"), "schema: technical run Dataset or creator missing");
check((schemaByRoute.get(linkRunRoute) ?? []).some((node) => node["@type"] === "Dataset" && node.creator?.name === "Matthias Ramahi"), "schema: link run Dataset or creator missing");
check(allSchemas.filter((node) => node["@type"] === "SoftwareApplication").length === 2, "schema: SoftwareApplication must exist only for the two localized Skill Generator pages");
check((schemaByRoute.get("/seo-agent-skill") ?? []).some((node) => node["@type"] === "SoftwareApplication"), "schema: German Skill Generator SoftwareApplication missing");
check((schemaByRoute.get("/en/seo-agent-skill") ?? []).some((node) => node["@type"] === "SoftwareApplication"), "schema: English Skill Generator SoftwareApplication missing");

const capabilities = pageHtml.get("/faehigkeiten");
const mcp = pageHtml.get("/mcp-fuer-seo-agenten");
for (const [route, html] of [["/faehigkeiten", capabilities], ["/mcp-fuer-seo-agenten", mcp]]) {
  check(html.includes('href="https://contextter.com/"'), `${route}: Contextter link missing`);
  check(html.includes('href="https://seo-mcp.de/capabilities"'), `${route}: seo-mcp capability link missing`);
  check(html.includes("Eigentumshinweis:"), `${route}: adjacent common-ownership disclosure missing`);
  check(html.includes("keine unabhängige") || html.includes("keine unabhängigen"), `${route}: independence boundary missing`);
}
const footerSource = await readFile(resolve(root, "src", "components", "SiteFooter.astro"), "utf8");
check(!footerSource.includes("contextter.com") && !footerSource.includes("seo-mcp.de"), "footer: cross-domain portfolio network link found");

const skill = pageHtml.get("/seo-agent-skill");
check(skill.includes("data-seo-skill-generator") && skill.includes('class="skill-form"'), "skill generator: local form is missing");
check((skill.match(/<label\b/g) ?? []).length === 3, "skill generator: must keep exactly three simple inputs");
check(skill.includes("data-copy-skill") && skill.includes("data-download-skill"), "skill generator: copy or SKILL.md download action missing");
check(skill.includes("Keine Anmeldung · keine API · kostenlos"), "skill generator: simple product promise missing");
check(skill.includes("Er erfindet keine Rankings") && skill.includes("Alles bleibt lokal in deinem Browser"), "skill generator: evidence or local-processing boundary missing");
check(skill.includes("versteckt keine Tool-Werbung") && skill.includes("offengelegter gemeinsamer Eigentümerschaft"), "skill generator: transparent recommendation boundary missing");
for (const url of ["https://ai-fanout.com/", "https://seo-fanout.com/", "https://analysespider.com/", "https://seo-mcp.de/capabilities"]) check(skill.includes(`href="${url}"`), `skill generator: relevant tool link missing: ${url}`);
check(skill.includes("selben Betreiber") && skill.includes("keine unabhängigen Empfehlungen"), "skill generator: adjacent ownership disclosure missing");
const englishSkill = pageHtml.get("/en/seo-agent-skill");
check(englishSkill.includes("data-seo-skill-generator") && englishSkill.includes("Create SEO Agent Skill"), "English skill generator: localized surface missing");
check(englishSkill.includes("data-copy-skill") && englishSkill.includes("data-download-skill"), "English skill generator: copy or SKILL.md download action missing");

const costPage = pageHtml.get("/seo-agent-kosten");
const failurePage = pageHtml.get("/fehlerbehandlung-seo-agenten");
check(costPage.includes("data-cost-calculator") && costPage.includes("data-cost-form"), "cost calculator: local calculation surface missing");
check(costPage.includes("Keine Übertragung") && costPage.includes("keine Preisbehauptung"), "cost calculator: local and non-market-price boundaries missing");
check(failurePage.includes("Nicht jeder Fehler ist ein Retry") && failurePage.includes("max_retries_per_step"), "failure handling: decision matrix or contract missing");
check(failurePage.includes("https://airc.nist.gov/airmf-resources/playbook/manage/"), "failure handling: primary source link missing");

const benchmark = pageHtml.get("/benchmarks");
const runPage = pageHtml.get(runRoute);
check(benchmark.includes("Matthias Ramahi") && benchmark.includes("Nicht vorhanden · offengelegt"), "benchmark hub: owner or missing independent review disclosure is absent");
check(benchmark.includes("Provider- und Arbeitskostenbudget") && benchmark.includes("NOT PROVEN"), "benchmark hub: provider cost or authenticated GSC gate missing");
check(runPage.includes("SEO-AI-001-2026-08-22-R1"), "run page: run ID missing");
check(runPage.includes("Nicht unabhängig menschlich reviewed"), "run page: review status missing");
check(runPage.includes("Der Lauf misst keine Rankings und behauptet keine aktive MCP-Verbindung"), "run page: ranking or MCP boundary missing");
check((runPage.match(/class="raw-observation-head"/g) ?? []).length === 1, "run page: raw observation table missing");
const linkRunPage = pageHtml.get(linkRunRoute);
check(linkRunPage.includes("SEO-AI-003-2026-08-22-R1") && linkRunPage.includes("PARTIAL"), "link run page: run ID or partial status missing");
check(linkRunPage.includes("10 / 10 bestanden") && linkRunPage.includes("Nicht unabhängig menschlich reviewed"), "link run page: validation or reviewer boundary missing");
check((linkRunPage.match(/data-priority="PASS"/g) ?? []).length === 10, "link run page: expected ten evidence candidates");

const imprint = pageHtml.get("/impressum");
const privacy = pageHtml.get("/datenschutz");
check(imprint.includes("Kempener Straße 44") && imprint.includes("info@matthiasramahi.de"), "imprint: verified operator details are missing");
check(privacy.includes("Keine Analyse, Cookies oder Formulare"), "privacy: exact no-tracking section is missing");
check(privacy.includes("ohne Reporting-Endpunkt") && privacy.includes("keine CSP-Berichte"), "privacy: CSP report-only behavior missing");
check(privacy.includes("nicht an seo-ai-agent.de, Contextter, Vercel Functions, einen MCP-Server oder eine externe API übertragen"), "privacy: local skill-generator boundary is missing");
const englishLegal = pageHtml.get("/en/legal-notice");
const englishPrivacy = pageHtml.get("/en/privacy");
check(englishLegal.includes("Kempener Straße 44") && englishLegal.includes("info@matthiasramahi.de"), "English legal notice: verified operator details are missing");
check(englishPrivacy.includes("No analytics, cookies, forms, or live APIs") && englishPrivacy.includes("not sent to seo-ai-agent.de, Contextter, Vercel Functions, an MCP server, or an external API"), "English privacy: exact local/no-tracking boundary missing");

const socialCard = await readFile(resolve(root, "public", "social-card.png"));
check(socialCard.length > 100_000, "social card PNG appears empty or under-rendered");
check(socialCard.readUInt32BE(16) === 1200 && socialCard.readUInt32BE(20) === 630, "social card must be 1200x630");

const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
const sitemapIndex = await readFile(resolve(dist, "sitemap-index.xml"), "utf8");
const sitemap = await readFile(resolve(dist, "sitemap-0.xml"), "utf8");
const notFound = await readFile(resolve(dist, "404.html"), "utf8");
check(robots.includes("Allow: /") && !robots.includes("Disallow: /"), "robots.txt must allow crawling");
check(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`), "robots.txt must reference the automatic sitemap index");
check(sitemapIndex.includes(`${origin}/sitemap-0.xml`), "sitemap index must reference the generated child sitemap");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expectedUrls = pageRoutes.map((route) => route === "/" ? `${origin}/` : `${origin}${route}`).sort();
check(JSON.stringify(sitemapUrls) === JSON.stringify(expectedUrls), `sitemap URL set mismatch: expected ${expectedUrls.length}, got ${sitemapUrls.length}`);
check(!sitemap.includes("/404") && !sitemap.includes("robots.txt") && !sitemap.includes("/evidence/"), "sitemap contains a non-canonical or utility URL");
check(notFound.includes('content="noindex, follow"'), "404 must remain noindex");
check((notFound.match(/<h1\b/g) ?? []).length === 1, "404 must contain exactly one h1");

const evidenceDir = resolve(root, "evidence", "runs", "2026-08-22-seo-ai-001-r1");
const publicEvidenceDir = resolve(root, "public", "evidence", "runs", "2026-08-22-seo-ai-001-r1");
const artifactNames = ["input.v1.json", "raw-observations.v1.json", "result.v1.json"];
for (const name of artifactNames) {
  const canonical = await readFile(resolve(evidenceDir, name), "utf8");
  const publicMirror = await readFile(resolve(publicEvidenceDir, name), "utf8");
  check(canonical === publicMirror, `run artifact mirror differs: ${name}`);
}
const input = JSON.parse(await readFile(resolve(evidenceDir, "input.v1.json"), "utf8"));
const raw = JSON.parse(await readFile(resolve(evidenceDir, "raw-observations.v1.json"), "utf8"));
const result = JSON.parse(await readFile(resolve(evidenceDir, "result.v1.json"), "utf8"));
check(input.runId === result.runId && raw.runId === result.runId, "run artifact IDs are inconsistent");
check(input.benchmarkOwner.name === "Matthias Ramahi", "run input: benchmark owner missing");
check(input.runner.independentReviewer === null && result.review.independentHumanReviewer === null, "run must not invent an independent reviewer");
check(raw.observations.length === 14 && raw.observations.every((item) => !item.error), "raw run must preserve 14 successful observations");
check(result.findings.length === 5 && result.criteria.every((item) => item.status === "pass"), "run result or criteria incomplete");
check(result.execution.directCostEuro === 0 && result.execution.writesDuringRun === false, "run cost/write boundary mismatch");
check(result.limitations.some((item) => item.includes("Search Console")) && result.limitations.some((item) => item.includes("MCP")), "run limitations must expose GSC and MCP boundaries");

const linkEvidenceDir = resolve(root, "evidence", "runs", "2026-08-22-seo-ai-003-r1");
const publicLinkEvidenceDir = resolve(root, "public", "evidence", "runs", "2026-08-22-seo-ai-003-r1");
const linkArtifactNames = ["input.v1.json", "candidates.v1.json", "fixture.v1.json", "raw-observations.v1.json", "result.v1.json"];
for (const name of linkArtifactNames) {
  const canonical = await readFile(resolve(linkEvidenceDir, name), "utf8");
  const publicMirror = await readFile(resolve(publicLinkEvidenceDir, name), "utf8");
  check(canonical === publicMirror, `link run artifact mirror differs: ${name}`);
}
const linkInput = JSON.parse(await readFile(resolve(linkEvidenceDir, "input.v1.json"), "utf8"));
const linkCandidates = JSON.parse(await readFile(resolve(linkEvidenceDir, "candidates.v1.json"), "utf8"));
const linkFixture = JSON.parse(await readFile(resolve(linkEvidenceDir, "fixture.v1.json"), "utf8"));
const linkRaw = JSON.parse(await readFile(resolve(linkEvidenceDir, "raw-observations.v1.json"), "utf8"));
const linkResult = JSON.parse(await readFile(resolve(linkEvidenceDir, "result.v1.json"), "utf8"));
check([linkInput.runId, linkCandidates.runId, linkFixture.runId, linkRaw.runId, linkResult.runId].every((id) => id === "SEO-AI-003-2026-08-22-R1"), "link run artifact IDs are inconsistent");
check(linkFixture.origin === "https://seo-ai-agent.de" && Object.keys(linkFixture.pages).length >= 10, "link run frozen fixture is incomplete");
check(linkInput.runner.independentReviewer === null && linkResult.review.independentHumanReviewer === null, "link run must not invent an independent reviewer");
check(linkCandidates.candidates.length === 10 && linkRaw.observations.length === 10, "link run must preserve ten candidates and observations");
check(linkRaw.observations.every((item) => Object.values(item.checks).every((value) => value === true) && !item.source.error && !item.target.error), "link run automated evidence checks must all pass");
check(linkResult.status === "partial" && linkResult.criteria.some((item) => item.status === "not_proven"), "link run must preserve the partial Human-Review gate");
check(linkResult.execution.directCostEuro === 0 && linkResult.execution.writesDuringRun === false && linkResult.execution.gscConnected === false && linkResult.execution.mcpConnected === false, "link run cost, write, GSC, or MCP boundary mismatch");

const rights = JSON.parse(await readFile(resolve(root, "evidence", "rights-and-sources.v1.json"), "utf8"));
const vercel = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
check(rights.domain === domain, "rights manifest domain mismatch");
for (const id of ["first-real-task-run", "second-real-task-run", "contextter-product-context", "seo-mcp-capability-reference", "original-social-card"]) check(rights.sources.some((source) => source.id === id), `rights manifest source missing: ${id}`);
check(rights.unknowns.some((item) => item.includes("Search Console")), "rights manifest must preserve authenticated GSC uncertainty");
check(packageJson.dependencies?.["@astrojs/sitemap"], "official Astro sitemap integration is missing");
check(packageJson.devDependencies?.["axe-core"], "axe-core dev dependency is missing");
check(vercel.trailingSlash === false, "Vercel must normalize trailing slash variants to no-slash URLs");
const headerMap = new Map((vercel.headers ?? []).flatMap((entry) => entry.headers ?? []).map((entry) => [entry.key.toLowerCase(), entry.value]));
for (const [key, expected] of [["x-content-type-options", "nosniff"], ["referrer-policy", "strict-origin-when-cross-origin"], ["x-frame-options", "DENY"], ["cross-origin-opener-policy", "same-origin"], ["cross-origin-resource-policy", "same-origin"]]) check(headerMap.get(key) === expected, `security header mismatch: ${key}`);
check(headerMap.has("content-security-policy-report-only"), "report-only CSP is missing");
check(!headerMap.has("content-security-policy"), "CSP must remain report-only in this slice");
check(headerMap.get("content-security-policy-report-only")?.includes("'sha256-") && !headerMap.get("content-security-policy-report-only")?.includes("'unsafe-inline'"), "CSP must use inline hashes without unsafe-inline");
const robotsHeaders = [...headerMap].filter(([key]) => key === "x-robots-tag");
check(robotsHeaders.length === 0, "Vercel must not emit an X-Robots-Tag noindex header at launch");
const redirects = vercel.redirects ?? [];
check(redirects.length === 4, "Vercel must define two legacy-product and two canonical-host redirects");
check(redirects.some((redirect) => redirect.source === "/task-spec-builder" && redirect.destination === "/seo-agent-skill" && redirect.permanent === true), "legacy German Builder must permanently redirect to the Skill Generator");
check(redirects.some((redirect) => redirect.source === "/en/task-spec-builder" && redirect.destination === "/en/seo-agent-skill" && redirect.permanent === true), "legacy English Builder must permanently redirect to the Skill Generator");
const rootRedirect = redirects.find((redirect) => redirect.source === "/");
const pathRedirect = redirects.find((redirect) => redirect.source === "/:path*");
check(rootRedirect?.destination === `${origin}/` && rootRedirect?.permanent === true, "www root must permanently redirect to apex root");
check(pathRedirect?.destination === `${origin}/:path*` && pathRedirect?.permanent === true, "www subpaths must permanently redirect path-preserving to apex");
check([rootRedirect, pathRedirect].every((redirect) => redirect?.has?.some((condition) => condition.type === "host" && condition.value === `www.${domain}`)), "canonical redirects must be scoped to the www host");

if (failures.length > 0) {
  console.error(`QA failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`QA passed: ${pageRoutes.length} indexable pages, page-specific schema, disclosed contextual links, social card, security contract, automatic sitemap, run evidence, legal pages, internal links, and true 404.`);
