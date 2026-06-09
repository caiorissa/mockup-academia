import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { revealTransition } from '@/lib/motion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: -20, y: 0 },
  right: { x: 20, y: 0 },
  none: { x: 0, y: 0 },
}

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: Direction
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const shouldReduce = useReducedMotion()
  const offset = offsets[direction]

  return (
    <motion.div
      className={cn(className)}
      initial={
        shouldReduce
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-48px 0px -40px 0px', amount: 0.15 }}
      transition={revealTransition(shouldReduce, delay)}
    >
      {children}
    </motion.div>
  )
}
