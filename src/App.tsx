import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { copy, signs } from './content/evening'
import { TouchStick } from './game/TouchStick'
import { detectWebGL, currentAct, actDone } from './logic'
import { InviteProvider, useInvite } from './state'
import { Talk } from './ui/Talk'

const GameCanvas = lazy(() => import('./game/GameCanvas').then((m) => ({ default: m.GameCanvas })))

class Guard extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props)
    this.state = { err: false }
  }
  static getDerivedStateFromError() {
    return { err: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    if (this.state.err) return null
    return this.props.children
  }
}

function Shell() {
  const { state, patch } = useInvite()
  const [webgl] = useState(() => detectWebGL())
  const [ready, setReady] = useState(false)
  const [broken, setBroken] = useState(false)
  const [hint, setHint] = useState(true)

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 9000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (state.toast) {
      const t = window.setTimeout(() => patch({ toast: '' }), 4200)
      return () => window.clearTimeout(t)
    }
  }, [state.toast, patch])

  if (!webgl) {
    return (
      <main className="app fallback">
        <p>Нужен браузер с WebGL — открой на ноуте.</p>
      </main>
    )
  }

  if (broken) {
    return (
      <main className="app fallback">
        <p>Сцена споткнулась. Обнови страницу.</p>
      </main>
    )
  }

  const sign = signs[state.location]
  const now = currentAct(state)

  return (
    <main className={`app ${state.crashed ? 'is-crash' : ''}`}>
      <Guard onError={() => setBroken(true)}>
        <Suspense fallback={null}>
          <GameCanvas onReady={() => setReady(true)} />
        </Suspense>
      </Guard>
      {!ready && (
        <div className="loader" role="status">
          <span className="loader-orb" />
          <p>{copy.loader}</p>
        </div>
      )}
      {ready && (
        <div className="hud">
          <p className="hud-title">{sign.uiTitle}</p>
          <p className="hud-obj">{sign.uiObjective}</p>
          <ol className="hud-steps">
            {(['letter', 'japan', 'sport', 'secret', 'yesno', 'date', 'send'] as const).map((id) => (
              <li key={id} className={actDone(state, id) || id === now ? 'is-on' : 'is-lock'}>
                {signs[id].arch.replace(/^АКТ [IVX]+ · /, '')}
              </li>
            ))}
          </ol>
        </div>
      )}
      {ready && hint && <p className="hint">{copy.hint}</p>}
      {state.toast && <p className="toast">{state.toast}</p>}
      <Talk />
      <TouchStick />
      {state.crashed && (
        <div className="crash-card">
          <h2>{copy.crashTitle}</h2>
          <p>{copy.crashBody}</p>
          <button
            type="button"
            className="talk-btn is-on"
            onClick={() => patch({ crashed: false, restored: true, saidYes: true, toast: copy.restoreCta })}
          >
            {copy.restoreCta}
          </button>
        </div>
      )}
    </main>
  )
}

export default function App() {
  return (
    <InviteProvider>
      <Shell />
    </InviteProvider>
  )
}
