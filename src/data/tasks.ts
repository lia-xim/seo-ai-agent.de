export interface TaskDefinition {
  id: string;
  slug: string;
  title: string;
  version: string;
  status: "draft_spec";
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
    status: "draft_spec",
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
    status: "draft_spec",
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
