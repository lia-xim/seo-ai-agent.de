# Readiness-Audit seo-ai-agent.de

Stand: 23.08.2026

Owner: Matthias Ramahi

Scope: Repository, statischer Build, oeffentliche Produktion, reproduzierbare Task-Evidenz und Launch-Governance

Projektzuordnung: Contextter (akzeptiert, unveraendert)

## Ergebnis

Der lokale Release-Kandidat besteht die technischen Launch-Gates. Es gibt 18 kanonische, indexierbare Inhaltsseiten, eine automatisch erzeugte Sitemap, eine echte 404, passende Seitentypen im strukturierten Markup und einen gehashten CSP-Vertrag im Report-only-Modus. Die Website behauptet weder einen Provider-Sieger noch eine aktive MCP-Verbindung.

Der inhaltlich groesste belegbare Mangel war die geringe Benchmarktiefe. Als erste Ausbaustufe wurde `SEO-AI-003-2026-08-22-R1` ausgefuehrt und veroeffentlicht. Der Lauf validiert zehn interne Linkkandidaten technisch, bleibt aber wegen fehlendem unabhaengigem Human-Review bewusst `partial`. Ein eingefrorenes, aus HTTP-Antworten abgeleitetes Seiten-Fixture macht die historischen Checks auch nach Live-Aenderungen wiederholbar.

## Findings nach Prioritaet

| Prioritaet | Befund | Entscheidung / Massnahme |
| --- | --- | --- |
| P0 | Kein belegter Blocker im finalen lokalen Release-Kandidaten. | Kein P0 offen. |
| P1 | Ein einzelner technischer Tasklauf war zu wenig Proof fuer den eigenstaendigen Benchmark-Zweck. | Zweiten datierten First-Party-Lauf mit Input, Kandidaten, Fixture, Rohbeobachtungen, Kriterien und Grenzen veroeffentlicht. |
| P1 | Eine Reproduktion gegen die veraenderliche Live-Site waere nach einem Deployment nicht stabil. | Historischen Produktionsstand als abgeleitete Seiteneingaben plus Body-Hashes eingefroren; Harness kann offline dagegen laufen. |
| P1 | Task-Spezifikationen hatten keinen konsistenten Pfad zu Lauf, Methodik, Faehigkeiten, Kosten und Failure Handling. | Kontextuelle Next Steps ergaenzt; keine Footer- oder Portfolio-Verlinkung. |
| P1 | Providervergleich, Reviewer und Kosten waren nicht als harte Gates vollstaendig sichtbar. | Vergleich bleibt gesperrt; Rechte, gleicher Input, Vollkostenbudget, Review und Ausschluesse sind sichtbar dokumentiert. |
| P2 | Authentifizierter GSC-Zustand ist in dieser Sitzung nicht verfuegbar. | `NOT PROVEN`; keine Aussage zu Submission, URL Inspection, Google-selected Canonical, manuellen Massnahmen oder Security Issues. |
| P2 | Beide Laeufe sind First-Party und nicht unabhaengig menschlich reviewed. | Offenlegung bleibt direkt an den Ergebnissen; kein Reviewer erfunden. |
| P2 | CSP ist absichtlich Report-only und hat keinen Reporting-Endpunkt. | Hash-Vertrag getestet; Enforcement erst nach beobachtungsbasiertem separatem Gate. |

## Evidence Register

| Status | Evidenz / Aussage |
| --- | --- |
| Verified | `pnpm verify`: 36 Astro-Dateien ohne Diagnose, 19 gebaute Seiten, 18 indexierbare Canonical-Seiten, automatische Sitemap, 30 erreichbare Launch-Artefakte, echte 404. |
| Verified | Schema-Vertrag: `WebSite` nur auf `/`, `CollectionPage` auf Aufgaben/Benchmarks/Faehigkeiten, `Dataset` nur auf zwei realen Laeufen, `SoftwareApplication` nur am Builder, sonst `WebPage`. |
| Verified | Security-Vertrag: CSP Report-only ohne `unsafe-inline`, 20 exakte Inline-Hashes; nosniff, Referrer Policy, DENY, COOP und CORP gesetzt. |
| Verified | Lokaler Browserlauf: 1536 x 1024 und 390 x 844, 17 Axe-Zustaende ohne Violation, keine Console-/Runtimefehler, kein horizontaler Overflow, Skip-Link per Tastatur erreichbar. |
| Verified | `SEO-AI-003`: 10/10 technische Fixture-Checks reproduzierbar; 0 Writes, 0 bezahlte Calls, kein GSC, kein MCP. |
| Supported | Der eigenstaendige Nutzerwert liegt in Task-Spezifikation, Evidenz, Kosten, Failure Handling und reproduzierbarer Bewertung, nicht in MCP-Dokumentation. |
| Hypothesis | Suchende benoetigen providerneutrale Vorlagen und Belegpfade fuer SEO-Agent-Aufgaben. Ohne authentifizierte GSC-/Analytics-Daten ist Nachfrage und Suchwirkung nicht belegt. |
| Experiment | Eine spaetere Multi-Provider-Saison ist erst nach Rechte-, Budget-, Gleichheits-, Review- und Ausschluss-Gates zulaessig. |
| Rejected | Kein erfundenes Ranking, kein Contextter-Siegerstatus, keine aktive MCP-Behauptung und keine gemeinsame Eigentuemerschaft als unabhaengige Empfehlung. |

## Page-Action-Matrix

