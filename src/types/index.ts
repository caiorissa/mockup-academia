import type { LucideIcon } from 'lucide-react'

export type PlanType = 'mensal' | 'trimestral' | 'semestral' | 'anual'
export type StudentStatus = 'ativo' | 'inativo' | 'pendente' | 'suspenso'
export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'cancelado'
export type CheckInMethod = 'qr' | 'manual' | 'facial'
export type ThemeMode = 'dark' | 'light' | 'system'

export interface Unit {
  id: string
  name: string
  city: string
  state: string
  address: string
}

export interface Student {
  id: string
  unitId: string
  name: string
  email: string
  phone: string
  avatar?: string
  plan: PlanType
  status: StudentStatus
  enrolledAt: string
  nextDueDate: string
  monthlyFee: number
  trainer?: string
  lastCheckIn?: string
  attendanceRate: number
}

export interface Payment {
  id: string
  studentId: string
  studentName: string
  amount: number
  dueDate: string
  paidAt?: string
  status: PaymentStatus
  plan: PlanType
  method?: string
}

export interface CheckIn {
  id: string
  studentId: string
  studentName: string
  timestamp: string
  method: CheckInMethod
  duration?: number
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  load?: string
  rest: string
}

export interface WorkoutSheet {
  id: string
  studentId: string
  studentName: string
  title: string
  goal: string
  trainer: string
  createdAt: string
  updatedAt: string
  exercises: Exercise[]
  progress: number
  sessionsCompleted: number
  totalSessions: number
}

export interface MetricPoint {
  month: string
  value: number
}

export interface DashboardMetrics {
  activeStudents: number
  activeStudentsChange: number
  monthlyRevenue: number
  monthlyRevenueChange: number
  retentionRate: number
  retentionChange: number
  todayCheckIns: number
  todayCheckInsChange: number
  overduePayments: number
  newEnrollments: number
  churnRate: number
  avgAttendance: number
  revenueHistory: MetricPoint[]
  enrollmentHistory: MetricPoint[]
  retentionHistory: MetricPoint[]
  planDistribution: { name: string; value: number; color: string }[]
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'enrollment' | 'payment' | 'checkin' | 'workout'
  message: string
  timestamp: string
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  overduePayments: boolean
  newEnrollments: boolean
  dailySummary: boolean
}

export interface DisplayPreferences {
  compactSidebar: boolean
  showRevenueInDashboard: boolean
}

export interface AccountSettings {
  name: string
  email: string
  phone: string
  role: string
  gymName: string
  defaultUnitId: string
  notifications: NotificationSettings
  preferences: DisplayPreferences
}

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}
