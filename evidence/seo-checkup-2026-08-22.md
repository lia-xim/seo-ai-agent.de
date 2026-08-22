# SEO Check-up · seo-ai-agent.de · 2026-08-22

## Scope und Entscheidungsgrenze

- Auftrag: technischer, inhaltlicher und nutzerbezogener Check-up mit direkter erster Ausbaustufe.
- Akzeptierte Hauptprojekt-Zuordnung: **Contextter**; unverändert.
- Domainstatus: neu registrierte eigene Domain; keine Legacy-, Archiv- oder Altbetreiberlogik.
- Nicht ausgeführt: kostenpflichtige Keyword-/SERP-API, DNS-Änderung, Rankingversprechen, aktive MCP-Verbindung.
- Authentifizierter Search-Console-Status: **nicht verifiziert**. Daher keine Aussage zu Impressionen, Klicks, Google-selected Canonical oder tatsächlicher Indexaufnahme.

## Evidence Register

| Status | Aussage | Evidenz | Konsequenz |
|---|---|---|---|
| Verified | Der öffentliche Sitemap-Index lieferte 15 kanonische HTML-Seiten, alle mit Status 200. | `node scripts/live-seo-audit.mjs`, Lauf `2026-08-22T20:18:13.723Z` | Technische Basis erhalten; neue Seiten über dieselbe Registry/Sitemap führen. |
| Verified | Es gab keine doppelten Titles, Descriptions oder H1, keine Orphans und keine defekten internen Ziele. | Derselbe Live-Crawl | Keine pauschale Metadatenumschreibung; nur neue eindeutige Nutzerjobs ergänzen. |
| Verified | HTTP→HTTPS, www→Apex und Slashvarianten normalisierten permanent mit 308; Query und Pfad blieben erhalten. | Live-Edge-Checks im Audit-Script | Redirect-Vertrag unverändert lassen. |
| Verified | Unbekannte Pfade und `/sitemap.xml` lieferten echte 404; `/sitemap-index.xml` lieferte 200. | Live-Edge-Checks | Keine Catch-all-Weiterleitung und keine manuelle Sitemap ergänzen. |
| Verified | Kein Meta- oder Header-noindex auf kanonischen Seiten; HSTS und zentrale Security Header vorhanden; CSP nur Report-only. | Live-Crawl und `vercel.json` | Indexierbaren Status erhalten; CSP erst nach gesonderter Beobachtung erzwingen. |
| Verified | Die Website nannte Kosten und Fehlerbehandlung als Rubrik, bot aber weder Berechnung noch ausführbaren Failure-Handling-Vertrag. | Vollständige Prüfung von `src/data/site.ts`, Seiten und Komponenten | Zwei eigenständige, wartbare Nutzerjobs bauen. |
| Verified | `/agenten-vergleich` erklärte drei Arbeitsweisen, blieb mit 199 sichtbaren Wörtern aber deutlich abstrakter als Capability- und Methodikseiten. | Live-Inventar und Quellprüfung | Vorhandene Seite zuerst um Risikogates und Auswahlpfad stärken. |
| Verified | `SECURITY.md` behauptete noch einen absichtlich von Indexierung ausgeschlossenen Stand, obwohl der Launch indexierbar war. | Repo-Prüfung | Dokumentation an den echten Launchstatus anpassen. |
| Supported | Task-Kosten sind nicht dasselbe wie Agenturpreise: Modell, Daten, Review, Retries und Reserve müssen pro Lauf getrennt werden. | Bestehende Task-Spezifikation, akzeptierter Domain-Scope; Suchsnapshot zeigte überwiegend Agenturpreis-Seiten statt Taskkalkulation. | Browser-lokalen Rechner ohne Marktpreisbehauptung bauen. |
| Supported | Stop, Retry, Eskalation, Recovery und menschliches Eingreifen sind eigenständige operative Kontrollen. | NIST AI RMF/AIRC zu TEVV, Monitoring, Incident Response und Recovery; vorhandene Stop-Regeln | Taskbezogene Failure-Matrix und kopierbaren Mindestvertrag bauen. |
| Hypothesis | Die zwei neuen Seiten können qualifizierte Einstiege für Nutzer schaffen, die noch keine vollständige Task Recipe bauen. | Informationsarchitektur und Intent-Abgrenzung, nicht GSC-bestätigt | Als klar gekennzeichnete erste Ausbaustufe veröffentlichen und in GSC beobachten. |
| Experiment | Search-Performance je neuer Canonical-Seite nach 30/60/90 Tagen bewerten. | Künftige GSC-Seiten-/Querydaten; aktuell nicht authentifiziert verifiziert | Keine Trafficprognose. Bei null qualifizierter Nachfrage stärken, zusammenführen oder aus Sitemap nehmen. |
| Rejected | Marktpreislisten, Anbieter-Rankings, automatischer Contextter-Sieger, MCP-Dokumentationskopie und Keyword-Fan-out. | Rechte-/Evidenzgrenzen und akzeptierte Domainstrategie | Nicht implementieren. |

