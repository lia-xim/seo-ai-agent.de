import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const scriptVersion = "1.1.0";
const inputPath = resolve(process.argv[2] ?? "evidence/runs/2026-08-22-seo-ai-003-r1/input.v1.json");
const candidatesPath = resolve(process.argv[3] ?? "evidence/runs/2026-08-22-seo-ai-003-r1/candidates.v1.json");
if (!process.argv[4]) {
  throw new Error("Usage: node scripts/run-internal-link-evidence.mjs <input.json> <candidates.json> <output.json> [fixture.json] [--capture-fixture]");
}
const outputPath = resolve(process.argv[4]);
const fixturePath = process.argv[5] ? resolve(process.argv[5]) : null;
const captureFixture = process.argv[6] === "--capture-fixture";
const [inputText, candidatesText] = await Promise.all([
  readFile(inputPath, "utf8"),
  readFile(candidatesPath, "utf8")
]);
const input = JSON.parse(inputText);
const candidateArtifact = JSON.parse(candidatesText);
let fixtureText = null;
let fixture = null;
if (fixturePath && !captureFixture) {
  try {
    fixtureText = await readFile(fixturePath, "utf8");
    fixture = JSON.parse(fixtureText);
  } catch (error) {
    throw new Error(`Frozen fixture unavailable: ${fixturePath}`, { cause: error });
  }
  if (fixture.runId !== input.runId || fixture.origin !== input.target.origin) {
    throw new Error("Frozen fixture does not match the input run or origin.");
  }
}

const hash = (value) => createHash("sha256").update(value).digest("hex");
const normalizePath = (value) => {
  const pathname = new URL(value, input.target.origin).pathname;
  return pathname.replace(/\/$/, "") || "/";
};
const decodeEntities = (value) => value
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");
const textFromHtml = (value) => decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const extractCanonical = (body) => {
  const tag = body.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] ?? null;
};
const extractMain = (body) => body.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
const startedAt = new Date().toISOString();
const cache = new Map();

const fetchPage = async (path) => {
  if (cache.has(path)) return cache.get(path);
  if (fixture?.pages?.[path]) {
    cache.set(path, fixture.pages[path]);
    return fixture.pages[path];
  }
  if (fixture) throw new Error(`Path missing from frozen fixture: ${path}`);
  const requestedUrl = new URL(path, input.target.origin).href;
  const observedAt = new Date().toISOString();
  try {
    const response = await fetch(requestedUrl, {
      redirect: "manual",
      headers: { "user-agent": input.userAgent }
    });
    const body = await response.text();
    const main = extractMain(body);
    const page = {
      requestedUrl,
      observedAt,
      status: response.status,
      canonical: extractCanonical(body),
      mainText: textFromHtml(main),
      mainLinks: [...new Set([...main.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => normalizePath(match[1])))],
      bodySha256: hash(body),
      error: null
    };
    cache.set(path, page);
    return page;
  } catch (error) {
    const page = { requestedUrl, observedAt, status: null, canonical: null, mainText: "", mainLinks: [], bodySha256: null, error: error instanceof Error ? error.message : String(error) };
    cache.set(path, page);
    return page;
  }
};

const observations = [];
for (const candidate of candidateArtifact.candidates) {
  const [source, target] = await Promise.all([fetchPage(candidate.sourcePath), fetchPage(candidate.targetPath)]);
  const expectedSourceCanonical = new URL(candidate.sourcePath, input.target.origin).href;
  const expectedTargetCanonical = new URL(candidate.targetPath, input.target.origin).href;
  observations.push({
    id: candidate.id,
    source: {
      path: candidate.sourcePath,
      requestedUrl: source.requestedUrl,
      observedAt: source.observedAt,
      status: source.status,
      canonical: source.canonical,
      expectedCanonical: expectedSourceCanonical,
      bodySha256: source.bodySha256,
      passageFound: source.mainText.includes(candidate.sourcePassage),
      targetAlreadyLinkedInMain: source.mainLinks.includes(normalizePath(candidate.targetPath)),
      mainLinks: source.mainLinks,
      error: source.error
    },
    target: {
      path: candidate.targetPath,
      requestedUrl: target.requestedUrl,
      observedAt: target.observedAt,
      status: target.status,
      canonical: target.canonical,
      expectedCanonical: expectedTargetCanonical,
      bodySha256: target.bodySha256,
      error: target.error
    },
    checks: {
      sourceStatus200: source.status === 200,
      sourceSelfCanonical: source.canonical === expectedSourceCanonical,
      passagePresentInMain: source.mainText.includes(candidate.sourcePassage),
      targetStatus200: target.status === 200,
      targetSelfCanonical: target.canonical === expectedTargetCanonical,
      targetAbsentFromMainLinks: !source.mainLinks.includes(normalizePath(candidate.targetPath))
    }
  });
}

if (fixturePath && captureFixture) {
  const fixtureArtifact = {
    schemaVersion: 1,
    runId: input.runId,
    origin: input.target.origin,
    capturedAt: new Date().toISOString(),
    derivation: "Public HTTP response parsed to status, canonical, main text, main links and full-body SHA-256; no response headers or off-main HTML retained.",
    pages: Object.fromEntries([...cache.entries()].sort(([left], [right]) => left.localeCompare(right)))
  };
  await mkdir(dirname(fixturePath), { recursive: true });
  await writeFile(fixturePath, `${JSON.stringify(fixtureArtifact, null, 2)}\n`, "utf8");
}

const artifact = {
  schemaVersion: 1,
  runId: input.runId,
  inputSha256: hash(JSON.stringify(input)),
  candidatesSha256: hash(JSON.stringify(candidateArtifact)),
  harness: {
    name: "run-internal-link-evidence.mjs",
    version: scriptVersion,
    node: process.version,
    redirects: "manual",
    mainContentBoundary: "<main> only",
    sourceMode: captureFixture ? "live_http_capture" : fixture ? "frozen_fixture" : "live_http",
    fixtureSha256: fixtureText ? hash(fixtureText) : null
  },
  startedAt,
  completedAt: new Date().toISOString(),
  observations
};
const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, serialized, "utf8");

const failed = observations.filter((observation) => Object.values(observation.checks).some((value) => value !== true) || observation.source.error || observation.target.error);
console.log(`Recorded ${observations.length} candidate validations for ${input.runId}; ${failed.length} failed.`);
if (failed.length > 0) process.exitCode = 1;
