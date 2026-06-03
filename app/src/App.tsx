import { useMachine } from '@xstate/react'
import { hydroMachine, TEXT_STATES } from './machine'
import { textScenes, taskScenes } from './scenario'
import ChallengeScene from './scenes/ChallengeScene'
import TextScene from './scenes/TextScene'
import './App.css'

export default function App() {
  const [state, send] = useMachine(hydroMachine)
  const stateId = state.value as string

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    const ending = textScenes[stateId]
    return (
      <div className="ending">
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {ending?.text ?? 'The shift is over.'}
        </p>
      </div>
    )
  }

  // ── Text-only pages ────────────────────────────────────────────────────────
  if (TEXT_STATES.has(stateId)) {
    const scene = textScenes[stateId]
    if (!scene) return null
    return (
      <TextScene
        key={stateId}
        scene={scene}
        onChoice={(event) => send({ type: event })}
      />
    )
  }

  // ── Task pages ─────────────────────────────────────────────────────────────
  const scene = taskScenes[stateId]
  if (!scene) return null

  return (
    <ChallengeScene
      key={stateId}
      scene={scene}
      onComplete={(answer) => send({ type: 'NEXT', answer })}
    />
  )
}
