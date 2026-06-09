import {
  LayoutDashboard,
  UserPlus,
  CreditCard,
  ScanLine,
  Dumbbell,
  BarChart3,
  Settings,
} from 'lucide-react'
import type { NavItem } from '@/types'

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Matrículas', href: '/matriculas', icon: UserPlus },
  { label: 'Mensalidades', href: '/mensalidades', icon: CreditCard },
  { label: 'Check-in', href: '/check-in', icon: ScanLine },
  { label: 'Treinos', href: '/treinos', icon: Dumbbell },
  { label: 'Métricas', href: '/metricas', icon: BarChart3 },
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
]