## Priorisierte Befunde

### P0

Keine nachgewiesenen P0-Blocker im öffentlich erreichbaren technischen Stand.

### P1

1. **Fehlender Kostenjob:** Das Produkt verlangte ein Kostenlimit, half aber nicht bei dessen Herleitung. Maßnahme: `/seo-agent-kosten` mit lokalem, providerneutralem Kalkulator.
2. **Fehlender Failure-Handling-Job:** Stop-Regeln waren verteilt, aber Retry, Eskalation und Rollback nicht als Vertrag ausführbar. Maßnahme: `/fehlerbehandlung-seo-agenten`.
3. **Zu abstrakter Vergleich:** `/agenten-vergleich` drohte gegenüber `/faehigkeiten` und `/methodik-und-konflikte` austauschbar zu wirken. Maßnahme: klare Rolle „kleinste sichere Automationsstufe wählen“, vier Risikogates und Auswahlpfad.
4. **Dokumentationsdrift:** `SECURITY.md` widersprach dem indexierbaren Live-Status. Maßnahme: korrigiert.

### P2

1. Authentifizierte GSC-Evidenz für Sitemap-Einreichung, Indexierung, Queries und Google-selected Canonical fehlt weiterhin.
2. Der erste reale Lauf ist First-Party und nicht unabhängig reviewed. Das ist sichtbar und verhindert weiterhin ein belastbares Anbieter-Ranking.
3. CSP bleibt Report-only. Das ist bewusst, aber eine spätere Enforcement-Entscheidung braucht beobachtete Verletzungen und aktualisierte Hashes.

### P3

1. Die drei Task-Detailseiten sind kompakt. Sie erfüllen einen klaren Referenzjob; Ausbau erst mit realen Runs oder Nutzerfragen, nicht über generische Textmenge.
2. Analytics fehlen bewusst. Interaktionsmessung des lokalen Rechners wäre eine neue Datenschutz- und Implementierungsentscheidung und wird nicht still ergänzt.

## Page-Action-Matrix

Jede indexierbare URL erhält genau einen primären Nutzerjob.

| Canonical URL | Primärer Nutzerjob | Rolle | Aktion 2026-08-22 |
|---|---|---|---|
| `/` | Verstehen, was eine prüfbare SEO-Agent-Aufgabe ist, und den passenden Einstieg wählen. | Hub | Stärken: Kontrollcluster ergänzen. |
| `/task-spec-builder` | Eine begrenzte Task Recipe lokal erstellen und exportieren. | Tool | Behalten; Kosten- und Failure-Links als nächste Schritte nutzen. |
| `/aufgaben` | Verfügbare versionierte Tasks auswählen. | Collection | Behalten. |
| `/aufgaben/technische-audit-triage` | Die Spezifikation für technische Audit-Triage übernehmen. | Task Reference | Behalten. |
| `/aufgaben/keyword-chancen-priorisieren` | Die Spezifikation für belegte Keyword-Priorisierung übernehmen. | Task Reference | Behalten. |
| `/aufgaben/interne-links-begruenden` | Die Spezifikation für evidenzbasierte interne Linkvorschläge übernehmen. | Task Reference | Behalten. |
| `/benchmarks` | Veröffentlichte echte Taskläufe und ihren Reviewstatus finden. | Collection | Behalten. |
| `/benchmarks/2026-08-22-technische-audit-triage` | Einen realen Lauf samt Rohdaten reproduzieren und begrenzen. | Dataset / Proof | Behalten. |
| `/agenten-vergleich` | Die kleinste sichere Automationsstufe für eine Aufgabe wählen. | Decision Guide | Stärken: Risikogates und Auswahlpfad. |
| `/faehigkeiten` | Benötigte Daten-, Analyse- und Kontrollfähigkeiten ableiten. | Capability Hub | Behalten. |
| `/mcp-fuer-seo-agenten` | Die Rolle von MCP im Task→Capability→Run-Ablauf verstehen. | Integration Guide | Behalten; Verbindungsstatus bleibt ehrlich deaktiviert. |
| `/seo-agent-kosten` | Ein Taskbudget aus eigenen Kosten- und Reviewannahmen berechnen. | Local Calculator | **Neu.** |
| `/fehlerbehandlung-seo-agenten` | Stop-, Retry-, Eskalations- und Rollback-Regeln festlegen. | Method / Template | **Neu.** |
| `/methodik-und-konflikte` | Bewertungsrubrik, Reviewregeln und Interessenkonflikte prüfen. | Methodology | Stärken: operative Tools verlinken. |
| `/quellen-und-rechte` | Quellenstatus, Rechte und Evidenzgrenzen prüfen. | Trust | Behalten. |
| `/impressum` | Betreiber und Kontakt rechtlich feststellen. | Legal | Behalten. |
| `/datenschutz` | Tatsächliche Datenverarbeitung der statischen Seite verstehen. | Legal / Privacy | Behalten; neue lokale Kalkulation erfordert keine Übertragung. |

