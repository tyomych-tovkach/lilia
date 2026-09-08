import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState } from 'react'
import { districtOpen } from '../../logic'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { FONT, SPOTS } from '../layout'
import { WorldLabel } from '../WorldLabel'
import { Text } from '@react-three/drei'

export function BoardStation() {
  const { state, patch } = useInvite()
  const open = districtOpen(state, 2) && !state.saidYes
  const [noOff, setNoOff] = useState<[number, number]>([0.95, 0])

  const yesPos: [number, number, number] = [SPOTS.board[0] - 0.95, 0, SPOTS.board[2] + 1.15]
  const noPos: [number, number, number] = [SPOTS.board[0] + noOff[0], 0, SPOTS.board[2] + 1.15 + noOff[1]]

  return (
    <group>
      <RigidBody type="fixed" colliders={false} position={SPOTS.board}>
        <CuboidCollider args={[0.95, 1.2, 0.2]} position={[0, 1.2, -0.12]} />
      </RigidBody>
      <group position={SPOTS.board}>
        <mesh position={[0, 1.55, 0]}>
          <boxGeometry args={[2.05, 1.7, 0.14]} />
          <meshStandardMaterial
            color={state.crashed ? '#3a0510' : '#07140f'}
            emissive={state.crashed ? '#ff2244' : state.saidYes ? '#2dff9a' : '#0b3d22'}
            emissiveIntensity={state.crashed ? 1.5 : 0.7}
          />
        </mesh>
        <Text font={FONT} position={[0, 2.05, 0.1]} fontSize={0.14} color={state.crashed ? '#ff6b7a' : '#7dffb3'} anchorX="center">
          {state.crashed ? 'エラー' : '試合'}
        </Text>
        <WorldLabel position={[0, 1.55, 0.12]} color="#f8ffe8">
          Лилия · Темыч
        </WorldLabel>
        <WorldLabel position={[0, 1.22, 0.12]} color="#ffd27a">
          {state.crashed ? 'BUG' : '12.09.2026'}
        </WorldLabel>
      </group>

      {open && !state.crashed && (
        <>
          <Interactable
            id="yes"
            position={yesPos}
            color="#3dff8a"
            radius={1.05}
            onInteract={() => patch({ saidYes: true, crashed: false, phase: 'date' })}
          >
            <mesh position={[0, 0.48, 0]}>
              <sphereGeometry args={[0.24, 16, 16]} />
              <meshStandardMaterial color="#3dff8a" emissive="#1dff88" emissiveIntensity={1.3} />
            </mesh>
            <WorldLabel position={[0, 0.9, 0]} color="#7dffb3">
              Да
            </WorldLabel>
          </Interactable>
          <Interactable
            id="no"
            position={noPos}
            color="#ff4d6d"
            radius={1.05}
            onInteract={() => {
              if (state.noAttempts === 0) {
                patch({ noAttempts: 1 })
                setNoOff([1.05, -0.55])
                return
              }
              patch({ noAttempts: state.noAttempts + 1, crashed: true, phase: 'crash' })
            }}
          >
            <mesh position={[0, 0.48, 0]}>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial color="#ff4d6d" emissive="#ff2244" emissiveIntensity={1} />
            </mesh>
            <WorldLabel position={[0, 0.88, 0]} color="#ffb0bc">
              {state.noAttempts === 0 ? 'Нет' : 'почти'}
            </WorldLabel>
          </Interactable>
        </>
      )}

      {state.crashed && (
        <Interactable
          id="restore"
          position={[SPOTS.board[0], 0, SPOTS.board[2] + 1.25]}
          color="#ffe066"
          radius={1.35}
          onInteract={() => patch({ crashed: false, restored: true, saidYes: true, phase: 'date' })}
        >
          <mesh position={[0, 0.75, 0]}>
            <octahedronGeometry args={[0.36]} />
            <meshStandardMaterial color="#ffe066" emissive="#ffb020" emissiveIntensity={1.8} />
          </mesh>
          <WorldLabel position={[0, 1.28, 0]} color="#ffe066">
            Да · починить
          </WorldLabel>
        </Interactable>
      )}
    </group>
  )
}
