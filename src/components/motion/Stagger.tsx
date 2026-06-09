import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { reducedVariants, staggerContainer, staggerItem } from '@/lib/motion'

interface StaggerProps {
  children: ReactNode
  className?: string
  once?: boolean
}

export function Stagger({ children, className, once = true }: StaggerProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px 0px -30px 0px', amount: 0.1 }}
      variants={reducedVariants(staggerContainer, shouldReduce)}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div className={className} variants={reducedVariants(staggerItem, shouldReduce)}>
      {children}
    </motion.div>
  )
}
