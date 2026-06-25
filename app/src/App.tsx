import { useMachine } from '@xstate/react'
import { hydroMachine } from './machine'
import ChallengeScene from './scenes/ChallengeScene'
import type { YamlEndingData, YamlSceneData } from './types/story'
import './App.css'

export default function App() {
  const [state, send] = useMachine(hydroMachine)
  const stateId = state.value as string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = Object.values(state.getMeta())[0] as any

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    const endingMeta = meta as YamlEndingData | undefined
    const narrative = endingMeta?.ending.epilogue.narrative ?? 'The shift is over.'
    return (
      <div className="ending">
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {narrative}
        </p>
      </div>
    )
  }

  // ── Section pages ──────────────────────────────────────────────────────────
  if (!meta) return null

  const sceneMeta = meta as YamlSceneData
  return (
    <ChallengeScene
      key={stateId}
      scene={sceneMeta}
      onComplete={(answer) => send({ type: 'NEXT', answer })}
    />
  )
}
