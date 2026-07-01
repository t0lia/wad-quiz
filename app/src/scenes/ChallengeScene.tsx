import { useState, useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'
import SingleChoice from '../tasks/SingleChoice'
import DialogueBlock from './DialogueBlock'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Components } from 'react-markdown'

type Props = {
  scene: ChallengeSceneData
  onComplete: (answer?: string) => void
}

// Scene image paths are stored as root-absolute ('/locations/x.png') since they
// reference app/public/ directly, but GitHub Pages deploys under a per-branch
// subpath — re-root them under Vite's configured base so they resolve there too.
function withBase(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

const mdComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (match) {
      return (
        <SyntaxHighlighter language={match[1]} style={isDark ? oneDark : oneLight} PreTag="div" customStyle={{ fontSize: '11px' }}>
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    }
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
export default function ChallengeScene({ scene, onComplete }: Props) {
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

  return (
    <div className="scene fade-in">
      {first.image && <img className="scene-image" src={withBase(first.image)} alt="" />}
      {first.title && <h2 className="scene-title">{first.title}</h2>}

      {segments.map((seg, i) =>
        i === segments.length - 1 ? (
          <ActiveSegment key={seg.scene.id} scene={seg.scene} onSubmit={handleSegmentComplete} bottomRef={bottomRef} />
        ) : (
          <ResolvedSegment key={seg.scene.id} scene={seg.scene} answer={seg.answer} />
        )
      )}

      <div ref={bottomRef} />
    </div>
  )
}

type ActiveProps = {
  scene: ChallengeSceneData
  onSubmit: (answer?: string) => void
  bottomRef: RefObject<HTMLDivElement | null>
}

// The current, interactive segment — tap reveals text, then dialogue, then
// the task widget (or submits directly for tap-only tasks).
function ActiveSegment({ scene, onSubmit, bottomRef }: ActiveProps) {
  const [submitted, setSubmitted] = useState(false)
  const [revealedContent, setRevealedContent] = useState(1) // text always shown first
  const [taskRevealed, setTaskRevealed] = useState(false)
  const [dialogueDone, setDialogueDone] = useState(false)

  const contentBlocks: ContentBlock[] = scene.dialogue?.length ? ['text', 'dialogue'] : ['text']

  const isTapTask =
    scene.task.type === 'one_tap_forward' ||
    (scene.task.type === 'text_scene' && !scene.task.choices)

  const allContentRevealed = revealedContent >= contentBlocks.length
  const lastContent = contentBlocks[revealedContent - 1]
  const waitingForDialogue = lastContent === 'dialogue' && !dialogueDone
  const showHint = !submitted && !taskRevealed && !waitingForDialogue

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
    } else {
      setTaskRevealed(true)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [revealedContent, taskRevealed, dialogueDone, bottomRef])

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

      {/* Task — revealed after all content, only for non-tap tasks */}
      {taskRevealed && (
        <div className="block-enter">
          <TaskRouter task={scene.task} submitted={submitted} onSubmit={handleSubmit} />
        </div>
      )}

      {/* Tap hint — full-width button, safe tap target on mobile */}
      {showHint && (
        <button className="tap-hint" onClick={advanceBlock}>
          {allContentRevealed && isTapTask ? 'next' : 'tap to continue'}
        </button>
      )}
    </>
  )
}

type ResolvedProps = { scene: ChallengeSceneData; answer?: string }

// A past segment within the current scene — fully revealed, frozen in place.
// Only single_choice tasks (the only interactive task type actually in use)
// render a widget here, disabled and showing the answer that was picked.
function ResolvedSegment({ scene, answer }: ResolvedProps) {
  return (
    <div className="segment-resolved">
      <div className="scene-text">
        <ReactMarkdown components={mdComponents}>{scene.text}</ReactMarkdown>
      </div>
      {scene.dialogue?.length ? <DialogueBlock lines={scene.dialogue} instant /> : null}
      {scene.task.type === 'single_choice' && (
        <SingleChoice task={scene.task} submitted readOnly selectedAnswer={answer} onSubmit={() => {}} />
      )}
    </div>
  )
}
