import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from './Card'

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card hover className="relative overflow-hidden">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-vertex-300 uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold text-vertex-50 tracking-tight">{value}</p>
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  isPositive ? 'text-success' : 'text-danger',
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>{isPositive ? '+' : ''}{change}% vs mês anterior</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl bg-vertex-700/80 border border-vertex-600/40',
              iconColor,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
