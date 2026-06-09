import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-on-accent hover:bg-accent-hover font-semibold shadow-glow active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
  secondary:
    'bg-vertex-800 text-vertex-50 hover:bg-vertex-700 border border-vertex-600/50 shadow-card',
  ghost: 'text-vertex-300 hover:bg-vertex-800/80 hover:text-accent',
  danger: 'bg-danger-muted text-danger hover:bg-danger/20 border border-danger/25',
  outline:
    'border border-vertex-600/60 text-vertex-100 hover:border-accent hover:text-accent hover:bg-accent-muted',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-sm gap-2.5 uppercase tracking-wide font-display font-semibold',
  icon: 'h-10 w-10',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'disabled:opacity-40 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-vertex-950',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
)

Button.displayName = 'Button'
