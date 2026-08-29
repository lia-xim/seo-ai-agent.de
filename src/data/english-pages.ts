export interface EnglishPageSection {
  number: string;
  title: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly { href: string; label: string }[];
}

export interface EnglishPage {
  slug: string;
  title: string;
  description: string;
  intro: string;
  meta: string;
  pageType?: "WebPage" | "CollectionPage";
  legal?: boolean;
  sections: readonly EnglishPageSection[];
}

export const englishPages: readonly EnglishPage[] = [
  {
    slug: "capabilities", title: "SEO-agent capabilities", description: "A task-oriented framework for data access, analysis, evidence, and controlled SEO-agent actions.", intro: "A capability only counts when its evidence can be reviewed.", meta: "5 CAPABILITY AREAS / READ-FIRST / PROVIDER-NEUTRAL", pageType: "CollectionPage",
    sections: [
      { number: "01", title: "Read crawl and indexing signals", paragraphs: ["Check status, robots directives, canonicals, sitemaps, and redirects as separate observations. Evidence should name the source URL, target, timestamp, and raw signal."], links: [{ href: "/en/tasks/technical-audit-triage", label: "Open matching task" }] },
      { number: "02", title: "Interpret search performance", paragraphs: ["Connect clicks, impressions, CTR, and position to the property, page, query, date range, filters, timezone, and data freshness. An export is not the same as an authenticated live connection."] },
      { number: "03", title: "Prioritize keyword opportunities", paragraphs: ["Combine demand, intent, existing pages, technical suitability, effort, and uncertainty. Never invent missing volume or rankings."], links: [{ href: "/en/tasks/prioritize-keyword-opportunities", label: "Open matching task" }] },
      { number: "04", title: "Justify internal links", paragraphs: ["Show the read source passage, canonical target, proposed anchor, current link state, and why the link helps the user."], links: [{ href: "/en/tasks/justify-internal-links", label: "Open matching task" }] },
      { number: "05", title: "Control access and actions", paragraphs: ["Separate read, propose, and write scopes. Log tool calls, cost, retries, questions, and final state. Stop when evidence or permission is missing."], links: [{ href: "/en/task-spec-builder", label: "Build a Task Recipe" }, { href: "https://seo-mcp.de/capabilities", label: "Review the shared-owner SEO MCP reference" }, { href: "https://contextter.com/", label: "View the shared-owner Contextter product context" }] }
    ]
  },
  {
    slug: "mcp-for-seo-agents", title: "MCP for SEO agents", description: "How MCP can expose SEO data and tools while task scope, evidence, and human approval remain separate.", intro: "MCP makes data reachable. It does not make the result correct.", meta: "READ-ONLY FIRST / NO PUBLIC CONTEXTTER ENDPOINT CLAIM",
    sections: [
      { number: "01", title: "Data access is not autonomy", paragraphs: ["A server can describe reachable data and tools. The Task Recipe still decides whether an agent may read, propose, or write."] },
      { number: "02", title: "Capability before provider", paragraphs: ["Name the required job first. Then verify whether a server exposes the right schema, authentication, freshness, cost, and evidence fields."] },
      { number: "03", title: "Read-only is the first useful milestone", paragraphs: ["A useful pilot can read one bounded project, return source-linked observations, and fail closed when tenant, scope, or freshness is unclear."] },
      { number: "04", title: "Current connection state", paragraphs: ["The Contextter connect remains disabled. No public endpoint, OAuth flow, or live read capability is claimed on this website."], links: [{ href: "/en/task-spec-builder", label: "Build a recipe without a connection" }, { href: "https://seo-mcp.de/capabilities", label: "Open the shared-owner technical reference" }] }
    ]
  },
  {
    slug: "runs", title: "Reproducible SEO-agent runs", description: "Dated first-party task runs with frozen inputs, raw observations, criteria, cost, review status, and limitations.", intro: "Two executed runs. No provider ranking.", meta: "2 FIRST-PARTY RUNS / 0 INDEPENDENT REVIEWERS / MCP OFF", pageType: "CollectionPage",
    sections: [
      { number: "R1", title: "Technical audit triage · 22 August 2026", paragraphs: ["SEO-AI-001 used a frozen first-party fixture and produced five prioritized findings from fourteen raw HTTP observations. Direct cost was €0. No website write, GSC connection, or MCP connection occurred."], links: [{ href: "/en/runs/2026-08-22-technical-audit-triage", label: "Review run evidence" }] },
      { number: "R1", title: "Internal-link evidence · 22 August 2026", paragraphs: ["SEO-AI-003 validated ten candidates against frozen HTML. Automated gates passed, but the run remains PARTIAL because no independent human reviewer completed editorial acceptance."], links: [{ href: "/en/runs/2026-08-22-internal-link-evidence", label: "Review run evidence" }] },
      { number: "GATE", title: "What is not proven", bullets: ["No provider comparison or winner", "No independent human reviewer", "No authenticated GSC evidence in the run", "No live MCP connection", "No fixed provider-season budget"] }
    ]
  },
  {
    slug: "agent-comparison", title: "Compare SEO-agent approaches", description: "Choose an approach by task, risk, evidence needs, and permissions instead of a generic winner table.", intro: "Choose the risk frame before the system.", meta: "ASSISTANT / READ-ONLY AGENT / ACTION AGENT",
    sections: [
      { number: "01", title: "Assistant", paragraphs: ["Useful when a person supplies the data and remains responsible for every action. Lowest access risk, highest manual effort."] },
      { number: "02", title: "Read-only agent", paragraphs: ["Useful for bounded analysis across real project data. It needs tenant-safe scopes, source-linked output, budgets, and stop rules."] },
      { number: "03", title: "Action agent", paragraphs: ["Use only when write access is necessary, the blast radius is bounded, approvals are explicit, and rollback is proven."] },
      { number: "RULE", title: "No automatic Contextter winner", paragraphs: ["Contextter shares the same operator as this website. It may become a disclosed task participant only after the tested capability is real and evaluated under the same frozen rules."] }
    ]
  },
  {
    slug: "seo-agent-costs", title: "Plan SEO-agent costs", description: "Include model, data, human review, retries, infrastructure, and reserve before approving a task run.", intro: "SEO-agent cost starts before the first call.", meta: "LOCAL PLANNING / NO MARKET-PRICE CLAIM",
    sections: [
      { number: "01", title: "Direct execution", paragraphs: ["Record model, tool, data-provider, and infrastructure spend using your own current terms. This site does not invent market prices."] },
      { number: "02", title: "Human review", paragraphs: ["Budget for setup, output review, adjudication, and corrections. A cheap model run can still create expensive review work."] },
      { number: "03", title: "Retries and reserve", paragraphs: ["Set a retry ceiling per step and a total reserve. A budget is a limit, not permission to call every available endpoint."] },
      { number: "04", title: "Portable budget field", paragraphs: ["The English Task Recipe Builder stores time and cost limits locally and exports them with the task."], links: [{ href: "/en/task-spec-builder", label: "Open the local builder" }] }
    ]
  },
  {
    slug: "failure-handling", title: "Failure handling for SEO agents", description: "Define stop, retry, fallback, escalation, and rollback behavior for bounded SEO-agent tasks.", intro: "A good SEO agent knows when to stop.", meta: "STOP / RETRY / ESCALATE / ROLLBACK",
    sections: [
      { number: "STOP", title: "Permission or rights conflict", paragraphs: ["Stop immediately when the requested action exceeds scope, requires unapproved paid data, or would expose confidential or personal data."] },
      { number: "RETRY", title: "Transient tool failure", paragraphs: ["Retry only when the error is plausibly transient, the retry limit is not exhausted, and a duplicate write cannot occur."] },
      { number: "ASK", title: "Missing evidence", paragraphs: ["Ask a precise question when a source, target, date range, canonical, or acceptance rule is missing. Do not fill the gap with a guess."] },
      { number: "ROLLBACK", title: "Unexpected write outcome", paragraphs: ["Stop further writes, preserve the log, revert through the approved recovery path, and require human review before resuming."] }
    ]
  },
  {
    slug: "methodology", title: "Methodology and conflicts", description: "A provider-neutral framework for evidence, permissions, repeatability, cost, time, failure handling, and disclosed conflicts.", intro: "A score cannot replace a run log.", meta: "METHOD V0.2 / PROVIDER GATES",
    sections: [
      { number: "01", title: "Evidence and repeatability", paragraphs: ["Freeze inputs, task version, allowed tools, environment, expected output, criteria, exclusions, retries, cost, and raw observations."] },
      { number: "02", title: "Review status", paragraphs: ["Both published runs name Matthias Ramahi as benchmark owner and openly state that no second independent human reviewer exists."] },
      { number: "03", title: "Provider gate", bullets: ["Benchmark and output rights documented", "Equal frozen task and rubric", "Provider, data, retry, infrastructure, and review budget fixed", "Reviewer and adjudication rule named", "Failures and excluded runs remain visible"] },
      { number: "04", title: "Ownership conflict", paragraphs: ["SEO AI Agent, Contextter, and seo-mcp.de share the same operator. Common ownership is disclosed beside relevant links and can never act as independent corroboration."] }
    ]
  },
  {
    slug: "sources-and-rights", title: "Sources and rights", description: "Source register, third-party rights, correction routes, and evidence limits for SEO AI Agent.", intro: "Use primary sources. Keep ownership and rights visible.", meta: "SOURCE REGISTER / RIGHTS BOUNDARY",
    sections: [
      { number: "01", title: "First-party run artifacts", paragraphs: ["Frozen input, raw observations, results, and reproduction scripts are published for the two real task runs where rights permit."], links: [{ href: "/en/runs", label: "Review public runs" }] },
      { number: "02", title: "Third-party material", paragraphs: ["Screenshots, text, code, data, brands, customer information, model output, and provider output remain subject to their respective rights and terms."] },
      { number: "03", title: "Common ownership", paragraphs: ["Contextter and seo-mcp.de are related portfolio properties, not independent sources. Their role is disclosed next to every relevant link."] },
      { number: "04", title: "Corrections", paragraphs: ["Technical corrections and vendor responses can be submitted through the public repository. Security reports belong in its private security flow."], links: [{ href: "https://github.com/lia-xim/seo-ai-agent.de/issues", label: "Open GitHub issues" }] }
    ]
  },
  {
    slug: "legal-notice", title: "Legal notice", description: "Provider identification and contact details for seo-ai-agent.de.", intro: "Provider identification for this website.", meta: "LEGAL / UPDATED 22 AUGUST 2026", legal: true,
    sections: [
      { number: "01 / PROVIDER", title: "Information under Section 5 DDG", paragraphs: ["Matthias Ramahi\nKempener Straße 44\n40699 Erkrath\nGermany", "Email: info@matthiasramahi.de"] },
      { number: "02 / EDITORIAL", title: "Responsible for editorial content", paragraphs: ["Matthias Ramahi, address as above.", "The content supports technical and editorial evaluation of SEO agents. It is not legal, tax, or business advice."] },
      { number: "03 / RIGHTS", title: "External links and rights", paragraphs: ["External website operators remain responsible for their content. Third-party rights in screenshots, text, data, brands, model output, and provider output remain unaffected."] },
      { number: "04 / CONFLICT", title: "Ownership disclosure", paragraphs: ["seo-ai-agent.de is operated in the Contextter environment. Contextter may later be a disclosed test participant, is not an independent source, and receives no automatic winner status."] }
    ]
  },
  {
    slug: "privacy", title: "Privacy", description: "Privacy information for the static Vercel website and local Task Recipe Builder.", intro: "What this website processes — and what remains local.", meta: "GDPR / UPDATED 22 AUGUST 2026", legal: true,
    sections: [
      { number: "01 / CONTROLLER", title: "Controller", paragraphs: ["Matthias Ramahi\nKempener Straße 44\n40699 Erkrath\nGermany", "Email: info@matthiasramahi.de"] },
      { number: "02 / HOSTING", title: "Static hosting through Vercel", paragraphs: ["Vercel processes technically necessary connection and log data when serving this static Astro site, including IP address, time, requested URL, browser and device information, referrer, security, and diagnostic data.", "The report-only Content Security Policy has no reporting endpoint. This website therefore does not collect or transmit CSP reports."], links: [{ href: "https://vercel.com/legal/privacy-notice", label: "Vercel privacy notice" }] },
      { number: "03 / LOCAL TOOL", title: "Local Task Recipe Builder", paragraphs: ["Builder inputs are processed in browser memory only. They are not sent to seo-ai-agent.de, Contextter, Vercel Functions, an MCP server, or an external API. Clipboard access occurs only after an explicit copy action."] },
      { number: "04 / NOT USED", title: "No analytics, cookies, forms, or live APIs", bullets: ["No analytics, advertising, or tracking", "No cookies, Local Storage, or Session Storage", "No contact form, account, login, or upload", "Fonts are delivered with the website", "No live MCP, AI-model, or external API calls", "No embedded videos, maps, or social widgets"] },
      { number: "05 / EMAIL", title: "Contact by email", paragraphs: ["When you contact us by email, sender address, content, time, and voluntarily supplied details are processed to answer the request. Data is deleted when the request is complete unless legal retention or legitimate documentation duties apply."] },
      { number: "06 / RIGHTS", title: "Your privacy rights", paragraphs: ["Subject to legal requirements, you may have rights to access, correction, deletion, restriction, portability, and objection. You may also complain to a supervisory authority."], links: [{ href: "https://www.ldi.nrw.de/", label: "Data Protection Authority of North Rhine-Westphalia" }] }
    ]
  }
];
