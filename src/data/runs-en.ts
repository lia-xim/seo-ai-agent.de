export const runsEn = [
  {
    slug: "2026-08-22-technical-audit-triage",
    title: "Technical audit triage · R1",
    description: "English review page for the frozen first-party technical-audit run executed on 22 August 2026.",
    runId: "SEO-AI-001-2026-08-22-R1", status: "COMPLETED", task: "/en/tasks/technical-audit-triage",
    result: "Five prioritized findings from fourteen successful HTTP observations.",
    criteria: ["Frozen input and task version", "Fourteen raw observations", "Five source-linked findings", "Direct cost €0", "No writes during the run"],
    limits: ["First-party test only", "No independent human reviewer", "No authenticated Search Console connection", "No MCP connection", "No provider comparison or ranking"],
    artifact: "/evidence/runs/2026-08-22-seo-ai-001-r1/result.v1.json", raw: "/evidence/runs/2026-08-22-seo-ai-001-r1/raw-observations.v1.json"
  },
  {
    slug: "2026-08-22-internal-link-evidence",
    title: "Internal-link evidence · R1",
    description: "English review page for the frozen first-party internal-link run executed on 22 August 2026.",
    runId: "SEO-AI-003-2026-08-22-R1", status: "PARTIAL", task: "/en/tasks/justify-internal-links",
    result: "Ten candidates passed automated source, target, anchor, and canonical checks.",
    criteria: ["Frozen HTML fixture", "Ten candidates and observations", "All automated evidence gates passed", "Direct cost €0", "No link was inserted"],
    limits: ["Editorial acceptance remains open", "No independent human reviewer", "No live website, Search Console, or MCP connection", "Synthetic first-party fixture", "No provider comparison or ranking"],
    artifact: "/evidence/runs/2026-08-22-seo-ai-003-r1/result.v1.json", raw: "/evidence/runs/2026-08-22-seo-ai-003-r1/raw-observations.v1.json"
  }
] as const;
