import { useEffect, useState } from 'react'
import type { Snapshot } from 'xstate'
import { useMachine } from '@xstate/react'
import { hydroMachine } from './machine1'
import { sceneGroupId } from './machine/sceneGroup'
import ChallengeScene from './scenes/ChallengeScene'
import ProgressBar from './components/ProgressBar'
import { formatEndingProfileLine, resolveEndingProfile, categoryBackground } from './storyLogic'
import './App.css'

export { hydroMachine } from './machine1'

const STORAGE_KEY = 'wad-quiz-progress'

function loadSnapshot() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : undefined
  } catch {
    return undefined
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function snapshotHasProgress(s: any): boolean {
  if (!s || typeof s !== 'object') return false
  // if state value moved past the initial state
  if (typeof s.value === 'string' && s.value !== 'section_1') return true
  // object-valued state (parallel/compound) — assume progress
  if (s.value && typeof s.value === 'object') return true
  // non-zero score means progress
  const score = s.context?.score
  if (score) {
    if ((score.technical ?? 0) !== 0) return true
    if ((score.dedication ?? 0) !== 0) return true
    if ((score.social ?? 0) !== 0) return true
  }
  // other context flags that indicate progress
  if ((s.context?.debt_count ?? 0) > 0) return true
  if (s.context?.route_choice) return true
  if (s.context?.boot_mode) return true
  return !!(s.context?.accepted_exit_7 || s.context?.accepted_exit_8 || s.context?.accepted_exit_9 || s.context?.accepted_exit_10)
}

function ContinueDialog({ onContinue, onStartNew }: { onContinue: () => void; onStartNew: () => void }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-modal">
        <div className="dialog-media">
          {/* use Vite base URL so the image works whether app is hosted at root or under a sub-path */}
          <img src={`${import.meta.env.BASE_URL}locations/exterior_hull.webp`} alt="background" />
        </div>
        <div className="dialog-content">
          <h2 className="dialog-title">Welcome back!</h2>
          <p className="dialog-message">You have a saved progress. Would you like to continue or start from the beginning?</p>
          <div className="dialog-actions">
            <button className="dialog-btn dialog-btn--secondary" onClick={onStartNew}>
              Start from beginning
            </button>
            <button className="dialog-btn dialog-btn--primary" onClick={onContinue}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [showDialog, setShowDialog] = useState(false)
  // load snapshot once and keep stable reference so effect doesn't re-run
  const [savedSnapshot] = useState(() => loadSnapshot())

  useEffect(() => {
    if (snapshotHasProgress(savedSnapshot)) {
      // show dialog only when snapshot contains progress
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowDialog(true)
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If dialog is shown, render only the dialog. The machine (which uses hooks)
  // lives inside `MachineApp` so it is not initialized until after the
  // user made the choice.
  if (showDialog) {
    return (
      <ContinueDialog
        onContinue={() => {
          setShowDialog(false)
        }}
        onStartNew={() => {
          // clear saved progress and reload immediately to ensure the app
          // starts fresh (avoid mounting MachineApp with the old snapshot)
          localStorage.removeItem(STORAGE_KEY)
          location.reload()
        }}
      />
    )
  }

  return <MachineApp snapshot={savedSnapshot} />
}

function MachineApp({ snapshot }: { snapshot: unknown }) {
  const [rand] = useState(() => Math.random())
  const [state, send, actor] = useMachine(hydroMachine, {
    // cast snapshot to xstate Snapshot type
    snapshot: snapshot as unknown as Snapshot<unknown>,
  })
  const stateId = state.value as string
  const scene = Object.values(state.getMeta())[0]
  const groupId = sceneGroupId(stateId)

  useEffect(() => {
    // persist snapshot whenever state changes
    // include actor in deps if needed by linting rules
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actor.getPersistedSnapshot()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    location.reload()
  }

  // ── Final (ending) states ──────────────────────────────────────────────────
  if (state.status === 'done') {
    const endingProfile = resolveEndingProfile(state.context.score)
    return (
      <div className="ending fade-in">
        <div className="ending-banner" role="note">
          {/* KIRILL_BANNER_TEXT — replace with final copy from Kirill */}
          [PLACEHOLDER: ending banner text]
        </div>
        <h2 className="scene-title ending-title">{scene?.title}</h2>
        <div
          className="ending-profile"
          style={{ background: categoryBackground(endingProfile.category) }}
        >
          {formatEndingProfileLine(endingProfile)}
        </div>
        <p style={{ whiteSpace: 'pre-line', fontSize: 20, lineHeight: '160%' }}>
          {scene?.text ?? 'The shift is over.'}
        </p>
        <button className="restart-btn" onClick={reset}>Play Again</button>
      </div>
    )
  }

  if (!scene) return null

  return (
    <>
      <button className="restart-btn restart-btn--fixed" onClick={reset} aria-label="Restart">↺</button>
      <ProgressBar currentState={stateId} routeChoice={state.context.route_choice} />
      <ChallengeScene
        key={groupId}
        scene={scene}
        context={state.context as Record<string, unknown>}
        onComplete={(answer) => send({ type: 'NEXT', answer, rand })}
      />
    </>
  )
}
