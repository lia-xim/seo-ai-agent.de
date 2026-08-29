export type Language = "de" | "en";

export const routePairs = [
  ["/", "/en"],
  ["/workflows", "/en/workflows"],
  ["/task-spec-builder", "/en/task-spec-builder"],
  ["/aufgaben", "/en/tasks"],
  ["/aufgaben/technische-audit-triage", "/en/tasks/technical-audit-triage"],
  ["/aufgaben/keyword-chancen-priorisieren", "/en/tasks/prioritize-keyword-opportunities"],
  ["/aufgaben/interne-links-begruenden", "/en/tasks/justify-internal-links"],
  ["/faehigkeiten", "/en/capabilities"],
  ["/mcp-fuer-seo-agenten", "/en/mcp-for-seo-agents"],
  ["/benchmarks", "/en/runs"],
  ["/benchmarks/2026-08-22-technische-audit-triage", "/en/runs/2026-08-22-technical-audit-triage"],
  ["/benchmarks/2026-08-22-interne-link-evidenz", "/en/runs/2026-08-22-internal-link-evidence"],
  ["/agenten-vergleich", "/en/agent-comparison"],
  ["/seo-agent-kosten", "/en/seo-agent-costs"],
  ["/fehlerbehandlung-seo-agenten", "/en/failure-handling"],
  ["/methodik-und-konflikte", "/en/methodology"],
  ["/quellen-und-rechte", "/en/sources-and-rights"],
  ["/impressum", "/en/legal-notice"],
  ["/datenschutz", "/en/privacy"]
] as const;

const alternateRoutes = new Map<string, string>(
  routePairs.flatMap(([de, en]) => [[de, en], [en, de]])
);

export const languageForPath = (path: string): Language => path === "/en" || path.startsWith("/en/") ? "en" : "de";
export const alternatePathFor = (path: string) => alternateRoutes.get(path);

export const navigation = {
  de: [
    { href: "/workflows", label: "Workflows" },
    { href: "/task-spec-builder", label: "Task Recipe" },
    { href: "/aufgaben", label: "Aufgaben" },
    { href: "/benchmarks", label: "Runs" },
    { href: "/mcp-fuer-seo-agenten", label: "MCP" }
  ],
  en: [
    { href: "/en/workflows", label: "Workflows" },
    { href: "/en/task-spec-builder", label: "Task Recipe" },
    { href: "/en/tasks", label: "Tasks" },
    { href: "/en/runs", label: "Runs" },
    { href: "/en/mcp-for-seo-agents", label: "MCP" }
  ]
} as const;

export const localeMeta = {
  de: { locale: "de_DE", otherLocale: "en_US", skip: "Zum Inhalt springen" },
  en: { locale: "en_US", otherLocale: "de_DE", skip: "Skip to content" }
} as const;
