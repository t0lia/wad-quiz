import { useState, useRef } from 'react'
import type { SwipeCardsTask } from '../types/story'

type Props = { task: SwipeCardsTask; submitted: boolean; onSubmit: () => void }

const SWIPE_THRESHOLD = 80

export default function SwipeCards({ task, submitted, onSubmit }: Props) {
  const [index, setIndex] = useState(0)
  const [swipeX, setSwipeX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)

  const card = task.cards[index]

  function advance() {
    if (index === task.cards.length - 1) onSubmit()
    else setIndex((i) => i + 1)
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (submitted || task.options.length < 2) return
    e.currentTarget.setPointerCapture(e.pointerId)
    startXRef.current = e.clientX
    setDragging(true)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return
    setSwipeX(e.clientX - startXRef.current)
  }

  function handlePointerUp() {
    if (!dragging) return
    setDragging(false)
    if (swipeX > SWIPE_THRESHOLD || swipeX < -SWIPE_THRESHOLD) advance()
    setSwipeX(0)
  }

  if (!card) return null

  return (
    <>
      <div className="card-progress">{index + 1} / {task.cards.length}</div>
      <div
        className={`swipe-card${dragging ? ' swiping' : ''}`}
        style={{ transform: dragging ? `translateX(${swipeX}px) rotate(${swipeX * 0.04}deg)` : undefined }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { setDragging(false); setSwipeX(0) }}
      >
        <p className="card-content">{card.content}</p>
        {Object.keys(card.meta).length > 0 && (
          <ul className="card-meta">
            {Object.entries(card.meta).map(([k, v]) => (
              <li key={k}><span className="meta-key">{k}:</span> {v}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="bucket-btns">
        {task.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="bucket-btn"
            onClick={advance}
            disabled={submitted}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </>
  )
}
