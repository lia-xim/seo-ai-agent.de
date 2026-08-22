const origin = process.argv[2] ?? "https://seo-ai-agent.de";
const timeoutMs = 12_000;

const fetchUrl = async (url, redirect = "follow") => {
  try {
    return await fetch(url, {
      redirect,
      signal: AbortSignal.timeout(timeoutMs),
      headers: { "user-agent": "seo-ai-agent-live-audit/1.0" }
    });
  } catch (error) {
    return {
      status: 0,
      url,
      error: error instanceof Error ? error.message : String(error),
      headers: new Headers(),
      text: async () => ""
    };
  }
};

const matches = (pattern, value) => [...value.matchAll(pattern)].map((match) => match[1].trim());
const first = (pattern, value) => value.match(pattern)?.[1]?.trim() ?? "";
const text = (value) => value
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z#0-9]+;/gi, " ")
  .replace(/\s+/g, " ")
  .trim();
const normalizePath = (path) => path.replace(/\/$/, "") || "/";

const sitemapIndex = await fetchUrl(`${origin}/sitemap-index.xml`);
let urls = matches(/<loc>(.*?)<\/loc>/g, await sitemapIndex.text());
if (urls.some((url) => url.endsWith(".xml"))) {
  const childUrls = [];
  for (const url of urls) {
    const response = await fetchUrl(url);
    childUrls.push(...matches(/<loc>(.*?)<\/loc>/g, await response.text()));
  }
  urls = childUrls;
}

const pages = [];
const linksByPath = new Map();
for (const url of urls) {
  const response = await fetchUrl(url);
  const html = await response.text();
  const path = new URL(url).pathname;
  const internal = [];
  const external = [];
  for (const href of matches(/<a\b[^>]*href=["']([^"']+)["']/gi, html)) {
    try {
      const target = new URL(href, url);
      if (target.origin === origin || target.hostname === `www.${new URL(origin).hostname}`) {
        internal.push(normalizePath(target.pathname));
      } else if (/^https?:$/.test(target.protocol)) {
        external.push(target.href);
      }
    } catch {}
  }
  linksByPath.set(normalizePath(path), internal);
  const schemaTypes = [];
  for (const source of matches(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, html)) {
    try {
      const schema = JSON.parse(source);
      for (const node of schema["@graph"] ?? [schema]) {
        const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
        schemaTypes.push(...types.filter(Boolean));
      }
    } catch {
      schemaTypes.push("INVALID");
    }
  }
  const main = first(/<main[^>]*>([\s\S]*?)<\/main>/i, html) || html;
  pages.push({
    path: normalizePath(path),
    status: response.status,
    title: text(first(/<title>([\s\S]*?)<\/title>/i, html)),
    description: first(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i, html)
      || first(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html),
    canonical: first(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i, html)
      || first(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i, html),
    robots: first(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i, html),
    h1: text(first(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html)),
    words: text(main).split(/\s+/).filter(Boolean).length,
    internalLinks: new Set(internal).size,
    externalLinks: new Set(external).size,
    schemaTypes: [...new Set(schemaTypes)].sort()
  });
}

const inbound = Object.fromEntries(pages.map(({ path }) => [path, 0]));
for (const paths of linksByPath.values()) {
  for (const path of new Set(paths)) if (path in inbound) inbound[path] += 1;
}
for (const page of pages) page.inboundLinks = inbound[page.path];

const duplicates = (key) => Object.entries(Object.groupBy(pages, (page) => page[key]))
  .filter(([value, group]) => value && group.length > 1)
  .map(([value, group]) => ({ value, paths: group.map(({ path }) => path) }));

const badInternal = [];
for (const path of new Set([...linksByPath.values()].flat())) {
  const response = await fetchUrl(`${origin}${path}`);
  if (response.status === 0 || response.status >= 400) badInternal.push({ path, status: response.status });
}

const edgeChecks = [];
for (const [name, url] of [
  ["http", `http://${new URL(origin).hostname}/aufgaben?audit=1`],
  ["www-root", `https://www.${new URL(origin).hostname}/`],
  ["www-path", `https://www.${new URL(origin).hostname}/aufgaben?audit=1`],
  ["slash", `${origin}/aufgaben/`],
  ["unknown", `${origin}/does-not-exist-seo-check`],
  ["retired-sitemap", `${origin}/sitemap.xml`]
]) {
  const response = await fetchUrl(url, "manual");
  edgeChecks.push({ name, status: response.status, location: response.headers.get("location") });
}

const homeResponse = await fetchUrl(origin);
const report = {
  auditedAt: new Date().toISOString(),
  origin,
  sitemapStatus: sitemapIndex.status,
  pageCount: pages.length,
  pages,
  duplicates: {
    titles: duplicates("title"),
    descriptions: duplicates("description"),
    h1: duplicates("h1")
  },
  orphans: pages.filter(({ path, inboundLinks }) => path !== "/" && inboundLinks === 0).map(({ path }) => path),
  badInternal,
  edgeChecks,
  headers: {
    hsts: homeResponse.headers.get("strict-transport-security"),
    xContentTypeOptions: homeResponse.headers.get("x-content-type-options"),
    referrerPolicy: homeResponse.headers.get("referrer-policy"),
    permissionsPolicy: homeResponse.headers.get("permissions-policy"),
    csp: homeResponse.headers.get("content-security-policy"),
    cspReportOnly: Boolean(homeResponse.headers.get("content-security-policy-report-only")),
    xRobotsTag: homeResponse.headers.get("x-robots-tag")
  }
};

console.log(JSON.stringify(report, null, 2));
if (sitemapIndex.status !== 200 || pages.some(({ status }) => status !== 200) || badInternal.length > 0) process.exitCode = 1;
