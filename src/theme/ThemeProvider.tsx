import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext } from './ThemeContext'
import {
  applyThemeToDocument,
  getPreferredTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from './theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return
      setTheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem(THEME_STORAGE_KEY, next)
    setTheme(next)
  }

  return (
    <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>
  )
}
