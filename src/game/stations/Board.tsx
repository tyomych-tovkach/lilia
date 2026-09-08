import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState } from 'react'
import { arcadeComplete } from '../../logic'
import { useInvite } from '../../state'
import { Interactable } from '../Interactable'
import { Kit } from '../Kit'
import { SPOTS } from '../layout'

export function BoardStation() {
  const { state, patch } = useInvite()
  const open = arcadeComplete(state) && !state.saidYes
  const [noOff, setNoOff] = useState<[number, number]>([1.35, 0])

  return (
    <group>
      <RigidBody type="fixed" colliders={false} position={SPOTS.board}>
        <CuboidCollider args={[1.4, 1.6, 0.35]} position={[0, 1.6, -0.2]} />
      </RigidBody>
      <Kit file="arcade-machine.glb" position={[SPOTS.board[0] - 2.4, 0, SPOTS.board[2]]} scale={1.55} />
      <Kit file="prize-wheel.glb" position={[SPOTS.board[0] + 2.5, 0, SPOTS.board[2]]} scale={1.45} />
      <group position={SPOTS.board}>
        <mesh position={[0, 2.15, 0]}>
          <boxGeometry args={[4.6, 2.4, 0.22]} />
          <meshStandardMaterial
            color={state.crashed ? '#3a0510' : '#07140f'}
            emissive={state.crashed ? '#ff2244' : state.saidYes ? '#2dff9a' : '#0b3d22'}
            emissiveIntensity={state.crashed ? 1.5 : 0.7}
          />
        </mesh>
        <Text position={[0, 2.55, 0.14]} fontSize={0.22} color={state.crashed ? '#ff6b7a' : '#7dffb3'} anchorX="center">
          {state.crashed ? 'ERROR / BUG' : 'SECOND HALF'}
        </Text>
        <Text position={[0, 2.1, 0.14]} fontSize={0.28} color="#f8ffe8" anchorX="center">
          ЛИЛИЯ  ?  ТЕМЫЧ
        </Text>
        <Text position={[0, 1.62, 0.14]} fontSize={0.16} color="#ffd27a" anchorX="center">
          {state.crashed ? 'BUG DETECTED' : '12.09.2026  KRASNODAR'}
        </Text>
      </group>

      {open && !state.crashed && (
        <>
          <Interactable
            id="yes"
            position={[SPOTS.board[0] - 1.2, 0, SPOTS.board[2] + 1.6]}
            color="#3dff8a"
            onInteract={() => patch({ saidYes: true, crashed: false, phase: 'date' })}
          >
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.38, 16, 16]} />
              <meshStandardMaterial color="#3dff8a" emissive="#1dff88" emissiveIntensity={1.3} />
            </mesh>
            <Text position={[0, 1.25, 0]} fontSize={0.22} color="#041018" anchorX="center">
              ДА
            </Text>
          </Interactable>
          <Interactable
            id="no"
            position={[SPOTS.board[0] + noOff[0], 0, SPOTS.board[2] + 1.6 + noOff[1]]}
            color="#ff4d6d"
            onInteract={() => {
              if (state.noAttempts === 0) {
                patch({ noAttempts: 1 })
                setNoOff([2.8, -1.1])
                return
              }
              patch({ noAttempts: state.noAttempts + 1, crashed: true, phase: 'crash' })
            }}
          >
            <mesh position={[0, 0.7, 0]}>
              <sphereGeometry args={[0.34, 16, 16]} />
              <meshStandardMaterial color="#ff4d6d" emissive="#ff2244" emissiveIntensity={1} />
            </mesh>
            <Text position={[0, 1.22, 0]} fontSize={0.18} color="#fff" anchorX="center">
              {state.noAttempts === 0 ? 'НЕТ' : 'почти'}
            </Text>
          </Interactable>
        </>
      )}

      {state.crashed && (
        <Interactable
          id="restore"
          position={[SPOTS.board[0], 0, SPOTS.board[2] + 2.2]}
          color="#ffe066"
          radius={2.1}
          onInteract={() => patch({ crashed: false, restored: true, saidYes: true, phase: 'date' })}
        >
          <mesh position={[0, 1.1, 0]}>
            <octahedronGeometry args={[0.7]} />
            <meshStandardMaterial color="#ffe066" emissive="#ffb020" emissiveIntensity={1.8} />
          </mesh>
          <Text position={[0, 2.05, 0]} fontSize={0.2} color="#fff4dc" anchorX="center">
            ДА
          </Text>
        </Interactable>
      )}
    </group>
  )
}
