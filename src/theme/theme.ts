export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'videopm-theme'

export function readStoredTheme(): Theme | null {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return null
}

export function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function getPreferredTheme(): Theme {
  return readStoredTheme() ?? systemTheme()
}

export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
  }
}
