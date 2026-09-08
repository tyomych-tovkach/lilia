import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { ACT_ORDER, copy, OPTIONAL_ACTS, signs } from './content/evening'
import { actChipStatus, detectWebGL, locationObjective } from './logic'
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
  const [narrow, setNarrow] = useState(() => window.matchMedia('(max-width: 820px)').matches)
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 2200)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setHint(false), 14000)
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyH') setHint((v) => !v)
    }
    const mq = window.matchMedia('(max-width: 820px)')
    const onMq = () => setNarrow(mq.matches)
    mq.addEventListener('change', onMq)
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onMq)
    }
  }, [])

  useEffect(() => {
    if (state.toast) {
      const t = window.setTimeout(() => patch({ toast: '' }), 5200)
      return () => window.clearTimeout(t)
    }
  }, [state.toast, patch])

  if (!webgl) {
    return (
      <main className="app fallback">
        <p>Нужен браузер с WebGL — открой на ноутбуке, лучше в полный экран.</p>
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
  const objective = locationObjective(state)

  return (
    <main className="app">
      <Guard onError={() => setBroken(true)}>
        <Suspense fallback={null}>
          <GameCanvas onReady={onReady} />
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
          <p className="hud-obj">{objective}</p>
          <ol className="hud-playbill">
            {ACT_ORDER.map((id) => {
              const st = actChipStatus(state, id)
              const mark =
                st === 'done' ? copy.doneMark : st === 'now' ? copy.nowMark : st === 'optional' ? copy.optionalMark : copy.waitMark
              return (
                <li key={id} className={`is-${st} ${OPTIONAL_ACTS.includes(id) ? 'is-side' : ''}`}>
                  <span>{signs[id].arch.replace(/^АКТ [IVX]+ · /, '')}</span>
                  <em>{mark}</em>
                </li>
              )
            })}
          </ol>
        </div>
      )}
      {ready && hint && <p className="hint">{copy.hint}</p>}
      {narrow && <p className="pc-note">{copy.pcNote}</p>}
      {state.toast && <p className="toast">{state.toast}</p>}
      <Talk />
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
