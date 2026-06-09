import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from './Card'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

interface StatCardProps {
  label: string
  value: string
  change?: number
  icon: LucideIcon
  iconColor?: string
  delay?: number
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  iconColor = 'text-accent',
  delay = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <ScrollReveal delay={delay} direction="up">
      <Card hover accent className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/[0.03] transition-colors duration-300 pointer-events-none" />
        <div className="flex items-start justify-between gap-4 relative">
          <div className="space-y-1 min-w-0">
            <p className="text-[10px] font-bold text-vertex-400 uppercase tracking-widest">
              {label}
            </p>
            <p className="font-display text-3xl font-bold text-vertex-50 tracking-tight leading-none">
              {value}
            </p>
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-[11px] font-semibold mt-2',
                  isPositive ? 'text-success' : 'text-danger',
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{isPositive ? '+' : ''}{change}%</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center border border-vertex-600/50 bg-vertex-900/60 transition-transform duration-200 group-hover:scale-105',
              iconColor,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </ScrollReveal>
  )
}
