import { useState } from 'react'
import { copy } from '../copy'
import { Kicker, Title } from './bits'

export function ActScoreboard({
  crashed,
  onYes,
  onNoAttempt,
}: {
  crashed: boolean
  onYes: () => void
  onNoAttempt: () => 'dodge' | 'crash'
}) {
  const [noPos, setNoPos] = useState({ x: 58, y: 0 })
  const [label, setLabel] = useState(copy.boardNo)

  if (crashed) return null

  return (
    <div className="hud hud-board">
      <div className="board-card">
        <Kicker>{copy.boardKicker}</Kicker>
        <p className="versus">{copy.boardVersus}</p>
        <Title>{copy.boardTitle}</Title>
        <p className="question">{copy.boardQuestion}</p>
        <div className="yesno">
          <button type="button" className="btn btn-yes" onClick={onYes}>
            {copy.boardYes}
          </button>
          <button
            type="button"
            className="btn btn-no"
            style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
            onClick={(e) => {
              e.preventDefault()
              const result = onNoAttempt()
              if (result === 'dodge') {
                setLabel(copy.boardDodge)
                setNoPos({
                  x: 40 + Math.round(Math.random() * 140),
                  y: -70 - Math.round(Math.random() * 50),
                })
              }
            }}
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}

export function BugModal({ onFix }: { onFix: () => void }) {
  return (
    <div className="bug" role="alertdialog" aria-labelledby="bug-title">
      <div className="bug-card">
        <p className="bug-code">ERR 0xLILIA · SYSTEM HALT</p>
        <h2 id="bug-title">{copy.bugTitle}</h2>
        <p>{copy.bugBody}</p>
        <button type="button" className="btn btn-yes" onClick={onFix}>
          {copy.bugCta}
        </button>
        <p className="aside">{copy.bugAside}</p>
      </div>
    </div>
  )
}
