import { describe, it, expect, beforeEach } from 'vitest'
import { useAnimationStore } from '../../src/store/useAnimationStore'

describe('useAnimationStore', () => {
  beforeEach(() => {
    useAnimationStore.getState().reset(3, 10)
  })

  it('starts in idle state', () => {
    const state = useAnimationStore.getState()
    expect(state.playbackState).toBe('idle')
    expect(state.currentPhaseIndex).toBe(0)
    expect(state.currentStepIndex).toBe(0)
    expect(state.totalPhases).toBe(3)
    expect(state.totalSteps).toBe(10)
    expect(state.speed).toBe(1)
  })

  it('updates playback state', () => {
    useAnimationStore.getState().setPlaybackState('playing')
    expect(useAnimationStore.getState().playbackState).toBe('playing')

    useAnimationStore.getState().setPlaybackState('paused')
    expect(useAnimationStore.getState().playbackState).toBe('paused')

    useAnimationStore.getState().setPlaybackState('finished')
    expect(useAnimationStore.getState().playbackState).toBe('finished')
  })

  it('sets current step', () => {
    useAnimationStore.getState().setCurrentStep(2, 3)
    const state = useAnimationStore.getState()
    expect(state.currentPhaseIndex).toBe(2)
    expect(state.currentStepIndex).toBe(3)
  })

  it('updates speed', () => {
    useAnimationStore.getState().setSpeed(2)
    expect(useAnimationStore.getState().speed).toBe(2)

    useAnimationStore.getState().setSpeed(0.5)
    expect(useAnimationStore.getState().speed).toBe(0.5)
  })

  it('manages visited module IDs', () => {
    useAnimationStore.getState().markModuleVisited('a')
    useAnimationStore.getState().markModuleVisited('b')

    const state = useAnimationStore.getState()
    expect(state.visitedModuleIds.has('a')).toBe(true)
    expect(state.visitedModuleIds.has('b')).toBe(true)
    expect(state.visitedModuleIds.has('c')).toBe(false)

    useAnimationStore.getState().clearVisited()
    expect(useAnimationStore.getState().visitedModuleIds.size).toBe(0)
  })

  it('sets active module ID', () => {
    useAnimationStore.getState().setActiveModuleId('mod-x')
    expect(useAnimationStore.getState().activeModuleId).toBe('mod-x')

    useAnimationStore.getState().setActiveModuleId(null)
    expect(useAnimationStore.getState().activeModuleId).toBeNull()
  })
})
