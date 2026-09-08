import type { ReactNode } from 'react'

export function Panel({
  children,
  className = '',
  wide = false,
}: {
  children: ReactNode
  className?: string
  wide?: boolean
}) {
  return <div className={`panel ${wide ? 'panel-wide' : ''} ${className}`.trim()}>{children}</div>
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>
}

export function Title({ children }: { children: ReactNode }) {
  return <h1 className="title">{children}</h1>
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="lead">{children}</p>
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="row">{children}</div>
}

export function Chip({
  active,
  children,
  onClick,
  disabled,
}: {
  active?: boolean
  disabled?: boolean
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button type="button" className={`chip ${active ? 'is-on' : ''}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export function Field({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <input
      className="field"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      maxLength={80}
    />
  )
}

export function TextArea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <textarea
      className="field area"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      maxLength={180}
      rows={3}
    />
  )
}
