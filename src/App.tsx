import { Component, lazy, Suspense, useCallback, useEffect, useState, type ReactNode } from 'react'
import { ACT_ORDER, copy, OPTIONAL_ACTS, signs } from './content/evening'
import { actChipStatus, detectWebGL, locationObjective, onSayYes, showCrashOverlay } from './logic'
import { InviteProvider, useInvite } from './state'
import { Talk } from './ui/Talk'
import { talkLock } from './game/playerRef'

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

  const overlay = showCrashOverlay(state)
  useEffect(() => {
    if (overlay) talkLock.current = true
  }, [overlay])

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
  const crashClass =
    state.location === 'yesno' && !state.saidYes && state.crashStage >= 1 ? `is-crash-${state.crashStage}` : ''

  return (
    <main className={`app ${crashClass}`}>
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
          <p className="hud-title">{state.location === 'yesno' && state.crashStage >= 2 && !state.saidYes ? copy.crashHud : sign.uiTitle}</p>
          <p className="hud-obj">{objective}</p>
          <ol className="hud-playbill">
            <li className="hud-playbill-label">афиша</li>
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
      {state.toast && <p className={`toast ${state.saidYes ? 'is-warm' : ''}`}>{state.toast}</p>}
      {overlay && (
        <div className="crash-overlay" role="alertdialog" aria-modal="true" aria-labelledby="crash-title">
          <div className="crash-overlay__scan" aria-hidden="true" />
          <div className="crash-overlay__frame">
            <p className="crash-overlay__kicker">{copy.crashOverlayKicker}</p>
            <h1 id="crash-title" className="crash-overlay__title">
              {copy.crashOverlayTitle}
            </h1>
            <p className="crash-overlay__body">{copy.crashOverlayBody}</p>
            <div className="crash-overlay__actions">
              <button
                type="button"
                className="talk-btn is-on crash-overlay__yes"
                onClick={() => {
                  talkLock.current = false
                  patch(onSayYes(state))
                }}
              >
                {copy.crashOverlayYes}
              </button>
              <button type="button" className="talk-btn crash-overlay__no is-dead" disabled>
                {copy.crashOverlayNo}
              </button>
            </div>
          </div>
        </div>
      )}
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
