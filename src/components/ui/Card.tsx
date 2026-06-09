import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
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
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-vertex-800/80 border border-vertex-600/30 shadow-card backdrop-blur-sm',
        hover && 'transition-all duration-300 hover:border-vertex-500/50 hover:shadow-elevated hover:-translate-y-0.5',
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
    <h3 className={cn('text-sm font-semibold text-vertex-50', className)}>
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
    <p className={cn('text-xs text-vertex-300 mt-0.5', className)}>{children}</p>
  )
}
