import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'

export function useChartTheme() {
  const { resolvedTheme } = useApp()

  return useMemo(
    () =>
      resolvedTheme === 'light'
        ? {
            grid: '#d4d8e0',
            axis: '#8b92a5',
            tooltipBg: '#ffffff',
            tooltipBorder: '#d4d8e0',
            accent: '#FF6B35',
          }
        : {
            grid: '#252b3d',
            axis: '#5c6478',
            tooltipBg: '#1c2130',
            tooltipBorder: '#353d54',
            accent: '#FF6B35',
          },
    [resolvedTheme],
  )
}
