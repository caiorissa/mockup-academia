import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ProgressBar({
  value,
  className,
  color = 'accent',
}: {
  value: number
  className?: string
  color?: 'accent' | 'success' | 'info'
}) {
  const colorMap = {
    accent: 'bg-accent',
    success: 'bg-success',
    info: 'bg-info',
  }

  return (
    <div className={cn('h-1.5 w-full rounded-full bg-vertex-700 overflow-hidden', className)}>
      <motion.div
        className={cn('h-full rounded-full', colorMap[color])}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
