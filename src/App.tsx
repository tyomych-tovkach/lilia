import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { detectWebGL } from './logic'
import { InviteProvider, useInvite } from './state'
import { TouchStick } from './game/TouchStick'

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
  const readyRef = useRef(false)

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 7000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (state.toast) {
      const t = window.setTimeout(() => patch({ toast: '' }), 4200)
      return () => window.clearTimeout(t)
    }
  }, [state.toast, patch])

  if (!webgl || broken) {
    return (
      <main className="app fallback">
        <p>Нужен браузер с WebGL — открой на ноуте.</p>
      </main>
    )
  }

  return (
    <main className={`app ${state.crashed ? 'is-crash' : ''}`}>
      <Guard
        onError={() => {
          setBroken(true)
        }}
      >
        <Suspense fallback={null}>
          <GameCanvas
            onReady={() => {
              readyRef.current = true
              setReady(true)
            }}
          />
        </Suspense>
      </Guard>
      {!ready && (
        <div className="loader" role="status">
          <span className="loader-orb" />
          <p>собираем аркаду…</p>
        </div>
      )}
      {ready && hint && <p className="hint">WASD · мышь крутит камеру · E взять</p>}
      {state.toast && <p className="toast">{state.toast}</p>}
      {state.portal === 'custom' && state.saidYes && (
        <input
          className="custom"
          autoFocus
          maxLength={80}
          placeholder="своё место…"
          value={state.customPlace.trimStart()}
          onChange={(e) => patch({ customPlace: e.target.value, portal: 'custom', flavor: '' })}
        />
      )}
      <TouchStick />
      {state.crashed && <div className="glitch" aria-hidden />}
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
