# Beziehung zwischen `contracts` und dem Heimgewebe-metarepo

Dieses Repo stellt die **externen APIs** des Heimgewebes bereit (z. B. `aussen/v1`,
`heimlern/v1`) und deren JSON-Mirror-Schemas für Clients.

Die **internen Organismus-Contracts** (Event-Backbone, Fleet-Health, Insights,
OS-Kontext, Policy) liegen kanonisch im **metarepo**:

  - `heimgewebe/metarepo` → Verzeichnis `contracts/`

## Rollenverteilung

**metarepo**

- Definiert interne Contracts wie:
  - `aussen.event.schema.json`
  - `event.line.schema.json`
  - `chronik-fixtures.schema.json`
  - `fleet.health.schema.json`
  - `insights.daily.schema.json`
  - `os.context.*.schema.json`
  - `policy.*.schema.json`
- Diese Schemas sind Referenz für alle internen Repos:
  - `aussensensor`, `chronik`, `semantAH`, `hausKI`, `heimlern`, `mitschreiber`, …

**contracts-mirror-Repo**

- Bietet Protobuf-Definitionen für:
  - `aussen/v1`
  - `heimlern/v1`
  - ggf. weitere externe APIs.
- Stellt JSON-Mirror-Schemas für externe Klienten bereit.
- Dokumentiert, wie externe Systeme gegen das Heimgewebe sprechen können.

## Prinzipien

1. **Single Source of Truth für interne Contracts:**

   Wenn ein Schema intern im Heimgewebe gebraucht wird (Events, Metriken,
   Policy, OS-Kontext), liegt es nur im **metarepo** und wird von dort konsumiert.

2. **Keine stillen Forks:**

   Wenn dieses Repo eine Kopie eines internen Contracts enthält, dann ist diese:

   - klar als Mirror markiert und
   - wird nicht eigenständig verändert.

   Die eigentliche Änderung erfolgt immer im metarepo.

3. **Externe APIs zuerst:**

   Dieses Repo konzentriert sich darauf, externe Schnittstellen stabil und
   verständlich zu dokumentieren. Alles, was nur intern genutzt wird, gehört
   ins metarepo.

## Weiterführende Dokumente

- Im metarepo:

  - `docs/contracts/overview.md`
  - `contracts/consumers.yaml`

- In diesem Repo:

  - README (Übersicht über die bereitgestellten APIs)
  - Protobuf-Definitionen unter `aussen/v1/`, `heimlern/v1/` usw.

Damit ist klar: Das **metarepo** hält den inneren Vertragskörper des Heimgewebes,
dieses Repo ist die **Schnittfläche nach außen**. Wer intern schrauben will,
geht zum metarepo. Wer von außen sprechen will, landet hier.
