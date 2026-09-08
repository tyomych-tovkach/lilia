import { useEffect, useState } from 'react'
import { copy } from '../copy'
import { GATES } from './layout'
import { maxDistrict } from '../logic'
import { useInvite } from '../state'
import { playerPos } from './playerRef'

const STEPS = ['письмо', 'аркада', 'табло', 'порталы', 'почта'] as const

export function Hud() {
  const { state } = useInvite()
  const [z, setZ] = useState(playerPos.z)
  useEffect(() => {
    const id = window.setInterval(() => setZ(playerPos.z), 160)
    return () => window.clearInterval(id)
  }, [])

  const open = maxDistrict(state)
  const current = state.phase === 'sent' ? 4 : open
  let lock = ''
  if (open < 1 && z < GATES.toArcade + 1.8) lock = copy.gateLetter
  else if (open < 2 && z < GATES.toMatch + 1.8) lock = copy.gateArcade
  else if (open < 3 && z < GATES.toPortals + 1.8) lock = copy.gateMatch
  else if (open < 4 && z < GATES.toMail + 1.8) lock = copy.gateMail

  return (
    <div className="hud">
      <ol className="hud-steps">
        {STEPS.map((label, i) => (
          <li key={label} className={i <= current ? 'is-on' : i === current + 1 ? 'is-next' : 'is-lock'}>
            {label}
          </li>
        ))}
      </ol>
      {lock && <p className="hud-lock">{lock}</p>}
      {state.letterOpen && z > GATES.toArcade && (
        <article className="letter-hud">
          <p className="letter-title">{copy.letterTitle}</p>
          {copy.letterBody.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </article>
      )}
    </div>
  )
}
