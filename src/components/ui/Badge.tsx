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
  default: 'bg-vertex-700 text-vertex-200 border-vertex-600/50',
  success: 'bg-success-muted text-success border-success/20',
  warning: 'bg-warning-muted text-warning border-warning/20',
  danger: 'bg-danger-muted text-danger border-danger/20',
  info: 'bg-info-muted text-info border-info/20',
  accent: 'bg-accent-muted text-accent border-accent/20',
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
        'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
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
