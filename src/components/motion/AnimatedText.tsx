import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EASE_OUT } from '@/lib/motion'

type Variant = 'fade-up' | 'fade' | 'slide-left' | 'words'

interface AnimatedTextProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  variant?: Variant
  delay?: number
}

const tagMap = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
}

export function AnimatedText({
  text,
  as = 'h1',
  className,
  variant = 'fade-up',
  delay = 0,
}: AnimatedTextProps) {
  const shouldReduce = useReducedMotion()
  const Component = tagMap[as]

  if (shouldReduce || variant === 'fade') {
    return (
      <Component
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: shouldReduce ? 0 : 0.4, delay }}
      >
        {text}
      </Component>
    )
  }

  if (variant === 'words') {
    const words = text.split(' ')
    return (
      <Component className={cn('flex flex-wrap gap-x-[0.3em]', className)} aria-label={text}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="inline-block"
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.45, delay: delay + i * 0.06, ease: EASE_OUT }}
          >
            {word}
          </motion.span>
        ))}
      </Component>
    )
  }

  const initial =
    variant === 'slide-left'
      ? { opacity: 0, x: -16 }
      : { opacity: 0, y: 14 }

  return (
    <Component
      className={className}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      {text}
    </Component>
  )
}

interface AnimatedTypewriterProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function AnimatedTypewriter({
  text,
  className,
  delay = 0.3,
  speed = 0.025,
}: AnimatedTypewriterProps) {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) {
    return <p className={className}>{text}</p>
  }

  const chars = text.split('')

  return (
    <p className={cn('inline-flex flex-wrap', className)} aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: delay + i * speed }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-accent ml-0.5 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        aria-hidden
      />
    </p>
  )
}
