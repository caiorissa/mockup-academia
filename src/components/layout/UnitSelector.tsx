import { useEffect, useRef, useState } from 'react'
import { Building2, Check, ChevronDown } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { units } from '@/data/mock/units'
import { cn } from '@/lib/utils'

export function UnitSelector({ compact = false }: { compact?: boolean }) {
  const { selectedUnitId, setSelectedUnitId, selectedUnit } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full rounded-xl border border-vertex-600/30 bg-vertex-800/60 p-3 text-left transition-colors',
          'hover:border-accent/30 hover:bg-vertex-800',
          open && 'border-accent/40 ring-2 ring-accent/15',
        )}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 border border-accent/25">
            <Building2 className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-vertex-100 truncate">
              {compact ? selectedUnit.name.replace('Unidade ', '') : selectedUnit.name}
            </p>
            <p className="text-[11px] text-vertex-400 mt-0.5">
              {selectedUnit.city} — {selectedUnit.state}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-vertex-400 shrink-0 transition-transform',
              open && 'rotate-180',
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-xl border border-vertex-600/40 bg-vertex-900 shadow-elevated overflow-hidden">
          <div className="px-3 py-2 border-b border-vertex-700/50">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-vertex-400">
              Trocar unidade
            </p>
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {units.map((unit) => {
              const active = unit.id === selectedUnitId
              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUnitId(unit.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      active
                        ? 'bg-accent/10 text-vertex-50'
                        : 'text-vertex-300 hover:bg-vertex-800 hover:text-vertex-100',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{unit.name}</p>
                      <p className="text-[10px] text-vertex-400 mt-0.5">
                        {unit.city} — {unit.state}
                      </p>
                    </div>
                    {active && <Check className="h-4 w-4 text-accent shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
