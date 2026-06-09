import { RouterProvider } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { DataProvider } from '@/context/DataContext'
import { ToastProvider } from '@/context/ToastContext'
import { router } from '@/app/router'

export default function App() {
  return (
    <AppProvider>
      <DataProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </DataProvider>
    </AppProvider>
  )
}
