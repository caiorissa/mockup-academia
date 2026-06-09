import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { useData } from '@/context/DataContext'
import { checkInsByUnit, hourlyCheckInsByUnit } from '@/data/mock/checkinsByUnit'
import { metricsByUnit } from '@/data/mock/metricsByUnit'
import { computeLiveMetrics } from '@/lib/computeMetrics'

export function useUnitStudents() {
  const { selectedUnitId } = useApp()
  const { students } = useData()
  return useMemo(
    () => students.filter((s) => s.unitId === selectedUnitId),
    [students, selectedUnitId],
  )
}

export function useUnitPayments() {
  const unitStudents = useUnitStudents()
  const { payments } = useData()
  const studentIds = useMemo(() => new Set(unitStudents.map((s) => s.id)), [unitStudents])
  return useMemo(
    () => payments.filter((p) => studentIds.has(p.studentId)),
    [payments, studentIds],
  )
}

export function useUnitWorkouts() {
  const unitStudents = useUnitStudents()
  const { workouts } = useData()
  const studentIds = useMemo(() => new Set(unitStudents.map((s) => s.id)), [unitStudents])
  return useMemo(
    () => workouts.filter((w) => studentIds.has(w.studentId)),
    [workouts, studentIds],
  )
}

export function useUnitCheckIns() {
  const { selectedUnitId, sessionCheckIns } = useApp()
  const base = checkInsByUnit[selectedUnitId] ?? []
  return useMemo(() => [...sessionCheckIns, ...base], [sessionCheckIns, base])
}

export function useUnitHourlyCheckIns() {
  const { selectedUnitId } = useApp()
  return hourlyCheckInsByUnit[selectedUnitId] ?? []
}

export function useUnitMetrics() {
  const { selectedUnitId } = useApp()
  const students = useUnitStudents()
  const payments = useUnitPayments()
  const checkIns = useUnitCheckIns()
  const workouts = useUnitWorkouts()

  const base = metricsByUnit[selectedUnitId] ?? metricsByUnit.pinheiros

  return useMemo(
    () => computeLiveMetrics(students, payments, checkIns, workouts, base),
    [students, payments, checkIns, workouts, base],
  )
}

export function usePendingPaymentsCount() {
  const payments = useUnitPayments()
  return useMemo(
    () => payments.filter((p) => p.status === 'pendente' || p.status === 'atrasado').length,
    [payments],
  )
}
