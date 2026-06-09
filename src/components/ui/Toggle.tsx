import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  disabled?: boolean
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-4 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-sm font-medium text-vertex-100">{label}</p>}
          {description && (
            <p className="text-xs text-vertex-400 mt-0.5">{description}</p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
          checked ? 'bg-accent' : 'bg-vertex-600',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </label>
  )
}
