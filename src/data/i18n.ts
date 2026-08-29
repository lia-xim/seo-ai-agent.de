export type Language = "de" | "en";

export const routePairs = [
  ["/", "/en"],
  ["/workflows", "/en/workflows"],
  ["/skill-packs", "/en/skill-packs"],
  ["/seo-agent-skill", "/en/seo-agent-skill"],
  ["/seo-agent-skill-check", "/en/seo-agent-skill-check"],
  ["/seo-agent-policy-generator", "/en/seo-agent-policy-generator"],
  ["/agent-skill-vergleich", "/en/agent-skill-comparison"],
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
    { href: "/skill-packs", label: "Skill Packs" },
    { href: "/seo-agent-skill", label: "Skill erstellen" },
    { href: "/seo-agent-skill-check", label: "Skill Check" },
    { href: "/seo-agent-policy-generator", label: "Policy" },
  ],
  en: [
    { href: "/en/skill-packs", label: "Skill Packs" },
    { href: "/en/seo-agent-skill", label: "Create skill" },
    { href: "/en/seo-agent-skill-check", label: "Skill Check" },
    { href: "/en/seo-agent-policy-generator", label: "Policy" },
  ]
} as const;

export const localeMeta = {
  de: { locale: "de_DE", otherLocale: "en_US", skip: "Zum Inhalt springen" },
  en: { locale: "en_US", otherLocale: "de_DE", skip: "Skip to content" }
} as const;
