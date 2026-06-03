import { useState, useRef } from 'react'
import type { SwipeCardsTask } from '../types/story'

type Props = { task: SwipeCardsTask; submitted: boolean; onSubmit: () => void }

const SWIPE_THRESHOLD = 80

export default function SwipeCards({ task, submitted, onSubmit }: Props) {
  const [index, setIndex] = useState(0)
  const [swipeX, setSwipeX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flyDir, setFlyDir] = useState<'left' | 'right' | null>(null)
  const [decisions, setDecisions] = useState<{ cardId: string; optionLabel: string; dir: 'left' | 'right' }[]>([])
  const startXRef = useRef(0)

  const card = task.cards[index]
  const leftOption = task.options[0]
  const rightOption = task.options[task.options.length - 1]

  const swipeProgress = Math.min(Math.abs(swipeX) / SWIPE_THRESHOLD, 1)
  const leftOpacity = swipeX < 0 ? 0.25 + swipeProgress * 0.75 : 0.25
  const rightOpacity = swipeX > 0 ? 0.25 + swipeProgress * 0.75 : 0.25

  function decide(dir: 'left' | 'right', optionLabel: string) {
    setDecisions((prev) => [...prev, { cardId: card.id, optionLabel, dir }])
    setFlyDir(dir)
  }

  function advance() {
    setFlyDir(null)
    setIndex((i) => {
      if (i === task.cards.length - 1) { onSubmit(); return i }
      return i + 1
    })
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (submitted || flyDir) return
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
    if (swipeX > SWIPE_THRESHOLD) decide('right', rightOption.label)
    else if (swipeX < -SWIPE_THRESHOLD) decide('left', leftOption.label)
    setSwipeX(0)
  }

  if (!card) return null

  const cardStyle = dragging
    ? { transform: `translateX(${swipeX}px) rotate(${swipeX * 0.04}deg)` }
    : undefined

  return (
    <>
      <div className="card-progress">{index + 1} / {task.cards.length}</div>

      <div className="swipe-hints">
        <span className="swipe-hint" style={{ opacity: leftOpacity }}>← {leftOption.label}</span>
        <span className="swipe-hint" style={{ opacity: rightOpacity }}>{rightOption.label} →</span>
      </div>

      <div
        className={['swipe-card', dragging ? 'swiping' : '', flyDir ? `fly-${flyDir}` : ''].filter(Boolean).join(' ')}
        style={cardStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { setDragging(false); setSwipeX(0) }}
        onAnimationEnd={() => { if (flyDir) advance() }}
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
        {task.options.map((opt, i) => {
          const dir = i === 0 ? 'left' : 'right'
          return (
            <button
              key={opt.id}
              type="button"
              className="bucket-btn"
              onClick={() => decide(dir, opt.label)}
              disabled={submitted || !!flyDir}
            >
              {i === 0 ? `← ${opt.label}` : `${opt.label} →`}
            </button>
          )
        })}
      </div>

      {decisions.length > 0 && (
        <div className="swipe-history">
          <div className="swipe-history-col left">
            {decisions.filter((d) => d.dir === 'left').map((d) => {
              const c = task.cards.find((x) => x.id === d.cardId)!
              return (
                <div key={d.cardId} className="swipe-history-item left">
                  {c.content}
                </div>
              )
            })}
          </div>
          <div className="swipe-history-col right">
            {decisions.filter((d) => d.dir === 'right').map((d) => {
              const c = task.cards.find((x) => x.id === d.cardId)!
              return (
                <div key={d.cardId} className="swipe-history-item right">
                  {c.content}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
