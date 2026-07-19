import React, { useCallback, useState } from 'react'
import { Download, Check } from 'lucide-react'
import { useArchitectureStore } from '../../store/useArchitectureStore'
import { cn } from '../../utils/cn'

type ExportFormat = 'json' | 'yaml'

const ExportButton: React.FC = () => {
  const architecture = useArchitectureStore((s) => s.architecture)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const download = useCallback(
    (format: ExportFormat) => {
      if (!architecture) return
      setShowMenu(false)

      const frameworkId = architecture.framework.name.toLowerCase().replace(/\s+/g, '-')
      let content: string
      let mime: string
      let ext: string

      if (format === 'json') {
        content = JSON.stringify(architecture, null, 2)
        mime = 'application/json'
        ext = 'json'
      } else {
        // js-yaml dump — we import dynamically to keep bundle small
        import('js-yaml').then((yaml) => {
          const yamlContent = yaml.dump(architecture, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
          })
          const blob = new Blob([yamlContent], { type: 'text/yaml' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${frameworkId}-architecture.yaml`
          a.click()
          URL.revokeObjectURL(url)
        })
        return
      }

      const blob = new Blob([content], { type: mime })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${frameworkId}-architecture.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    },
    [architecture],
  )

  const copyJSON = useCallback(async () => {
    if (!architecture) return
    const json = JSON.stringify(architecture, null, 2)
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setShowMenu(false)
    setTimeout(() => setCopied(false), 2000)
  }, [architecture])

  if (!architecture) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
          copied
            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
        )}
        title="Export architecture"
      >
        {copied ? <Check className="size-3.5" /> : <Download className="size-3.5" />}
        {copied ? 'Copied!' : 'Export'}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <button
              onClick={() => download('json')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Download JSON
            </button>
            <button
              onClick={() => download('yaml')}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Download YAML
            </button>
            <div className="mx-2 my-0.5 border-t border-slate-100 dark:border-slate-700" />
            <button
              onClick={copyJSON}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Copy JSON
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ExportButton
