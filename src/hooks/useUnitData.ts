import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { students } from '@/data/mock/students'
import { payments } from '@/data/mock/payments'
import { workoutSheets } from '@/data/mock/workouts'
import { checkInsByUnit, hourlyCheckInsByUnit } from '@/data/mock/checkinsByUnit'
import { metricsByUnit } from '@/data/mock/metricsByUnit'

export function useUnitStudents() {
  const { selectedUnitId } = useApp()
  return useMemo(
    () => students.filter((s) => s.unitId === selectedUnitId),
    [selectedUnitId],
  )
}

export function useUnitPayments() {
  const unitStudents = useUnitStudents()
  const studentIds = useMemo(() => new Set(unitStudents.map((s) => s.id)), [unitStudents])
  return useMemo(
    () => payments.filter((p) => studentIds.has(p.studentId)),
    [studentIds],
  )
}

export function useUnitWorkouts() {
  const unitStudents = useUnitStudents()
  const studentIds = useMemo(() => new Set(unitStudents.map((s) => s.id)), [unitStudents])
  return useMemo(
    () => workoutSheets.filter((w) => studentIds.has(w.studentId)),
    [studentIds],
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
  return metricsByUnit[selectedUnitId] ?? metricsByUnit.pinheiros
}
