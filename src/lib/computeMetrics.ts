import {
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import type {
  ActivityItem,
  CheckIn,
  DashboardMetrics,
  Payment,
  PlanType,
  Student,
  WorkoutSheet,
} from '@/types'
import { formatCurrency } from '@/lib/utils'

const PLAN_LABELS: Record<PlanType, string> = {
  mensal: 'Mensal',
  trimestral: 'Trimestral',
  semestral: 'Semestral',
  anual: 'Anual',
}

const PLAN_COLORS: Record<PlanType, string> = {
  mensal: '#d4f000',
  trimestral: '#4ecdc4',
  semestral: '#5cdb5c',
  anual: '#ffb020',
}

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`
}

function last6Months(): Date[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => startOfMonth(subMonths(now, 5 - i)))
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

function buildRecentActivity(
  students: Student[],
  payments: Payment[],
  checkIns: CheckIn[],
  workouts: WorkoutSheet[],
): ActivityItem[] {
  const items: ActivityItem[] = []

  for (const p of payments) {
    if (p.status === 'pago' && p.paidAt) {
      items.push({
        id: `pay-${p.id}`,
        type: 'payment',
        message: `${p.studentName} — pagamento confirmado (${formatCurrency(p.amount)})`,
        timestamp: p.paidAt,
      })
    }
  }

  for (const s of students) {
    items.push({
      id: `enr-${s.id}`,
      type: 'enrollment',
      message: `Matrícula: ${s.name} (${PLAN_LABELS[s.plan]})`,
      timestamp: `${s.enrolledAt}T10:00:00`,
    })
  }

  for (const c of checkIns) {
    const time = format(parseISO(c.timestamp), 'HH:mm')
    items.push({
      id: `chk-${c.id}`,
      type: 'checkin',
      message: `${c.studentName} fez check-in às ${time}`,
      timestamp: c.timestamp,
    })
  }

  for (const w of workouts) {
    items.push({
      id: `wkt-${w.id}`,
      type: 'workout',
      message: `Ficha: ${w.title} — ${w.studentName}`,
      timestamp: `${w.updatedAt}T14:00:00`,
    })
  }

  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6)
}

export function computeLiveMetrics(
  students: Student[],
  payments: Payment[],
  checkIns: CheckIn[],
  workouts: WorkoutSheet[],
  base: DashboardMetrics,
): DashboardMetrics {
  const now = new Date()
  const months = last6Months()

  const activeStudents = students.filter(
    (s) => s.status === 'ativo' || s.status === 'pendente',
  ).length
  const totalStudents = students.length

  const unpaidPayments = payments.filter(
    (p) => p.status === 'pendente' || p.status === 'atrasado',
  )
  const overduePayments = unpaidPayments.length

  const monthlyRevenue = payments
    .filter((p) => p.status === 'pago' && p.paidAt && isSameMonth(parseISO(p.paidAt), now))
    .reduce((sum, p) => sum + p.amount, 0)

  const prevMonthRevenue = payments
    .filter((p) => {
      if (p.status !== 'pago' || !p.paidAt) return false
      const d = parseISO(p.paidAt)
      return isSameMonth(d, subMonths(now, 1))
    })
    .reduce((sum, p) => sum + p.amount, 0)

  const newEnrollments = students.filter((s) =>
    isSameMonth(parseISO(s.enrolledAt), now),
  ).length

  const prevEnrollments = students.filter((s) =>
    isSameMonth(parseISO(s.enrolledAt), subMonths(now, 1)),
  ).length

  const todayCheckIns = checkIns.filter((c) => isToday(parseISO(c.timestamp))).length

  const retentionRate =
    totalStudents > 0 ? Math.round((activeStudents / totalStudents) * 1000) / 10 : 0

  const churnCount = students.filter(
    (s) => s.status === 'inativo' || s.status === 'suspenso',
  ).length
  const churnRate =
    totalStudents > 0 ? Math.round((churnCount / totalStudents) * 1000) / 10 : 0

  const avgAttendance =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
      : 0

  const eligibleForPlan = students.filter(
    (s) => s.status === 'ativo' || s.status === 'pendente',
  )
  const planCounts: Record<PlanType, number> = {
    mensal: 0,
    trimestral: 0,
    semestral: 0,
    anual: 0,
  }
  for (const s of eligibleForPlan) planCounts[s.plan]++
  const planTotal = Object.values(planCounts).reduce((a, b) => a + b, 0) || 1

  const planDistribution = (Object.keys(planCounts) as PlanType[]).map((plan) => ({
    name: PLAN_LABELS[plan],
    value: Math.round((planCounts[plan] / planTotal) * 100),
    color: PLAN_COLORS[plan],
  }))

  const revenueByMonth = new Map<string, number>()
  const enrollmentsByMonth = new Map<string, number>()

  for (const p of payments) {
    if (p.status === 'pago' && p.paidAt) {
      const d = parseISO(p.paidAt)
      const key = monthKey(d)
      revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + p.amount)
    }
  }

  for (const s of students) {
    const d = parseISO(s.enrolledAt)
    const key = monthKey(d)
    enrollmentsByMonth.set(key, (enrollmentsByMonth.get(key) ?? 0) + 1)
  }

  const revenueHistory = months.map((d) => ({
    month: MONTH_LABELS[d.getMonth()],
    value: revenueByMonth.get(monthKey(d)) ?? 0,
  }))

  const enrollmentHistory = months.map((d) => ({
    month: MONTH_LABELS[d.getMonth()],
    value: enrollmentsByMonth.get(monthKey(d)) ?? 0,
  }))

  const retentionHistory = months.map((d, i) => {
    const enrolledBefore = students.filter((s) => parseISO(s.enrolledAt) <= d)
    const activeBefore = enrolledBefore.filter((s) => s.status === 'ativo').length
    const rate =
      enrolledBefore.length > 0
        ? Math.round((activeBefore / enrolledBefore.length) * 100)
        : retentionRate
    return { month: MONTH_LABELS[d.getMonth()], value: i === 5 ? retentionRate : rate }
  })

  return {
    ...base,
    activeStudents,
    activeStudentsChange: pctChange(
      students.filter((s) => isSameMonth(parseISO(s.enrolledAt), now)).length,
      prevEnrollments,
    ),
    monthlyRevenue,
    monthlyRevenueChange: pctChange(monthlyRevenue, prevMonthRevenue),
    retentionRate,
    retentionChange: pctChange(retentionRate, base.retentionRate),
    todayCheckIns,
    todayCheckInsChange: base.todayCheckInsChange,
    overduePayments,
    newEnrollments,
    churnRate,
    avgAttendance,
    revenueHistory,
    enrollmentHistory,
    retentionHistory,
    planDistribution,
    recentActivity: buildRecentActivity(students, payments, checkIns, workouts),
  }
}
