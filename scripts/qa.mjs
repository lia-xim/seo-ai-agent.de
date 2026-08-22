import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const domain = "seo-ai-agent.de";
const origin = `https://${domain}`;
const pageRoutes = [
  "/", "/task-spec-builder", "/aufgaben",
  "/aufgaben/technische-audit-triage", "/aufgaben/keyword-chancen-priorisieren",
  "/aufgaben/interne-links-begruenden", "/benchmarks",
  "/benchmarks/2026-08-22-technische-audit-triage", "/agenten-vergleich",
  "/methodik-und-konflikte", "/quellen-und-rechte", "/impressum", "/datenschutz"
];

const failures = [];
const routeFile = (route) => route === "/" ? resolve(dist, "index.html") : resolve(dist, route.slice(1), "index.html");
const check = (passed, message) => { if (!passed) failures.push(message); };
const pageHtml = new Map();

for (const route of pageRoutes) {
  const file = routeFile(route);
  await access(file);
  const html = await readFile(file, "utf8");
  pageHtml.set(route, html);
  check(html.includes('<html lang="de">'), `${route}: document language must be de`);
  check(!/<meta\s+name="robots"/i.test(html), `${route}: indexable canonical page must not contain a robots meta directive`);
  check(!/noindex/i.test(html.split("</head>", 1)[0]), `${route}: noindex remains in the document head`);
  check(html.includes(`href="${origin}${route === "/" ? "/" : route}"`), `${route}: canonical URL is missing or wrong`);
  check(html.includes('rel="sitemap" href="/sitemap-index.xml"'), `${route}: sitemap discovery link is missing`);
  check((html.match(/<h1\b/g) ?? []).length === 1, `${route}: expected exactly one h1`);
  check(!/\{\{[^}]+\}\}|__[_A-Z]+__/.test(html), `${route}: unresolved template token found`);
  check(!/Testsieger|bester SEO-Agent|unabhängige Bewertung/i.test(html), `${route}: prohibited winner or independence claim found`);
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

const builder = pageHtml.get("/task-spec-builder");
check(builder.includes('class="spec-form"'), "builder: form is missing");
check(builder.includes("data-download-json"), "builder: JSON download action is missing");
check(builder.includes("data-copy-markdown"), "builder: Markdown copy action is missing");
check(builder.includes("data-show-example"), "builder: synthetic result action is missing");
check(builder.includes("Beispielergebnis · keine Live-Daten"), "builder: synthetic result disclosure is missing");
check(builder.includes("MCP-Pilot in Vorbereitung"), "builder: honest MCP readiness state is missing");
check(builder.includes("disabled>MCP-Pilot in Vorbereitung"), "builder: MCP connect must remain disabled");
check((builder.match(/<label\b/g) ?? []).length >= 8, "builder: too few explicit labels");

const benchmark = pageHtml.get("/benchmarks");
const runPage = pageHtml.get("/benchmarks/2026-08-22-technische-audit-triage");
check(benchmark.includes("Matthias Ramahi") && benchmark.includes("Nicht vorhanden · offengelegt"), "benchmark hub: owner or missing independent review disclosure is absent");
check(runPage.includes("SEO-AI-001-2026-08-22-R1"), "run page: run ID missing");
check(runPage.includes("Nicht unabhängig menschlich reviewed"), "run page: review status missing");
check(runPage.includes("Der Lauf misst keine Rankings und behauptet keine aktive MCP-Verbindung"), "run page: ranking or MCP boundary missing");
check((runPage.match(/class="raw-observation-head"/g) ?? []).length === 1, "run page: raw observation table missing");

const imprint = pageHtml.get("/impressum");
const privacy = pageHtml.get("/datenschutz");
check(imprint.includes("Kempener Straße 44") && imprint.includes("info@matthiasramahi.de"), "imprint: verified operator details are missing");
check(privacy.includes("Keine Analyse, Cookies oder Formulare"), "privacy: exact no-tracking section is missing");
check(privacy.includes("nicht an seo-ai-agent.de, Contextter, Vercel Functions, einen MCP-Server oder eine externe API übertragen"), "privacy: local builder boundary is missing");

const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
const sitemapIndex = await readFile(resolve(dist, "sitemap-index.xml"), "utf8");
const sitemap = await readFile(resolve(dist, "sitemap-0.xml"), "utf8");
const notFound = await readFile(resolve(dist, "404.html"), "utf8");
check(robots.includes("Allow: /") && !robots.includes("Disallow: /"), "robots.txt must allow crawling");
check(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`), "robots.txt must reference the automatic sitemap index");
check(sitemapIndex.includes(`${origin}/sitemap-0.xml`), "sitemap index must reference the generated child sitemap");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort();
const expectedUrls = pageRoutes.map((route) => route === "/" ? origin : `${origin}${route}`).sort();
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

const rights = JSON.parse(await readFile(resolve(root, "evidence", "rights-and-sources.v1.json"), "utf8"));
const vercel = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
check(rights.domain === domain, "rights manifest domain mismatch");
check(rights.sources.some((source) => source.id === "first-real-task-run"), "rights manifest must register the real task run");
check(rights.unknowns.some((item) => item.includes("Search Console")), "rights manifest must preserve authenticated GSC uncertainty");
check(packageJson.dependencies?.["@astrojs/sitemap"], "official Astro sitemap integration is missing");
const robotsHeaders = vercel.headers?.flatMap((entry) => entry.headers ?? []).filter((entry) => entry.key.toLowerCase() === "x-robots-tag") ?? [];
check(robotsHeaders.length === 0, "Vercel must not emit an X-Robots-Tag noindex header at launch");
const redirects = vercel.redirects ?? [];
check(redirects.length === 2, "Vercel must define root and path canonical-host redirects");
const rootRedirect = redirects.find((redirect) => redirect.source === "/");
const pathRedirect = redirects.find((redirect) => redirect.source === "/:path*");
check(rootRedirect?.destination === `${origin}/` && rootRedirect?.permanent === true, "www root must permanently redirect to apex root");
check(pathRedirect?.destination === `${origin}/:path*` && pathRedirect?.permanent === true, "www subpaths must permanently redirect path-preserving to apex");
check([rootRedirect, pathRedirect].every((redirect) => redirect?.has?.some((condition) => condition.type === "host" && condition.value === `www.${domain}`)), "canonical redirects must be scoped to the www host");

if (failures.length > 0) {
  console.error(`QA failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`QA passed: ${pageRoutes.length} canonical indexable pages, automatic sitemap, launch indexing, run evidence, legal pages, redirects, internal links, and true 404.`);