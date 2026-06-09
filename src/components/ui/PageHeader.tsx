import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-vertex-50 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-vertex-300">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </motion.div>
  )
}
