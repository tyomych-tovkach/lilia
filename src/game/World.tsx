import { copy, signs } from '../content/evening'
import type { ActId, LocationId } from '../content/types'
import { actUnlocked, currentAct } from '../logic'
import { useInvite } from '../state'
import { Archway, Kanji, PlazaShell, RuSign } from './Craft'
import { Interactable } from './Interactable'
import { Kit } from './Kit'
import { Npc } from './Npc'
import { PLACE } from './playerRef'

function Gate({
  to,
  position,
  rotationY = 0,
  open,
}: {
  to: LocationId
  position: [number, number, number]
  rotationY?: number
  open: boolean
}) {
  const { patch } = useInvite()
  const label = to === 'hub' ? 'ФОЙЕ' : signs[to].arch
  return (
    <>
      <Archway position={position} rotationY={rotationY} label={label} open={open} />
      <Interactable
        id={`gate-${to}-${position.join(',')}`}
        position={position}
        radius={1.6}
        color={open ? '#ffd27a' : '#8a8074'}
        onInteract={() => {
          if (!open) {
            patch({ toast: copy.locked })
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

  if (loc === 'hub') {
    const open = (id: ActId) => actUnlocked(state, id)
    return (
      <PlazaShell half={half} ground="#5a4a3c" accent="#7a6550" plaster={['#f3e6d0', '#efe0c8', '#e8d4bc']}>
        <RuSign text="ВЕЧЕР" position={[0, 0.08, 0]} size={0.42} color="#4a3a28" />
        <Npc loc="hub" position={[0, 0, 1.6]} />
        <Gate to="letter" position={[-4.2, 0, -7.7]} open={open('letter')} />
        <Gate to="japan" position={[0, 0, -7.7]} open={open('japan')} />
        <Gate to="sport" position={[4.2, 0, -7.7]} open={open('sport')} />
        <Gate to="secret" position={[7.7, 0, -2.4]} rotationY={-Math.PI / 2} open={open('secret')} />
        <Gate to="yesno" position={[7.7, 0, 2.4]} rotationY={-Math.PI / 2} open={open('yesno')} />
        <Gate to="date" position={[-7.7, 0, -2.4]} rotationY={Math.PI / 2} open={open('date')} />
        <Gate to="send" position={[-7.7, 0, 2.4]} rotationY={Math.PI / 2} open={open('send')} />
        <Gate to="kubgu" position={[-4.2, 0, 7.7]} rotationY={Math.PI} open />
        <Gate to="vkusno" position={[4.2, 0, 7.7]} rotationY={Math.PI} open />
        <Kanji text={signs[now].arch} position={[0, 2.2, 0.4]} size={0.16} color="#ffd27a" />
      </PlazaShell>
    )
  }

  if (loc === 'letter') {
    return (
      <PlazaShell half={half} ground="#4a3a32" accent="#6a5040" plaster={['#f0e0d0', '#e8d4c4']}>
        <Back half={half} />
        <Npc loc="letter" position={[0, 0, -1.2]} />
        <mesh position={[0, 0.35, -2.4]}>
          <boxGeometry args={[1.6, 0.08, 1.6]} />
          <meshStandardMaterial color="#d4b090" />
        </mesh>
        <mesh position={[-1.4, 1.4, -3.1]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color="#c9a227" />
        </mesh>
        <mesh position={[1.4, 1.4, -3.1]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[0.08, 2.2, 0.08]} />
          <meshStandardMaterial color="#c9a227" />
        </mesh>
        <Kanji text="手紙" position={[0, 0.08, 1.4]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#5a4030" />
      </PlazaShell>
    )
  }

  if (loc === 'japan') {
    return (
      <PlazaShell half={half} ground="#3a2a24" accent="#5a4034" plaster={['#f4e8d8', '#ead8c8']}>
        <Back half={half} />
        <Npc loc="japan" position={[0, 0, -1]} />
        <mesh position={[0, 0.28, -2.2]}>
          <cylinderGeometry args={[0.55, 0.6, 0.28, 16]} />
          <meshStandardMaterial color="#4a3020" />
        </mesh>
        <mesh position={[0, 0.48, -2.2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
          <meshStandardMaterial color="#f4ead8" />
        </mesh>
        <Kanji text="茶" position={[0, 0.08, 1.6]} rotation={[-Math.PI / 2, 0, 0]} size={0.7} color="#5a3020" />
      </PlazaShell>
    )
  }

  if (loc === 'sport') {
    return (
      <PlazaShell half={half} ground="#3a5a3a" accent="#4a6a44" plaster={['#d8e0d0', '#c8d4c0']}>
        <Back half={half} />
        <Npc loc="sport" position={[0.8, 0, -1.4]} />
        <mesh position={[0, 0.06, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 8]} />
          <meshStandardMaterial color="#4a8a4a" />
        </mesh>
        <mesh position={[0, 1.1, -3.4]}>
          <boxGeometry args={[3.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#f4f0e0" />
        </mesh>
        <Kit file="basketball-game.glb" position={[-2.1, 0, 1.2]} scale={0.85} />
        <Kanji text="球" position={[0, 0.08, 2.4]} rotation={[-Math.PI / 2, 0, 0]} size={0.55} color="#2a4a2a" />
      </PlazaShell>
    )
  }

  if (loc === 'secret') {
    return (
      <PlazaShell half={half} ground="#2a2438" accent="#3a3450" plaster={['#d8d0e8', '#c8c0d8']}>
        <Back half={half} />
        <Npc loc="secret" position={[0, 0, -1.1]} />
        <mesh position={[0, 0.08, -2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 24]} />
          <meshStandardMaterial color="#3a2a4a" />
        </mesh>
        <Kanji text="夜" position={[0, 0.08, 1.8]} rotation={[-Math.PI / 2, 0, 0]} size={0.6} color="#4a3a5a" />
      </PlazaShell>
    )
  }

  if (loc === 'yesno') {
    return (
      <PlazaShell half={half} ground="#3a3430" accent="#5a4a40" plaster={['#e8dcc8', '#d8ccb8']}>
        <Back half={half} />
        <Npc loc="yesno" position={[0, 0, -1]} />
        <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.8, 0.12, 4.2]} />
          <meshStandardMaterial color="#6a5a48" />
        </mesh>
        <Kanji text="縁" position={[0, 0.08, 2]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#4a3a30" />
      </PlazaShell>
    )
  }

  if (loc === 'date') {
    return (
      <PlazaShell half={half} ground="#4a3e32" accent="#6a5848" plaster={['#f0e4d0', '#e4d8c4']}>
        <Back half={half} />
        <Npc loc="date" position={[0, 0, -1.2]} />
        <mesh position={[-1.4, 0.55, -2.2]}>
          <cylinderGeometry args={[0.45, 0.5, 0.7, 12]} />
          <meshStandardMaterial color="#c4a070" />
        </mesh>
        <mesh position={[0, 0.55, -2.4]}>
          <cylinderGeometry args={[0.45, 0.5, 0.7, 12]} />
          <meshStandardMaterial color="#5a8a4a" />
        </mesh>
        <mesh position={[1.4, 0.55, -2.2]}>
          <cylinderGeometry args={[0.45, 0.5, 0.7, 12]} />
          <meshStandardMaterial color="#c44536" />
        </mesh>
        <Kanji text="席" position={[0, 0.08, 1.8]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#5a4030" />
      </PlazaShell>
    )
  }

  if (loc === 'send') {
    return (
      <PlazaShell half={half} ground="#4a4034" accent="#6a5a48" plaster={['#e8dcc8', '#d8d0c0']}>
        <Back half={half} />
        <Npc loc="send" position={[0, 0, -1]} />
        <Kit file="ticket-machine.glb" position={[1.6, 0, -1.6]} scale={1} />
        <mesh position={[-1.4, 1.15, -2.4]}>
          <boxGeometry args={[1.6, 1.8, 0.12]} />
          <meshStandardMaterial color="#3a5a8a" />
        </mesh>
        <Kanji text="便" position={[0, 0.08, 1.6]} rotation={[-Math.PI / 2, 0, 0]} size={0.5} color="#4a3a28" />
      </PlazaShell>
    )
  }

  if (loc === 'kubgu') {
    return (
      <PlazaShell half={half} ground="#5a5a50" accent="#6a6a60" plaster={['#e8dcc4', '#ddd2b8', '#d4c8b0']}>
        <Back half={half} />
        <Npc loc="kubgu" position={[1.4, 0, 1.2]} />
        <mesh position={[0, 2.2, -5.4]}>
          <boxGeometry args={[10.5, 4.4, 1.8]} />
          <meshStandardMaterial color="#d8cbb0" roughness={0.78} />
        </mesh>
        {[-3.2, -1.6, 0, 1.6, 3.2].map((x) => (
          <mesh key={x} position={[x, 1.5, -4.35]}>
            <cylinderGeometry args={[0.22, 0.22, 3, 12]} />
            <meshStandardMaterial color="#efe6d2" />
          </mesh>
        ))}
        <mesh position={[0, 4.55, -5.3]}>
          <boxGeometry args={[11, 0.35, 2.2]} />
          <meshStandardMaterial color="#c4b090" />
        </mesh>
        <mesh position={[0, 3.35, -4.4]}>
          <boxGeometry args={[4.6, 0.7, 0.12]} />
          <meshStandardMaterial color="#3a4a6a" />
        </mesh>
        <RuSign text="КУБГУ" position={[0, 3.35, -4.28]} size={0.28} color="#f4ead8" />
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.4, 24]} />
          <meshStandardMaterial color="#3a6a3a" />
        </mesh>
      </PlazaShell>
    )
  }

  return (
    <PlazaShell half={half} ground="#3a4a38" accent="#4a5a44" plaster={['#1a4a32', '#245a3c']}>
      <Back half={half} />
      <Npc loc="vkusno" position={[0.6, 0, 0.8]} />
      <mesh position={[0, 1.35, -4.6]}>
        <boxGeometry args={[8.4, 2.7, 2.4]} />
        <meshStandardMaterial color="#1a4a32" />
      </mesh>
      <mesh position={[0, 2.85, -4.55]}>
        <boxGeometry args={[8.6, 0.35, 2.6]} />
        <meshStandardMaterial color="#e8782c" />
      </mesh>
      <mesh position={[-1.6, 2.15, -3.35]}>
        <boxGeometry args={[0.18, 0.9, 0.12]} />
        <meshStandardMaterial color="#f0c040" emissive="#f0c040" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-1.35, 2.15, -3.35]}>
        <boxGeometry args={[0.18, 0.9, 0.12]} />
        <meshStandardMaterial color="#f0c040" emissive="#f0c040" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.95, 2.05, -3.32]}>
        <sphereGeometry args={[0.28, 12, 10]} />
        <meshStandardMaterial color="#e05030" emissive="#c03020" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[1.4, 0.7, -3.2]}>
        <boxGeometry args={[1.8, 1.1, 0.8]} />
        <meshStandardMaterial color="#c4a070" />
      </mesh>
      <Kit file="vending-machine.glb" position={[2.8, 0, -1.2]} scale={1} />
      <RuSign text="ВКУСНО И ТОЧКА" position={[0, 3.35, -3.3]} size={0.18} color="#f4ead8" />
    </PlazaShell>
  )
}
