import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { INITIAL_STATE, SESSION_KEY, type InviteState } from './logic'

function loadState(): InviteState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return { ...INITIAL_STATE }
    const parsed = JSON.parse(raw) as Partial<InviteState>
    return { ...INITIAL_STATE, ...parsed }
  } catch {
    return { ...INITIAL_STATE }
  }
}

function persist(state: InviteState) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota — играем дальше в памяти */
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
