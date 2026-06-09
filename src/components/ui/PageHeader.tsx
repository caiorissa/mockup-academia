import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { AnimatedText, AnimatedTypewriter } from '@/components/motion/AnimatedText'
import { EASE_OUT } from '@/lib/motion'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduce ? 0 : 0.35 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8"
    >
      <div className="border-l-[3px] border-accent pl-4">
        <AnimatedText
          as="h1"
          text={title}
          variant="words"
          className="font-display text-3xl font-bold uppercase tracking-wide text-vertex-50 leading-none"
        />
        {description && (
          <AnimatedTypewriter
            text={description}
            className="mt-2 text-sm text-vertex-400 max-w-xl"
            delay={0.2}
            speed={0.018}
          />
        )}
      </div>
      {actions && (
        <motion.div
          className="flex items-center gap-2 shrink-0 flex-wrap"
          initial={shouldReduce ? false : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  )
}
