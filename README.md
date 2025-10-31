# Contracts Repository

Dieses Repository enthält alle Service- und Event-Verträge des Heimgewebe-Ökosystems.

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
