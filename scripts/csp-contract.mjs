import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const vercelPath = resolve(root, "vercel.json");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
};

const htmlFiles = (await walk(dist)).filter((file) => extname(file) === ".html");
const hashes = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    const digest = createHash("sha256").update(match[2], "utf8").digest("base64");
    hashes.add(`'sha256-${digest}'`);
  }
}
const expectedHashes = [...hashes].sort();

if (process.argv.includes("--print")) {
  console.log(expectedHashes.join(" "));
  process.exit(0);
}

const vercel = JSON.parse(await readFile(vercelPath, "utf8"));
const headers = (vercel.headers ?? []).flatMap((entry) => entry.headers ?? []);
const csp = headers.find((entry) => entry.key.toLowerCase() === "content-security-policy-report-only")?.value ?? "";
const configuredHashes = [...csp.matchAll(/'sha256-[^']+'/g)].map((match) => match[0]).sort();
const failures = [];
if (!csp) failures.push("Content-Security-Policy-Report-Only header is missing");
if (csp.includes("'unsafe-inline'") || csp.includes("'unsafe-eval'")) failures.push("CSP must not allow unsafe-inline or unsafe-eval");
for (const directive of ["default-src 'self'", "base-uri 'self'", "object-src 'none'", "frame-ancestors 'none'", "form-action 'self'", "img-src 'self' data:", "font-src 'self'", "style-src 'self'", "connect-src 'self'"]) {
  if (!csp.includes(directive)) failures.push(`CSP directive missing: ${directive}`);
}
if (JSON.stringify(configuredHashes) !== JSON.stringify(expectedHashes)) {
  failures.push(`CSP inline hash set differs: configured ${configuredHashes.length}, build ${expectedHashes.length}`);
}
if (failures.length) {
  console.error(`CSP contract failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`CSP contract passed: ${htmlFiles.length} HTML files and ${expectedHashes.length} exact inline-script hashes.`);