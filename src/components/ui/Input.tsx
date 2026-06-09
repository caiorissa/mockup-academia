import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => (
    <div className="relative">
      {icon && (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-vertex-400">
          {icon}
        </div>
      )}
      <input
        ref={ref}
        className={cn(
          'h-10 w-full rounded-xl border border-vertex-600/50 bg-vertex-800/60',
          'px-3 text-sm text-vertex-50 placeholder:text-vertex-400',
          'transition-all duration-200',
          'focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20',
          icon && 'pl-10',
          className,
        )}
        {...props}
      />
    </div>
  ),
)

Input.displayName = 'Input'
