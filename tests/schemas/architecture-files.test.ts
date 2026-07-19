import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { architectureDefinitionSchema } from '../../src/schemas/architecture.schema'
import { frameworks } from '../../src/data/frameworks'

const architecturesDir = resolve(__dirname, '../../public/architectures')

function discoverArchitectureFiles(): string[] {
  try {
    return readdirSync(architecturesDir).filter((f) => f.endsWith('.json'))
  } catch {
    return []
  }
}

function loadAndParse(filename: string): unknown {
  const filePath = resolve(architecturesDir, filename)
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

describe('Architecture Data Files — auto-discovery validation', () => {
  const files = discoverArchitectureFiles()

  it('discovers at least 7 architecture files', () => {
    expect(files.length).toBeGreaterThanOrEqual(7)
  })

  // Test each discovered file
  describe.each(files)('%s', (filename) => {
    const data = loadAndParse(filename)
    const result = architectureDefinitionSchema.safeParse(data)

    it('passes Zod schema validation', () => {
      if (!result.success) {
        console.error(
          `Validation errors in ${filename}:`,
          JSON.stringify(result.error.issues, null, 2),
        )
      }
      expect(result.success).toBe(true)
    })

    it('has version "1.0"', () => {
      expect((data as Record<string, unknown>).version).toBe('1.0')
    })

    it('has at least one module', () => {
      const modules = (data as Record<string, unknown>).modules as unknown[]
      expect(modules.length).toBeGreaterThanOrEqual(1)
    })

    it('has at least one dataFlow', () => {
      const flows = (data as Record<string, unknown>).dataFlows as unknown[]
      expect(flows.length).toBeGreaterThanOrEqual(1)
    })

    it('has at least one execution phase', () => {
      const execFlow = (data as Record<string, unknown>).executionFlow as Record<string, unknown>
      const phases = execFlow.phases as unknown[]
      expect(phases.length).toBeGreaterThanOrEqual(1)
    })

    it('has unique module IDs', () => {
      const modules = (data as Record<string, unknown>).modules as Array<{ id: string }>
      const ids = modules.map((m) => m.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('has unique dataFlow IDs', () => {
      const flows = (data as Record<string, unknown>).dataFlows as Array<{ id: string }>
      const ids = flows.map((f) => f.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('has all dataFlow references pointing to existing modules', () => {
      const modules = (data as Record<string, unknown>).modules as Array<{ id: string }>
      const moduleIds = new Set(modules.map((m) => m.id))
      const flows = (data as Record<string, unknown>).dataFlows as Array<{ from: string; to: string }>
      for (const flow of flows) {
        expect(moduleIds.has(flow.from), `Flow "${flow.from}" → "${flow.to}": "from" module not found`).toBe(true)
        expect(moduleIds.has(flow.to), `Flow "${flow.from}" → "${flow.to}": "to" module not found`).toBe(true)
      }
    })

    it('has all execution step moduleIds referencing existing modules', () => {
      const modules = (data as Record<string, unknown>).modules as Array<{ id: string }>
      const moduleIds = new Set(modules.map((m) => m.id))
      const execFlow = (data as Record<string, unknown>).executionFlow as {
        phases: Array<{ name: string; steps: Array<{ moduleId: string }> }>
      }
      for (const phase of execFlow.phases) {
        for (const step of phase.steps) {
          expect(
            moduleIds.has(step.moduleId),
            `Phase "${phase.name}" step references unknown module "${step.moduleId}"`,
          ).toBe(true)
        }
      }
    })

    it('has a valid framework pattern', () => {
      const validPatterns = [
        'state-graph', 'role-based', 'actor-model', 'handoff',
        'sop-pipeline', 'component-based', 'visual-dag',
        'master-loop', 'hub-and-spoke', 'react-loop', 'layered',
      ]
      const framework = (data as Record<string, unknown>).framework as { pattern: string }
      expect(validPatterns).toContain(framework.pattern)
    })
  })
})

describe('Frameworks registry consistency', () => {
  it('has all 11 framework entries', () => {
    expect(frameworks.length).toBe(11)
  })

  it('each framework entry has a corresponding architecture file', () => {
    for (const fw of frameworks) {
      const filePath = resolve(architecturesDir, fw.file)
      const exists = (() => {
        try {
          readFileSync(filePath)
          return true
        } catch {
          return false
        }
      })()
      expect(exists, `Missing file for framework "${fw.name}": ${fw.file}`).toBe(true)
    }
  })

  it.each(frameworks)('$name file has correct module/flow/phase counts', (fw) => {
    const filePath = resolve(architecturesDir, fw.file)
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw) as {
      modules: unknown[]
      dataFlows: unknown[]
      executionFlow: { phases: unknown[] }
    }
    expect(
      data.modules.length,
      `${fw.name}: expected ${fw.moduleCount} modules, got ${data.modules.length}`,
    ).toBe(fw.moduleCount)
    expect(
      data.dataFlows.length,
      `${fw.name}: expected ${fw.flowCount} flows, got ${data.dataFlows.length}`,
    ).toBe(fw.flowCount)
    expect(
      data.executionFlow.phases.length,
      `${fw.name}: expected ${fw.phaseCount} phases, got ${data.executionFlow.phases.length}`,
    ).toBe(fw.phaseCount)
  })
})
