import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Payment, PersonalTrainer, PlanType, Student, StudentStatus, WorkoutSheet } from '@/types'
import { students as initialStudents } from '@/data/mock/students'
import { payments as initialPayments } from '@/data/mock/payments'
import { workoutSheets as initialWorkouts } from '@/data/mock/workouts'
import { defaultTrainers } from '@/data/mock/trainers'

const DATA_KEY = 'vertex-data'

interface StoredData {
  students: Student[]
  payments: Payment[]
  workouts: WorkoutSheet[]
  trainers: PersonalTrainer[]
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(DATA_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredData>
      return {
        students: parsed.students ?? initialStudents,
        payments: parsed.payments ?? initialPayments,
        workouts: parsed.workouts ?? initialWorkouts,
        trainers: parsed.trainers ?? defaultTrainers,
      }
    }
  } catch {
    /* ignore */
  }
  return {
    students: initialStudents,
    payments: initialPayments,
    workouts: initialWorkouts,
    trainers: defaultTrainers,
  }
}

export interface NewStudentInput {
  name: string
  email: string
  phone: string
  plan: PlanType
  trainer?: string
  monthlyFee: number
  unitId: string
}

export interface NewWorkoutInput {
  studentId: string
  studentName: string
  title: string
  goal: string
  trainer: string
  unitId: string
}

export interface NewTrainerInput {
  name: string
  specialty?: string
  phone?: string
}

interface DataContextValue {
  students: Student[]
  payments: Payment[]
  workouts: WorkoutSheet[]
  trainers: PersonalTrainer[]
  addStudent: (input: NewStudentInput) => Student
  updateStudentStatus: (id: string, status: StudentStatus) => void
  addWorkout: (input: NewWorkoutInput) => WorkoutSheet
  addTrainer: (input: NewTrainerInput) => PersonalTrainer
  removeTrainer: (id: string) => void
  toggleTrainerActive: (id: string) => void
  chargePayment: (paymentId: string, method: string) => void
  sendPaymentReminder: (paymentId: string) => void
  sendBulkReminders: (unitId: string) => number
  markPaymentPaid: (paymentId: string, method: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData)

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data))
  }, [data])

  const addStudent = useCallback((input: NewStudentInput): Student => {
    const id = `s-${Date.now()}`
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const student: Student = {
      id,
      unitId: input.unitId,
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      plan: input.plan,
      status: 'ativo',
      enrolledAt: today.toISOString().split('T')[0],
      nextDueDate: nextMonth.toISOString().split('T')[0],
      monthlyFee: input.monthlyFee,
      trainer: input.trainer,
      attendanceRate: 0,
    }

    const payment: Payment = {
      id: `p-${Date.now()}`,
      studentId: id,
      studentName: student.name,
      amount: input.monthlyFee,
      dueDate: nextMonth.toISOString().split('T')[0],
      status: 'pendente',
      plan: input.plan,
    }

    setData((prev) => ({
      ...prev,
      students: [student, ...prev.students],
      payments: [payment, ...prev.payments],
    }))

    return student
  }, [])

  const updateStudentStatus = useCallback((id: string, status: StudentStatus) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === id ? { ...s, status } : s)),
    }))
  }, [])

  const addWorkout = useCallback((input: NewWorkoutInput): WorkoutSheet => {
    const today = new Date().toISOString().split('T')[0]
    const sheet: WorkoutSheet = {
      id: `w-${Date.now()}`,
      studentId: input.studentId,
      studentName: input.studentName,
      title: input.title.trim(),
      goal: input.goal.trim(),
      trainer: input.trainer.trim(),
      createdAt: today,
      updatedAt: today,
      progress: 0,
      sessionsCompleted: 0,
      totalSessions: 12,
      exercises: [
        { name: 'Aquecimento', sets: 1, reps: '10 min', rest: '-' },
        { name: 'Exercício principal', sets: 4, reps: '10-12', load: 'A definir', rest: '90s' },
        { name: 'Alongamento', sets: 1, reps: '5 min', rest: '-' },
      ],
    }

    setData((prev) => ({
      ...prev,
      workouts: [sheet, ...prev.workouts],
    }))

    return sheet
  }, [])

  const addTrainer = useCallback((input: NewTrainerInput): PersonalTrainer => {
    const trainer: PersonalTrainer = {
      id: `t-${Date.now()}`,
      name: input.name.trim(),
      specialty: input.specialty?.trim() || undefined,
      phone: input.phone?.trim() || undefined,
      active: true,
    }

    setData((prev) => ({
      ...prev,
      trainers: [...prev.trainers, trainer],
    }))

    return trainer
  }, [])

  const removeTrainer = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.filter((t) => t.id !== id),
    }))
  }, [])

  const toggleTrainerActive = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.map((t) =>
        t.id === id ? { ...t, active: !t.active } : t,
      ),
    }))
  }, [])

  const chargePayment = useCallback((paymentId: string, method: string) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId
          ? { ...p, method: method, status: p.status === 'atrasado' ? 'pendente' : p.status }
          : p,
      ),
    }))
  }, [])

  const sendPaymentReminder = useCallback((paymentId: string) => {
    void paymentId
  }, [])

  const sendBulkReminders = useCallback((unitId: string): number => {
    const unitStudentIds = new Set(
      data.students.filter((s) => s.unitId === unitId).map((s) => s.id),
    )
    const pending = data.payments.filter(
      (p) =>
        unitStudentIds.has(p.studentId) &&
        (p.status === 'pendente' || p.status === 'atrasado'),
    )
    return pending.length
  }, [data.students, data.payments])

  const markPaymentPaid = useCallback((paymentId: string, method: string) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: 'pago' as const,
              method,
              paidAt: new Date().toISOString(),
            }
          : p,
      ),
    }))
  }, [])

  const value = useMemo(
    () => ({
      students: data.students,
      payments: data.payments,
      workouts: data.workouts,
      trainers: data.trainers,
      addStudent,
      updateStudentStatus,
      addWorkout,
      addTrainer,
      removeTrainer,
      toggleTrainerActive,
      chargePayment,
      sendPaymentReminder,
      sendBulkReminders,
      markPaymentPaid,
    }),
    [
      data,
      addStudent,
      updateStudentStatus,
      addWorkout,
      addTrainer,
      removeTrainer,
      toggleTrainerActive,
      chargePayment,
      sendPaymentReminder,
      sendBulkReminders,
      markPaymentPaid,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
