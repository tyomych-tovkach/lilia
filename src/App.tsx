import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { copy } from './copy'
import { Hud } from './game/Hud'
import { TouchStick } from './game/TouchStick'
import { detectWebGL, type ComposeField } from './logic'
import { InviteProvider, useInvite } from './state'

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

function composeValue(compose: ComposeField, state: ReturnType<typeof useInvite>['state']) {
  if (compose === 'japan') return state.japanCustom
  if (compose === 'sport') return state.sportCustom
  if (compose === 'secret') return state.secretCustom
  if (compose === 'place') return state.customPlace
  return ''
}

function Shell() {
  const { state, patch } = useInvite()
  const [webgl] = useState(() => detectWebGL())
  const [ready, setReady] = useState(false)
  const [broken, setBroken] = useState(false)
  const [hint, setHint] = useState(true)
  const readyRef = useRef(false)

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 8000)
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

  const compose = state.compose
  const placeholder =
    compose === 'japan'
      ? copy.japanCustom
      : compose === 'sport'
        ? copy.sportCustom
        : compose === 'secret'
          ? copy.secretCustom
          : compose === 'place'
            ? copy.portalsCustomPh
            : ''

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
      {ready && <Hud />}
      {ready && hint && <p className="hint">W вглубь экрана · A/D в стороны · мышь — взгляд · E взять</p>}
      {state.toast && <p className="toast">{state.toast}</p>}
      {compose && (
        <input
          className="custom"
          autoFocus
          maxLength={80}
          placeholder={placeholder}
          value={composeValue(compose, state)}
          onChange={(e) => {
            const v = e.target.value
            if (compose === 'japan') patch({ japanCustom: v, compose: 'japan' })
            if (compose === 'sport') patch({ sportCustom: v, compose: 'sport' })
            if (compose === 'secret') patch({ secretCustom: v, compose: 'secret' })
            if (compose === 'place') patch({ customPlace: v, portal: 'custom', flavor: '', compose: 'place' })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') patch({ compose: null })
          }}
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
