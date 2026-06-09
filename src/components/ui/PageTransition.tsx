import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE_OUT } from '@/lib/motion'

export function PageTransition({ children }: { children: ReactNode }) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}
