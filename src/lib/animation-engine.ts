import type { ArchitectureDefinition, ExecutionStep, ExecutionPhase } from '../types/architecture'
import type { DataFlow } from '../types/architecture'

/**
 * Flattened step representation for timeline navigation.
 */
export interface FlattenedStep {
  phaseIndex: number
  phaseName: string
  stepIndex: number
  globalIndex: number
  step: ExecutionStep
  /** Data flows that originate from or target this step's module */
  relatedFlowIds: string[]
}

/**
 * Result of advancing the animation one step.
 */
export interface StepResult {
  phaseIndex: number
  stepIndex: number
  globalIndex: number
  phase: ExecutionPhase
  step: ExecutionStep
  activeModuleId: string
  activeFlowIds: string[]
  /** Whether this is the last step overall */
  isLastStep: boolean
  /** Whether this is the first step of a new phase */
  isPhaseStart: boolean
}

/**
 * Flattens all execution phases into an ordered array of steps with global indexing.
 */
export function flattenSteps(def: ArchitectureDefinition): FlattenedStep[] {
  const result: FlattenedStep[] = []
  let globalIndex = 0
  const allFlows = def.dataFlows

  for (let pi = 0; pi < def.executionFlow.phases.length; pi++) {
    const phase = def.executionFlow.phases[pi]
    for (let si = 0; si < phase.steps.length; si++) {
      const step = phase.steps[si]
      const relatedFlowIds = allFlows
        .filter((f: DataFlow) => f.from === step.moduleId || f.to === step.moduleId)
        .map((f: DataFlow) => f.id)

      result.push({
        phaseIndex: pi,
        phaseName: phase.name,
        stepIndex: si,
        globalIndex,
        step,
        relatedFlowIds,
      })
      globalIndex++
    }
  }
  return result
}

/**
 * Get the StepResult at a given position in the flattened timeline.
 */
export function getStepAt(
  def: ArchitectureDefinition,
  phaseIndex: number,
  stepIndex: number,
): StepResult | null {
  const phases = def.executionFlow.phases
  if (phaseIndex < 0 || phaseIndex >= phases.length) return null

  const phase = phases[phaseIndex]
  if (stepIndex < 0 || stepIndex >= phase.steps.length) return null

  const step = phase.steps[stepIndex]

  // Calculate global index
  let globalIndex = 0
  for (let i = 0; i < phaseIndex; i++) {
    globalIndex += phases[i].steps.length
  }
  globalIndex += stepIndex

  // Find flows related to this module
  const activeFlowIds = def.dataFlows
    .filter((f) => f.from === step.moduleId || f.to === step.moduleId)
    .map((f) => f.id)

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0)

  return {
    phaseIndex,
    stepIndex,
    globalIndex,
    phase,
    step,
    activeModuleId: step.moduleId,
    activeFlowIds,
    isLastStep: globalIndex >= totalSteps - 1,
    isPhaseStart: stepIndex === 0,
  }
}

/**
 * Get the first step of the execution flow.
 */
export function getFirstStep(def: ArchitectureDefinition): StepResult | null {
  return getStepAt(def, 0, 0)
}

/**
 * Get the next step from a given position. Returns null if at end.
 */
export function getNextStep(
  def: ArchitectureDefinition,
  phaseIndex: number,
  stepIndex: number,
): StepResult | null {
  const phases = def.executionFlow.phases
  const phase = phases[phaseIndex]

  // Next step in same phase?
  if (stepIndex + 1 < phase.steps.length) {
    return getStepAt(def, phaseIndex, stepIndex + 1)
  }

  // Next phase?
  if (phaseIndex + 1 < phases.length) {
    return getStepAt(def, phaseIndex + 1, 0)
  }

  return null
}

/**
 * Get the previous step from a given position. Returns null if at start.
 */
export function getPreviousStep(
  def: ArchitectureDefinition,
  phaseIndex: number,
  stepIndex: number,
): StepResult | null {
  // Previous step in same phase?
  if (stepIndex - 1 >= 0) {
    return getStepAt(def, phaseIndex, stepIndex - 1)
  }

  // Previous phase, last step?
  if (phaseIndex - 1 >= 0) {
    const prevPhase = def.executionFlow.phases[phaseIndex - 1]
    return getStepAt(def, phaseIndex - 1, prevPhase.steps.length - 1)
  }

  return null
}

/**
 * Get total number of steps across all phases.
 */
export function getTotalSteps(def: ArchitectureDefinition): number {
  return def.executionFlow.phases.reduce((sum, p) => sum + p.steps.length, 0)
}
