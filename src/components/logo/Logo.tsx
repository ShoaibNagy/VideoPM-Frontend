import { Link } from 'react-router'
import styles from './Logo.module.scss'

type LogoProps = {
  className?: string
}

export function Logo({ className }: LogoProps) {
  const classNames = className ? `${styles.logo} ${className}` : styles.logo

  return (
    <Link className={classNames} to="/">
      <img
        className={styles.mark}
        src="/logo.svg"
        alt=""
        width={26}
        height={26}
      />
      VideoPM
    </Link>
  )
}
