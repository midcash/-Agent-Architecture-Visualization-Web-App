import React from 'react'
import { useAnimationStore } from '../../store/useAnimationStore'
import { useArchitectureStore } from '../../store/useArchitectureStore'
import { useAnimationPlayer } from '../../hooks/useAnimationPlayer'
import { Play, Pause, Square, StepForward, StepBack, Gauge } from 'lucide-react'

const SPEEDS = [0.5, 1, 2, 3] as const

const PlaybackControls: React.FC = () => {
  const playbackState = useAnimationStore((s) => s.playbackState)
  const speed = useAnimationStore((s) => s.speed)
  const currentPhaseIndex = useAnimationStore((s) => s.currentPhaseIndex)
  const currentStepIndex = useAnimationStore((s) => s.currentStepIndex)
  const setSpeed = useAnimationStore((s) => s.setSpeed)
  const architecture = useArchitectureStore((s) => s.architecture)

  const { play, pause, stop, stepForward, stepBackward } = useAnimationPlayer()

  if (!architecture) return null

  const phase = architecture.executionFlow.phases[currentPhaseIndex]
  const currentStep = phase?.steps[currentStepIndex]

  const isPlaying = playbackState === 'playing'
  const isFinished = playbackState === 'finished'
  const isIdle = playbackState === 'idle'

  return (
    <div className="absolute bottom-16 left-1/2 z-10 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        {/* Step backward */}
        <button
          onClick={stepBackward}
          disabled={isIdle || isPlaying}
          className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          title="Previous Step"
        >
          <StepBack className="size-4" />
        </button>

        {/* Play/Pause */}
        {isPlaying ? (
          <button
            onClick={pause}
            className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white transition-colors hover:bg-blue-600"
            title="Pause"
          >
            <Pause className="size-4" />
          </button>
        ) : (
          <button
            onClick={play}
            disabled={isFinished}
            className="flex size-9 items-center justify-center rounded-md bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            title={isFinished ? 'Finished' : 'Play'}
          >
            <Play className="size-4 ml-0.5" />
          </button>
        )}

        {/* Stop */}
        <button
          onClick={stop}
          disabled={isIdle}
          className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          title="Stop"
        >
          <Square className="size-3.5" />
        </button>

        {/* Step forward */}
        <button
          onClick={stepForward}
          disabled={isPlaying || isFinished}
          className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          title="Next Step"
        >
          <StepForward className="size-4" />
        </button>

        {/* Separator */}
        <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Speed selector */}
        <div className="flex items-center gap-1">
          <Gauge className="size-3.5 text-slate-400" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded px-1.5 py-0.5 text-xs font-medium transition-colors ${
                speed === s
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={`${s}x Speed`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Current step info */}
        {currentStep && (
          <>
            <div className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            <span className="whitespace-nowrap px-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {phase.name}
              </span>
              {' · '}
              {currentStep.action}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default PlaybackControls
