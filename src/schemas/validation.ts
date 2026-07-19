import { ZodError } from 'zod'
import type { ValidationError, ArchitectureDefinition } from '../types/architecture'
import { architectureDefinitionSchema } from './architecture.schema'

export function formatZodErrors(error: ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.') || '(root)',
    message: issue.message,
    severity: 'error' as const,
  }))
}

export type ValidateResult =
  | { ok: true; definition: ArchitectureDefinition; warnings: ValidationError[] }
  | { ok: false; errors: ValidationError[] }

export function validateArchitecture(data: unknown): ValidateResult {
  const result = architectureDefinitionSchema.safeParse(data)
  if (result.success) {
    return { ok: true, definition: result.data, warnings: [] }
  }
  return {
    ok: false,
    errors: formatZodErrors(result.error),
  }
}
