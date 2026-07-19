import { load as yamlLoad } from 'js-yaml'
import { validateArchitecture } from '../schemas/validation'
import type { ArchitectureDefinition, ParseResult, ValidationError } from '../types/architecture'

function detectFormat(filename: string, content: string): 'json' | 'yaml' {
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
    return 'yaml'
  }
  if (filename.endsWith('.json')) {
    return 'json'
  }
  // Content-based detection
  const trimmed = content.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json'
  }
  return 'yaml'
}

function parseContent(content: string, format: 'json' | 'yaml'): unknown {
  if (format === 'json') {
    return JSON.parse(content)
  }
  const parsed = yamlLoad(content)
  if (parsed === null || parsed === undefined) {
    throw new Error('YAML content is empty')
  }
  return parsed
}

export function parseArchitecture(raw: unknown): {
  ok: true
  definition: ArchitectureDefinition
  warnings: ValidationError[]
} | {
  ok: false
  errors: ValidationError[]
} {
  const result = validateArchitecture(raw)
  if (result.ok) {
    return { ok: true, definition: result.definition, warnings: result.warnings }
  }
  return { ok: false, errors: result.errors }
}

export async function parseArchitectureFile(
  content: string,
  filename: string,
): Promise<ParseResult> {
  const format = detectFormat(filename, content)

  try {
    const raw = parseContent(content, format)
    const result = validateArchitecture(raw)
    if (result.ok) {
      return { ok: true, definition: result.definition, warnings: result.warnings }
    }
    return { ok: false, errors: result.errors, filename }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown parse error'
    return {
      ok: false,
      errors: [{
        path: `file:${filename}`,
        message: format === 'json'
          ? `JSON parse error: ${message}`
          : `YAML parse error: ${message}`,
        severity: 'error',
      }],
      filename,
    }
  }
}
