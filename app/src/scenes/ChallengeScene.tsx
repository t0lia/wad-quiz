import { useState, useEffect, useRef, useMemo } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'
import DialogueBlock from './DialogueBlock'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Components } from 'react-markdown'

type Props = {
  scene: ChallengeSceneData
  onComplete: (answer?: string) => void
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

export default function ChallengeScene({ scene, onComplete }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [revealedContent, setRevealedContent] = useState(1) // text always shown first
  const [taskRevealed, setTaskRevealed] = useState(false)
  const [dialogueDone, setDialogueDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const contentBlocks = useMemo<ContentBlock[]>(() => {
    const b: ContentBlock[] = ['text']
    if (scene.dialogue?.length) b.push('dialogue')
    return b
  }, [scene.dialogue])

  const isTapTask =
    scene.task.type === 'one_tap_forward' ||
    (scene.task.type === 'text_scene' && !scene.task.choices)

  const allContentRevealed = revealedContent >= contentBlocks.length
  const lastContent = contentBlocks[revealedContent - 1]
  const waitingForDialogue = lastContent === 'dialogue' && !dialogueDone
  const showHint = !submitted && !taskRevealed && !waitingForDialogue

  function handleSubmit(a?: string) {
    setSubmitted(true)
    onComplete(a)
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
  }, [revealedContent, taskRevealed, dialogueDone])

  return (
    <div className="scene">
      {scene.image && <img className="scene-image" src={scene.image} alt="" />}
      {scene.title && <h2 className="scene-title">{scene.title}</h2>}

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

      <div ref={bottomRef} />
    </div>
  )
}
