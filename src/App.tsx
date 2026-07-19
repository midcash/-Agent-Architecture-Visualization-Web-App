import { useCallback, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import ArchitectureCanvas from './components/canvas/ArchitectureCanvas'
import ComparisonView from './components/comparison/ComparisonView'
import { useArchitectureStore } from './store/useArchitectureStore'
import { frameworks, getFrameworkByFile, type FrameworkEntry } from './data/frameworks'
import { parseArchitectureFile } from './lib/parser'
import { cn } from './utils/cn'
import FileDropZone from './components/import-export/FileDropZone'
import ExportButton from './components/import-export/ExportButton'
import ValidationErrors from './components/import-export/ValidationErrors'
import type { ValidationError as ValidationErrorType } from './types/architecture'
import { Columns2, Eye } from 'lucide-react'

type ViewMode = 'single' | 'compare'

function App() {
  return (
    <ReactFlowProvider>
      <AppShell />
    </ReactFlowProvider>
  )
}

function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [importErrors, setImportErrors] = useState<ValidationErrorType[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('single')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex h-full flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300 dark:border-slate-800 dark:bg-slate-900',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Agent ArchViz
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Frameworks
          </h2>
          <FrameworkList />

          {/* Import section */}
          <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
            <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Import
            </h2>
            <FileDropZone
              onFile={(content, filename) => {
                setImportErrors([])
                const result = parseArchitectureFile(content, filename)
                result.then((r) => {
                  if (r.ok) {
                    const fw = getFrameworkByFile(filename)
                    useArchitectureStore.getState().loadArchitecture(r.definition, fw)
                  } else {
                    setImportErrors(r.errors)
                  }
                })
              }}
            />
            {importErrors.length > 0 && (
              <div className="mt-2">
                <ValidationErrors
                  errors={importErrors}
                  onDismiss={() => setImportErrors([])}
                />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative flex-1">
        {/* Top bar */}
        <header className="flex h-10 items-center gap-3 border-b border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex size-7 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2" rx="1" />
              <rect x="1" y="7" width="14" height="2" rx="1" />
              <rect x="1" y="12" width="14" height="2" rx="1" />
            </svg>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center rounded-md bg-slate-100 p-0.5 dark:bg-slate-800">
            <button
              onClick={() => setViewMode('single')}
              className={cn(
                'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                viewMode === 'single'
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
              )}
            >
              <Eye className="size-3" />
              Single
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={cn(
                'flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors',
                viewMode === 'compare'
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
              )}
            >
              <Columns2 className="size-3" />
              Compare
            </button>
          </div>

          {viewMode === 'single' && <ArchitectureInfo />}

          <div className="ml-auto">
            <ExportButton />
          </div>
        </header>

        {/* Canvas / Comparison area */}
        <div className="h-[calc(100vh-2.5rem)]">
          {viewMode === 'single' ? (
            <ArchitectureCanvas />
          ) : (
            <ComparisonView />
          )}
        </div>
      </main>
    </div>
  )
}

function FrameworkList() {
  const loadArchitecture = useArchitectureStore((s) => s.loadArchitecture)
  const currentFramework = useArchitectureStore((s) => s.framework)
  const setLoading = useArchitectureStore((s) => s.setLoading)
  const setError = useArchitectureStore((s) => s.setError)

  const handleSelect = useCallback(
    async (fw: FrameworkEntry) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/architectures/${fw.file}`)
        if (!res.ok) throw new Error(`Failed to load ${fw.file}: ${res.status}`)
        const text = await res.text()
        const result = await parseArchitectureFile(text, fw.file)
        if (result.ok) {
          loadArchitecture(result.definition, fw)
        } else {
          setError(result.errors.map((e: { message: string }) => e.message).join('; '))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load architecture')
      } finally {
        setLoading(false)
      }
    },
    [loadArchitecture, setLoading, setError],
  )

  return (
    <ul className="space-y-0.5">
      {frameworks.map((fw) => (
        <li key={fw.id}>
          <button
            onClick={() => handleSelect(fw)}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors',
              currentFramework?.id === fw.id
                ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-50'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
            )}
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: fw.color }}
            />
            <span className="flex-1 truncate font-medium">{fw.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function ArchitectureInfo() {
  const framework = useArchitectureStore((s) => s.framework)
  const architecture = useArchitectureStore((s) => s.architecture)
  const isLoading = useArchitectureStore((s) => s.isLoading)
  const error = useArchitectureStore((s) => s.error)
  const reset = useArchitectureStore((s) => s.reset)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="inline-block size-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <span className="truncate">{error}</span>
        <button
          onClick={reset}
          className="shrink-0 rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          Dismiss
        </button>
      </div>
    )
  }

  if (!framework || !architecture) {
    return (
      <span className="text-sm text-slate-400 dark:text-slate-500">
        Select a framework to begin
      </span>
    )
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-semibold text-slate-800 dark:text-slate-100">
        {framework.name}
      </span>
      <span className="text-slate-400 dark:text-slate-500">v{framework.version}</span>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {framework.patternLabel}
      </span>
      <span className="text-xs text-slate-400 dark:text-slate-500">
        {architecture.modules.length} modules · {architecture.dataFlows.length} flows
      </span>
    </div>
  )
}

export default App
