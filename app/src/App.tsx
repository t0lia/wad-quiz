import { useMachine } from '@xstate/react'
import { hydroMachine } from './machine'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

export default function App() {
  const [state, send] = useMachine(hydroMachine)
  const stateId = state.value as string
  const scene = Object.values(state.getMeta())[0]
  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    return (
      <div className="ending">
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {scene?.text ?? 'The shift is over.'}
        </p>
      </div>
    )
  }

  // ── Task pages ─────────────────────────────────────────────────────────────
  if (!scene) return null

  return (
    <ChallengeScene
      key={stateId}
      scene={scene}
      onComplete={(answer) => send({ type: 'NEXT', answer })}
    />
  )
}
