import React from 'react'
import { useAnimationStore } from '../../store/useAnimationStore'
import { useArchitectureStore } from '../../store/useArchitectureStore'
import { cn } from '../../utils/cn'

const FlowTimeline: React.FC = () => {
  const currentPhaseIndex = useAnimationStore((s) => s.currentPhaseIndex)
  const currentStepIndex = useAnimationStore((s) => s.currentStepIndex)
  const playbackState = useAnimationStore((s) => s.playbackState)
  const architecture = useArchitectureStore((s) => s.architecture)

  if (!architecture || playbackState === 'idle') return null

  const phases = architecture.executionFlow.phases

  return (
    <div className="absolute right-4 top-14 z-10 w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Execution Timeline
      </h3>

      <div className="space-y-2">
        {phases.map((phase, pi) => {
          const isCurrentPhase = pi === currentPhaseIndex
          const isPastPhase = pi < currentPhaseIndex

          return (
            <div key={phase.id}>
              {/* Phase header */}
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs',
                  isCurrentPhase && 'font-semibold text-blue-600 dark:text-blue-400',
                  isPastPhase && 'text-slate-400 dark:text-slate-500',
                  !isCurrentPhase && !isPastPhase && 'text-slate-500 dark:text-slate-400',
                )}
              >
                <span
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full text-[9px] leading-none',
                    isCurrentPhase && 'bg-blue-500 text-white',
                    isPastPhase && 'bg-emerald-500 text-white',
                    !isCurrentPhase && !isPastPhase && 'bg-slate-200 text-slate-500 dark:bg-slate-700',
                  )}
                >
                  {isPastPhase ? '✓' : pi + 1}
                </span>
                <span className="truncate">{phase.name}</span>
                {phase.repeat && (
                  <span className="ml-auto shrink-0 rounded bg-amber-100 px-1 py-px text-[9px] text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    {phase.repeat}
                  </span>
                )}
              </div>

              {/* Steps within current phase */}
              {isCurrentPhase && (
                <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-slate-200 pl-3 dark:border-slate-700">
                  {phase.steps.map((step, si) => {
                    const isCurrentStep = si === currentStepIndex
                    const isPastStep = si < currentStepIndex

                    return (
                      <div
                        key={si}
                        className={cn(
                          'text-[10px] leading-relaxed transition-colors',
                          isCurrentStep && 'font-medium text-blue-600 dark:text-blue-400',
                          isPastStep && 'text-slate-400 dark:text-slate-500',
                          !isCurrentStep && !isPastStep && 'text-slate-400 dark:text-slate-500',
                        )}
                      >
                        <span
                          className={cn(
                            'mr-1 inline-block size-1.5 rounded-full align-middle',
                            isCurrentStep && 'bg-blue-500',
                            isPastStep && 'bg-emerald-400',
                            !isCurrentStep && !isPastStep && 'bg-slate-300 dark:bg-slate-600',
                          )}
                        />
                        {step.action}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FlowTimeline
