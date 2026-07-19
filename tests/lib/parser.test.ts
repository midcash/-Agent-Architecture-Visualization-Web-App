import { describe, it, expect } from 'vitest'
import { parseArchitectureFile, parseArchitecture } from '../../src/lib/parser'

const validJson = JSON.stringify({
  version: '1.0',
  framework: {
    name: 'Test',
    version: '1.0',
    description: 'A test framework',
    url: 'https://example.com',
    pattern: 'handoff',
  },
  modules: [
    { id: 'm1', name: 'Agent', type: 'compute', description: 'LLM agent' },
    { id: 'm2', name: 'Handoff', type: 'routing', description: 'Transfer control' },
  ],
  dataFlows: [
    {
      id: 'f1',
      from: 'm1',
      to: 'm2',
      label: 'delegate',
      type: 'sync',
      direction: 'unidirectional',
    },
  ],
  executionFlow: {
    phases: [
      {
        id: 'p1',
        name: 'Main',
        description: 'Main execution',
        steps: [
          { moduleId: 'm1', action: 'run', description: 'Run agent' },
        ],
      },
    ],
  },
})

const validYaml = `
version: '1.0'
framework:
  name: Test
  version: '1.0'
  description: A test framework
  url: https://example.com
  pattern: handoff
modules:
  - id: m1
    name: Agent
    type: compute
    description: LLM agent
  - id: m2
    name: Handoff
    type: routing
    description: Transfer control
dataFlows:
  - id: f1
    from: m1
    to: m2
    label: delegate
    type: sync
    direction: unidirectional
executionFlow:
  phases:
    - id: p1
      name: Main
      description: Main execution
      steps:
        - moduleId: m1
          action: run
          description: Run agent
`

describe('parseArchitectureFile', () => {
  it('parses valid JSON file', async () => {
    const result = await parseArchitectureFile(validJson, 'test.json')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.definition.version).toBe('1.0')
      expect(result.definition.modules).toHaveLength(2)
    }
  })

  it('parses valid YAML file', async () => {
    const result = await parseArchitectureFile(validYaml, 'test.yaml')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.definition.framework.pattern).toBe('handoff')
    }
  })

  it('rejects invalid JSON content', async () => {
    const result = await parseArchitectureFile('not json {', 'test.json')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0].message).toContain('JSON parse error')
    }
  })

  it('rejects valid JSON that fails schema validation', async () => {
    const badJson = JSON.stringify({ version: '2.0', framework: {} })
    const result = await parseArchitectureFile(badJson, 'test.json')
    expect(result.ok).toBe(false)
  })

  it('rejects empty JSON object', async () => {
    const result = await parseArchitectureFile('{}', 'test.json')
    expect(result.ok).toBe(false)
  })

  it('rejects empty YAML', async () => {
    const result = await parseArchitectureFile('', 'test.yaml')
    expect(result.ok).toBe(false)
  })
})

describe('parseArchitecture (raw object)', () => {
  it('parses a valid raw object', () => {
    const raw = JSON.parse(validJson)
    const result = parseArchitecture(raw)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.definition.framework.name).toBe('Test')
    }
  })

  it('rejects invalid raw object', () => {
    const result = parseArchitecture({ invalid: true })
    expect(result.ok).toBe(false)
  })
})
