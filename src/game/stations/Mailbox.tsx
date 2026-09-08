import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { districtOpen, formatRuDate, meetingLine, playerCardLines, buildPlayerCard } from '../../logic'
import { sendInvite } from '../../mail'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { Kit } from '../Kit'
import { SPOTS } from '../layout'
import { FramedHtml, WorldLabel } from '../WorldLabel'
import { useRef } from 'react'

export function MailboxStation() {
  const { state, patch } = useInvite()
  const busy = useRef(false)
  const ready = districtOpen(state, 4) && state.phase !== 'sent'
  const card = buildPlayerCard(state)

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={SPOTS.mailbox}>
        <CuboidCollider args={[0.4, 0.8, 0.35]} position={[0, 0.8, 0]} />
      </RigidBody>
      <Kit file="ticket-machine.glb" position={SPOTS.mailbox} scale={1.05} />
      <Interactable
        id="mail"
        position={SPOTS.mailbox}
        color="#ffd27a"
        enabled={ready}
        radius={1.55}
        onInteract={() => {
          if (busy.current || state.phase === 'sent') return
          busy.current = true
          patch({ phase: 'mail', toast: '' })
          void sendInvite(state).then((res) => {
            busy.current = false
            if (res.ok) {
              patch({ phase: 'sent', sentAt: new Date().toISOString(), toast: '' })
              return
            }
            patch({ toast: 'не долетело — подойди ещё раз' })
          })
        }}
      >
        <mesh />
      </Interactable>
      {districtOpen(state, 4) && (
        <group position={[SPOTS.mailbox[0], 0, SPOTS.mailbox[2] + 1.15]}>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[1.35, 1.55, 0.06]} />
            <meshStandardMaterial color="#2a2018" />
          </mesh>
          <FramedHtml position={[0, 1.15, 0.05]} className="summary-card" width={220} height={250}>
            {state.phase === 'sent' ? (
              <p>Второй тайм назначен. Темыч уже читает сводку.</p>
            ) : (
              <>
                <p className="letter-title">сводка</p>
                {playerCardLines(card).map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <p>{meetingLine(state)}</p>
                <p>
                  {formatRuDate(state.date)} · {state.slot === 'day' ? 'день' : 'вечер'}
                </p>
                <p>E — отправить Темычу</p>
              </>
            )}
          </FramedHtml>
        </group>
      )}
      {!ready && state.phase !== 'sent' && (
        <WorldLabel position={[SPOTS.mailbox[0], 1.7, SPOTS.mailbox[2]]} color="#c9b48a">
          届
        </WorldLabel>
      )}
    </>
  )
}
