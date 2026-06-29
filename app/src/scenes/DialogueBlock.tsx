import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import type { DialogueLine } from '../types/story'
import './DialogueBlock.css'

const CHAR_SPEED = 12
const LINE_PAUSE = 280

const inlineComponents: Components = {
  p: ({ children }) => <>{children}</>,
}

export default function DialogueBlock({ lines }: { lines: DialogueLine[] }) {
  const [typingLine, setTypingLine] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const currentText = lines[typingLine]?.text ?? ''
  const currentLineDone = charCount >= currentText.length
  const allDone = typingLine >= lines.length

  useEffect(() => {
    if (allDone || currentLineDone) return
    const t = setTimeout(() => setCharCount(c => c + 1), CHAR_SPEED)
    return () => clearTimeout(t)
  }, [allDone, currentLineDone, charCount])

  useEffect(() => {
    if (!currentLineDone || typingLine >= lines.length - 1) return
    const t = setTimeout(() => {
      setTypingLine(l => l + 1)
      setCharCount(0)
    }, LINE_PAUSE)
    return () => clearTimeout(t)
  }, [currentLineDone, typingLine, lines.length])

  return (
    <div className="dialogue">
      {lines.map((line, i) => {
        if (i > typingLine) return null
        const lineDone = i < typingLine || (i === typingLine && currentLineDone)
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
