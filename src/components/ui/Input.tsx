import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-vertex-400 mb-1.5 block">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vertex-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-10 w-full border border-vertex-600/50 bg-vertex-900/60',
            'px-3 text-sm text-vertex-50 placeholder:text-vertex-500',
            'transition-all duration-150',
            'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
            icon && 'pl-10',
            className,
          )}
          {...props}
        />
      </div>
    </div>
  ),
)

Input.displayName = 'Input'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-vertex-400 mb-1.5 block">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'h-10 w-full border border-vertex-600/50 bg-vertex-900/60 px-3 text-sm text-vertex-50',
          'focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
