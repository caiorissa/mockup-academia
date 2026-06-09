import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { UnitSelector } from '@/components/layout/UnitSelector'
import { useApp } from '@/context/AppContext'
import { usePendingPaymentsCount } from '@/hooks/useUnitData'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function Logo({ compact = false }: { compact?: boolean }) {
  const { settings } = useApp()

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center bg-accent text-on-accent font-display font-bold text-lg clip-chamfer">
        V
      </div>
      {!compact && (
        <div>
          <p className="font-display text-lg font-bold text-vertex-50 uppercase tracking-wider leading-none">
            {settings.gymName.split(' ')[0]}
          </p>
          <p className="text-[9px] text-accent font-bold uppercase tracking-[0.2em] mt-1">
            Performance Club
          </p>
        </div>
      )}
    </div>
  )
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pendingPaymentsCount = usePendingPaymentsCount()
  const { settings } = useApp()
  const compact = settings.preferences.compactSidebar

  return (
    <nav className={cn('flex flex-col px-2', compact ? 'gap-0.5' : 'gap-1')}>
      {navItems.map((item) => {
        const badge =
          item.href === '/mensalidades' && pendingPaymentsCount > 0
            ? pendingPaymentsCount
            : item.badge

        return (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 px-3 font-semibold uppercase tracking-wide transition-all duration-150',
                compact ? 'py-2 text-[10px]' : 'py-2.5 text-xs',
                isActive
                  ? 'text-on-accent bg-accent shadow-glow'
                  : 'text-vertex-300 hover:text-accent hover:bg-vertex-800/60',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'shrink-0 transition-colors',
                    compact ? 'h-4 w-4' : 'h-[18px] w-[18px]',
                    isActive ? 'text-on-accent' : 'text-vertex-400 group-hover:text-accent',
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold',
                      isActive ? 'bg-on-accent text-accent' : 'bg-danger text-white',
                    )}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 border-r border-vertex-700/50 bg-vertex-900 shadow-card">
        <div className="flex h-16 items-center px-4 border-b border-vertex-700/50 gym-stripe">
          <Logo />
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <NavContent />
        </div>
        <div className="p-3 border-t border-vertex-700/50">
          <UnitSelector />
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-vertex-900 border-r border-vertex-700/50 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-vertex-700/50 gym-stripe">
                <Logo />
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto">
                <NavContent onNavigate={onClose} />
              </div>
              <div className="p-3 border-t border-vertex-700/50">
                <UnitSelector />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
