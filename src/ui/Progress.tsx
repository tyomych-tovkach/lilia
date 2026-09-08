import { copy } from '../copy'

const ACTS = ['envelope', 'letter', 'arcade', 'scoreboard', 'portals', 'finale', 'sent'] as const

export function Progress({ act }: { act: (typeof ACTS)[number] }) {
  const idx = Math.min(ACTS.indexOf(act), 5)
  return (
    <ol className="progress" aria-label="акт">
      {copy.progress.map((label, i) => (
        <li key={label} className={i === idx ? 'is-now' : i < idx ? 'is-done' : ''}>
          <span className="dot" />
          <span className="label">{label}</span>
        </li>
      ))}
    </ol>
  )
}
