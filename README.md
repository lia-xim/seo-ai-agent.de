# seo-ai-agent.de

Public source repository for seo-ai-agent.de: a German Task Recipe and evidence workspace for making bounded SEO-agent work executable and reviewable without generic winner claims.

## Current state

The site is prepared as a public, legally identified preview on the owned custom domain. Indexing is deliberately disabled until there is explicit approval, a named benchmark owner, and at least one real reproducible task run with dated evidence.

Every generated page uses noindex, follow, and Vercel adds the same X-Robots-Tag globally. robots.txt allows crawling so search engines can observe the page-level noindex directive. The sitemap remains empty while indexing is blocked.

## Purpose and boundary

Die Seite macht aus SEO-Fragen klare Task Recipes mit Freigaben, Budgets, Datenbedarf, erwarteten Ergebnissen und nachvollziehbaren Testkriterien.

Contextter darf keinen automatischen Siegerstatus erhalten. Jede spätere Bewertung braucht datierte Testevidenz und eine Eigentumsoffenlegung. Contextter is disclosed as the accepted primary portfolio relationship and as a possible future test participant, not as an independent source.

## Fresh-domain boundary

seo-ai-agent.de is a newly registered domain. It is not an expired-domain rebuild and does not continue a former website, operator, archive, brand, audience, or URL inventory. There are no legacy recovery or historical-rights launch gates.

Ordinary third-party rights still apply to screenshots, text, code, data, brands, customer information, and model or provider outputs.

## Implemented surfaces

- / — purpose, example task, measurement dimensions, and current project status
- /task-spec-builder — local JSON/Markdown Task Recipe Builder with MCP capability readiness and no upload or login
- /aufgaben plus three versioned task definitions
- /benchmarks — launch gates and the currently empty benchmark state
- /agenten-vergleich — selection approaches without provider winner claims
- /methodik-und-konflikte — rubric, ownership, corrections, and conflict rules
- /quellen-und-rechte — source register and third-party rights boundaries
- /impressum — verified operator identification
- /datenschutz — processing details matched to the shipped static site
- true 404, crawlable robots.txt, and empty-while-noindex sitemap.xml

The first frozen draft tasks cover technical audit triage, keyword-opportunity prioritization, and evidence-backed internal-link proposals. A synthetic result view demonstrates evidence, gaps, costs, uncertainty, and manual review without claiming live MCP data.

## MCP and privacy boundary

The current UI does not connect to a live MCP server. It never asks for raw tokens, never performs paid work, and keeps the Contextter connect action disabled until OAuth, scopes, and at least one read capability are verified in production.

The site is statically hosted on Vercel. It has no analytics, cookies, consent manager, contact form, external font request, local or session storage, advertising, or embedded third-party media. Builder inputs stay in browser memory and are not transmitted. The Clipboard API is used only after an explicit copy action.

## Local development

    corepack pnpm install
    corepack pnpm dev

Full build, artifact, link, indexing, evidence-manifest, and status verification:

    corepack pnpm verify

Optional Chromium interaction and responsive QA:

    corepack pnpm dev --host 127.0.0.1 --port 4317
    corepack pnpm qa:browser

## Evidence

- evidence/rights-and-sources.v1.json records used sources, allowed use, and unresolved benchmark or governance questions.
- PROJECT_BRIEF.md is the implementation contract for purpose, IA, visual system, disclosure, launch gates, and stop conditions.
- Unknown paths return a true 404; there is no catch-all redirect.

## Indexing gates

Do not remove noindex until all of the following are true:

1. The owner explicitly approves indexing.
2. A named benchmark owner is recorded.
3. At least one real, frozen and reproducible task run is published with dated evidence.
4. Ownership, method, costs, limitations, manual interventions, and corrections are disclosed.
5. Production canonicals, robots, sitemap, status codes, accessibility and performance are reverified.

Public rankings additionally require a reviewer, provider permissions, a budget, and the same rubric for every participant. If operating capacity is missing, keep the site as a builder and versioned task reference.

## Deployment

Vercel project: seo-ai-agent-de.

The custom domain may serve the noindex preview. DNS scope is limited to web routing for apex and www; nameservers and all mail, verification, security, and other non-web records remain unchanged. Indexing is a separate later decision.

## Rights

This repository is public for operational transparency. Third-party screenshots, text, code, data, brands, customer information, and model or provider outputs may be used only with an applicable right, license, permission, or quotation basis. No open-source license is granted unless a later commit adds one explicitly.
