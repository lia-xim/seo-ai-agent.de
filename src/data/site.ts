export type IndexingMode = "blocked" | "indexable";

export interface SitePage {
  path: string;
  label: string;
  description: string;
  indexableWhenLaunched: boolean;
}

export interface SiteConfig {
  domain: string;
  origin: string;
  previewUrl: string;
  language: "de";
  locale: "de_DE";
  title: string;
  description: string;
  purpose: string;
  status: string;
  boundary: string;
  primaryProject: string;
  ownershipDisclosure: string;
  indexing: IndexingMode;
  reviewedAt: string;
  githubUrl: string;
  navigation: readonly { href: string; label: string }[];
  pages: readonly SitePage[];
}

export const site: SiteConfig = {
  domain: "seo-ai-agent.de",
  origin: "https://seo-ai-agent.de",
  previewUrl: "https://seo-ai-agent-de.vercel.app",
  language: "de",
  locale: "de_DE",
  title: "SEO Agent Skill: Kostenlos erstellen und direkt nutzen",
  description: "Professionelle SEO Agent Skill Packs für Codex, Claude Code, Gemini CLI und Cursor – lokal verpackt, kostenlos und ohne Anmeldung.",
  purpose: "Die Seite bietet gepflegte SEO Agent Skill Packs, einen einfachen Skill Generator, einen Policy Generator und reproduzierbare Aufgaben als belastbare Arbeitsgrundlage.",
  status: "Indexierbarer Launch mit zwei datierten First-Party-Taskläufen. Der zweite Lauf ist wegen fehlender unabhängiger menschlicher Review ausdrücklich nur teilweise abgenommen. Es gibt keine Anbieter-Rangliste.",
  boundary: "Contextter darf keinen automatischen Siegerstatus erhalten. Jede spätere Bewertung braucht datierte Testevidenz und eine Eigentumsoffenlegung.",
  primaryProject: "Contextter (akzeptiert)",
  ownershipDisclosure: "seo-ai-agent.de wird im Umfeld von Contextter betrieben. Contextter ist ein offengelegter möglicher Testteilnehmer, keine unabhängige Quelle und erhält keinen automatischen Siegerstatus.",
  indexing: "indexable",
  reviewedAt: "2026-08-29",
  githubUrl: "https://github.com/lia-xim/seo-ai-agent.de",
  navigation: [
    { href: "/skill-packs", label: "Skill Packs" },
    { href: "/seo-agent-skill", label: "Skill erstellen" },
    { href: "/seo-agent-policy-generator", label: "Policy" },
    { href: "/agent-skill-vergleich", label: "Vergleich" }
  ],
  pages: [
    { path: "/", label: "Start", description: "SEO Agent Skill erstellen und direkt verwenden.", indexableWhenLaunched: true },
    { path: "/skill-packs", label: "SEO Agent Skill Packs", description: "Acht kuratierte SEO-Skill-Packs in fünf Agentenformaten lokal herunterladen.", indexableWhenLaunched: true },
    { path: "/seo-agent-skill", label: "SEO Agent Skill Generator", description: "Einen evidenzbasierten SEO Agent Skill als Prompt oder SKILL.md erstellen.", indexableWhenLaunched: true },
    { path: "/seo-agent-policy-generator", label: "SEO Agent Policy Generator", description: "Scope, Daten, Aktionen, Kosten und Stop-Regeln für einen SEO-Agenten festlegen.", indexableWhenLaunched: true },
    { path: "/agent-skill-vergleich", label: "Agent-Skill-Formatvergleich", description: "Codex, Claude Code, Gemini CLI und Cursor anhand ihrer dokumentierten Skill-Formate vergleichen.", indexableWhenLaunched: true },
    { path: "/workflows", label: "Workflows", description: "Vier begrenzte SEO-Agent-Workflows vom Auftrag bis zum prüfbaren Run.", indexableWhenLaunched: true },
    { path: "/aufgaben", label: "Aufgaben", description: "Versionierte SEO-Aufgaben mit Evidenz- und Abnahmegrenzen.", indexableWhenLaunched: true },
    { path: "/aufgaben/technische-audit-triage", label: "Technische Audit-Triage", description: "Technische Befunde für eine menschliche Prüfung priorisieren.", indexableWhenLaunched: true },
    { path: "/aufgaben/keyword-chancen-priorisieren", label: "Keyword-Chancen priorisieren", description: "Keyword-Chancen anhand offengelegter Daten und Regeln ordnen.", indexableWhenLaunched: true },
    { path: "/aufgaben/interne-links-begruenden", label: "Interne Links begründen", description: "Interne Linkvorschläge mit Quell- und Ziel-Evidenz belegen.", indexableWhenLaunched: true },
    { path: "/benchmarks", label: "Benchmarks", description: "Datierte Taskläufe, Kriterien, Rohbeobachtungen und Review-Status.", indexableWhenLaunched: true },
    { path: "/benchmarks/2026-08-22-technische-audit-triage", label: "Technische Audit-Triage vom 22.08.2026", description: "Eingefrorener First-Party-Tasklauf mit Rohbeobachtungen, Kriterien und Grenzen.", indexableWhenLaunched: true },
    { path: "/benchmarks/2026-08-22-interne-link-evidenz", label: "Interne Link-Evidenz vom 22.08.2026", description: "Ausgeführter First-Party-Tasklauf mit zehn HTML-validierten Linkkandidaten und offenem Human-Review-Gate.", indexableWhenLaunched: true },
    { path: "/agenten-vergleich", label: "Agentenvergleich", description: "Einen Ansatz nach Aufgabe, Risiko und Nachweisbedarf auswählen.", indexableWhenLaunched: true },
    { path: "/faehigkeiten", label: "Fähigkeiten", description: "Welche Daten-, Analyse-, Evidenz- und Kontrollfähigkeiten SEO-Agenten für klar begrenzte Aufgaben benötigen.", indexableWhenLaunched: true },
    { path: "/mcp-fuer-seo-agenten", label: "MCP für SEO-Agenten", description: "Wie MCP Datenzugriff und Toolgrenzen für SEO-Agenten beschreiben kann, ohne einen aktiven Endpoint vorzutäuschen.", indexableWhenLaunched: true },
    { path: "/seo-agent-kosten", label: "SEO-Agent-Kosten", description: "Direkte Ausgaben, Review, Retries und Reserve für begrenzte SEO-Agent-Taskläufe berechnen.", indexableWhenLaunched: true },
    { path: "/fehlerbehandlung-seo-agenten", label: "Fehlerbehandlung", description: "Stop-, Retry-, Eskalations- und Rollback-Regeln für SEO-Agent-Aufgaben definieren.", indexableWhenLaunched: true },
    { path: "/methodik-und-konflikte", label: "Methodik und Konflikte", description: "Rubrik, Eigentum, Korrekturen und Grenzen prüfen.", indexableWhenLaunched: true },
    { path: "/quellen-und-rechte", label: "Quellen und Rechte", description: "Quellenregister, Drittanbieterrechte und Evidenzgrenzen.", indexableWhenLaunched: true },
    { path: "/impressum", label: "Impressum", description: "Anbieterkennzeichnung und Kontakt für seo-ai-agent.de.", indexableWhenLaunched: true },
    { path: "/datenschutz", label: "Datenschutz", description: "Datenschutzinformationen zur statischen Vercel-Website und zu den browser-lokalen Generatoren.", indexableWhenLaunched: true },
    { path: "/en", label: "English home", description: "Create and use an evidence-led SEO Agent Skill.", indexableWhenLaunched: true },
    { path: "/en/skill-packs", label: "SEO Agent Skill Packs", description: "Download eight curated SEO skill packs in five agent formats locally.", indexableWhenLaunched: true },
    { path: "/en/seo-agent-skill", label: "SEO Agent Skill Generator", description: "Create an evidence-led SEO Agent Skill as a prompt or SKILL.md.", indexableWhenLaunched: true },
    { path: "/en/seo-agent-policy-generator", label: "SEO Agent Policy Generator", description: "Define scope, data, actions, cost, and stop rules for an SEO agent.", indexableWhenLaunched: true },
    { path: "/en/agent-skill-comparison", label: "Agent skill format comparison", description: "Compare Codex, Claude Code, Gemini CLI, and Cursor by documented skill format.", indexableWhenLaunched: true },
    { path: "/en/workflows", label: "Workflows", description: "Four bounded SEO-agent workflows.", indexableWhenLaunched: true },
    { path: "/en/tasks", label: "Tasks", description: "Versioned SEO-agent tasks.", indexableWhenLaunched: true },
    { path: "/en/tasks/technical-audit-triage", label: "Technical audit triage", description: "Prioritize technical findings with evidence.", indexableWhenLaunched: true },
    { path: "/en/tasks/prioritize-keyword-opportunities", label: "Prioritize keyword opportunities", description: "Prioritize opportunities without invented data.", indexableWhenLaunched: true },
    { path: "/en/tasks/justify-internal-links", label: "Justify internal links", description: "Support internal links with source and target evidence.", indexableWhenLaunched: true },
    { path: "/en/runs", label: "Runs", description: "Dated first-party task runs and limits.", indexableWhenLaunched: true },
    { path: "/en/runs/2026-08-22-technical-audit-triage", label: "Technical audit run", description: "English review of the technical first-party run.", indexableWhenLaunched: true },
    { path: "/en/runs/2026-08-22-internal-link-evidence", label: "Internal-link evidence run", description: "English review of the internal-link first-party run.", indexableWhenLaunched: true },
    { path: "/en/capabilities", label: "Capabilities", description: "Task-oriented SEO-agent capabilities.", indexableWhenLaunched: true },
    { path: "/en/mcp-for-seo-agents", label: "MCP for SEO agents", description: "MCP data access and task boundaries.", indexableWhenLaunched: true },
    { path: "/en/agent-comparison", label: "Agent comparison", description: "Compare approaches by job and risk.", indexableWhenLaunched: true },
    { path: "/en/seo-agent-costs", label: "SEO-agent costs", description: "Plan execution, review, retries, and reserve.", indexableWhenLaunched: true },
    { path: "/en/failure-handling", label: "Failure handling", description: "Define stop, retry, escalation, and rollback rules.", indexableWhenLaunched: true },
    { path: "/en/methodology", label: "Methodology", description: "Evidence, review, cost, and conflict rules.", indexableWhenLaunched: true },
    { path: "/en/sources-and-rights", label: "Sources and rights", description: "Source register and rights boundaries.", indexableWhenLaunched: true },
    { path: "/en/legal-notice", label: "Legal notice", description: "Provider identification and contact.", indexableWhenLaunched: true },
    { path: "/en/privacy", label: "Privacy", description: "Privacy information for the static site and browser-local generators.", indexableWhenLaunched: true }
  ]
};
