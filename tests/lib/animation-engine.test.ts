import { describe, it, expect } from 'vitest'
import { flattenSteps, getStepAt, getFirstStep, getNextStep, getPreviousStep, getTotalSteps } from '../../src/lib/animation-engine'
import type { ArchitectureDefinition } from '../../src/types/architecture'

function makeTestDef(): ArchitectureDefinition {
  return {
    version: '1.0' as const,
    framework: {
      name: 'Test',
      version: '1.0',
      description: 'Test framework',
      url: 'https://example.com',
      pattern: 'state-graph' as const,
      category: 'test',
    },
    modules: [
      { id: 'mod-a', name: 'Module A', type: 'core', description: 'A' },
      { id: 'mod-b', name: 'Module B', type: 'compute', description: 'B' },
      { id: 'mod-c', name: 'Module C', type: 'routing', description: 'C' },
    ],
    dataFlows: [
      { id: 'f1', from: 'mod-a', to: 'mod-b', label: 'A→B', type: 'sync', direction: 'unidirectional' },
      { id: 'f2', from: 'mod-b', to: 'mod-c', label: 'B→C', type: 'async', direction: 'unidirectional' },
      { id: 'f3', from: 'mod-a', to: 'mod-c', label: 'A→C', type: 'conditional', direction: 'unidirectional' },
    ],
    executionFlow: {
      phases: [
        {
          id: 'phase-1',
          name: 'Init',
          description: 'Initialization phase',
          steps: [
            { moduleId: 'mod-a', action: 'init', description: 'Init A' },
            { moduleId: 'mod-b', action: 'prepare', description: 'Prepare B' },
          ],
        },
        {
          id: 'phase-2',
          name: 'Execute',
          description: 'Main execution',
          repeat: 'loop',
          steps: [
            { moduleId: 'mod-a', action: 'read', description: 'Read A' },
            { moduleId: 'mod-b', action: 'process', description: 'Process B' },
            { moduleId: 'mod-c', action: 'output', description: 'Output C' },
          ],
        },
        {
          id: 'phase-3',
          name: 'Cleanup',
          description: 'Final cleanup',
          steps: [
            { moduleId: 'mod-c', action: 'finalize', description: 'Finalize' },
          ],
        },
      ],
    },
  }
}

describe('animation-engine', () => {
  const def = makeTestDef()

  describe('flattenSteps', () => {
    it('flattens all phases into correct number of steps', () => {
      const steps = flattenSteps(def)
      // 2 + 3 + 1 = 6
      expect(steps.length).toBe(6)
    })

    it('assigns correct global indices', () => {
      const steps = flattenSteps(def)
      for (let i = 0; i < steps.length; i++) {
        expect(steps[i].globalIndex).toBe(i)
      }
    })

    it('sets correct phase names', () => {
      const steps = flattenSteps(def)
      expect(steps[0].phaseName).toBe('Init')
      expect(steps[2].phaseName).toBe('Execute')
      expect(steps[5].phaseName).toBe('Cleanup')
    })

    it('includes related flow IDs for each step', () => {
      const steps = flattenSteps(def)
      // mod-a has f1 (from) and f3 (from)
      expect(steps[0].relatedFlowIds).toContain('f1')
      expect(steps[0].relatedFlowIds).toContain('f3')
      // mod-c has f2 (to) and f3 (to)
      expect(steps[4].relatedFlowIds).toContain('f2')
      expect(steps[4].relatedFlowIds).toContain('f3')
    })
  })

  describe('getTotalSteps', () => {
    it('returns correct total step count', () => {
      expect(getTotalSteps(def)).toBe(6)
    })
  })

  describe('getStepAt', () => {
    it('returns correct step for valid position', () => {
      const result = getStepAt(def, 0, 0)
      expect(result).not.toBeNull()
      expect(result!.activeModuleId).toBe('mod-a')
      expect(result!.step.action).toBe('init')
      expect(result!.isPhaseStart).toBe(true)
      expect(result!.isLastStep).toBe(false)
    })

    it('returns last step correctly', () => {
      const result = getStepAt(def, 2, 0)
      expect(result).not.toBeNull()
      expect(result!.isLastStep).toBe(true)
    })

    it('returns null for out-of-bounds phase', () => {
      expect(getStepAt(def, 3, 0)).toBeNull()
    })

    it('returns null for out-of-bounds step', () => {
      expect(getStepAt(def, 0, 5)).toBeNull()
    })

    it('calculates correct global index', () => {
      // Phase 1 has 2 steps, so phase 2 step 0 has global index 2
      const result = getStepAt(def, 1, 0)
      expect(result!.globalIndex).toBe(2)
    })
  })

  describe('getFirstStep', () => {
    it('returns the first step of the first phase', () => {
      const result = getFirstStep(def)
      expect(result).not.toBeNull()
      expect(result!.step.action).toBe('init')
      expect(result!.phaseIndex).toBe(0)
      expect(result!.stepIndex).toBe(0)
    })
  })

  describe('getNextStep', () => {
    it('advances within same phase', () => {
      const result = getNextStep(def, 0, 0)
      expect(result).not.toBeNull()
      expect(result!.phaseIndex).toBe(0)
      expect(result!.stepIndex).toBe(1)
      expect(result!.step.action).toBe('prepare')
    })

    it('advances to next phase when at end of phase', () => {
      const result = getNextStep(def, 0, 1)
      expect(result).not.toBeNull()
      expect(result!.phaseIndex).toBe(1)
      expect(result!.stepIndex).toBe(0)
    })

    it('returns null at end of all phases', () => {
      const result = getNextStep(def, 2, 0)
      expect(result).toBeNull()
    })
  })

  describe('getPreviousStep', () => {
    it('goes back within same phase', () => {
      const result = getPreviousStep(def, 1, 1)
      expect(result).not.toBeNull()
      expect(result!.phaseIndex).toBe(1)
      expect(result!.stepIndex).toBe(0)
    })

    it('goes back to previous phase last step', () => {
      const result = getPreviousStep(def, 1, 0)
      expect(result).not.toBeNull()
      expect(result!.phaseIndex).toBe(0)
      expect(result!.stepIndex).toBe(1)
    })

    it('returns null at beginning', () => {
      const result = getPreviousStep(def, 0, 0)
      expect(result).toBeNull()
    })
  })

  describe('step result active flows', () => {
    it('finds all flows connected to the active module', () => {
      // mod-a is connected to f1 (from), f3 (from)
      const result = getStepAt(def, 0, 0) // mod-a
      expect(result!.activeFlowIds).toHaveLength(2)

      // mod-c is connected to f2 (to), f3 (to)
      const result3 = getStepAt(def, 1, 2) // mod-c
      expect(result3!.activeFlowIds).toHaveLength(2)
    })
  })
})
