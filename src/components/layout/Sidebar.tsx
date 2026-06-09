import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { navItems } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { UnitSelector } from '@/components/layout/UnitSelector'
import { useApp } from '@/context/AppContext'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

function Logo({ compact = false }: { compact?: boolean }) {
  const { settings } = useApp()

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 border border-accent/25">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="currentColor">
          <path d="M12 2L22 20H2L12 2ZM12 7L16.5 15H7.5L12 7Z" />
        </svg>
      </div>
      {!compact && (
        <div>
          <p className="text-sm font-bold text-vertex-50 tracking-tight leading-none">
            {settings.gymName.split(' ')[0]}
          </p>
          <p className="text-[10px] text-vertex-400 uppercase tracking-widest mt-0.5">
            Performance Club
          </p>
        </div>
      )}
    </div>
  )
}

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pendingPaymentsCount, settings } = useApp()
  const compact = settings.preferences.compactSidebar

  return (
    <nav className={cn('flex flex-col px-3', compact ? 'gap-0.5' : 'gap-1')}>
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
                'group relative flex items-center gap-3 rounded-xl px-3 font-medium transition-all duration-200',
                compact ? 'py-2 text-xs' : 'py-2.5 text-sm',
                isActive
                  ? 'text-vertex-50 bg-vertex-700/80'
                  : 'text-vertex-300 hover:text-vertex-100 hover:bg-vertex-800/60',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-vertex-700/80 border border-vertex-600/40"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon
                  className={cn(
                    'relative shrink-0 transition-colors',
                    compact ? 'h-4 w-4' : 'h-[18px] w-[18px]',
                    isActive ? 'text-accent' : 'text-vertex-400 group-hover:text-vertex-200',
                  )}
                />
                <span className="relative flex-1">{item.label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="relative flex h-5 min-w-5 items-center justify-center rounded-md bg-accent/20 px-1.5 text-[10px] font-bold text-accent">
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
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 border-r border-vertex-700/50 bg-vertex-900/95 backdrop-blur-xl">
        <div className="flex h-16 items-center px-5 border-b border-vertex-700/50">
          <Logo />
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
          <NavContent />
        </div>
        <div className="p-4 border-t border-vertex-700/50">
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-vertex-900 border-r border-vertex-700/50 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5 border-b border-vertex-700/50">
                <Logo />
                <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fechar menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto">
                <NavContent onNavigate={onClose} />
              </div>
              <div className="p-4 border-t border-vertex-700/50">
                <UnitSelector />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
