import { useCallback, useEffect, useRef } from 'react'
import { useAnimationStore } from '../store/useAnimationStore'
import { useArchitectureStore } from '../store/useArchitectureStore'
import { getNextStep, getPreviousStep, getFirstStep, type StepResult } from '../lib/animation-engine'

const BASE_STEP_MS = 1000

/**
 * Hook that drives the animation playback engine.
 * Manages setInterval for automatic advancement and exposes manual controls.
 */
export function useAnimationPlayer() {
  const {
    playbackState,
    speed,
    setPlaybackState,
   	setCurrentStep,
   	reset: resetAnimation,
  } = useAnimationStore()

  const {
    architecture,
    setNodeActive,
    setEdgeActive,
    dimAllExcept,
    clearDimming,
  } = useArchitectureStore()

  const phaseIdxRef = useRef(0)
  const stepIdxRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const applyStep = useCallback(
    (result: StepResult) => {
      phaseIdxRef.current = result.phaseIndex
      stepIdxRef.current = result.stepIndex
      setCurrentStep(result.phaseIndex, result.stepIndex)

      // Highlight active node, dim others
      dimAllExcept(new Set([result.activeModuleId]))
      setNodeActive(result.activeModuleId, true)

      // Highlight active edges
      for (const flowId of result.activeFlowIds) {
        setEdgeActive(flowId, true)
      }
    },
    [setCurrentStep, dimAllExcept, setNodeActive, setEdgeActive],
  )

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const advance = useCallback(() => {
    if (!architecture) return
    const next = getNextStep(architecture, phaseIdxRef.current, stepIdxRef.current)
    if (next) {
      applyStep(next)
      if (next.isLastStep) {
        clearTimer()
        setPlaybackState('finished')
      }
    } else {
      clearTimer()
      setPlaybackState('finished')
    }
  }, [architecture, applyStep, clearTimer, setPlaybackState])

  const play = useCallback(() => {
    if (!architecture) return
    clearTimer()

    // If finished, restart from beginning
    if (playbackState === 'finished') {
      const first = getFirstStep(architecture)
      if (first) applyStep(first)
    } else if (playbackState === 'idle') {
      const first = getFirstStep(architecture)
      if (first) applyStep(first)
    }

    setPlaybackState('playing')
    const interval = BASE_STEP_MS / speed
    timerRef.current = setInterval(advance, interval)
  }, [architecture, playbackState, speed, clearTimer, applyStep, advance, setPlaybackState])

  const pause = useCallback(() => {
    clearTimer()
    setPlaybackState('paused')
  }, [clearTimer, setPlaybackState])

  const stop = useCallback(() => {
    clearTimer()
    clearDimming()
    phaseIdxRef.current = 0
    stepIdxRef.current = 0
    if (architecture) {
      resetAnimation(
        architecture.executionFlow.phases.length,
        architecture.executionFlow.phases.reduce((s, p) => s + p.steps.length, 0),
      )
    } else {
      resetAnimation(0, 0)
    }
    setPlaybackState('idle')
  }, [clearTimer, clearDimming, architecture, resetAnimation, setPlaybackState])

  const stepForward = useCallback(() => {
    if (!architecture) return
    clearTimer()
    setPlaybackState('paused')

    const next = getNextStep(architecture, phaseIdxRef.current, stepIdxRef.current)
    if (next) {
      applyStep(next)
      if (next.isLastStep) setPlaybackState('finished')
    }
  }, [architecture, clearTimer, applyStep, setPlaybackState])

  const stepBackward = useCallback(() => {
    if (!architecture) return
    clearTimer()
    setPlaybackState('paused')

    const prev = getPreviousStep(architecture, phaseIdxRef.current, stepIdxRef.current)
    if (prev) {
      applyStep(prev)
    }
  }, [architecture, clearTimer, applyStep, setPlaybackState])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  return {
    play,
    pause,
    stop,
    stepForward,
    stepBackward,
  }
}
