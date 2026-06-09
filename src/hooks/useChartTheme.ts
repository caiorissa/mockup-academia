import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'

export function useChartTheme() {
  const { resolvedTheme } = useApp()

  return useMemo(
    () =>
      resolvedTheme === 'light'
        ? {
            grid: '#e8e5dd',
            axis: '#a8a49a',
            tooltipBg: '#ffffff',
            tooltipBorder: '#e8e5dd',
            accent: '#b8d600',
          }
        : {
            grid: '#2c2c28',
            axis: '#6b6b62',
            tooltipBg: '#161614',
            tooltipBorder: '#2c2c28',
            accent: '#d4f000',
          },
    [resolvedTheme],
  )
}
