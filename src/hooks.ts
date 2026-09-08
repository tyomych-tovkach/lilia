import { useEffect, useState } from 'react'
import { PHONE_BREAKPOINT } from './logic'

export function useMedia(query: string) {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatch(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return match
}

export function useIsPhone() {
  return useMedia(`(max-width: ${PHONE_BREAKPOINT - 1}px)`)
}

export function useReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)')
}
