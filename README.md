# seo-ai-agent.de

Public source repository for seo-ai-agent.de: a German Task Recipe and evidence workspace for making bounded SEO-agent work executable and reviewable without generic winner claims.

## Current state

The owned custom domain is an indexable minimum-viable launch. Matthias Ramahi is the named operator and Benchmark Owner. The first real First-Party task run, `SEO-AI-001-2026-08-22-R1`, publishes its frozen input, prompt and harness versions, criteria, raw HTTP observations, findings, costs, interventions, conflicts, and limitations.

There is no provider ranking and no independent human review. The site does not claim an active MCP connection. The Builder's result example remains explicitly synthetic.

Canonical HTML pages are indexable and generated automatically into `sitemap-index.xml` through `@astrojs/sitemap`. `robots.txt` allows crawling and references the sitemap index. The 404 page remains noindex and is excluded from the sitemap. Vercel permanently redirects both the www root and www subpaths to the path-equivalent apex URL.

## Purpose and boundary

Die Seite macht aus SEO-Fragen klare Task Recipes mit Freigaben, Budgets, Datenbedarf, erwarteten Ergebnissen und nachvollziehbaren Testkriterien.

Contextter darf keinen automatischen Siegerstatus erhalten. Jede Bewertung braucht datierte Testevidenz und eine Eigentumsoffenlegung. Contextter is disclosed as the accepted primary portfolio relationship and as a possible future test participant, not as an independent source. Contextter and seo-mcp.de are linked only inside relevant user flows with adjacent common-ownership disclosure; there is no cross-domain footer network.

## Fresh-domain boundary

seo-ai-agent.de is a newly registered domain. It is not an expired-domain rebuild and does not continue a former website, operator, archive, brand, audience, or URL inventory. Ordinary third-party rights still apply to screenshots, text, code, data, brands, customer information, and model or provider outputs.

## Implemented surfaces

- `/` — purpose, task workflow, measurement dimensions, and launch status
- `/task-spec-builder` — local JSON/Markdown Task Recipe Builder with disabled MCP readiness and an explicitly synthetic example
- `/aufgaben` plus three versioned task definitions
- `/benchmarks` — published runs and transparent review state
- `/benchmarks/2026-08-22-technische-audit-triage` — first real frozen First-Party task run
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

## MCP and privacy boundary

The UI does not connect to a live MCP server. It never asks for raw tokens, never performs paid work, and keeps the connect action disabled until OAuth, scopes, and a read capability are verified in production.

The site is statically hosted on Vercel. It has no analytics, cookies, consent manager, contact form, external font request, local or session storage, advertising, or embedded third-party media. Builder and cost-calculator inputs stay in browser memory and are not transmitted. Clipboard access occurs only after an explicit copy action.

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
- `evidence/runs/2026-08-22-seo-ai-001-r1/` contains frozen input, raw observations, and the evaluated result.
- Public JSON mirrors are served from `/evidence/runs/2026-08-22-seo-ai-001-r1/`.
- Search Console property, URL Inspection, manual-action, security-issue, and submitted-sitemap state require authenticated GSC evidence. Sitemap availability alone is not proof of indexing.

Future provider rankings additionally require comparable real runs, provider permissions, a fixed budget, and explicit review disclosure. Common ownership is never independent corroboration.

## Deployment and DNS

Vercel project: `seo-ai-agent-de`. DNS scope is limited to web routing for apex and www; nameservers and all mail, verification, security, and other non-web records remain unchanged.

## Rights

This repository is public for operational transparency. Third-party screenshots, text, code, data, brands, customer information, and model or provider outputs may be used only with an applicable right, license, permission, or quotation basis. No open-source license is granted unless a later commit adds one explicitly.