import React, { useState } from 'react'
import { useComparisonStore } from '../../store/useComparisonStore'
import { getFrameworkById } from '../../data/frameworks'
import { parseArchitectureFile } from '../../lib/parser'
import ComparisonPanel from './ComparisonPanel'
import FrameworkSelector from './FrameworkSelector'
import { cn } from '../../utils/cn'
import { Link2, Link2Off } from 'lucide-react'

const ComparisonView: React.FC = () => {
  const { left, right, syncEnabled, setLeft, setRight, toggleSync, reset: resetComparison } =
    useComparisonStore()
  const [loadingL, setLoadingL] = useState(false)
  const [loadingR, setLoadingR] = useState(false)

  const loadFramework = async (
    id: string,
    side: 'left' | 'right',
  ) => {
    const setter = side === 'left' ? setLoadingL : setLoadingR
    setter(true)

    try {
      const fw = getFrameworkById(id)
      if (!fw) return

      const res = await fetch(`/architectures/${fw.file}`)
      const text = await res.text()
      const result = await parseArchitectureFile(text, fw.file)

      if (result.ok) {
        if (side === 'left') setLeft(result.definition, fw)
        else setRight(result.definition, fw)
      }
    } finally {
      setter(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Control bar */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-3 py-1.5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex-1">
          <FrameworkSelector
            value={left.framework?.id ?? null}
            onChange={(id) => loadFramework(id, 'left')}
            placeholder="Left panel..."
          />
        </div>

        <button
          onClick={toggleSync}
          className={cn(
            'flex size-7 items-center justify-center rounded transition-colors',
            syncEnabled
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
          title={syncEnabled ? 'Sync enabled' : 'Sync disabled'}
        >
          {syncEnabled ? <Link2 className="size-4" /> : <Link2Off className="size-4" />}
        </button>

        <div className="flex-1">
          <FrameworkSelector
            value={right.framework?.id ?? null}
            onChange={(id) => loadFramework(id, 'right')}
            placeholder="Right panel..."
          />
        </div>

        <button
          onClick={resetComparison}
          className="ml-2 rounded px-2 py-1 text-[10px] text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          Clear
        </button>
      </div>

      {/* Split panels */}
      <div className="flex-1 overflow-hidden">
        <div className="grid h-full grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
          {/* Left panel */}
          <div className="h-full overflow-hidden">
            {left.architecture && left.framework ? (
              <ComparisonPanel
                architecture={left.architecture}
                framework={left.framework}
                label="Left"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                {loadingL ? 'Loading...' : 'Select a framework'}
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="h-full overflow-hidden">
            {right.architecture && right.framework ? (
              <ComparisonPanel
                architecture={right.architecture}
                framework={right.framework}
                label="Right"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                {loadingR ? 'Loading...' : 'Select a framework'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonView
