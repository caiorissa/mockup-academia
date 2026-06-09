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
            accent: '#9ab800',
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
