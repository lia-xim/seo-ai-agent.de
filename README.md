# seo-ai-agent.de

Public source repository for seo-ai-agent.de: bilingual, browser-local SEO Agent Skill Packs, generators, deterministic skill checks, bounded tasks, and reproducible evidence without generic winner claims.

The website is bilingual. German remains the default at `/`; English equivalents live under `/en` with explicit hreflang pairs. The product role is deliberately simple: choose a maintained SEO job, choose the target agent, and download the ready local package. A three-input general skill, a format-specific deterministic Skill Checker with local repairs, and a four-input safety policy remain available as smaller tools.

## Current state

The owned custom domain is an indexable launch. Matthias Ramahi is the named operator and Benchmark Owner. Two real First-Party task runs are published: `SEO-AI-001-2026-08-22-R1` contains the frozen technical launch audit; `SEO-AI-003-2026-08-22-R1` contains ten HTML-validated internal-link candidates and remains explicitly `partial` because no independent human reviewer confirmed anchor, placement, or editorial value.

There is no provider ranking and no independent human review. Authenticated GSC status is `NOT PROVEN`, and no provider/comparison budget is fixed. The site does not claim an active MCP connection. The generated skill explicitly forbids invented data and unapproved writes.

Canonical HTML pages are indexable and generated automatically through `@astrojs/sitemap`. The stable public endpoint `sitemap.xml` is a valid sitemap index that references the generated child sitemap, and `robots.txt` points to that public endpoint. The 404 page remains noindex and is excluded from the sitemap. Vercel permanently redirects both the www root and www subpaths to the path-equivalent apex URL.

## Purpose and boundary

Die Seite verpackt acht gepflegte SEO-Fachmethoden lokal für Codex, Claude Code, Gemini CLI, Cursor oder als universellen Prompt. Der einfache Generator, der formatspezifische Skill Checker mit Fix-Blöcken und der Policy Generator ergänzen diese Packs mit Quellenpflicht, Read-only-Grenzen und klaren Stop-Regeln.

Crawl Foundry darf keinen automatischen Siegerstatus erhalten. Jede Bewertung braucht datierte Testevidenz und eine Eigentumsoffenlegung. Crawl Foundry is disclosed as the commonly operated product relationship and as a possible future data option, not as an independent source. Crawl Foundry and seo-mcp.de are linked only inside relevant user flows with adjacent common-ownership disclosure; there is no cross-domain footer network.

## Fresh-domain boundary

seo-ai-agent.de is a newly registered domain. It is not an expired-domain rebuild and does not continue a former website, operator, archive, brand, audience, or URL inventory. Ordinary third-party rights still apply to screenshots, text, code, data, brands, customer information, and model or provider outputs.

## Implemented surfaces

- `/` — purpose, task workflow, measurement dimensions, and launch status
- `/skill-packs` — eight curated SEO Agent Skill Packs packaged locally for five target formats, including a complete ZIP
- `/seo-agent-skill` — local three-input SEO Agent Skill Generator with copy and `SKILL.md` download
- `/seo-agent-skill-check` — format-aware local review for SKILL.md, Cursor Rules, and prompts with deterministic repairs, install hints, and a SHA-256 QA report
- `/seo-agent-policy-generator` — local four-input scope, action, data, cost, security, and stop-rule generator
- `/agent-skill-vergleich` — source-linked format comparison for Codex, Claude Code, Gemini CLI, Cursor, prompts, and MCP
- `/workflows` — four task-first paths from a real SEO job to a reviewable run
- `/en` — English product home with equivalent workflows, tasks, capabilities, runs, method, rights, and legal information
- `/en/seo-agent-skill` — English localized SEO Agent Skill Generator
- `/en/skill-packs`, `/en/seo-agent-skill-check`, `/en/seo-agent-policy-generator`, and `/en/agent-skill-comparison` — English equivalents of the product surfaces
- `/aufgaben` plus three versioned task definitions
- `/benchmarks` — published runs and transparent review state
- `/benchmarks/2026-08-22-technische-audit-triage` — frozen technical First-Party task run
- `/benchmarks/2026-08-22-interne-link-evidenz` — executed link-evidence run with ten validated candidates and a visible Human-Review gate
- `/agenten-vergleich` — selection approaches without provider winner claims
- `/faehigkeiten` — provider-neutral capability framework for data, analysis, evidence, and control
- `/mcp-fuer-seo-agenten` — MCP's role in an agent workflow without duplicating seo-mcp.de implementation docs
- `/seo-agent-kosten` — browser-local task-cost calculator for execution, data, review, retries, and reserve
- `/fehlerbehandlung-seo-agenten` — task-level stop, retry, escalation, and rollback contract
- `/methodik-und-konflikte` — rubric, ownership, corrections, and conflict rules
- `/quellen-und-rechte` — source register and third-party rights boundaries
- `/impressum` and `/datenschutz` — operator and actual processing truth
- automatic XML sitemap, crawlable robots.txt, canonical control, true 404, no-slash normalization, page-specific schema, social cards, and tested security headers

