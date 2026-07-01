import { useEffect } from 'react'
import { useMachine } from '@xstate/react'
import { hydroMachine } from './machine'
import { sceneGroupId } from './machine/sceneGroup'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

const STORAGE_KEY = 'wad-quiz-progress'

function loadSnapshot() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : undefined
  } catch {
    return undefined
  }
}

function reset() {
  localStorage.removeItem(STORAGE_KEY)
  location.reload()
}

export default function App() {
  const [state, send, actor] = useMachine(hydroMachine, {
    snapshot: loadSnapshot(),
  })
  const stateId = state.value as string
  const scene = Object.values(state.getMeta())[0]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actor.getPersistedSnapshot()))
  }, [state])

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    const { technical, dedication, social } = state.context.score
    return (
      <div className="ending fade-in">
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {scene?.text ?? 'The shift is over.'}
        </p>
        <dl className="score-summary">
          <div className="score-summary__row">
            <dt>Technical</dt>
            <dd>{technical}</dd>
          </div>
          <div className="score-summary__row">
            <dt>Dedication</dt>
            <dd>{dedication}</dd>
          </div>
          <div className="score-summary__row">
            <dt>Social Capital</dt>
            <dd>{social}</dd>
          </div>
        </dl>
        <button className="restart-btn" onClick={reset}>play again</button>
      </div>
    )
  }

  // ── Task pages ─────────────────────────────────────────────────────────────
  if (!scene) return null

  return (
    <>
      <button className="restart-btn restart-btn--fixed" onClick={reset} aria-label="Restart">↺</button>
      <ChallengeScene
        key={sceneGroupId(stateId)}
        scene={scene}
        onComplete={(answer) => send({ type: 'NEXT', answer })}
      />
    </>
  )
}
