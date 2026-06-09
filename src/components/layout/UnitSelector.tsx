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
          'w-full border border-vertex-600/40 bg-vertex-800/60 p-3 text-left transition-colors',
          'hover:border-accent/50',
          open && 'border-accent ring-1 ring-accent/20',
        )}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-vertex-700 border border-vertex-600/50">
            <Building2 className="h-4 w-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-vertex-400">Unidade</p>
            <p className="text-xs font-semibold text-vertex-100 truncate mt-0.5">
              {compact ? selectedUnit.name.replace('Unidade ', '') : selectedUnit.name}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-vertex-500 shrink-0 transition-transform mt-1',
              open && 'rotate-180',
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 z-50 border border-vertex-600/50 bg-vertex-900 shadow-elevated overflow-hidden">
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
                        ? 'bg-accent text-vertex-950'
                        : 'text-vertex-300 hover:bg-vertex-800 hover:text-accent',
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{unit.name}</p>
                      <p className={cn('text-[10px] mt-0.5', active ? 'text-vertex-800' : 'text-vertex-500')}>
                        {unit.city} — {unit.state}
                      </p>
                    </div>
                    {active && <Check className="h-4 w-4 shrink-0" />}
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