## Reproduce the first task run

    node scripts/run-technical-audit-triage.mjs \
      evidence/runs/2026-08-22-seo-ai-001-r1/input.v1.json \
      evidence/runs/2026-08-22-seo-ai-001-r1/raw-observations.v1.json

The committed raw artifact is a historical observation of the public Noindex preview before the launch fixes. Re-running later is a new observation and must not silently overwrite or reinterpret R1.

## Reproduce the second task run

    $evidenceOutput = Join-Path $env:TEMP "seo-ai-003-r1-reproduction.json"
    node scripts/run-internal-link-evidence.mjs evidence/runs/2026-08-22-seo-ai-003-r1/input.v1.json evidence/runs/2026-08-22-seo-ai-003-r1/candidates.v1.json $evidenceOutput evidence/runs/2026-08-22-seo-ai-003-r1/fixture.v1.json

The second harness replays the frozen, HTTP-derived page fixture from the historical live baseline. It validates source and target status, self-canonical, exact source passage inside `<main>`, and absence of the target from existing main-content links without depending on the later live site. It does not evaluate semantic quality or publish links.

## MCP and privacy boundary

The UI does not connect to a live MCP server. It never asks for raw tokens and never performs paid work. The generated files explain MCP as a possible data capability but do not claim a live connection.

The site is statically hosted on Vercel. It has no analytics, cookies, consent manager, contact form, external font request, local or session storage, advertising, or embedded third-party media. Skill Generator, Skill Packager, Skill Checker, Policy Generator, and cost-calculator inputs stay in browser memory and are not transmitted. ZIP files, fix blocks, SHA-256 input hashes, and QA reports are created on-device from static templates, browser cryptography, and rules. Clipboard access occurs only after an explicit copy action.

## Local development and verification

    corepack pnpm install
    corepack pnpm dev
    corepack pnpm verify

Optional Chromium interaction and responsive QA:

    corepack pnpm dev --host 127.0.0.1 --port 4317
    corepack pnpm qa:browser

## Evidence and indexing

- `evidence/rights-and-sources.v1.json` records sources, allowed use, and unresolved governance questions.
- `evidence/seo-checkup-2026-08-22.md` contains the Evidence Register, Page-Action Matrix, Hub/Cluster Map, findings, and 30/60/90 sequence.
- `evidence/readiness-audit-2026-08-23.md` records the final readiness findings, current page jobs, technical gates, and remaining launch risks.
- `evidence/runs/2026-08-22-seo-ai-001-r1/` contains the first run's frozen input, raw observations, and evaluated result.
- `evidence/runs/2026-08-22-seo-ai-003-r1/` contains the second run's frozen input, unedited candidates, HTTP-derived page fixture, raw HTML validations, and partial result.
- Public JSON mirrors are served below the matching `/evidence/runs/` paths.
- Search Console property, URL Inspection, manual-action, security-issue, and submitted-sitemap state require authenticated GSC evidence. Sitemap availability alone is not proof of indexing.

Future provider rankings additionally require comparable real runs, documented benchmarking/output rights, a fixed budget covering providers, data, accounts, retries, infrastructure and human review, plus explicit reviewer and exclusion rules. Common ownership is never independent corroboration.

## Deployment and DNS

Vercel project: `seo-ai-agent-de`. DNS scope is limited to web routing for apex and www; nameservers and all mail, verification, security, and other non-web records remain unchanged.

## Rights

This repository is public for operational transparency. Third-party screenshots, text, code, data, brands, customer information, and model or provider outputs may be used only with an applicable right, license, permission, or quotation basis. No open-source license is granted unless a later commit adds one explicitly.
