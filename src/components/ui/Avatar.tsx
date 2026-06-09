import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-xl object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-accent/10',
        'border border-accent/20 font-semibold text-accent',
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
