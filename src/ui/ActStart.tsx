import { copy } from '../copy'
import { Kicker, Lead, Panel, Title } from './bits'

export function ActEnvelope({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="hud hud-bottom">
      <Panel>
        <Kicker>{copy.envelopeKicker}</Kicker>
        <Title>{copy.envelopeTitle}</Title>
        <Lead>{copy.envelopeSub}</Lead>
        <button type="button" className="btn btn-yes" onClick={onOpen}>
          {copy.envelopeCta}
        </button>
      </Panel>
    </div>
  )
}

export function ActLetter({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="hud hud-letter">
      <Panel wide>
        <Kicker>{copy.letterEyebrow}</Kicker>
        <Title>{copy.letterTitle}</Title>
        {copy.letterBody.map((p) => (
          <p key={p} className="letter-p">
            {p}
          </p>
        ))}
        <p className="aside">{copy.letterAside}</p>
        <button type="button" className="btn btn-yes" onClick={onEnter}>
          {copy.letterCta}
        </button>
      </Panel>
    </div>
  )
}
