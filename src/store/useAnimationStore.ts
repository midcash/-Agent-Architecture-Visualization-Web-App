import { create } from 'zustand'

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished'

export interface AnimationStore {
  /** Current playback state */
  playbackState: PlaybackState
  /** Current phase index */
  currentPhaseIndex: number
  /** Current step index (within the current phase) */
  currentStepIndex: number
  /** Total number of phases */
  totalPhases: number
  /** Total steps across all phases */
  totalSteps: number
  /** Global step index (flattened across phases) */
  globalStepIndex: number
  /** Playback speed multiplier (1x = 1000ms per step) */
  speed: number
  /** Currently active module ID */
  activeModuleId: string | null
  /** IDs of modules that participated in the current step */
  visitedModuleIds: Set<string>

  // Actions
  setPlaybackState: (state: PlaybackState) => void
  setCurrentStep: (phaseIndex: number, stepIndex: number) => void
  setSpeed: (speed: number) => void
  nextStep: () => { phaseIndex: number; stepIndex: number } | null
  previousStep: () => { phaseIndex: number; stepIndex: number } | null
  reset: (totalPhases: number, totalSteps: number) => void
  setActiveModuleId: (id: string | null) => void
  markModuleVisited: (id: string) => void
  clearVisited: () => void
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  playbackState: 'idle',
  currentPhaseIndex: 0,
  currentStepIndex: 0,
  totalPhases: 0,
  totalSteps: 0,
  globalStepIndex: 0,
  speed: 1,
  activeModuleId: null,
  visitedModuleIds: new Set<string>(),

  setPlaybackState: (playbackState) => set({ playbackState }),

  setCurrentStep: (phaseIndex, stepIndex) =>
    set({ currentPhaseIndex: phaseIndex, currentStepIndex: stepIndex }),

  setSpeed: (speed) => set({ speed }),

  nextStep: () => {
    // Return null if no architecture loaded
    const { totalPhases } = get()
    if (totalPhases === 0) return null
    return null // Delegated to animation engine
  },

  previousStep: () => {
    const { totalPhases } = get()
    if (totalPhases === 0) return null
    return null // Delegated to animation engine
  },

  reset: (totalPhases, totalSteps) =>
    set({
      playbackState: 'idle',
      currentPhaseIndex: 0,
      currentStepIndex: 0,
      totalPhases,
      totalSteps,
      globalStepIndex: 0,
      activeModuleId: null,
      visitedModuleIds: new Set<string>(),
    }),

  setActiveModuleId: (activeModuleId) => set({ activeModuleId }),

  markModuleVisited: (id) => {
    const visited = new Set(get().visitedModuleIds)
    visited.add(id)
    set({ visitedModuleIds: visited })
  },

  clearVisited: () => set({ visitedModuleIds: new Set<string>() }),
}))
