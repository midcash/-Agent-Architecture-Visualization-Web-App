import { describe, it, expect } from 'vitest'
import { architectureDefinitionSchema } from '../../src/schemas/architecture.schema'

function makeValidDef(overrides: Record<string, unknown> = {}) {
  return {
    version: '1.0',
    framework: {
      name: 'Test Framework',
      version: '1.0.0',
      description: 'A test framework for validation',
      url: 'https://example.com',
      pattern: 'state-graph',
    },
    modules: [
      { id: 'mod-a', name: 'Module A', type: 'core', description: 'Core module A' },
      { id: 'mod-b', name: 'Module B', type: 'compute', description: 'Compute module B' },
    ],
    dataFlows: [
      {
        id: 'flow-1',
        from: 'mod-a',
        to: 'mod-b',
        label: 'A → B',
        type: 'sync',
        direction: 'unidirectional',
      },
    ],
    executionFlow: {
      phases: [
        {
          id: 'phase-1',
          name: 'Init',
          description: 'Initial phase',
          steps: [
            {
              moduleId: 'mod-a',
              action: 'initialize',
              description: 'Init module A',
            },
          ],
        },
      ],
    },
    ...overrides,
  }
}

describe('architectureDefinitionSchema', () => {
  it('accepts a valid complete definition', () => {
    const result = architectureDefinitionSchema.safeParse(makeValidDef())
    expect(result.success).toBe(true)
  })

  it('rejects missing version', () => {
    const def = makeValidDef()
    delete (def as Record<string, unknown>).version
    const result = architectureDefinitionSchema.safeParse(def)
    expect(result.success).toBe(false)
  })

  it('rejects wrong version', () => {
    const result = architectureDefinitionSchema.safeParse(makeValidDef({ version: '2.0' }))
    expect(result.success).toBe(false)
  })

  it('rejects empty modules array', () => {
    const result = architectureDefinitionSchema.safeParse(makeValidDef({ modules: [] }))
    expect(result.success).toBe(false)
  })

  it('rejects empty dataFlows array', () => {
    const result = architectureDefinitionSchema.safeParse(makeValidDef({ dataFlows: [] }))
    expect(result.success).toBe(false)
  })

  it('rejects empty phases array', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        executionFlow: { phases: [] },
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects duplicate module ids', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        modules: [
          { id: 'mod-a', name: 'A1', type: 'core', description: 'First' },
          { id: 'mod-a', name: 'A2', type: 'compute', description: 'Duplicate' },
        ],
      }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      const dupErrors = result.error.issues.filter(
        (i) => i.message.includes('Duplicate module id'),
      )
      expect(dupErrors.length).toBeGreaterThan(0)
    }
  })

  it('rejects dataFlow with unknown "from" module', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        dataFlows: [
          {
            id: 'flow-1',
            from: 'non-existent',
            to: 'mod-b',
            label: 'bad flow',
            type: 'sync',
            direction: 'unidirectional',
          },
        ],
      }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      const refErrors = result.error.issues.filter(
        (i) => i.message.includes('unknown module'),
      )
      expect(refErrors.length).toBeGreaterThan(0)
    }
  })

  it('rejects dataFlow with unknown "to" module', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        dataFlows: [
          {
            id: 'flow-1',
            from: 'mod-a',
            to: 'non-existent',
            label: 'bad flow',
            type: 'sync',
            direction: 'unidirectional',
          },
        ],
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects execution step with unknown moduleId', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        executionFlow: {
          phases: [
            {
              id: 'phase-1',
              name: 'Init',
              description: 'Phase',
              steps: [
                {
                  moduleId: 'ghost-module',
                  action: 'do',
                  description: 'Should fail',
                },
              ],
            },
          ],
        },
      }),
    )
    expect(result.success).toBe(false)
    if (!result.success) {
      const refErrors = result.error.issues.filter(
        (i) => i.message.includes('unknown module'),
      )
      expect(refErrors.length).toBeGreaterThan(0)
    }
  })

  it('rejects invalid framework url', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        framework: {
          name: 'Bad',
          version: '1.0',
          description: 'test',
          url: 'not-a-url',
          pattern: 'state-graph',
        },
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects unknown module type', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        modules: [
          { id: 'mod-a', name: 'A', type: 'invalid-type', description: 'Bad type' },
          { id: 'mod-b', name: 'B', type: 'compute', description: 'OK' },
        ],
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects invalid framework pattern', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        framework: {
          name: 'Bad',
          version: '1.0',
          description: 'test',
          url: 'https://example.com',
          pattern: 'not-a-pattern',
        },
      }),
    )
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields in nested objects', () => {
    const result = architectureDefinitionSchema.safeParse({
      version: '1.0',
      framework: { name: 'Test', version: '1.0', description: 'test', url: 'https://example.com', pattern: 'state-graph' },
      modules: [],
      dataFlows: [],
    } as unknown)
    expect(result.success).toBe(false)
  })

  it('accepts optional fields like position and metadata', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({
        modules: [
          {
            id: 'mod-a',
            name: 'Module A',
            type: 'core',
            description: 'With position',
            position: { x: 100, y: 200 },
            metadata: { language: 'Python', version: '3.11' },
          },
          { id: 'mod-b', name: 'Module B', type: 'compute', description: 'OK' },
        ],
      }),
    )
    expect(result.success).toBe(true)
  })

  it('rejects extra unknown fields (strict mode)', () => {
    const result = architectureDefinitionSchema.safeParse(
      makeValidDef({ unknownField: 'should-not-be-here' }),
    )
    expect(result.success).toBe(false)
  })
})
