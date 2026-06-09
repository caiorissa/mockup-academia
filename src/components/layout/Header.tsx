import { Link } from 'react-router-dom'
import { Bell, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useApp } from '@/context/AppContext'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { settings, selectedUnit } = useApp()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-vertex-700/50 bg-vertex-950/80 backdrop-blur-xl px-4 lg:px-8">
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
        <p className="text-sm font-medium text-vertex-300 lg:hidden">{title}</p>
      )}

      <div className="hidden md:flex items-center gap-2 text-xs text-vertex-400">
        <span className="hidden lg:inline">{settings.gymName}</span>
        <span className="hidden lg:inline text-vertex-600">·</span>
        <span className="font-medium text-vertex-300">{selectedUnit.name}</span>
      </div>

      <div className="hidden sm:block flex-1 max-w-md">
        <Input
          placeholder="Buscar alunos, fichas, pagamentos..."
          icon={<Search className="h-4 w-4" />}
          className="bg-vertex-900/50"
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
          <Bell className="h-[18px] w-[18px]" />
          {settings.notifications.push && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent ring-2 ring-vertex-950" />
          )}
        </Button>

        <Link
          to="/configuracoes"
          className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-vertex-700/50 rounded-lg hover:bg-vertex-800/50 transition-colors py-1 pr-1"
        >
          <div className="text-right">
            <p className="text-xs font-medium text-vertex-100">{settings.name}</p>
            <p className="text-[10px] text-vertex-400">{settings.role}</p>
          </div>
          <Avatar name={settings.name} size="sm" />
        </Link>
      </div>
    </header>
  )
}
