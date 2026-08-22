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
  title: "SEO AI Agent: Task Recipes mit prüfbarer Evidenz",
  description: "Baue SEO-Agent-Recipes mit Datenbedarf, Zugriffen, Budget, Abbruchregeln und prüfbaren Ergebnissen.",
  purpose: "Die Seite macht aus SEO-Fragen prüfbare Agentenaufträge und zeigt, welche realen Daten, Freigaben und Nachweise dafür benötigt werden.",
  status: "Indexierbarer Minimum-Viable-Launch mit einem datierten Einzel-Tasklauf. Es gibt keine Anbieter-Rangliste und keine unabhängige menschliche Review.",
  boundary: "Contextter darf keinen automatischen Siegerstatus erhalten. Jede spätere Bewertung braucht datierte Testevidenz und eine Eigentumsoffenlegung.",
  primaryProject: "Contextter (akzeptiert)",
  ownershipDisclosure: "seo-ai-agent.de wird im Umfeld von Contextter betrieben. Contextter ist ein offengelegter möglicher Testteilnehmer, keine unabhängige Quelle und erhält keinen automatischen Siegerstatus.",
  indexing: "indexable",
  reviewedAt: "2026-08-22",
  githubUrl: "https://github.com/lia-xim/seo-ai-agent.de",
  navigation: [
    { href: "/task-spec-builder", label: "Task Recipe" },
    { href: "/aufgaben", label: "Aufgaben" },
    { href: "/faehigkeiten", label: "Fähigkeiten" },
    { href: "/benchmarks", label: "Benchmarks" },
    { href: "/mcp-fuer-seo-agenten", label: "MCP" }
  ],
  pages: [
    { path: "/", label: "Start", description: "Prüfbare SEO-Agent-Aufträge und ehrlicher Projektstatus.", indexableWhenLaunched: true },
    { path: "/task-spec-builder", label: "Task Recipe Builder", description: "Einen begrenzten Auftrag mit Datenbedarf als Markdown oder JSON erstellen.", indexableWhenLaunched: true },
    { path: "/aufgaben", label: "Aufgaben", description: "Versionierte SEO-Aufgaben mit Evidenz- und Abnahmegrenzen.", indexableWhenLaunched: true },
    { path: "/aufgaben/technische-audit-triage", label: "Technische Audit-Triage", description: "Technische Befunde für eine menschliche Prüfung priorisieren.", indexableWhenLaunched: true },
    { path: "/aufgaben/keyword-chancen-priorisieren", label: "Keyword-Chancen priorisieren", description: "Keyword-Chancen anhand offengelegter Daten und Regeln ordnen.", indexableWhenLaunched: true },
    { path: "/aufgaben/interne-links-begruenden", label: "Interne Links begründen", description: "Interne Linkvorschläge mit Quell- und Ziel-Evidenz belegen.", indexableWhenLaunched: true },
    { path: "/benchmarks", label: "Benchmarks", description: "Datierte Taskläufe, Kriterien, Rohbeobachtungen und Review-Status.", indexableWhenLaunched: true },
    { path: "/benchmarks/2026-08-22-technische-audit-triage", label: "Technische Audit-Triage vom 22.08.2026", description: "Eingefrorener First-Party-Tasklauf mit Rohbeobachtungen, Kriterien und Grenzen.", indexableWhenLaunched: true },
    { path: "/agenten-vergleich", label: "Agentenvergleich", description: "Einen Ansatz nach Aufgabe, Risiko und Nachweisbedarf auswählen.", indexableWhenLaunched: true },
    { path: "/faehigkeiten", label: "Fähigkeiten", description: "Welche Daten-, Analyse-, Evidenz- und Kontrollfähigkeiten SEO-Agenten für klar begrenzte Aufgaben benötigen.", indexableWhenLaunched: true },
    { path: "/mcp-fuer-seo-agenten", label: "MCP für SEO-Agenten", description: "Wie MCP Datenzugriff und Toolgrenzen für SEO-Agenten beschreiben kann, ohne einen aktiven Endpoint vorzutäuschen.", indexableWhenLaunched: true },
    { path: "/methodik-und-konflikte", label: "Methodik und Konflikte", description: "Rubrik, Eigentum, Korrekturen und Grenzen prüfen.", indexableWhenLaunched: true },
    { path: "/quellen-und-rechte", label: "Quellen und Rechte", description: "Quellenregister, Drittanbieterrechte und Evidenzgrenzen.", indexableWhenLaunched: true },
    { path: "/impressum", label: "Impressum", description: "Anbieterkennzeichnung und Kontakt für seo-ai-agent.de.", indexableWhenLaunched: true },
    { path: "/datenschutz", label: "Datenschutz", description: "Datenschutzinformationen zur statischen Vercel-Website und zum lokalen Task Recipe Builder.", indexableWhenLaunched: true }
  ]
};