| Kanonische URL | Primaerer Nutzerjob | Aktion |
| --- | --- | --- |
| `/` | Zweck und naechsten Einstieg verstehen | Staerken: zwei reale Laeufe korrekt zaehlen. |
| `/task-spec-builder` | Pruefbaren Auftrag lokal erzeugen | Behalten; MCP-Aktion deaktiviert. |
| `/aufgaben` | Geeignete Task-Spezifikation waehlen | Staerken: Laufstatus ehrlich unterscheiden. |
| `/aufgaben/technische-audit-triage` | Technische Triage spezifizieren | Mit ausgefuehrtem Lauf und Kontrollseiten verbinden. |
| `/aufgaben/keyword-chancen-priorisieren` | Datenabhaengige Priorisierung spezifizieren | Als Entwurf belassen; keine fehlenden Daten simulieren. |
| `/aufgaben/interne-links-begruenden` | Link-Evidenz-Auftrag spezifizieren | Mit dem partial Lauf verbinden. |
| `/benchmarks` | Laufstatus, Gates und Rohbelege pruefen | Staerken: zwei Laeufe und Provider-Gates. |
| `/benchmarks/2026-08-22-technische-audit-triage` | Technischen R1-Lauf reproduzieren und begrenzen | Behalten. |
| `/benchmarks/2026-08-22-interne-link-evidenz` | Zehn Linkkandidaten und offenen Review-Gate pruefen | Neu bauen und indexieren. |
| `/agenten-vergleich` | Ansatz nach Risiko und Nachweisbedarf waehlen | Providerneutral halten; Kontrollpfade ergaenzen. |
| `/faehigkeiten` | Erforderliche Agentenfaehigkeiten ableiten | Behalten; Common Ownership direkt offenlegen. |
| `/mcp-fuer-seo-agenten` | MCP-Rolle und Grenzen verstehen | Informationsseite; kein Endpoint- oder Connect-Claim. |
| `/seo-agent-kosten` | Eigenes Taskbudget lokal kalkulieren | Behalten; keine Marktpreisbehauptung. |
| `/fehlerbehandlung-seo-agenten` | Stop, Retry, Eskalation und Rollback festlegen | Behalten. |
| `/methodik-und-konflikte` | Rubrik, Konflikte und Vergleichsgates pruefen | Reviewer-, GSC- und Vollkosten-Gates staerken. |
| `/quellen-und-rechte` | Quellen, Rechte und Unsicherheiten pruefen | Zweiten Lauf und Fixture erfassen. |
| `/impressum` | Betreiber identifizieren und kontaktieren | Behalten. |
| `/datenschutz` | Tatsachliche Datenfluesse verstehen | Builder und Kostenrechner als rein lokal dokumentieren. |

Keine indexierbare URL ist ohne Primaerjob. Es wurde keine Keyword-, PAA-, Stadt- oder Thin-Content-Seite hinzugefuegt.

## Hub-/Cluster-Map

```text
Start
|- Aufgaben
|  |- Technische Audit-Triage -> technischer R1-Lauf
|  |- Keyword-Chancen priorisieren -> Entwurf, kein Lauf
|  `- Interne Links begruenden -> Link-Evidenz R1 (partial)
|- Benchmarks
|  |- Technische Audit-Triage R1
|  `- Interne Link-Evidenz R1
|- Kontrollrahmen
|  |- Faehigkeiten
|  |- Agentenvergleich
|  |- Kosten
|  |- Fehlerbehandlung
|  `- Methodik und Konflikte
|- MCP fuer SEO-Agenten (Informationsseite, Verbindung deaktiviert)
`- Quellen/Rechte und Rechtstexte
```

## Technische Gates des Release-Kandidaten

| Gate | Ergebnis |
| --- | --- |
| Build / Astro Check | PASS: 36 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise |
| Canonicals | PASS: 18 selbstreferenzierende kanonische Inhaltsseiten |
| Robots / noindex | PASS: Crawling erlaubt, Sitemap referenziert, kein Launch-noindex |
| Automatische Sitemap | PASS: exakt 18 kanonische 200-Seiten; keine Evidence-, Utility- oder 404-URL |
| 404 | PASS: unbekannter Pfad und altes manuelles `/sitemap.xml` liefern echte 404 |
| Interne Links / Orphans | PASS im statischen Crawl; keine Broken Links oder Orphans |
| Structured Data | PASS gegen den Repovertrag; keine Rich-Result-Zusage |
| Security Header | PASS gegen den gehashten Report-only-Vertrag |
| Mobile / A11y | PASS im lokalen Chrome-CDP-/Axe-Lauf; 17 Zustaende, 0 Violations |
| Performance | Lokaler Lab-Snapshot: FCP 516 ms, Load 218 ms, 6 Ressourcen, 106188 kodierte Bytes; keine Feldmessung |
| GSC | NOT PROVEN: kein authentifizierter Zugriff in dieser Sitzung |

Die Implementierung orientiert sich an Googles Dokumentation zu [Canonical-Signalen](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [Redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects) und [Structured-Data-Richtlinien](https://developers.google.com/search/docs/appearance/structured-data/sd-policies). Diese Quellen sind Regeln und keine Bestaetigung von Indexierung oder Rich Results.

## Offene Gates und 30/60/90

- 30 Tage: authentifizierte GSC-Property, Sitemap-Submission und URL-Inspection-Stichprobe pruefen; ersten unabhaengigen Human-Review fuer SEO-AI-003 dokumentieren; reale Kostenzeit erfassen.
- 60 Tage: einen dritten eigenstaendigen Tasklauf mit anderer Datenklasse durchfuehren; Korrektur- und Regressionsergebnisse sichtbar halten; nur belegte interne Linkkandidaten redaktionell umsetzen.
- 90 Tage: Provider-Saison nur starten, wenn Rechte, identischer Task, Vollkostenbudget, Reviewer und Ausschlussregeln vorab fixiert sind. Sonst weiter First-Party-Methodik statt Rangliste ausbauen.

Rankings, Indexierung, Rich Results oder SEO-Wirkung werden nicht versprochen.
