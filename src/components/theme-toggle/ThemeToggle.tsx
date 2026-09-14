import { useTheme } from '../../theme/useTheme'
import styles from './ThemeToggle.module.scss'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle
            cx="12"
            cy="12"
            r="4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="4.5" />
            <line x1="12" y1="19.5" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4.5" y2="12" />
            <line x1="19.5" y1="12" x2="22" y2="12" />
            <line x1="4.9" y1="4.9" x2="6.6" y2="6.6" />
            <line x1="17.4" y1="17.4" x2="19.1" y2="19.1" />
            <line x1="4.9" y1="19.1" x2="6.6" y2="17.4" />
            <line x1="17.4" y1="6.6" x2="19.1" y2="4.9" />
          </g>
        </svg>
      )}
      <span className="visually-hidden">
        {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </button>
  )
}
