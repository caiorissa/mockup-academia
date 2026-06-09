import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AccountSettings, CheckIn, ThemeMode } from '@/types'
import { units } from '@/data/mock/units'
import { students } from '@/data/mock/students'
import { payments } from '@/data/mock/payments'
import { defaultAccountSettings } from '@/data/mock/defaultSettings'

const THEME_KEY = 'vertex-theme'
const UNIT_KEY = 'vertex-unit'
const SETTINGS_KEY = 'vertex-settings'

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode === 'system') return getSystemTheme()
  return mode
}

function loadSettings(): AccountSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) return { ...defaultAccountSettings, ...JSON.parse(stored) }
  } catch {
    /* ignore */
  }
  return defaultAccountSettings
}

interface AppContextValue {
  theme: ThemeMode
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  selectedUnitId: string
  selectedUnit: (typeof units)[number]
  setSelectedUnitId: (id: string) => void
  settings: AccountSettings
  updateSettings: (patch: Partial<AccountSettings>) => void
  updateNotifications: (patch: Partial<AccountSettings['notifications']>) => void
  updatePreferences: (patch: Partial<AccountSettings['preferences']>) => void
  saveSettings: () => void
  resetSettings: () => void
  savedMessage: string | null
  sessionCheckIns: CheckIn[]
  addManualCheckIn: (studentName: string) => void
  pendingPaymentsCount: number
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null
    return stored ?? 'dark'
  })

  const [selectedUnitId, setSelectedUnitIdState] = useState(() => {
    return localStorage.getItem(UNIT_KEY) ?? defaultAccountSettings.defaultUnitId
  })

  const [settings, setSettings] = useState<AccountSettings>(loadSettings)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [sessionCheckIns, setSessionCheckIns] = useState<CheckIn[]>([])

  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme])

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) ?? units[0],
    [selectedUnitId],
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', resolvedTheme === 'light')
    root.classList.toggle('dark', resolvedTheme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme, resolvedTheme])

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, selectedUnitId)
  }, [selectedUnitId])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = () => setThemeState('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  const setTheme = useCallback((next: ThemeMode) => setThemeState(next), [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const current = resolveTheme(prev)
      return current === 'dark' ? 'light' : 'dark'
    })
  }, [])

  const setSelectedUnitId = useCallback((id: string) => {
    setSelectedUnitIdState(id)
    setSessionCheckIns([])
  }, [])

  const updateSettings = useCallback((patch: Partial<AccountSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
    setSavedMessage(null)
  }, [])

  const updateNotifications = useCallback(
    (patch: Partial<AccountSettings['notifications']>) => {
      setSettings((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, ...patch },
      }))
      setSavedMessage(null)
    },
    [],
  )

  const updatePreferences = useCallback(
    (patch: Partial<AccountSettings['preferences']>) => {
      setSettings((prev) => ({
        ...prev,
        preferences: { ...prev.preferences, ...patch },
      }))
      setSavedMessage(null)
    },
    [],
  )

  const saveSettings = useCallback(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    if (settings.defaultUnitId !== selectedUnitId) {
      setSelectedUnitIdState(settings.defaultUnitId)
    }
    setSavedMessage('Alterações salvas com sucesso!')
    setTimeout(() => setSavedMessage(null), 3000)
  }, [settings, selectedUnitId])

  const resetSettings = useCallback(() => {
    setSettings(defaultAccountSettings)
    setThemeState('dark')
    setSelectedUnitIdState(defaultAccountSettings.defaultUnitId)
    localStorage.removeItem(SETTINGS_KEY)
    setSavedMessage('Configurações restauradas ao padrão.')
    setTimeout(() => setSavedMessage(null), 3000)
  }, [])

  const addManualCheckIn = useCallback(
    (studentName: string) => {
      const checkIn: CheckIn = {
        id: `session-${Date.now()}`,
        studentId: 'manual',
        studentName: studentName.trim(),
        timestamp: new Date().toISOString(),
        method: 'manual',
        duration: 0,
      }
      setSessionCheckIns((prev) => [checkIn, ...prev])
    },
    [],
  )

  const pendingPaymentsCount = useMemo(() => {
    const unitStudentIds = new Set(
      students.filter((s) => s.unitId === selectedUnitId).map((s) => s.id),
    )
    return payments.filter(
      (p) =>
        unitStudentIds.has(p.studentId) &&
        (p.status === 'pendente' || p.status === 'atrasado'),
    ).length
  }, [selectedUnitId])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      selectedUnitId,
      selectedUnit,
      setSelectedUnitId,
      settings,
      updateSettings,
      updateNotifications,
      updatePreferences,
      saveSettings,
      resetSettings,
      savedMessage,
      sessionCheckIns,
      addManualCheckIn,
      pendingPaymentsCount,
    }),
    [
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      selectedUnitId,
      selectedUnit,
      setSelectedUnitId,
      settings,
      updateSettings,
      updateNotifications,
      updatePreferences,
      saveSettings,
      resetSettings,
      savedMessage,
      sessionCheckIns,
      addManualCheckIn,
      pendingPaymentsCount,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
