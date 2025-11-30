# Schema Naming Convention Inconsistencies

## Overview
This document identifies naming convention inconsistencies in the JSON schemas within this repository.

## Identified Inconsistencies

### Naming Convention Discrepancy

The schemas in this repository use different naming conventions for field names:

1. **`aussen.event.schema.json`** uses **snake_case**:
   - `event_type`
   - `occurred_at`

2. **`os.context.state.schema.json`** uses **camelCase**:
   - `contextId`
   - `collectedAt`
   - `eventId`
   - `eventType`
   - `occurredAt`

### Recommendation

For consistency across the codebase, we recommend:

1. **Choose a single naming convention** (either camelCase or snake_case) for all JSON schemas
2. **Align with the protobuf convention**: The `aussen/v1/event.proto` uses snake_case (`event_type`, `occurred_at`), which suggests that snake_case might be the preferred convention
3. **Update `os.context.state.schema.json`** to use snake_case to match `aussen.event.schema.json` and the protobuf definitions

### Impact

Currently, this inconsistency:
- Makes the API less predictable for consumers
- Requires different JSON parsing/serialization logic for different schemas
- May cause confusion for developers working with multiple schemas

### Duplicate Pattern Definition

Both `aussen.event.schema.json` and `os.context.state.schema.json` define the same `dateTimeString` pattern in their `$defs` sections. Consider:
- Moving this to a shared schema definition file
- Referencing the common definition using `$ref`

## Action Items

- [ ] Decide on a unified naming convention (snake_case recommended)
- [ ] Update schemas to follow the unified convention
- [ ] Extract common pattern definitions to a shared schema file
- [ ] Update fixtures to match the new schema structure
- [ ] Update any code generation or validation logic that depends on field names
