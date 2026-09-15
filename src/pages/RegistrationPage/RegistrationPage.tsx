import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputEvent,
  type SubmitEvent,
} from 'react'
import { Link } from 'react-router'
import { Logo } from '../../components/logo/Logo'
import { ThemeToggle } from '../../components/theme-toggle/ThemeToggle'
import styles from './RegistrationPage.module.scss'

type FieldErrors = {
  fullName: string
  email: string
  password: string
  terms: string
}

type FormStatus = {
  message: string
  tone: 'success' | 'error'
} | null

type PasswordRule = 'length' | 'number'

const EMPTY_ERRORS: FieldErrors = {
  fullName: '',
  email: '',
  password: '',
  terms: '',
}

const PASSWORD_RULES: Record<
  PasswordRule,
  { label: string; test: (value: string) => boolean }
> = {
  length: {
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  number: {
    label: 'At least one number',
    test: (value) => /\d/.test(value),
  },
}

function passwordMeetsAllRules(value: string) {
  return Object.values(PASSWORD_RULES).every((rule) => rule.test(value))
}

function isTextField(
  element: Element | RadioNodeList | null,
): element is HTMLInputElement {
  return element instanceof HTMLInputElement
}

export function RegistrationPage() {
  const fullNameErrorId = useId()
  const emailErrorId = useId()
  const passwordRequirementsId = useId()
  const passwordErrorId = useId()
  const termsErrorId = useId()

  const passwordRef = useRef<HTMLInputElement>(null)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [errors, setErrors] = useState<FieldErrors>(EMPTY_ERRORS)
  const [status, setStatus] = useState<FormStatus>(null)

  useEffect(() => {
    document.title = 'Create your account — VideoPM'
  }, [])

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fullNameInput = form.elements.namedItem('fullName')
    const emailInput = form.elements.namedItem('email')
    const passwordInput = form.elements.namedItem('password')
    const termsInput = form.elements.namedItem('terms')

    if (
      !isTextField(fullNameInput) ||
      !isTextField(emailInput) ||
      !isTextField(passwordInput) ||
      !(termsInput instanceof HTMLInputElement)
    ) {
      return
    }

    const fullNameValid = fullNameInput.value.trim() !== ''
    const emailValid =
      emailInput.value.trim() !== '' && emailInput.checkValidity()
    const passwordValid = passwordMeetsAllRules(passwordInput.value)
    const termsValid = termsInput.checked

    const nextErrors: FieldErrors = {
      fullName: fullNameValid ? '' : 'Enter your full name.',
      email: emailValid ? '' : 'Enter a valid work email address.',
      password: passwordValid
        ? ''
        : 'Password doesn’t meet the requirements above yet.',
      terms: termsValid
        ? ''
        : 'You need to agree to the Terms of Service and Privacy Policy to continue.',
    }
    setErrors(nextErrors)

    const fieldOrder: Array<[boolean, HTMLInputElement]> = [
      [fullNameValid, fullNameInput],
      [emailValid, emailInput],
      [passwordValid, passwordInput],
      [termsValid, termsInput],
    ]
    const firstInvalid = fieldOrder.find(([valid]) => !valid)?.[1]

    if (firstInvalid) {
      setStatus({
        message: 'Check the highlighted fields below and try again.',
        tone: 'error',
      })
      firstInvalid.focus()
      return
    }

    setStatus({
      message:
        'Looks good — this is a design prototype, so there’s no live backend to create an account on yet.',
      tone: 'success',
    })
  }

  function handleFullNameChange(event: InputEvent<HTMLInputElement>) {
    if (errors.fullName && event.currentTarget.value.trim() !== '') {
      setErrors({ ...errors, fullName: '' })
    }
  }

  function handleEmailChange(event: InputEvent<HTMLInputElement>) {
    const input = event.currentTarget
    if (errors.email && input.checkValidity()) {
      setErrors({ ...errors, email: '' })
    }
  }

  function handlePasswordChange(event: InputEvent<HTMLInputElement>) {
    const value = event.currentTarget.value
    setPasswordValue(value)
    if (errors.password && passwordMeetsAllRules(value)) {
      setErrors({ ...errors, password: '' })
    }
  }

  function handleTermsChange(event: ChangeEvent<HTMLInputElement>) {
    if (errors.terms && event.currentTarget.checked) {
      setErrors({ ...errors, terms: '' })
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
              Set up your team’s workspace in a few minutes.
            </h1>
            <p className={styles.brandCopy}>
              Every project your team creates after this starts with the same
              folder structure, checklist templates, and export presets —
              automatically.
            </p>
            <ul className={styles.trustList}>
              <li>The same folder structure and checklist templates on every project</li>
              <li>Phases that gate on real checklists, not memory</li>
              <li>WCAG AAA accessible, in light or dark</li>
            </ul>
          </div>
        </section>

        <section className={styles.formPanel}>
          <div className={styles.formWrap}>
            <Logo className={styles.compactLogo} />

            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formSubtext}>
              You’ll be the first member — invite the rest of your team after
              this.
            </p>

            {status ? (
              <output className={statusClassName} aria-live="polite">
                {status.message}
              </output>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="fullName">Full name</label>
                <input
                  className={
                    errors.fullName
                      ? `${styles.input} ${styles.inputInvalid}`
                      : styles.input
                  }
                  type="text"
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Jordan Lee"
                  required
                  aria-invalid={errors.fullName ? true : undefined}
                  aria-describedby={fullNameErrorId}
                  onInput={handleFullNameChange}
                />
                <p
                  className={styles.fieldError}
                  id={fullNameErrorId}
                  hidden={!errors.fullName}
                >
                  {errors.fullName}
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="email">Work email</label>
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
                    autoComplete="new-password"
                    required
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={`${passwordRequirementsId} ${passwordErrorId}`}
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
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
                <ul className={styles.passwordRequirements} id={passwordRequirementsId}>
                  {(Object.entries(PASSWORD_RULES) as Array<
                    [PasswordRule, (typeof PASSWORD_RULES)[PasswordRule]]
                  >).map(([rule, { label, test }]) => {
                    const met = test(passwordValue)
                    return (
                      <li key={rule} data-met={met}>
                        <span className="visually-hidden">
                          {met ? 'Met: ' : 'Not yet met: '}
                        </span>
                        {label}
                      </li>
                    )
                  })}
                </ul>
                <p
                  className={styles.fieldError}
                  id={passwordErrorId}
                  hidden={!errors.password}
                >
                  {errors.password}
                </p>
              </div>

              <div className={styles.fieldGroup}>
                <label className={`${styles.checkboxField} ${styles.checkboxFieldWrap}`}>
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    aria-describedby={termsErrorId}
                    onChange={handleTermsChange}
                  />
                  I agree to the <a href="#">Terms of Service</a> and{' '}
                  <a href="#">Privacy Policy</a>
                </label>
                <p
                  className={styles.fieldError}
                  id={termsErrorId}
                  hidden={!errors.terms}
                >
                  {errors.terms}
                </p>
              </div>

              <button type="submit" className={styles.submit}>
                Create account
              </button>
            </form>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <p className={styles.signupLine}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}