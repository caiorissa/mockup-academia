import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

const Dashboard = lazy(() =>
  import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })),
)
const Matriculas = lazy(() =>
  import('@/pages/Matriculas').then((m) => ({ default: m.Matriculas })),
)
const Mensalidades = lazy(() =>
  import('@/pages/Mensalidades').then((m) => ({ default: m.Mensalidades })),
)
const CheckIn = lazy(() =>
  import('@/pages/CheckIn').then((m) => ({ default: m.CheckIn })),
)
const Treinos = lazy(() =>
  import('@/pages/Treinos').then((m) => ({ default: m.Treinos })),
)
const Metricas = lazy(() =>
  import('@/pages/Metricas').then((m) => ({ default: m.Metricas })),
)
const Configuracoes = lazy(() =>
  import('@/pages/Configuracoes').then((m) => ({ default: m.Configuracoes })),
)
const Personais = lazy(() =>
  import('@/pages/Personais').then((m) => ({ default: m.Personais })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'matriculas', element: <Matriculas /> },
      { path: 'mensalidades', element: <Mensalidades /> },
      { path: 'check-in', element: <CheckIn /> },
      { path: 'treinos', element: <Treinos /> },
      { path: 'personais', element: <Personais /> },
      { path: 'metricas', element: <Metricas /> },
      { path: 'configuracoes', element: <Configuracoes /> },
    ],
  },
])
