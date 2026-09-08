import { copy } from '../copy'
import {
  canSend,
  DATE_CHIPS,
  DATE_MAX,
  DATE_MIN,
  formatRuDate,
  PORTAL_FLAVORS,
  type InviteState,
  type PortalId,
} from '../logic'
import { Chip, Kicker, Lead, Panel, Row, TextArea, Title } from './bits'
import { PlayerCardView } from './PlayerCardView'
import { buildPlayerCard, meetingLine } from '../logic'

type Props = {
  state: InviteState
  patch: (p: Partial<InviteState>) => void
  onSummary: () => void
}

export function ActPortals({ state, patch, onSummary }: Props) {
  const pickingFlavor = state.portal === 'calm' || state.portal === 'play' || state.portal === 'japan'
  const custom = state.portal === 'custom'

  if (!state.portal) {
    return (
      <div className="hud hud-bottom">
        <Panel wide>
          <Kicker>поле встречи</Kicker>
          <Lead>{copy.portalsLead}</Lead>
          <div className="portals">
            {(Object.keys(copy.portalNames) as PortalId[]).map((id) => (
              <button
                key={id}
                type="button"
                className={`portal-btn p-${id}`}
                onClick={() => patch({ portal: id, flavor: '', customPlace: '' })}
              >
                <span className="jp">{copy.portalNames[id].jp}</span>
                <strong>{copy.portalNames[id].title}</strong>
                <small>{copy.portalNames[id].hint}</small>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => patch({ portal: 'custom', flavor: '' })}
          >
            {copy.portalsCustom}
          </button>
        </Panel>
      </div>
    )
  }

  return (
    <div className="hud hud-center">
      <Panel wide>
        <button type="button" className="back" onClick={() => patch({ portal: null, flavor: '', customPlace: '' })}>
          ← {copy.portalsBack}
        </button>
        {pickingFlavor && state.portal !== 'custom' && (
          <>
            <Title>{copy.portalNames[state.portal].title}</Title>
            <Row>
              {PORTAL_FLAVORS[state.portal].map((item) => (
                <Chip key={item} active={state.flavor === item} onClick={() => patch({ flavor: item })}>
                  {item}
                </Chip>
              ))}
            </Row>
          </>
        )}
        {custom && (
          <>
            <Title>{copy.portalsCustom}</Title>
            <Lead>{copy.portalsCustomLead}</Lead>
            <TextArea value={state.customPlace} onChange={(customPlace) => patch({ customPlace })} placeholder={copy.portalsCustomPh} />
          </>
        )}
        <Kicker>{copy.portalsWhen}</Kicker>
        <Row>
          {DATE_CHIPS.map((iso) => (
            <Chip key={iso} active={state.date === iso} onClick={() => patch({ date: iso })}>
              {formatRuDate(iso).slice(0, 5)}
            </Chip>
          ))}
        </Row>
        <label className="date-lab">
          {copy.portalsOtherDay}
          <input
            type="date"
            min={DATE_MIN}
            max={DATE_MAX}
            value={state.date}
            onChange={(e) => patch({ date: e.target.value })}
          />
        </label>
        <p className="aside">{copy.portalsDateHint}</p>
        <Row>
          <Chip active={state.slot === 'day'} onClick={() => patch({ slot: 'day' })}>
            {copy.portalsSlotDay}
          </Chip>
          <Chip active={state.slot === 'evening'} onClick={() => patch({ slot: 'evening' })}>
            {copy.portalsSlotEve}
          </Chip>
        </Row>
        <button type="button" className="btn btn-yes" disabled={!canSend(state)} onClick={onSummary}>
          {copy.portalsCta}
        </button>
      </Panel>
    </div>
  )
}

type FinaleProps = {
  state: InviteState
  sending: boolean
  error: string | null
  onSend: () => void
  onEdit: () => void
}

export function ActFinale({ state, sending, error, onSend, onEdit }: FinaleProps) {
  if (state.act === 'sent') {
    return (
      <div className="hud hud-center">
        <Panel>
          <Kicker>{copy.finaleOkStamp}</Kicker>
          <Title>{copy.finaleOkTitle}</Title>
          <Lead>{copy.finaleOkLead}</Lead>
        </Panel>
      </div>
    )
  }

  return (
    <div className="hud hud-center">
      <Panel wide>
        <Kicker>перед отправкой</Kicker>
        <Title>{copy.finaleTitle}</Title>
        <Lead>{copy.finaleLead}</Lead>
        <PlayerCardView card={buildPlayerCard(state)} />
        <ul className="summary">
          <li>встреча: {meetingLine(state)}</li>
          <li>
            когда: {formatRuDate(state.date)} · {state.slot === 'day' ? 'день' : 'вечер'}
          </li>
        </ul>
        {error && <p className="err">{copy.finaleRetry}</p>}
        <button type="button" className="btn btn-yes" onClick={onSend} disabled={sending}>
          {sending ? copy.finaleSending : copy.finaleSend}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onEdit} disabled={sending}>
          {copy.finaleEdit}
        </button>
        {error && <p className="aside">{copy.finaleShot}</p>}
      </Panel>
    </div>
  )
}
