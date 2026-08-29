export interface TaskDefinition {
  id: string;
  slug: string;
  title: string;
  version: string;
  status: "draft_spec" | "executed_once";
  summary: string;
  goal: string;
  inScope: readonly string[];
  outOfScope: readonly string[];
  allowedSources: readonly string[];
  requiredCapabilities: readonly string[];
  accessMode: "read-only";
  timeLimitMinutes: number;
  costLimitEuro: number;
  expectedOutput: string;
  stopRule: string;
  acceptanceCriteria: readonly string[];
  failureSignals: readonly string[];
}

export const tasks = [
  {
    id: "SEO-AI-001",
    slug: "technische-audit-triage",
    title: "Technische Audit-Triage",
    version: "0.1.0",
    status: "executed_once",
    summary: "Technische Crawl- und Indexierungsbefunde für eine menschliche Prüfung priorisieren.",
    goal: "Fünf technische Crawl- oder Indexierungsbefunde priorisieren und mit prüfbarer Evidenz für eine menschliche Entscheidung vorbereiten.",
    inScope: ["Crawlbarkeit und Indexierbarkeit", "robots.txt und Meta-Robots", "kanonische Signale und Weiterleitungen", "XML-Sitemaps", "technische interne Verlinkung"],
    outOfScope: ["automatische Änderungen an Website oder Infrastruktur", "Content-Qualität und Conversion", "Backlink-Bewertung", "nicht freigegebene kostenpflichtige Daten"],
    allowedSources: ["Crawl-Export (CSV)", "Search-Console-Export", "Repository (nur lesen)"],
    requiredCapabilities: ["Site Audit", "Search Performance", "Work Items"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "Liste von fünf priorisierten Befunden mit Evidenz, Auswirkung, Kurzbegründung, betroffenen URLs und Verweisen auf die verwendeten Quellen.",
    stopRule: "Abbrechen und Rückfrage stellen, sobald Schreibzugriff, ein nicht freigegebener kostenpflichtiger Endpunkt oder personenbezogene Kundendaten erforderlich werden.",
    acceptanceCriteria: ["Jeder Befund verweist auf mindestens eine konkrete Quelle oder ein Artefakt.", "Beobachtung und Interpretation sind getrennt.", "Betroffene URLs und Prioritätsgrund sind nachvollziehbar.", "Unsicherheit, fehlende Daten und Gegenbelege sind sichtbar.", "Es wurde keine Website-Änderung ausgeführt."],
    failureSignals: ["Pauschale Health Scores ohne URL-Evidenz", "Nicht offengelegte Zusatzdaten oder Kosten", "Vorgeschlagene Schreibaktion ohne Freigabe", "Erfundene Crawl-, Index- oder Rankingdaten"]
  },
  {
    id: "SEO-AI-002",
    slug: "keyword-chancen-priorisieren",
    title: "Keyword-Chancen priorisieren",
    version: "0.1.0",
    status: "draft_spec",
    summary: "Keyword-Chancen anhand offengelegter Nachfrage-, Seiten- und Wettbewerbsdaten ordnen.",
    goal: "Zehn Keyword-Chancen für ein bestehendes Seiteninventar priorisieren, ohne fehlende Nachfrage- oder Rankingdaten zu erfinden.",
    inScope: ["bereitgestellter Keyword- und Seitenexport", "Suchintention und vorhandene Zielseite", "belegte Nachfrage- und Positionsdaten", "Kannibalisierungsrisiko", "Wirkung, Aufwand und Evidenzsicherheit"],
    outOfScope: ["automatische Veröffentlichung", "Keyword-Volumen aus nicht freigegebenen Quellen", "Ranking- oder Traffic-Garantien", "vollständige Content-Produktion"],
    allowedSources: ["Keyword-Export (CSV)", "Search-Console-Export", "Seiteninventar"],
    requiredCapabilities: ["Keyword Research", "Search Performance", "Domain Intelligence"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "Priorisierte Liste mit Keyword, Zielseite, Suchintention, Evidenz, Konfliktrisiko, empfohlenem nächsten Schritt und offengelegter Unsicherheit.",
    stopRule: "Abbrechen und Rückfrage stellen, wenn eine Zielseite, eine Nachfragequelle oder die Freigabe für frische kostenpflichtige Daten fehlt.",
    acceptanceCriteria: ["Jede Chance ist einer realen oder ausdrücklich vorgeschlagenen Zielseite zugeordnet.", "Vorhandene Daten und Annahmen sind getrennt.", "Kannibalisierungs- und Intentkonflikte sind sichtbar.", "Priorität und Aufwand sind begründet.", "Es gibt keine Ranking- oder Traffic-Garantie."],
    failureSignals: ["Erfundene Suchvolumina oder Positionen", "Eine neue Seite pro Keyword ohne Intentprüfung", "Nicht offengelegte Anbieter- oder Modellannahmen", "Priorisierung allein nach einem unklaren Gesamtscore"]
  },
  {
    id: "SEO-AI-003",
    slug: "interne-links-begruenden",
    title: "Interne Links begründen",
    version: "0.1.0",
    status: "executed_once",
    summary: "Interne Linkvorschläge mit Quell-, Ziel-, Anchor- und Platzierungsevidenz belegen.",
    goal: "Zehn interne Linkvorschläge erstellen, die eine reale Quellpassage mit einer hilfreichen Zielseite verbinden und von einer Person geprüft werden können.",
    inScope: ["bereitgestellter Crawl- oder Linkexport", "Quell- und Ziel-URL", "konkrete Quellpassage", "Anchor-Vorschlag", "Nutzer- und Crawlpfad"],
    outOfScope: ["automatisches Einfügen von Links", "exact-match Anchor-Quoten", "portfolio-weite Linkmuster", "Linkvorschläge ohne gelesenen Seiteninhalt"],
    allowedSources: ["Crawl- und Linkexport", "HTML- oder Markdown-Seitenkopien", "Repository (nur lesen)"],
    requiredCapabilities: ["Site Audit", "Internal Links", "Work Items"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "Zehn Vorschläge mit Quell-URL, Ziel-URL, gelesener Passage, Anchor, Platzierung, Begründung und möglichem Konflikt.",
    stopRule: "Abbrechen und Rückfrage stellen, wenn Seiteninhalte nicht gelesen werden können, die Zielseite nicht kanonisch ist oder Schreibzugriff erforderlich wird.",
    acceptanceCriteria: ["Jeder Vorschlag nennt Quelle und Ziel.", "Die Quellpassage trägt den Link inhaltlich.", "Anchor und Platzierung sind natürlich und nicht koordiniert.", "Bestehende Links und kanonische Ziele wurden berücksichtigt.", "Es wurde kein Link automatisch gesetzt."],
    failureSignals: ["Vorschläge allein aus URL-Slugs", "Siteweite exact-match Anchors", "Links zu nicht kanonischen oder nicht hilfreichen Zielen", "Behauptete Passage ohne gelesenen Inhalt"]
  }
] as const satisfies readonly TaskDefinition[];

export const englishTaskSlugs: Record<string, string> = {
  "technische-audit-triage": "technical-audit-triage",
  "keyword-chancen-priorisieren": "prioritize-keyword-opportunities",
  "interne-links-begruenden": "justify-internal-links"
};

export const tasksEn = [
  {
    id: "SEO-AI-001",
    slug: "technical-audit-triage",
    title: "Technical audit triage",
    version: "0.1.0",
    status: "executed_once",
    summary: "Prioritize crawl and indexing findings for human review.",
    goal: "Prioritize five crawl or indexing findings and prepare reviewable evidence for a human decision.",
    inScope: ["crawlability and indexability", "robots.txt and meta robots", "canonical signals and redirects", "XML sitemaps", "technical internal linking"],
    outOfScope: ["automatic website or infrastructure changes", "content quality and conversion", "backlink evaluation", "unapproved paid data"],
    allowedSources: ["Crawl export (CSV)", "Search Console export", "Repository (read-only)"],
    requiredCapabilities: ["Site Audit", "Search Performance", "Work Items"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "Five prioritized findings with evidence, impact, a short rationale, affected URLs, and references to the sources used.",
    stopRule: "Stop and ask whenever write access, an unapproved paid endpoint, or personal customer data would be required.",
    acceptanceCriteria: ["Every finding links to at least one concrete source or artifact.", "Observation and interpretation are separated.", "Affected URLs and the priority rationale are traceable.", "Uncertainty, missing data, and counter-evidence are visible.", "No website change was executed."],
    failureSignals: ["Generic health scores without URL evidence", "Undisclosed extra data or costs", "A proposed write action without approval", "Invented crawl, index, or ranking data"]
  },
  {
    id: "SEO-AI-002",
    slug: "prioritize-keyword-opportunities",
    title: "Prioritize keyword opportunities",
    version: "0.1.0",
    status: "draft_spec",
    summary: "Prioritize opportunities using disclosed demand, page, and competition data.",
    goal: "Prioritize ten keyword opportunities for an existing page inventory without inventing missing demand or ranking data.",
    inScope: ["provided keyword and page exports", "search intent and existing target page", "supported demand and position data", "cannibalization risk", "impact, effort, and evidence confidence"],
    outOfScope: ["automatic publishing", "keyword volume from unapproved sources", "ranking or traffic guarantees", "full content production"],
    allowedSources: ["Keyword export (CSV)", "Search Console export", "Page inventory"],
    requiredCapabilities: ["Keyword Research", "Search Performance", "Domain Intelligence"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "A prioritized list with keyword, target page, search intent, evidence, conflict risk, recommended next step, and disclosed uncertainty.",
    stopRule: "Stop and ask if a target page, a demand source, or approval for fresh paid data is missing.",
    acceptanceCriteria: ["Every opportunity maps to a real or explicitly proposed target page.", "Existing data and assumptions are separated.", "Cannibalization and intent conflicts are visible.", "Priority and effort are explained.", "There is no ranking or traffic guarantee."],
    failureSignals: ["Invented search volumes or positions", "One new page per keyword without intent review", "Undisclosed provider or model assumptions", "Prioritization based only on an opaque aggregate score"]
  },
  {
    id: "SEO-AI-003",
    slug: "justify-internal-links",
    title: "Justify internal links",
    version: "0.1.0",
    status: "executed_once",
    summary: "Support internal-link suggestions with source, target, anchor, and placement evidence.",
    goal: "Create ten internal-link suggestions that connect a real source passage to a useful target page and can be reviewed by a person.",
    inScope: ["provided crawl or link export", "source and target URL", "specific source passage", "anchor suggestion", "user and crawl path"],
    outOfScope: ["automatic link insertion", "exact-match anchor quotas", "portfolio-wide link patterns", "link suggestions without reading page content"],
    allowedSources: ["Crawl and link export", "HTML or Markdown page copies", "Repository (read-only)"],
    requiredCapabilities: ["Site Audit", "Internal Links", "Work Items"],
    accessMode: "read-only",
    timeLimitMinutes: 25,
    costLimitEuro: 4,
    expectedOutput: "Ten suggestions with source URL, target URL, read passage, anchor, placement, rationale, and possible conflict.",
    stopRule: "Stop and ask if page content cannot be read, the target is not canonical, or write access would be required.",
    acceptanceCriteria: ["Every suggestion names source and target.", "The source passage supports the link.", "Anchor and placement are natural and not coordinated.", "Existing links and canonical targets were considered.", "No link was inserted automatically."],
    failureSignals: ["Suggestions based only on URL slugs", "Sitewide exact-match anchors", "Links to non-canonical or unhelpful targets", "A claimed passage without read content"]
  }
] as const satisfies readonly TaskDefinition[];
