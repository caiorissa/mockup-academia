import type { CheckIn } from '@/types'

export const todayCheckIns: CheckIn[] = [
  {
    id: 'c1',
    studentId: '7',
    studentName: 'Gabriela Lima',
    timestamp: '2026-06-07T06:50:00',
    method: 'qr',
    duration: 72,
  },
  {
    id: 'c2',
    studentId: '4',
    studentName: 'Diego Almeida',
    timestamp: '2026-06-07T07:15:00',
    method: 'facial',
    duration: 58,
  },
  {
    id: 'c3',
    studentId: '1',
    studentName: 'Ana Carolina Mendes',
    timestamp: '2026-06-07T08:32:00',
    method: 'qr',
    duration: 85,
  },
  {
    id: 'c4',
    studentId: '2',
    studentName: 'Bruno Henrique Silva',
    timestamp: '2026-06-06T18:45:00',
    method: 'manual',
    duration: 62,
  },
  {
    id: 'c5',
    studentId: '5',
    studentName: 'Eduarda Santos',
    timestamp: '2026-06-05T19:20:00',
    method: 'qr',
    duration: 45,
  },
]

export const hourlyCheckIns = [
  { hour: '06h', count: 12 },
  { hour: '07h', count: 28 },
  { hour: '08h', count: 35 },
  { hour: '09h', count: 18 },
  { hour: '10h', count: 8 },
  { hour: '11h', count: 5 },
  { hour: '12h', count: 14 },
  { hour: '17h', count: 22 },
  { hour: '18h', count: 41 },
  { hour: '19h', count: 38 },
  { hour: '20h', count: 24 },
  { hour: '21h', count: 11 },
]
