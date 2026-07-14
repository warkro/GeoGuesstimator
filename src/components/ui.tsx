import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

type StatItem = {
  label: string
  value: ReactNode
  tone?: 'default' | 'accent' | 'cool'
}

type CommandPanelProps = {
  eyebrow: string
  title: string
  description: string
  stats: StatItem[]
}

type CardSurfaceProps = {
  eyebrow: string
  title: string
  meta?: ReactNode
  className?: string
  children: ReactNode
}

type DataTileProps = {
  label: string
  value: ReactNode
  tone?: 'default' | 'accent' | 'cool'
  className?: string
}

type StatusPillProps = {
  children: ReactNode
  tone?: 'default' | 'accent' | 'cool'
  className?: string
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

const joinClassNames = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ')

export function CommandPanel({ eyebrow, title, description, stats }: CommandPanelProps) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="hero-copy">{description}</p>
      </div>
      <div className="score-strip" aria-label="Session stats">
        {stats.map((stat) => (
          <DataTile key={stat.label} label={stat.label} value={stat.value} tone={stat.tone} />
        ))}
      </div>
    </header>
  )
}

export function CardSurface({ eyebrow, title, meta, className, children }: CardSurfaceProps) {
  return (
    <article className={joinClassNames('card-surface', className)}>
      <div className="card-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        {meta}
      </div>
      {children}
    </article>
  )
}

export function DataTile({ label, value, tone = 'default', className }: DataTileProps) {
  return (
    <div className={joinClassNames('data-tile', `data-tile-${tone}`, className)}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

export function DataTileGrid({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={joinClassNames('data-tile-grid', className)} {...props}>
      {children}
    </div>
  )
}

export function StatusPill({ children, tone = 'default', className }: StatusPillProps) {
  return <span className={joinClassNames('status-pill', `status-pill-${tone}`, className)}>{children}</span>
}

export function ActionButton({ className, variant = 'primary', type = 'button', ...props }: ActionButtonProps) {
  return <button type={type} className={joinClassNames(`${variant}-button`, className)} {...props} />
}