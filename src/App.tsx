import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { copy } from './copy'
import { useIsPhone, useReducedMotion } from './hooks'
import {
  detectWebGL,
  machineComplete,
  type DoorId,
  type MachineId,
  type PortalId,
} from './logic'
import { sendInvite } from './mail'
import { InviteProvider, useInvite } from './state'
import { ActArcade } from './ui/ActArcade'
import { ActPortals, ActFinale } from './ui/ActPortals'
import { ActScoreboard, BugModal } from './ui/ActScoreboard'
import { ActEnvelope, ActLetter } from './ui/ActStart'
import { Confetti, GlitchOverlay, Loader, PhoneGate, TwoDBackdrop } from './ui/chrome'
import { Progress } from './ui/Progress'

const FestivalCanvas = lazy(() =>
  import('./scene/FestivalCanvas').then((m) => ({ default: m.FestivalCanvas })),
)

class CanvasGuard extends Component<{ children: ReactNode; onError: () => void }, { err: boolean }> {
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

function AppInner() {
  const { state, patch } = useInvite()
  const isPhone = useIsPhone()
  const reduced = useReducedMotion()
  const [webgl] = useState(() => detectWebGL())
  const [ready, setReady] = useState(false)
  const readyRef = useRef(false)
  const [canvasBroke, setCanvasBroke] = useState(false)
  const [machine, setMachine] = useState<MachineId | null>(null)
  const [door, setDoor] = useState<DoorId | null>(null)
  const [celebrate, setCelebrate] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const use3d = webgl && !state.force2d && !canvasBroke

  useEffect(() => {
    if (!use3d) {
      setReady(true)
      readyRef.current = true
      return
    }
    const t = window.setTimeout(() => {
      if (!readyRef.current) {
        setCanvasBroke(true)
        patch({ force2d: true })
      }
    }, 10000)
    return () => window.clearTimeout(t)
  }, [use3d, patch])

  if (isPhone && !state.phoneDismissed) {
    return (
      <PhoneGate
        onContinue={() => {
          patch({ phoneDismissed: true, force2d: true })
        }}
      />
    )
  }

  const goPortals = () => {
    setCelebrate(false)
    patch({ crashed: false, act: 'portals' })
  }

  const onYes = () => {
    setCelebrate(true)
    window.setTimeout(goPortals, reduced ? 350 : 1600)
  }

  const onNoAttempt = (): 'dodge' | 'crash' => {
    if (state.noAttempts === 0) {
      patch({ noAttempts: 1 })
      return 'dodge'
    }
    patch({ noAttempts: state.noAttempts + 1, crashed: true })
    return 'crash'
  }

  const onSend = async () => {
    if (sending) return
    setSending(true)
    setSendError(null)
    const result = await sendInvite(state)
    setSending(false)
    if (result.ok) {
      patch({ act: 'sent', sentAt: new Date().toISOString() })
      return
    }
    setSendError(result.reason)
  }

  const showLoader = use3d && !ready
  const showBug = state.crashed && state.act === 'scoreboard'

  return (
    <main className={`app ${state.crashed ? 'is-crash' : ''}`}>
      {use3d ? (
        <CanvasGuard
          onError={() => {
            setCanvasBroke(true)
            patch({ force2d: true })
          }}
        >
          <Suspense fallback={null}>
            <FestivalCanvas
              act={state.act}
              crashed={state.crashed}
              celebrate={celebrate || state.act === 'sent'}
              reducedMotion={reduced}
              arcadeDone={{
                japan: machineComplete(state, 'japan'),
                sport: machineComplete(state, 'sport'),
                secret: machineComplete(state, 'secret'),
              }}
              portalSelectable={state.act === 'portals' && state.portal === null}
              ready={ready}
              onReady={() => {
                readyRef.current = true
                setReady(true)
              }}
              onEnvelope={() => patch({ act: 'letter' })}
              onCabinet={setMachine}
              onDoor={setDoor}
              onPortal={(id: PortalId) => patch({ portal: id, flavor: '', customPlace: '' })}
            />
          </Suspense>
        </CanvasGuard>
      ) : (
        <TwoDBackdrop crashed={state.crashed} />
      )}

      {showLoader && <Loader />}
      {showBug && <GlitchOverlay reduced={reduced} />}
      {celebrate && <Confetti reduced={reduced} />}

      {!showLoader && (
        <>
          <Progress act={state.act} />
          {state.act === 'envelope' && <ActEnvelope onOpen={() => patch({ act: 'letter' })} />}
          {state.act === 'letter' && <ActLetter onEnter={() => patch({ act: 'arcade' })} />}
          {state.act === 'arcade' && (
            <ActArcade
              state={state}
              patch={patch}
              machine={machine}
              door={door}
              setMachine={setMachine}
              setDoor={setDoor}
              onBoard={() => patch({ act: 'scoreboard' })}
            />
          )}
          {state.act === 'scoreboard' && !showBug && !celebrate && (
            <ActScoreboard crashed={state.crashed} onYes={onYes} onNoAttempt={onNoAttempt} />
          )}
          {showBug && (
            <BugModal
              onFix={() => {
                patch({ crashed: false, restored: true, act: 'portals' })
              }}
            />
          )}
          {celebrate && (
            <div className="hud hud-center">
              <div className="panel">
                <p className="lead">{copy.celebrate}</p>
                <button type="button" className="btn btn-yes" onClick={goPortals}>
                  {copy.celebrateCta}
                </button>
              </div>
            </div>
          )}
          {state.act === 'portals' && <ActPortals state={state} patch={patch} onSummary={() => patch({ act: 'finale' })} />}
          {(state.act === 'finale' || state.act === 'sent') && (
            <ActFinale
              state={state}
              sending={sending}
              error={sendError}
              onSend={onSend}
              onEdit={() => patch({ act: 'portals' })}
            />
          )}
        </>
      )}
    </main>
  )
}

export default function App() {
  return (
    <InviteProvider>
      <AppInner />
    </InviteProvider>
  )
}
