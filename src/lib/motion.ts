import type { Transition, Variants } from 'framer-motion'

export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.8,
}

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 280,
  damping: 28,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
}

export function reducedVariants(
  variants: Variants,
  shouldReduce: boolean | null,
): Variants {
  if (!shouldReduce) return variants
  return {
    hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
    visible: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0 } },
  }
}

export function revealTransition(shouldReduce: boolean | null, delay = 0): Transition {
  if (shouldReduce) return { duration: 0 }
  return { duration: 0.5, delay, ease: EASE_OUT }
}

export const tapScale = { scale: 0.97 }
export const hoverLift = { y: -2 }
