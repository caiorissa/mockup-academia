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
    'bg-accent text-white hover:bg-accent-hover shadow-glow active:scale-[0.98]',
  secondary:
    'bg-vertex-700 text-vertex-50 hover:bg-vertex-600 border border-vertex-600/60',
  ghost: 'text-vertex-200 hover:bg-vertex-800 hover:text-vertex-50',
  danger: 'bg-danger/15 text-danger hover:bg-danger/25 border border-danger/30',
  outline:
    'border border-vertex-500/60 text-vertex-100 hover:border-accent/50 hover:text-accent',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-10 w-10',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200',
        'disabled:opacity-40 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-vertex-900',
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
