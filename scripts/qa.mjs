import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const domain = "seo-ai-agent.de";
const origin = `https://${domain}`;
const pageRoutes = [
  "/", "/task-spec-builder", "/aufgaben",
  "/aufgaben/technische-audit-triage", "/aufgaben/keyword-chancen-priorisieren",
  "/aufgaben/interne-links-begruenden", "/benchmarks", "/agenten-vergleich",
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
  check(html.includes('content="noindex, follow"'), `${route}: noindex boundary is missing`);
  check(html.includes(`href="${origin}${route === "/" ? "/" : route}"`), `${route}: canonical URL is missing or wrong`);
  check((html.match(/<h1\b/g) ?? []).length === 1, `${route}: expected exactly one h1`);
  check(!/\{\{[^}]+\}\}|__[_A-Z]+__/.test(html), `${route}: unresolved template token found`);
  check(!/Testsieger|bester SEO-Agent|unabhängige Bewertung/i.test(html), `${route}: prohibited winner or independence claim found`);
}

for (const [route, html] of pageHtml) {
  const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathname = href.split(/[?#]/, 1)[0];
    if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
      await access(resolve(dist, pathname.slice(1)));
      continue;
    }
    if (/\.[a-z0-9]+$/i.test(pathname)) {
      await access(resolve(dist, pathname.slice(1)));
      continue;
    }
    const normalized = pathname.replace(/\/$/, "") || "/";
    try {
      await access(routeFile(normalized));
    } catch {
      failures.push(`${route}: broken internal link ${href}`);
    }
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

const imprint = pageHtml.get("/impressum");
const privacy = pageHtml.get("/datenschutz");
check(imprint.includes("Kempener Straße 44") && imprint.includes("info@matthiasramahi.de"), "imprint: verified operator details are missing");
check(privacy.includes("Keine Analyse, Cookies oder Formulare"), "privacy: exact no-tracking section is missing");
check(privacy.includes("nicht an seo-ai-agent.de, Contextter, Vercel Functions, einen MCP-Server oder eine externe API übertragen"), "privacy: local builder boundary is missing");

const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
const notFound = await readFile(resolve(dist, "404.html"), "utf8");
check(robots.includes("Allow: /") && !robots.includes("Disallow: /"), "robots.txt must allow crawling so noindex can be observed");
check(!sitemap.includes("<url>"), "sitemap must expose no URLs while indexing is blocked");
check(notFound.includes('content="noindex, follow"'), "404 must remain noindex");
check((notFound.match(/<h1\b/g) ?? []).length === 1, "404 must contain exactly one h1");

const rights = JSON.parse(await readFile(resolve(root, "evidence", "rights-and-sources.v1.json"), "utf8"));

const vercel = JSON.parse(await readFile(resolve(root, "vercel.json"), "utf8"));
check(rights.domain === domain, "rights manifest domain mismatch");
check(Array.isArray(rights.sources) && rights.sources.length >= 6, "rights manifest needs a useful source register");
check(Array.isArray(rights.unknowns) && rights.unknowns.length > 0, "rights manifest must preserve unresolved questions");

const robotsHeader = vercel.headers?.flatMap((entry) => entry.headers ?? []).find((entry) => entry.key === "X-Robots-Tag");
check(robotsHeader?.value === "noindex, follow", "Vercel must apply the X-Robots-Tag boundary to all routes");
check(!Array.isArray(vercel.redirects) || vercel.redirects.length === 0, "Vercel config must not introduce catch-all redirects");

if (failures.length > 0) {
  console.error(`QA failed with ${failures.length} issue(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`QA passed: ${pageRoutes.length} pages, internal links, indexing boundary, evidence register, legal pages, and true-404 artifact.`);