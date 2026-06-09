import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useApp } from '@/context/AppContext'

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useApp()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </Button>
  )
}