## Hub-/Cluster-Map

```text
/
├── Auftrag erstellen
│   ├── /task-spec-builder
│   └── /aufgaben
│       ├── /aufgaben/technische-audit-triage
│       ├── /aufgaben/keyword-chancen-priorisieren
│       └── /aufgaben/interne-links-begruenden
├── Ausführung kontrollieren
│   ├── /faehigkeiten
│   ├── /mcp-fuer-seo-agenten
│   ├── /seo-agent-kosten
│   └── /fehlerbehandlung-seo-agenten
├── Ergebnisse bewerten
│   ├── /benchmarks
│   │   └── /benchmarks/2026-08-22-technische-audit-triage
│   ├── /agenten-vergleich
│   └── /methodik-und-konflikte
└── Vertrauen und Recht
    ├── /quellen-und-rechte
    ├── /impressum
    └── /datenschutz
```

Die Cluster werden kontextuell intern verlinkt. Contextter und seo-mcp.de bleiben nur an fachlich passenden Stellen mit unmittelbarer Common-Ownership-Offenlegung verknüpft; es gibt kein Portfolio-Footer-Netz.

## 30/60/90-Tage-Sequenz

- **30 Tage:** GSC-Property und Sitemapstatus authentifiziert prüfen; Indexabdeckung der zwei neuen URLs, Seiten-/Query-Impressionen und Canonical-Auswahl dokumentieren. Keine Positionsinterpretation bei zu wenigen Impressionen.
- **60 Tage:** Qualifizierte Queries gegen den primären Nutzerjob prüfen. Vergleichsseite nur mit realen Aufgabenfragen vertiefen; keine Anbieterlisten ohne gleiche Specs und echte Runs.
- **90 Tage:** Pro neue Seite entscheiden: stärken, unverändert lassen, mit einem Hub zusammenführen oder aus Sitemap/Index nehmen. Zweiten realen Tasklauf nur mit eingefrorenem Input, Rechten, Budget und sichtbarem Reviewstatus veröffentlichen.

## Reproduktionsbefehle

```powershell
corepack pnpm verify
node scripts/live-seo-audit.mjs
corepack pnpm qa:browser
```

Der Live-Crawl ist eine technische Momentaufnahme. Er beweist weder Indexierung noch Rankings oder organische Nachfrage.

## Implementierungs- und QA-Nachweis

- `corepack pnpm verify`: 34 Astro-Dateien ohne Fehler/Warnungen/Hinweise; 17 indexierbare Canonicals plus echte 404; Sitemap-, Canonical-, Schema-, Rechte-, Security-, interne Link- und Statusverträge bestanden.
- Report-only-CSP: 18 HTML-Dateien, 19 exakt aus dem Build berechnete Inline-Script-Hashes, kein `unsafe-inline` oder `unsafe-eval`.
- Chrome 151, Desktop 1536×1024 und Mobil 390×844: Rechnerinteraktion, Builderinteraktion, Auswahlhilfe, MCP-disabled-Status, Datenschutz, Tastatur-Skip-Link und Responsive Navigation bestanden.
- Axe: 13 geprüfte Desktop-/Mobilzustände, 0 Violations. Browserkonsole und Runtime: 0 Fehler.
- Lokales Performancebudget der Startseite: Response End 13 ms, DOMContentLoaded 198 ms, Load 228 ms, First Contentful Paint 544 ms, 6 Ressourcen und 90.057 kodierte Bytes. Das ist lokale Labor-Evidenz, kein Field-CWV- oder Rankingnachweis.
- Ein lokaler Lighthouse-Runner war nicht installiert; es wurde keine neue Audit-Abhängigkeit nur für einen Score ergänzt. Öffentliche Lighthouse-/PageSpeed-Werte werden erst gegen den deployten Stand erhoben und bleiben von lokalen Labormessungen getrennt.
- Der bevorzugte In-App-Browser konnte wegen des reproduzierbaren Windows-Sandboxfehlers `helper_unknown_error: apply deny-read ACLs` nicht initialisiert werden. Der vorhandene Chrome-CDP-Harness diente als Fallback.