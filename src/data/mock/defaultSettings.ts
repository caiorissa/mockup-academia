import type { AccountSettings } from '@/types'

export const defaultAccountSettings: AccountSettings = {
  name: 'Carlos Ribeiro',
  email: 'carlos.ribeiro@vertexclub.com.br',
  phone: '(11) 99876-5432',
  role: 'Gerente',
  gymName: 'VÉRTEX Performance Club',
  defaultUnitId: 'pinheiros',
  notifications: {
    email: true,
    push: true,
    overduePayments: true,
    newEnrollments: true,
    dailySummary: false,
  },
  preferences: {
    compactSidebar: false,
    showRevenueInDashboard: true,
  },
}
