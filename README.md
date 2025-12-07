# Contracts Repository

Dieses Repository enthält alle Service- und Event-Verträge des Heimgewebe-Ökosystems.

## Single Source of Truth

Die **einzige** Quelle der Wahrheit für alle JSON-Schemas liegt im `metarepo` unter
`heimgewebe/metarepo/contracts/*.schema.json` und folgt ADR
`0007-contracts-single-source-of-truth`.

Dieses Repository dient vor allem als Werkzeug- und Spiegel-Repo für diese Verträge
(z. B. CI, Validatoren, optionale Publikation). **Bitte keine Schemas direkt hier
ändern oder neu anlegen.** Anpassungen immer im `metarepo` durchführen und über die
vorgesehenen Sync-/Publish-Mechanismen spiegeln.

## Inhalte
- **`proto/`** – gRPC/Protobuf-Contracts für RPC-Kommunikation
- **`json/`** – JSON Schemas für Event-Payloads (AJV-kompatibel)
- **`fixtures/`** – Beispiel-Events für CI-Validierung

## CI
- **Buf Lint** und **Breaking-Check** prüfen alle `.proto`.
- **AJV Validate** sichert JSON Schemas gegen Fixtures.

## Lokale Kommandos
```bash
# Protobuf linting und Breaking-Check (nutzt Default-Branch des Remotes)
buf lint
buf breaking --against ".git#branch=$(git symbolic-ref --short refs/remotes/origin/HEAD | cut -d'/' -f2)"

# JSON-Schemas prüfen (strict compile + validate)
npx --yes ajv-cli@5 compile -s 'json/**/*.schema.json' --strict=true --spec=draft2020
npx --yes ajv-cli@5 validate -s 'json/**/*.schema.json' -d 'fixtures/**/*.jsonl' --spec=draft2020 --errors=line --all-errors

# Go-Stubs generieren
buf generate
```
