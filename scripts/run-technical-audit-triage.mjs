import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const scriptVersion = "1.0.0";
const inputPath = resolve(process.argv[2] ?? "evidence/runs/2026-08-22-seo-ai-001-r1/input.v1.json");
const outputPath = resolve(process.argv[3] ?? "evidence/runs/2026-08-22-seo-ai-001-r1/raw-observations.v1.json");
const input = JSON.parse(await readFile(inputPath, "utf8"));

const extract = (body, pattern) => body.match(pattern)?.[1]?.trim() ?? null;
const startedAt = new Date().toISOString();
const observations = [];

for (const probe of input.probes) {
  const observedAt = new Date().toISOString();
  try {
    const response = await fetch(probe.url, {
      redirect: "manual",
      headers: { "user-agent": input.userAgent },
    });
    const body = await response.text();
    const contentType = response.headers.get("content-type") ?? "";
    const isHtml = contentType.includes("text/html");
    observations.push({
      id: probe.id,
      role: probe.role,
      requestedUrl: probe.url,
      observedAt,
      status: response.status,
      headers: {
        contentType: contentType || null,
        location: response.headers.get("location"),
        xRobotsTag: response.headers.get("x-robots-tag"),
        cacheControl: response.headers.get("cache-control"),
      },
      html: isHtml
        ? {
            title: extract(body, /<title>([^<]*)<\/title>/i),
            canonical: extract(body, /<link\s+rel="canonical"\s+href="([^"]+)"/i),
            robotsMeta: extract(body, /<meta\s+name="robots"\s+content="([^"]+)"/i),
            h1: extract(body, /<h1[^>]*>([\s\S]*?)<\/h1>/i)?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ?? null,
          }
        : null,
      body: {
        bytes: Buffer.byteLength(body),
        sha256: createHash("sha256").update(body).digest("hex"),
        firstPartyText: probe.captureText ? body.slice(0, 500) : null,
      },
      error: null,
    });
  } catch (error) {
    observations.push({
      id: probe.id,
      role: probe.role,
      requestedUrl: probe.url,
      observedAt,
      status: null,
      headers: null,
      html: null,
      body: null,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const artifact = {
  schemaVersion: 1,
  runId: input.runId,
  task: input.task,
  target: input.target,
  inputSha256: createHash("sha256").update(JSON.stringify(input)).digest("hex"),
  harness: {
    name: "run-technical-audit-triage.mjs",
    version: scriptVersion,
    node: process.version,
    redirects: "manual",
  },
  startedAt,
  completedAt: new Date().toISOString(),
  observations,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`Recorded ${observations.length} observations for ${input.runId} at ${outputPath}`);
if (observations.some((observation) => observation.error)) process.exitCode = 1;
