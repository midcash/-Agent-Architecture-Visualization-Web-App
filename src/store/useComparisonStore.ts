import { create } from 'zustand'
import type { ArchitectureDefinition } from '../types/architecture'
import type { FrameworkEntry } from '../data/frameworks'

export interface PanelState {
  architecture: ArchitectureDefinition | null
  framework: FrameworkEntry | null
}

export interface ComparisonStore {
  /** Left panel state */
  left: PanelState
  /** Right panel state */
  right: PanelState
  /** Whether sync (zoom/pan) is enabled between panels */
  syncEnabled: boolean

  // Actions
  setLeft: (architecture: ArchitectureDefinition, framework: FrameworkEntry) => void
  setRight: (architecture: ArchitectureDefinition, framework: FrameworkEntry) => void
  clearLeft: () => void
  clearRight: () => void
  toggleSync: () => void
  reset: () => void
}

const emptyPanel: PanelState = { architecture: null, framework: null }

export const useComparisonStore = create<ComparisonStore>((set) => ({
  left: emptyPanel,
  right: emptyPanel,
  syncEnabled: false,

  setLeft: (architecture, framework) =>
    set({ left: { architecture, framework } }),

  setRight: (architecture, framework) =>
    set({ right: { architecture, framework } }),

  clearLeft: () => set({ left: emptyPanel }),

  clearRight: () => set({ right: emptyPanel }),

  toggleSync: () => set((s) => ({ syncEnabled: !s.syncEnabled })),

  reset: () =>
    set({ left: emptyPanel, right: emptyPanel, syncEnabled: false }),
}))
