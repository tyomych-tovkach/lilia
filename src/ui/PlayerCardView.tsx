import { copy } from '../copy'
import { playerCardLines, type PlayerCard } from '../logic'

export function PlayerCardView({ card }: { card: PlayerCard }) {
  return (
    <div className="scout">
      <p className="scout-kicker">{copy.arcadeCardTitle}</p>
      <p className="scout-name">ЛИЛИЯ</p>
      {playerCardLines(card).map((line) => (
        <p key={line} className="scout-line">
          {line}
        </p>
      ))}
    </div>
  )
}
