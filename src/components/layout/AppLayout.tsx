import { Suspense, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from '@/components/ui/PageTransition'
import { PageLoader } from '@/components/ui/PageLoader'
import { navItems } from '@/config/navigation'

const pageTitles: Record<string, string> = Object.fromEntries(
  navItems.map((item) => [item.href, item.label]),
)

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'VÉRTEX'

  return (
    <div className="min-h-screen bg-vertex-950 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64 flex flex-col min-h-screen flex-1 min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} title={pageTitle} />

        <main className="flex-1 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </PageTransition>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  )
}
