# Project brief: seo-ai-agent.de

## Accepted purpose

seo-ai-agent.de is a German Task Recipe, execution-readiness, and reproducible evaluation resource for SEO agents. It is organized by concrete SEO job, required evidence, data capabilities, permissions, budget, failure handling, and acceptance criteria rather than by generic provider list.

The first useful product is a no-signup Task Recipe Builder with a clearly synthetic result view. It remains useful without Contextter; a future verified MCP connection may upgrade a recipe from a reusable prompt contract to evidence-backed execution.

## Domain status and rights

seo-ai-agent.de is a newly registered owned domain. It is not an expired-domain rebuild and does not continue a former site, operator, archive, brand, audience, or historical URL inventory. Ordinary third-party rights remain binding for screenshots, text, code, data, brands, customer information, and model or provider outputs.

## Audience

- SEO agencies defining bounded agent work for client sites.
- In-house SEO teams reviewing evidence, access, cost, and proposed changes.
- Founders comparing automation approaches without delegating unbounded write access.
- Developers implementing SEO agents, workflows, and review gates.

## Initial architecture

- `/task-spec-builder`: build and export a bounded Task Recipe, inspect MCP data readiness, and preview an explicitly synthetic evidence result.
- `/aufgaben`: inspect the versioned task library.
- `/benchmarks`: find dated real task runs and their review state.
- `/benchmarks/2026-08-22-technische-audit-triage`: inspect the first real frozen First-Party task run and raw observations.
- `/agenten-vergleich`: choose an approach by task, risk, access, and evidence need without a provider ranking.
- `/methodik-und-konflikte`: audit scoring dimensions, ownership, corrections, and limits.
- `/quellen-und-rechte`, `/impressum`, `/datenschutz`: inspect provenance, rights, operator, and actual processing.

## Published evidence state

`SEO-AI-001-2026-08-22-R1` is a real read-only technical audit of the public Noindex preview observed on 2026-08-22. Matthias Ramahi is Benchmark Owner and operator. The run publishes frozen input, task and prompt versions, harness and Node versions, 14 raw HTTP observations, five findings, criteria, cost, interventions, conflict disclosure, and limits.

No second human reviewer was available. The result is explicitly marked as not independently reviewed. It is First-Party technical evidence, not an independent recommendation and not an agent or provider ranking.

## Technical and privacy truth

- Static Astro site hosted on Vercel.
- Canonical HTML pages are indexable; automatic sitemap generation uses `@astrojs/sitemap`.
- robots.txt allows crawling and references the sitemap index.
- 404 stays noindex and outside the sitemap.
- www root and subpaths permanently redirect to the path-equivalent apex URL.
- No analytics, cookies, consent manager, advertising, contact form, external fonts, local/session storage, or embedded third-party media.
- Task Recipe inputs remain in browser memory and are not sent to a server.
- No live MCP, provider API, login, upload, paid execution, or automated external write.
- Vercel processes request and connection metadata to deliver and secure the site.

## Hard boundaries

- No automatic Contextter winner status and no commonly owned site as independent corroboration.
- No synthetic example presented as a real result.
- No live MCP or model-API claim while the connection remains disabled.
- No hidden weights, post-hoc rubric changes, unreported manual intervention, invented rankings, or fabricated test runs.
- No public provider comparison season without comparable frozen tasks, rights, budget, versions, interventions, and explicit review status.

## Indexable launch decision

Matthias Ramahi explicitly approved indexing once the site reached an honest, legally clean, technically verified minimum-viable launch. The named owner, real task run, ownership disclosure, legal pages, automatic canonical sitemap, crawlable robots, canonical host redirects, status handling, responsive browser QA, and production verification form that release gate.

Search Console submission, URL Inspection, Google-selected canonical, manual-action state, security-issue state, crawling, indexing, rankings, impressions, and clicks remain separate evidence states. They must not be inferred from technical indexability.

## Stop condition

If task evidence becomes stale, ownership or corrections disappear, privacy behavior changes without updated disclosure, or maintenance capacity is missing, stop publishing new comparison claims. Existing dated runs remain historical records with visible limitations. Provider rankings remain blocked until comparable evidence and review governance exist.