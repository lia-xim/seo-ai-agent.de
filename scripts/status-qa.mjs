import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const root = fileURLToPath(new URL("..", import.meta.url));
const dist = resolve(root, "dist");
const routes = [
  "/", "/task-spec-builder", "/aufgaben",
  "/aufgaben/technische-audit-triage",
  "/aufgaben/keyword-chancen-priorisieren",
  "/aufgaben/interne-links-begruenden",
  "/benchmarks", "/agenten-vergleich", "/methodik-und-konflikte",
  "/quellen-und-rechte", "/impressum", "/datenschutz", "/robots.txt", "/sitemap.xml"
];

const contentType = (file) => {
  const extension = extname(file);
  if (extension === ".html") return "text/html; charset=utf-8";
  if (extension === ".xml") return "application/xml; charset=utf-8";
  if (extension === ".txt") return "text/plain; charset=utf-8";
  if (extension === ".css") return "text/css; charset=utf-8";
  if (extension === ".js") return "text/javascript; charset=utf-8";
  return "application/octet-stream";
};

const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://local.test").pathname);
  if (pathname.includes("..")) {
    response.writeHead(400).end("Bad request");
    return;
  }
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
  const missing = await fetch(`${base}/diese-seite-existiert-nicht`, { redirect: "manual" });
  if (missing.status !== 404) failures.push(`/diese-seite-existiert-nicht: expected 404, got ${missing.status}`);
  if (failures.length > 0) throw new Error(failures.join("\n"));
  console.log(`Status QA passed: ${routes.length} expected artifacts return 200 and an unknown route returns 404.`);
} finally {
  await new Promise((resolveClose, reject) => server.close((error) => error ? reject(error) : resolveClose()));
}