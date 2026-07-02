import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import type { DialogueLine } from '../types/story'
import './DialogueBlock.css'

const CHAR_SPEED = 12
const LINE_PAUSE = 280

const inlineComponents: Components = {
  p: ({ children }) => <>{children}</>,
}

type Props = { lines: DialogueLine[]; onComplete?: () => void; instant?: boolean }

// `instant` renders every line fully typed immediately, for scenes that have
// already been resolved (scrolled past) — the ticking effects and onComplete
// simply no-op in that mode instead of ever running.
export default function DialogueBlock({ lines, onComplete, instant = false }: Props) {
  const [typingLine, setTypingLine] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const completedRef = useRef(false)

  const currentText = lines[typingLine]?.text ?? ''
  const currentLineDone = charCount >= currentText.length
  const allDone = typingLine >= lines.length

  // Tick: advance character count
  useEffect(() => {
    if (instant || allDone || currentLineDone) return
    const t = setTimeout(() => setCharCount(c => c + 1), CHAR_SPEED)
    return () => clearTimeout(t)
  }, [instant, allDone, currentLineDone, charCount])

  // Advance to next line, or fire onComplete when last line finishes
  useEffect(() => {
    if (instant || !currentLineDone) return
    if (typingLine >= lines.length - 1) {
      if (!completedRef.current) {
        completedRef.current = true
        onComplete?.()
      }
      return
    }
    const t = setTimeout(() => {
      setTypingLine(l => l + 1)
      setCharCount(0)
    }, LINE_PAUSE)
    return () => clearTimeout(t)
  }, [instant, currentLineDone, typingLine, lines.length, onComplete])

  function skipToEnd() {
    setTypingLine(lines.length - 1)
    setCharCount(lines[lines.length - 1]?.text.length ?? 0)
  }

  return (
    <div className="dialogue" onClick={instant ? undefined : skipToEnd} style={instant ? undefined : { cursor: 'pointer' }}>
      {lines.map((line, i) => {
        if (!instant && i > typingLine) return null
        const lineDone = instant || i < typingLine || (i === typingLine && currentLineDone)
        const displayed = lineDone ? line.text : line.text.slice(0, charCount)

        return (
          <div key={i} className={`dialogue-line dialogue-line--${line.speaker}`}>
            <span className="dialogue-speaker">{line.speaker}</span>
            <span className="dialogue-text">
              {lineDone
                ? <ReactMarkdown components={inlineComponents}>{line.text}</ReactMarkdown>
                : <>{displayed}<span className="dialogue-cursor" /></>
              }
            </span>
          </div>
        )
      })}
    </div>
  )
}
