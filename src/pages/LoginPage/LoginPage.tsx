import { useEffect, useId, useRef, useState, type InputEvent, type SubmitEvent } from 'react'
import { Link } from 'react-router'
import { Logo } from '../../components/logo/Logo'
import { ThemeToggle } from '../../components/theme-toggle/ThemeToggle'
import styles from './LoginPage.module.scss'

type FieldErrors = {
  email: string
  password: string
}

type FormStatus = {
  message: string
  tone: 'success' | 'error'
} | null

function isTextField(
  element: Element | RadioNodeList | null,
): element is HTMLInputElement {
  return element instanceof HTMLInputElement
}

export function LoginPage() {
  const emailErrorId = useId()
  const passwordErrorId = useId()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({ email: '', password: '' })
  const [status, setStatus] = useState<FormStatus>(null)

  useEffect(() => {
    document.title = 'Log in — VideoPM'
  }, [])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const emailInput = form.elements.namedItem('email')
    const passwordInput = form.elements.namedItem('password')

    if (!isTextField(emailInput) || !isTextField(passwordInput)) return

    const emailValid =
      emailInput.value.trim() !== '' && emailInput.checkValidity()
    const passwordValid = passwordInput.value.trim() !== ''

    const nextErrors: FieldErrors = {
      email: emailValid ? '' : 'Enter a valid email address.',
      password: passwordValid ? '' : 'Enter your password.',
    }
    setErrors(nextErrors)

    if (!emailValid || !passwordValid) {
      setStatus({
        message: 'Check the highlighted fields below and try again.',
        tone: 'error',
      })
      ;(emailValid ? passwordInput : emailInput).focus()
      return
    }

    setStatus({
      message:
        'Looks good — this is a design prototype, so there’s no live backend to log in to yet.',
      tone: 'success',
    })
  }

  function handleEmailChange(event: InputEvent<HTMLInputElement>) {
    const input = event.currentTarget
    if (errors.email && input.checkValidity()) {
      setErrors({ ...errors, email: '' })
    }
  }

  function handlePasswordChange(event: InputEvent<HTMLInputElement>) {
    if (errors.password && event.currentTarget.value.trim() !== '') {
      setErrors({ ...errors, password: '' })
    }
  }

  const statusClassName =
    status?.tone === 'success'
      ? `${styles.status} ${styles.statusSuccess}`
      : styles.status

  return (
    <div className={styles.page}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className={styles.header}>
        <Logo className={styles.headerLogo} />
        <ThemeToggle />
      </header>

      <main id="main" className={styles.layout}>
        <section className={styles.brand} aria-label="Product">
          <div className={styles.brandInner}>
            <h1 className={styles.brandTitle}>
              Every project, the same structure, every time.
            </h1>
            <p className={styles.brandCopy}>
              Log in to pick up exactly where your team left off — the right
              phase, the right checklist, the right folder.
            </p>
            <ul className={styles.trustList}>
              <li>WCAG AAA accessible, in both themes</li>
              <li>The same folder structure on every project</li>
              <li>Checklists that actually gate progress</li>
            </ul>
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formWrap}>
            <Logo className={styles.compactLogo} />

            <h2 className={styles.formTitle}>Log in to VideoPM</h2>
            <p className={styles.formSubtext}>
              Enter your details to access your team’s projects.
            </p>

            {status ? (
              <output
                className={statusClassName}
                aria-live="polite"
              >
                {status.message}
              </output>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">Email address</label>
                <input
                  className={
                    errors.email
                      ? `${styles.input} ${styles.inputInvalid}`
                      : styles.input
                  }
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@studio.com"
                  required
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={emailErrorId}
                  onInput={handleEmailChange}
                />
                <p
                  className={styles.fieldError}
                  id={emailErrorId}
                  hidden={!errors.email}
                >
                  {errors.email}
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.passwordField}>
                  <input
                    className={
                      errors.password
                        ? `${styles.input} ${styles.inputInvalid}`
                        : styles.input
                    }
                    ref={passwordRef}
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={passwordErrorId}
                    onInput={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-pressed={passwordVisible}
                    onClick={() => {
                      setPasswordVisible(!passwordVisible)
                      passwordRef.current?.focus()
                    }}
                  >
                    {passwordVisible ? (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <line
                          x1="3"
                          y1="21"
                          x2="21"
                          y2="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </svg>
                    )}
                    <span className="visually-hidden">
                      {passwordVisible ? 'Hide password' : 'Show password'}
                    </span>
                  </button>
                </div>
                <p
                  className={styles.fieldError}
                  id={passwordErrorId}
                  hidden={!errors.password}
                >
                  {errors.password}
                </p>
              </div>

              <div className={styles.fieldRow}>
                <label className={styles.checkboxField}>
                  <input type="checkbox" id="remember" name="remember" />
                  Stay logged in on this device
                </label>
                <a className={styles.forgotLink} href="#forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className={styles.submit}>
                Log in
              </button>
            </form>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <p className={styles.signupLine}>
              Don’t have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
