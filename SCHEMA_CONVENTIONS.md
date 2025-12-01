# Schema Naming Convention Notes

## Overview
This document tracks the naming convention decisions for the JSON schemas within this repository.

## Current State

### Unified Naming Convention

All schemas now follow **snake_case** field names for consistency. The change aligns with the protobuf definitions (for example, `aussen/v1/event.proto`) and keeps the API predictable for consumers.

### Shared Definitions

Both `aussen.event.schema.json` and `os.context.state.schema.json` define the same `dateTimeString` pattern in their `$defs` sections. Consider extracting this into a shared schema file and referencing it via `$ref` to avoid duplication.

## Action Items

- [ ] Extract common pattern definitions to a shared schema file
- [ ] Update any code generation or validation logic that depends on shared definitions
