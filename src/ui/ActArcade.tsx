import { copy } from '../copy'
import {
  arcadeComplete,
  buildPlayerCard,
  JAPAN_STICKERS,
  machineComplete,
  SECRET_MARKS,
  SPORT_MARKS,
  toggleLimited,
  type DoorId,
  type InviteState,
  type MachineId,
} from '../logic'
import { Chip, Field, Kicker, Lead, Panel, Row, Title } from './bits'
import { PlayerCardView } from './PlayerCardView'

type Props = {
  state: InviteState
  patch: (p: Partial<InviteState>) => void
  machine: MachineId | null
  door: DoorId | null
  setMachine: (id: MachineId | null) => void
  setDoor: (id: DoorId | null) => void
  onBoard: () => void
}

export function ActArcade(props: Props) {
  const { state, patch, machine, door, setMachine, setDoor, onBoard } = props
  const done = arcadeComplete(state)
  const left = (['japan', 'sport', 'secret'] as const).filter((id) => !machineComplete(state, id)).length

  if (door) {
    return (
      <div className="hud hud-center">
        <Panel>
          <Kicker>пасхалка · не свидание</Kicker>
          <Lead>{door === 'kubgu' ? copy.easterKubsu : copy.easterVkusno}</Lead>
          <button type="button" className="btn btn-ghost" onClick={() => setDoor(null)}>
            {copy.easterClose}
          </button>
        </Panel>
      </div>
    )
  }

  if (machine === 'japan') {
    return (
      <MachinePanel
        title={copy.japanTitle}
        lead={copy.japanLead}
        save={copy.japanSave}
        options={[...JAPAN_STICKERS]}
        selected={state.japanStickers}
        max={2}
        custom={state.japanCustom}
        customPh={copy.japanCustom}
        onToggle={(item) => patch({ japanStickers: toggleLimited(state.japanStickers, item, 2) })}
        onCustom={(japanCustom) => patch({ japanCustom })}
        onClose={() => setMachine(null)}
        canClose={machineComplete(state, 'japan')}
      />
    )
  }

  if (machine === 'sport') {
    return (
      <MachinePanel
        title={copy.sportTitle}
        lead={copy.sportLead}
        save={copy.sportSave}
        options={[...SPORT_MARKS]}
        selected={state.sportMarks}
        max={3}
        custom={state.sportCustom}
        customPh={copy.sportCustom}
        onToggle={(item) => patch({ sportMarks: toggleLimited(state.sportMarks, item, 3) })}
        onCustom={(sportCustom) => patch({ sportCustom })}
        onClose={() => setMachine(null)}
        canClose={machineComplete(state, 'sport')}
      />
    )
  }

  if (machine === 'secret') {
    return (
      <MachinePanel
        title={copy.secretTitle}
        lead={copy.secretLead}
        save={copy.secretSave}
        options={[...SECRET_MARKS]}
        selected={state.secretMarks}
        max={3}
        custom={state.secretCustom}
        customPh={copy.secretCustom}
        onToggle={(item) => patch({ secretMarks: toggleLimited(state.secretMarks, item, 3) })}
        onCustom={(secretCustom) => patch({ secretCustom })}
        onClose={() => setMachine(null)}
        canClose={machineComplete(state, 'secret')}
      />
    )
  }

  return (
    <div className="hud hud-bottom">
      <Panel wide>
        <Kicker>разведка · 3 автомата</Kicker>
        <Lead>{copy.arcadeHint}</Lead>
        <div className="machines">
          <button type="button" className={`machine m-jp ${machineComplete(state, 'japan') ? 'is-done' : ''}`} onClick={() => setMachine('japan')}>
            <span>ガチャ</span>
            Япония
          </button>
          <button type="button" className={`machine m-sp ${machineComplete(state, 'sport') ? 'is-done' : ''}`} onClick={() => setMachine('sport')}>
            <span>ロッカー</span>
            Спорт
          </button>
          <button type="button" className={`machine m-sc ${machineComplete(state, 'secret') ? 'is-done' : ''}`} onClick={() => setMachine('secret')}>
            <span>チート</span>
            Секрет
          </button>
        </div>
        {done ? (
          <>
            <PlayerCardView card={buildPlayerCard(state)} />
            <button type="button" className="btn btn-yes" onClick={onBoard}>
              {copy.arcadeToBoard}
            </button>
          </>
        ) : (
          <p className="aside">{copy.arcadeNeedMore.replace('{n}', String(left))}</p>
        )}
        <div className="doors">
          <button type="button" className="door-btn" onClick={() => setDoor('kubgu')}>
            дверь «КубГУ»
          </button>
          <button type="button" className="door-btn" onClick={() => setDoor('vkusno')}>
            дверь «Вкусно и точка»
          </button>
        </div>
      </Panel>
    </div>
  )
}

function MachinePanel({
  title,
  lead,
  save,
  options,
  selected,
  max,
  custom,
  customPh,
  onToggle,
  onCustom,
  onClose,
  canClose,
}: {
  title: string
  lead: string
  save: string
  options: string[]
  selected: string[]
  max: number
  custom: string
  customPh: string
  onToggle: (item: string) => void
  onCustom: (v: string) => void
  onClose: () => void
  canClose: boolean
}) {
  return (
    <div className="hud hud-center">
      <Panel wide>
        <Kicker>автомат</Kicker>
        <Title>{title}</Title>
        <Lead>{lead}</Lead>
        <Row>
          {options.map((item) => (
            <Chip
              key={item}
              active={selected.includes(item)}
              disabled={!selected.includes(item) && selected.length >= max}
              onClick={() => onToggle(item)}
            >
              {item}
            </Chip>
          ))}
        </Row>
        <Field value={custom} onChange={onCustom} placeholder={customPh} />
        <button type="button" className="btn btn-yes" onClick={onClose} disabled={!canClose}>
          {save}
        </button>
      </Panel>
    </div>
  )
}
