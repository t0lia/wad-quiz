import { useMachine } from '@xstate/react'
import { useState } from 'react'
import { hydroMachine } from './machine'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

type Archetype = {
  name: string
  grade: string
  color: string
}

function calculateArchetype(tek: number, ded: number, soc: number): Archetype {
  // Convert to boolean (1 if >= threshold, 0 if < threshold)
  // Using a simple heuristic: if value > 0, treat as true
  const tekBool = tek > 0 ? 1 : 0
  const dedBool = ded > 0 ? 1 : 0
  const socBool = soc > 0 ? 1 : 0

  // Determine archetype based on combination
  if (dedBool && tekBool && socBool) {
    return { name: 'True leader', grade: 'A', color: '#4A90E2' }
  } else if (dedBool && tekBool && !socBool) {
    return { name: 'Cyborg', grade: 'A', color: '#4A90E2' }
  } else if (dedBool && !tekBool && socBool) {
    return { name: 'Loyalist', grade: 'B', color: '#7CB342' }
  } else if (dedBool && !tekBool && !socBool) {
    return { name: 'Workaholic', grade: 'B', color: '#7CB342' }
  } else if (!dedBool && tekBool && socBool) {
    return { name: '9-5er', grade: 'B', color: '#7CB342' }
  } else if (!dedBool && tekBool && !socBool) {
    return { name: 'Theorist', grade: 'B', color: '#7CB342' }
  } else if (!dedBool && !tekBool && socBool) {
    return { name: 'Water cooler dweller', grade: 'C', color: '#FBC02D' }
  } else {
    return { name: 'Slacker', grade: 'C', color: '#FBC02D' }
  }
}

export default function App() {
  const [rand] = useState<number>(() => Math.random())
  const [state, send] = useMachine(hydroMachine)
  const stateId = state.value as string
  const scene = Object.values(state.getMeta())[0]

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    const archetype = calculateArchetype(
      state.context.tek_score || 0,
      state.context.ded_score || 0,
      state.context.soc_score || 0
    )

    return (
      <div className="ending">
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {scene?.text ?? 'The shift is over.'}
        </p>
        <div
          style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: '#f5f5f5',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: '0 0 20px 0' }}>Your Profile</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              marginBottom: 30,
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Technical</div>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>
                {state.context.tek_score || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Dedication</div>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>
                {state.context.ded_score || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#666' }}>Social Capital</div>
              <div style={{ fontSize: 28, fontWeight: 'bold' }}>
                {state.context.soc_score || 0}
              </div>
            </div>
          </div>
          <div
            style={{
              padding: 20,
              backgroundColor: archetype.color,
              color: 'white',
              borderRadius: 8,
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 8 }}>Archetype</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
              {archetype.name}
            </div>
            <div style={{ fontSize: 18 }}>Grade: {archetype.grade}</div>
          </div>
        </div>
      </div>
    )
  }

  // ── Task pages ─────────────────────────────────────────────────────────────
  if (!scene) return null

  return (
    <ChallengeScene
      key={stateId}
      scene={scene}
      onComplete={(answer) => send({ type: 'NEXT', answer, rand })}
    />
  )
}

