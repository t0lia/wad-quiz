import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'
import SingleChoice from '../tasks/SingleChoice'
import DialogueBlock from './DialogueBlock'
import { evaluateStoryCondition } from '../storyLogic'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

// Note: a previous version of this file imported `react-syntax-highlighter` here
// for fenced-code blocks. Removing it cut ~750 KB from the production bundle
// (refractor/all pulls 200+ Prism grammars eagerly, and `sideEffects` in
// refractor/package.json prevents Rollup from tree-shaking them). The shipped
// narrative YAML contains only inline backticks (`sector-link`), never fenced
// blocks, so `SyntaxHighlighter` was unreachable dead code.

type Props = {
  scene: ChallengeSceneData
  context: Record<string, unknown>
  onComplete: (answer?: string) => void
}

// Scene image paths are stored as root-absolute ('/locations/x.png') since they
// reference app/public/ directly, but GitHub Pages deploys under a per-branch
// subpath — re-root them under Vite's configured base so they resolve there too.
function withBase(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

const mdComponents: Components = {
  // Plain inline `<code>` styling — fenced-code highlighting was removed
  // along with the react-syntax-highlighter import above. Production content
  // uses only inline backticks, so this branch is the one that actually runs.
  code({ className, children, ...props }) {
    return <code className={className} {...props}>{children}</code>
  },
}

type ContentBlock = 'text' | 'dialogue'
type Segment = { scene: ChallengeSceneData; answer?: string }

// A narrative "scene" (per text/scene_graph.md) spans several machine states
// — intro, task, conclusion. Each state's ChallengeSceneData becomes one
// segment here; only the last (current) segment is interactive, earlier ones
// stay frozen above it. App.tsx only remounts this component when the story
// moves to a genuinely different scene (see machine/sceneGroup.ts), so image
// and title — identical across every state within one scene — are rendered
// once from the first segment rather than repeated per segment.
function buildTaskIntro(scene: ChallengeSceneData, context: Record<string, unknown>) {
  const conditionalText = (scene.conditionalTaskIntro ?? [])
    .filter((entry) => evaluateStoryCondition(context, entry.condition))
    .map((entry) => entry.text)

  const parts = [...conditionalText]
  if (scene.taskIntro) {
    parts.push(scene.taskIntro)
  }

  return parts.join('\n\n')
}

export default function ChallengeScene({ scene, context, onComplete }: Props) {
  const [segments, setSegments] = useState<Segment[]>(() => [{ scene }])
  const bottomRef = useRef<HTMLDivElement>(null)

  // Adjust state during render when the `scene` prop advances to a new state
  // within the same narrative scene (React's documented pattern for deriving
  // state from a changed prop — see "You Might Not Need an Effect"). Avoids
  // an extra effect-triggered render pass.
  const lastSegment = segments[segments.length - 1]
  if (lastSegment.scene.id !== scene.id) {
    setSegments(prev => [...prev, { scene }])
  }

  function handleSegmentComplete(answer?: string) {
    setSegments(prev => {
      const copy = prev.slice()
      copy[copy.length - 1] = { ...copy[copy.length - 1], answer }
      return copy
    })
    onComplete(answer)
  }

  const first = segments[0].scene

  const renderImage = (imagePath: string) => {
    // Convert .webp to .jpg for fallback
    const jpegPath = imagePath.replace(/\.webp$/, '.jpg')
    return (
      <picture>
        <source srcSet={withBase(imagePath)} type="image/webp" />
        <img className="scene-image" src={withBase(jpegPath)} alt="" loading="lazy" decoding="async" />
      </picture>
    )
  }

  return (
    <div className="scene fade-in">
      {first.image ? renderImage(first.image) : null}
      {first.title && <h2 className="scene-title">{first.title}</h2>}

      {segments.map((seg, i) =>
        i === segments.length - 1 ? (
          <ActiveSegment key={seg.scene.id} scene={seg.scene} context={context} onSubmit={handleSegmentComplete} bottomRef={bottomRef} />
        ) : (
          <ResolvedSegment key={seg.scene.id} scene={seg.scene} context={context} answer={seg.answer} />
        )
      )}

      <div ref={bottomRef} />
    </div>
  )
}

type ActiveProps = {
  scene: ChallengeSceneData
  context: Record<string, unknown>
  onSubmit: (answer?: string) => void
  bottomRef: RefObject<HTMLDivElement | null>
}

// The current, interactive segment — tap reveals text, then dialogue, then
// the task widget (or submits directly for tap-only tasks).
function ActiveSegment({ scene, context, onSubmit, bottomRef }: ActiveProps) {
  const [submitted, setSubmitted] = useState(false)
  const [revealedContent, setRevealedContent] = useState(1) // text always shown first
  const [dialogueDone, setDialogueDone] = useState(false)
  const taskIntro = buildTaskIntro(scene, context)

  const contentBlocks: ContentBlock[] = scene.dialogue?.length ? ['text', 'dialogue'] : ['text']

  const isTapTask =
    scene.task.type === 'one_tap_forward' ||
    (scene.task.type === 'text_scene' && !scene.task.choices)

  const allContentRevealed = revealedContent >= contentBlocks.length
  const lastContent = contentBlocks[revealedContent - 1]
  const waitingForDialogue = lastContent === 'dialogue' && !dialogueDone
  // The task widget appears as soon as its supporting text/dialogue is fully
  // revealed — no extra tap needed to summon the answer options.
  const showTask = allContentRevealed && !waitingForDialogue && !isTapTask
  const showHint = !submitted && !waitingForDialogue && (!allContentRevealed || isTapTask)

  function handleSubmit(a?: string) {
    setSubmitted(true)
    onSubmit(a)
  }

  function advanceBlock() {
    if (submitted || waitingForDialogue) return
    if (!allContentRevealed) {
      setRevealedContent(c => c + 1)
    } else if (isTapTask) {
      handleSubmit()
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [revealedContent, showTask, dialogueDone, bottomRef])

  return (
    <>
      {/* Text — always first */}
      <div className="block-enter">
        <div className="scene-text">
          <ReactMarkdown components={mdComponents}>{scene.text}</ReactMarkdown>
        </div>
      </div>

      {/* Dialogue — revealed after first tap */}
      {revealedContent >= 2 && scene.dialogue?.length && (
        <div className="block-enter">
          <DialogueBlock lines={scene.dialogue} onComplete={() => setDialogueDone(true)} />
        </div>
      )}

      {/* Task — appears as soon as its text/dialogue is fully revealed */}
      {showTask && (
        <div className="block-enter">
          {taskIntro ? (
            <div className="scene-text">
              <ReactMarkdown components={mdComponents}>{taskIntro}</ReactMarkdown>
            </div>
          ) : null}
          <TaskRouter task={scene.task} submitted={submitted} onSubmit={handleSubmit} />
        </div>
      )}

      {/* Tap hint — full-width button, safe tap target on mobile */}
      {showHint && (
        <button className="tap-hint" onClick={advanceBlock}>
          {allContentRevealed && scene.task.type === 'text_scene' ? 'next' : 'tap to continue'}
        </button>
      )}
    </>
  )
}

type ResolvedProps = { scene: ChallengeSceneData; context: Record<string, unknown>; answer?: string }

// A past segment within the current scene — fully revealed, frozen in place.
// Only single_choice tasks (the only interactive task type actually in use)
// render a widget here, disabled and showing the answer that was picked.
function ResolvedSegment({ scene, context, answer }: ResolvedProps) {
  const taskIntro = buildTaskIntro(scene, context)

  return (
    <div className="segment-resolved">
      <div className="scene-text">
        <ReactMarkdown components={mdComponents}>{scene.text}</ReactMarkdown>
      </div>
      {scene.dialogue?.length ? <DialogueBlock lines={scene.dialogue} instant /> : null}
      {taskIntro ? (
        <div className="scene-text">
          <ReactMarkdown components={mdComponents}>{taskIntro}</ReactMarkdown>
        </div>
      ) : null}
      {scene.task.type === 'single_choice' && (
        <SingleChoice task={scene.task} submitted readOnly selectedAnswer={answer} onSubmit={() => {}} />
      )}
    </div>
  )
}
