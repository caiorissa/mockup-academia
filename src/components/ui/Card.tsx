import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  accent?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({
  children,
  className,
  hover = false,
  padding = 'md',
  accent = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface/95 border border-vertex-700/50 shadow-card',
        accent && 'border-l-[3px] border-l-accent',
        hover &&
          'transition-all duration-200 hover:border-accent/40 hover:shadow-elevated hover:-translate-y-px',
        paddingMap[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3 className={cn('font-display text-sm font-semibold uppercase tracking-wider text-vertex-50', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-xs text-vertex-400 mt-0.5', className)}>{children}</p>
  )
}
