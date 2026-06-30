import { useMachine } from '@xstate/react'
import { useEffect, useRef } from 'react'
import { hydroMachine } from './machine'
import type { ChallengeSceneData } from './types/story'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

type HistoryEntry = { stateId: string; scene: ChallengeSceneData }

export default function App() {
  const [state, send] = useMachine(hydroMachine)
  const stateId = state.value as string
  const scene = Object.values(state.getMeta())[0] as ChallengeSceneData | undefined
  const historyRef = useRef<HistoryEntry[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [stateId])

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    return (
      <div className="scroll-feed">
        {historyRef.current.map((entry) => (
          <ChallengeScene key={entry.stateId} scene={entry.scene} frozen onComplete={() => {}} />
        ))}
        <div className="scene ending-scene">
          <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
            {scene?.text ?? 'The shift is over.'}
          </p>
        </div>
        <div ref={bottomRef} />
      </div>
    )
  }

  // ── Task pages ─────────────────────────────────────────────────────────────
  if (!scene) return null

  return (
    <div className="scroll-feed">
      {historyRef.current.map((entry) => (
        <ChallengeScene key={entry.stateId} scene={entry.scene} frozen onComplete={() => {}} />
      ))}
      <ChallengeScene
        key={stateId}
        scene={scene}
        onComplete={(answer) => {
          historyRef.current = [...historyRef.current, { stateId, scene }]
          send({ type: 'NEXT', answer })
        }}
      />
      <div ref={bottomRef} />
    </div>
  )
}
