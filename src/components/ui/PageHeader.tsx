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
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8"
    >
      <div className="border-l-[3px] border-accent pl-4">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-vertex-50 leading-none">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-vertex-400 max-w-xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>}
    </motion.div>
  )
}
