import { Link } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useApp } from '@/context/AppContext'
import { usePendingPaymentsCount } from '@/hooks/useUnitData'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { settings, selectedUnit } = useApp()
  const pendingCount = usePendingPaymentsCount()

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-vertex-700/50 bg-vertex-900/90 backdrop-blur-md px-4 lg:px-8 shadow-card">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {title && (
        <p className="font-display text-sm font-semibold uppercase tracking-wider text-vertex-300 lg:hidden">
          {title}
        </p>
      )}

      <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-vertex-500">
        <span className="hidden lg:inline text-vertex-400">{settings.gymName}</span>
        <span className="hidden lg:inline">/</span>
        <span className="text-accent">{selectedUnit.name.replace('Unidade ', '')}</span>
      </div>

      <div className="hidden sm:block flex-1 max-w-sm">
        <Input
          placeholder="Buscar alunos, fichas..."
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />

        <Link to="/mensalidades" className="relative">
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-[18px] w-[18px]" />
          </Button>
          {settings.notifications.push && pendingCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center bg-danger text-[9px] font-bold text-white">
              {pendingCount}
            </span>
          )}
        </Link>

        <Link
          to="/configuracoes"
          className="hidden sm:flex items-center gap-2.5 pl-3 ml-1 border-l border-vertex-700/50 hover:opacity-80 transition-opacity py-1"
        >
          <div className="text-right">
            <p className="text-xs font-semibold text-vertex-100">{settings.name}</p>
            <p className="text-[10px] text-vertex-500 uppercase tracking-wide">{settings.role}</p>
          </div>
          <Avatar name={settings.name} size="sm" />
        </Link>
      </div>
    </header>
  )
}
