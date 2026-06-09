import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'accent'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-vertex-700 text-vertex-200 border-vertex-500/40',
  success: 'bg-success-muted text-success border-success/25',
  warning: 'bg-warning-muted text-warning border-warning/25',
  danger: 'bg-danger-muted text-danger border-danger/25',
  info: 'bg-info-muted text-info border-info/25',
  accent: 'bg-accent-muted text-accent border-accent/25',
}

export function Badge({
  children,
  variant = 'default',
  className,
  dot,
}: {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
  dot?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-danger',
            variant === 'info' && 'bg-info',
            variant === 'accent' && 'bg-accent',
            variant === 'default' && 'bg-vertex-300',
          )}
        />
      )}
      {children}
    </span>
  )
}
