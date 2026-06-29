import { useState } from 'react'
import type { ChallengeSceneData } from '../types/story'
import TaskRouter from '../tasks/TaskRouter'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { Components } from 'react-markdown'

type Props = {
  scene: ChallengeSceneData
  /** Called when the user completes the task; answer carries optional payload (e.g. first block for git task). */
  onComplete: (answer?: string) => void
}

const mdComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (match) {
      return (
        <SyntaxHighlighter language={match[1]} style={isDark ? oneDark : oneLight} PreTag="div">
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    }
    return <code className={className} {...props}>{children}</code>
  },
}

export default function ChallengeScene({ scene, onComplete }: Props) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(a?: string) {
    setSubmitted(true)
    onComplete(a)
  }

  return (
    <div className="scene">
      <div className="scene-text">
        <ReactMarkdown components={mdComponents}>{scene.text}</ReactMarkdown>
      </div>
      <TaskRouter task={scene.task} submitted={submitted} onSubmit={handleSubmit} />
    </div>
  )
}
