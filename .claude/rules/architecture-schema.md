# Architecture Definition Schema Rules

The architecture definition JSON/YAML schema is the **contract** for all data in this application. Changes here affect the parser, mapper, canvas, animation, import/export, and all tests.

## Schema Versioning
- Current version: `"1.0"` — validated strictly in Zod schema
- Never remove fields — deprecate them with `@deprecated` comments
- Adding new fields: add as `.optional()` to maintain backward compatibility
- Breaking changes require a version bump (e.g., `"2.0"`) and migration logic

## Required Fields
Every architecture file MUST have:
- `version: "1.0"`
- `framework.name`, `framework.pattern`
- At least one `module` with unique `id`
- At least one `dataFlow` with valid `from`/`to` references

## Cross-Field Validations (enforced by Zod)
1. All module `id` values must be unique
2. Every `dataFlow.from` must reference an existing module `id`
3. Every `dataFlow.to` must reference an existing module `id`
4. Every `executionStep.moduleId` must reference an existing module `id`
5. `framework.pattern` must be one of the 7 recognized patterns

## Adding a New Framework
1. Research the framework's actual architecture thoroughly
2. Create `public/architectures/<name>.json` following the schema
3. Add framework metadata to `src/data/frameworks.ts`
4. Add framework color to `src/lib/color-palette.ts`
5. Run `npm test` to validate the new definition file
6. The test suite auto-discovers and validates all files in `public/architectures/`

## Editing Existing Definitions
- Maintain architectural accuracy — these are learning/reference materials
- Document the source of architectural information (official docs, papers, etc.)
- Run `npm test` after any edit to ensure schema compliance
