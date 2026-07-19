import React, { useCallback } from 'react'
import { useReactFlow } from '@xyflow/react'
import { useArchitectureStore } from '../../store/useArchitectureStore'
import { Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'

const CanvasToolbar: React.FC = () => {
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  const architecture = useArchitectureStore((s) => s.architecture)
  const loadArchitecture = useArchitectureStore((s) => s.loadArchitecture)
  const framework = useArchitectureStore((s) => s.framework)

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.3, duration: 400 })
  }, [fitView])

  const handleResetLayout = useCallback(() => {
    if (architecture) {
      loadArchitecture(architecture, framework ?? undefined)
      setTimeout(() => fitView({ padding: 0.3, duration: 400 }), 50)
    }
  }, [architecture, framework, loadArchitecture, fitView])

  const handleZoomIn = useCallback(() => zoomIn({ duration: 200 }), [zoomIn])
  const handleZoomOut = useCallback(() => zoomOut({ duration: 200 }), [zoomOut])

  return (
    <div className="absolute left-4 top-4 z-10 flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <button
        onClick={handleZoomIn}
        className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="Zoom In"
      >
        <ZoomIn className="size-4" />
      </button>
      <button
        onClick={handleZoomOut}
        className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="Zoom Out"
      >
        <ZoomOut className="size-4" />
      </button>
      <div className="mx-1 border-t border-slate-200 dark:border-slate-700" />
      <button
        onClick={handleFitView}
        className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="Fit View"
      >
        <Maximize2 className="size-4" />
      </button>
      <button
        onClick={handleResetLayout}
        className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        title="Reset Layout"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  )
}

export default CanvasToolbar
