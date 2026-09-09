import { copy, signs } from '../content/evening'
import type { ActId, LocationId } from '../content/types'
import { actChipStatus, actUnlocked, currentAct, easterUnlocked } from '../logic'
import { useInvite } from '../state'
import type { DoorStatus } from './Craft'
import { Interactable } from './Interactable'
import {
  BridgeSet,
  CampusSet,
  CourtSet,
  FoyerSet,
  GardenSet,
  PostSet,
  RoofSet,
  StaffSet,
  TableSet,
  TeaSet,
} from './Sets'
import { Archway } from './Craft'
import { Taiwi } from './Taiwi'
import { PLACE } from './playerRef'

function doorStatus(open: boolean, now: boolean, done: boolean, staff = false): DoorStatus {
  if (staff) return open ? 'staff' : 'locked'
  if (!open) return 'locked'
  if (now) return 'now'
  if (done) return 'done'
  return 'open'
}

function Gate({
  to,
  position,
  rotationY = 0,
  open,
  now = false,
  done = false,
  staff = false,
  label,
}: {
  to: LocationId
  position: [number, number, number]
  rotationY?: number
  open: boolean
  now?: boolean
  done?: boolean
  staff?: boolean
  label?: string
}) {
  const { patch, state } = useInvite()
  const text = label ?? (to === 'hub' ? 'ФОЙЕ' : signs[to].arch)
  const prompt = !open ? '' : to === 'hub' ? copy.backPrompt : copy.enterPrompt
  return (
    <>
      <Archway position={position} rotationY={rotationY} label={text} status={doorStatus(open, now, done, staff)} staff={staff} />
      <Interactable
        id={`gate-${to}-${position.join(',')}`}
        position={position}
        radius={1.55}
        color={open ? (now ? '#ffd27a' : '#c9b48a') : '#6a6258'}
        prompt={prompt}
        onInteract={() => {
          if (!open) {
            patch({ toast: to === 'kubgu' || to === 'vkusno' ? copy.locked + ' Сначала сад.' : `${copy.locked} Сначала ${signs[currentAct(state)].arch}.` })
            return
          }
          patch({ location: to, toast: '' })
        }}
      >
        <mesh />
      </Interactable>
    </>
  )
}

function Back({ half }: { half: number }) {
  return <Gate to="hub" position={[0, 0, half - 1.35]} rotationY={Math.PI} open />
}

export function World() {
  const { state } = useInvite()
  const loc = state.location
  const half = PLACE[loc].half
  const now = currentAct(state)
  const chip = (id: ActId) => actChipStatus(state, id)

  if (loc === 'hub') {
    const open = (id: ActId) => actUnlocked(state, id)
    const easter = easterUnlocked(state)
    return (
      <FoyerSet half={half}>
        <Taiwi loc="hub" position={[0, 0, 0.35]} />
        <Gate to="yesno" position={[-4.4, 0, -half + 1.25]} open={open('yesno')} now={now === 'yesno'} done={chip('yesno') === 'done'} />
        <Gate to="letter" position={[0, 0, -half + 1.25]} open={open('letter')} now={now === 'letter'} done={chip('letter') === 'done'} />
        <Gate to="date" position={[3.2, 0, -half + 1.25]} open={open('date')} now={now === 'date'} done={chip('date') === 'done'} />
        <Gate to="send" position={[6.2, 0, -half + 1.25]} open={open('send')} now={now === 'send'} done={chip('send') === 'done'} />
        <Gate to="japan" position={[half - 1.25, 0, -3.1]} rotationY={-Math.PI / 2} open={open('japan')} now={false} done={chip('japan') === 'done'} />
        <Gate to="sport" position={[half - 1.25, 0, 0]} rotationY={-Math.PI / 2} open={open('sport')} now={false} done={chip('sport') === 'done'} />
        <Gate to="secret" position={[half - 1.25, 0, 3.1]} rotationY={-Math.PI / 2} open={open('secret')} now={false} done={chip('secret') === 'done'} />
        <Gate to="kubgu" position={[-3.2, 0, half - 1.2]} rotationY={Math.PI} open={easter} staff label="СЛУЖЕБКА" />
        <Gate to="vkusno" position={[3.2, 0, half - 1.2]} rotationY={Math.PI} open={easter} staff label="ПЕРСОНАЛ" />
      </FoyerSet>
    )
  }

  if (loc === 'letter') {
    return (
      <GardenSet half={half}>
        <Back half={half} />
        <Taiwi loc="letter" position={[0.8, 0, 0.3]} />
      </GardenSet>
    )
  }

  if (loc === 'japan') {
    return (
      <TeaSet half={half}>
        <Back half={half} />
        <Taiwi loc="japan" position={[1.45, 0, -0.35]} />
      </TeaSet>
    )
  }

  if (loc === 'sport') {
    return (
      <CourtSet half={half}>
        <Back half={half} />
        <Taiwi loc="sport" position={[0.9, 0, -1.2]} />
      </CourtSet>
    )
  }

  if (loc === 'secret') {
    return (
      <RoofSet half={half}>
        <Back half={half} />
        <Taiwi loc="secret" position={[0, 0, -0.8]} />
      </RoofSet>
    )
  }

  if (loc === 'yesno') {
    return (
      <BridgeSet half={half}>
        <Back half={half} />
        <Taiwi loc="yesno" position={[0, 0, -1.2]} />
      </BridgeSet>
    )
  }

  if (loc === 'date') {
    return (
      <TableSet half={half}>
        <Back half={half} />
        <Taiwi loc="date" position={[1.55, 0, -1.05]} />
      </TableSet>
    )
  }

  if (loc === 'send') {
    return (
      <PostSet half={half}>
        <Back half={half} />
        <Taiwi loc="send" position={[-0.35, 0, -1.05]} />
      </PostSet>
    )
  }

  if (loc === 'kubgu') {
    return (
      <CampusSet half={half}>
        <Back half={half} />
        <Taiwi loc="kubgu" position={[2.2, 0, 0.2]} />
      </CampusSet>
    )
  }

  return (
    <StaffSet half={half}>
      <Back half={half} />
        <Taiwi loc="vkusno" position={[2.4, 0, -0.9]} />
    </StaffSet>
  )
}
