import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { LocationId } from './content/types'
import { DATE_MIN_ISO, INITIAL_STATE, SESSION_KEY, type InviteState } from './logic'

const SHOT_LOCS: LocationId[] = ['hub', 'letter', 'japan', 'sport', 'secret', 'yesno', 'date', 'send', 'kubgu', 'vkusno']

function applyShot(state: InviteState): InviteState {
  const loc = new URLSearchParams(window.location.search).get('loc') as LocationId | null
  if (!loc || !SHOT_LOCS.includes(loc)) return state
  const next: InviteState = { ...state, location: loc, toast: '' }
  if (loc !== 'hub') next.letterDone = true
  if (loc === 'date' || loc === 'send') {
    next.saidYes = true
    next.format = next.format ?? 'calm'
    next.date = next.date || DATE_MIN_ISO
    next.slot = next.slot ?? 'evening'
  }
  return next
}

function loadState(): InviteState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return applyShot({ ...INITIAL_STATE })
    const parsed = JSON.parse(raw) as Partial<InviteState>
    return applyShot({ ...INITIAL_STATE, ...parsed, toast: '' })
  } catch {
    return applyShot({ ...INITIAL_STATE })
  }
}

function persist(state: InviteState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...state, toast: '' }))
  } catch {
    /* ignore */
  }
}

type Store = {
  state: InviteState
  patch: (partial: Partial<InviteState>) => void
}

const InviteContext = createContext<Store | null>(null)

export function InviteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InviteState>(loadState)
  const patch = useCallback((partial: Partial<InviteState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial }
      persist(next)
      return next
    })
  }, [])
  const value = useMemo<Store>(() => ({ state, patch }), [state, patch])
  return <InviteContext.Provider value={value}>{children}</InviteContext.Provider>
}

export function useInvite() {
  const ctx = useContext(InviteContext)
  if (!ctx) throw new Error('useInvite outside provider')
  return ctx
}
