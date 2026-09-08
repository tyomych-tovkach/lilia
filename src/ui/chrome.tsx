import { copy } from '../copy'

export function PhoneGate({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="gate">
      <div className="gate-card">
        <p className="kicker">リリア · ноут, пожалуйста</p>
        <h1 className="title">{copy.phoneTitle}</h1>
        <p className="lead">{copy.phoneBody}</p>
        <button type="button" className="btn btn-ghost" onClick={onContinue}>
          {copy.phoneStay}
        </button>
        <p className="aside">{copy.phoneHint}</p>
      </div>
    </div>
  )
}

export function Loader() {
  return (
    <div className="loader" role="status">
      <span className="loader-orb" />
      <p>{copy.loader}</p>
    </div>
  )
}

export function TwoDBackdrop({ crashed }: { crashed: boolean }) {
  return (
    <div className={`flat-world ${crashed ? 'is-crash' : ''}`} aria-hidden>
      <div className="flat-grid" />
      <div className="flat-lanterns" />
      <div className="flat-glow" />
    </div>
  )
}

export function Confetti({ reduced }: { reduced: boolean }) {
  if (reduced) return <div className="confetti confetti-flash" />
  return (
    <div className="confetti" aria-hidden>
      {Array.from({ length: 48 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 17) % 100}%`, animationDelay: `${(i % 12) * 0.06}s` }} />
      ))}
    </div>
  )
}

export function GlitchOverlay({ reduced }: { reduced: boolean }) {
  return (
    <div className={`glitch ${reduced ? 'is-soft' : ''}`} aria-hidden>
      <div className="glitch-bars" />
      <p className="glitch-run">エラー ERROR バグ 崩壊 ERROR エラー バグ</p>
    </div>
  )
}
