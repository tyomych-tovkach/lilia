import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { canSend } from '../../logic'
import { sendInvite } from '../../mail'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { Kit } from '../Kit'
import { SPOTS } from '../layout'
import { useRef } from 'react'

export function MailboxStation() {
  const { state, patch } = useInvite()
  const busy = useRef(false)
  const ready = canSend(state) && state.saidYes && state.phase !== 'sent'

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={SPOTS.mailbox}>
        <CuboidCollider args={[0.45, 0.9, 0.4]} position={[0, 0.9, 0]} />
      </RigidBody>
      <Kit file="ticket-machine.glb" position={SPOTS.mailbox} scale={1.7} />
      <Interactable
        id="mail"
        position={SPOTS.mailbox}
        color="#ffd27a"
        enabled={ready}
        radius={1.9}
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
      {state.phase === 'sent' && (
        <Text position={[SPOTS.mailbox[0], 2.5, SPOTS.mailbox[2]]} fontSize={0.2} color="#7dffb3" anchorX="center">
          второй тайм назначен
        </Text>
      )}
    </>
  )
}
