import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const root = fileURLToPath(new URL("..", import.meta.url));
const dist = resolve(root, "dist");
const routes = [
  "/", "/task-spec-builder", "/aufgaben",
  "/aufgaben/technische-audit-triage", "/aufgaben/keyword-chancen-priorisieren",
  "/aufgaben/interne-links-begruenden", "/benchmarks",
  "/benchmarks/2026-08-22-technische-audit-triage", "/agenten-vergleich",
  "/faehigkeiten", "/mcp-fuer-seo-agenten", "/seo-agent-kosten", "/fehlerbehandlung-seo-agenten", "/methodik-und-konflikte", "/quellen-und-rechte", "/impressum", "/datenschutz",
  "/robots.txt", "/sitemap-index.xml", "/sitemap-0.xml",
  "/evidence/runs/2026-08-22-seo-ai-001-r1/input.v1.json",
  "/evidence/runs/2026-08-22-seo-ai-001-r1/raw-observations.v1.json",
  "/evidence/runs/2026-08-22-seo-ai-001-r1/result.v1.json",
  "/social-card.png"
];

const contentType = (file) => {
  const extension = extname(file);
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".xml") return "application/xml; charset=utf-8";
  if (extension === ".txt") return "text/plain; charset=utf-8";
  if (extension === ".json") return "application/json; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".js") return "text/javascript; charset=utf-8";
  return "application/octet-stream";
};

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://local.test").pathname);
  if (pathname.includes("..")) return response.writeHead(400).end("Bad request");
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  const file = pathname === "/"
    ? resolve(dist, "index.html")
    : extname(pathname)
      ? resolve(dist, clean)
      : resolve(dist, clean, "index.html");
  try {
    const body = await readFile(file);
    response.writeHead(200, { "Content-Type": contentType(file) }).end(body);
  } catch {
    const body = await readFile(resolve(dist, "404.html"));
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(body);
  }
});

await new Promise((resolveListen, reject) => {
  server.once("error", reject);
  server.listen(0, host, resolveListen);
});
const address = server.address();
if (!address || typeof address === "string") throw new Error("Could not start the static status fixture");
const base = `http://${host}:${address.port}`;

try {
  const failures = [];
  for (const route of routes) {
    const response = await fetch(`${base}${route}`, { redirect: "manual" });
    if (response.status !== 200) failures.push(`${route}: expected 200, got ${response.status}`);
  }
  for (const route of ["/diese-seite-existiert-nicht", "/sitemap.xml"]) {
    const response = await fetch(`${base}${route}`, { redirect: "manual" });
    if (response.status !== 404) failures.push(`${route}: expected 404, got ${response.status}`);
  }
  if (failures.length > 0) throw new Error(failures.join("\n"));
  console.log(`Status QA passed: ${routes.length} launch artifacts return 200 and both unknown and retired manual-sitemap paths return 404.`);
} finally {
  await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
}