import { useState, useRef } from 'react'
import type { CardFilterTask } from '../types/story'

type Props = { task: CardFilterTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function CardFilter({ task, submitted, onSubmit }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>({})
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [settledCardId, setSettledCardId] = useState<string | null>(null)

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null)
  const [overBucketId, setOverBucketId] = useState<string | null>(null)
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null)
  const [ghostSize, setGhostSize] = useState({ width: 0 })
  const [itemOffset, setItemOffset] = useState({ x: 0, y: 0 })

  const bucketRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const pendingDrag = useRef<{ cardId: string; startX: number; startY: number } | null>(null)
  const isDragging = useRef(false)

  const unassigned = task.cards.filter((c) => !assignments[c.id])
  const canSubmit = unassigned.length === 0

  function selectCard(cardId: string, e?: React.MouseEvent) {
    e?.stopPropagation()
    if (submitted) return
    setSelectedCardId((prev) => (prev === cardId ? null : cardId))
  }

  function assignToBucket(bucketId: string) {
    if (!selectedCardId || submitted) return
    setAssignments((prev) => ({ ...prev, [selectedCardId]: bucketId }))
    setSettledCardId(selectedCardId)
    setSelectedCardId(null)
  }

  function onCardPointerDown(e: React.PointerEvent<HTMLButtonElement>, cardId: string) {
    if (submitted) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    pendingDrag.current = { cardId, startX: e.clientX, startY: e.clientY }
    isDragging.current = false
    setGhostSize({ width: rect.width })
    setItemOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  function onCardPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!pendingDrag.current) return
    const { cardId, startX, startY } = pendingDrag.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    if (!isDragging.current && Math.sqrt(dx * dx + dy * dy) > 8) {
      isDragging.current = true
      setDraggedCardId(cardId)
      setSelectedCardId(null)
    }

    if (!isDragging.current) return

    setPointerPos({ x: e.clientX, y: e.clientY })
    let found: string | null = null
    for (const [bucketId, el] of bucketRefs.current) {
      const rect = el.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) {
        found = bucketId
        break
      }
    }
    setOverBucketId(found)
  }

  function onCardPointerUp() {
    if (isDragging.current && pendingDrag.current && overBucketId) {
      const { cardId } = pendingDrag.current
      setAssignments((prev) => ({ ...prev, [cardId]: overBucketId }))
      setSettledCardId(cardId)
    }
    isDragging.current = false
    pendingDrag.current = null
    setDraggedCardId(null)
    setOverBucketId(null)
    setPointerPos(null)
  }

  function renderCard(card: (typeof task.cards)[number], fromBucket?: boolean) {
    const isDragged = draggedCardId === card.id
    const isSelected = selectedCardId === card.id
    const isSettled = settledCardId === card.id
    return (
      <button
        key={card.id}
        type="button"
        className={[
          'cf-card-item',
          isSelected ? 'selected' : '',
          isDragged ? 'dragging' : '',
          isSettled ? 'settled' : '',
        ].filter(Boolean).join(' ')}
        onClick={(e) => selectCard(card.id, fromBucket ? e : undefined)}
        onPointerDown={(e) => onCardPointerDown(e, card.id)}
        onPointerMove={onCardPointerMove}
        onPointerUp={onCardPointerUp}
        onPointerCancel={onCardPointerUp}
        onAnimationEnd={() => { if (settledCardId === card.id) setSettledCardId(null) }}
        disabled={submitted}
      >
        <span className="cf-card-content">{card.content}</span>
        {Object.entries(card.meta).map(([k, v]) => (
          <span key={k} className="cf-card-tag">{k}: {v}</span>
        ))}
      </button>
    )
  }

  const draggedCard = task.cards.find((c) => c.id === draggedCardId)

  return (
    <>
      <div className="cf-queue">
        {unassigned.length === 0
          ? <p className="cf-queue-empty">All cards sorted</p>
          : unassigned.map((card) => renderCard(card))}
      </div>

      <div className="cf-buckets" style={{ gridTemplateColumns: `repeat(${task.buckets.length}, 1fr)` }}>
        {task.buckets.map((bucket) => {
          const bucketCards = task.cards.filter((c) => assignments[c.id] === bucket.id)
          const isOver = overBucketId === bucket.id
          return (
            <div
              key={bucket.id}
              ref={(el) => { if (el) bucketRefs.current.set(bucket.id, el); else bucketRefs.current.delete(bucket.id) }}
              className={[
                'cf-bucket',
                selectedCardId ? 'available' : '',
                isOver ? 'over' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => assignToBucket(bucket.id)}
            >
              <div className="cf-bucket-label">{bucket.label}</div>
              <div className="cf-bucket-cards">
                {bucketCards.map((card) => renderCard(card, true))}
              </div>
            </div>
          )
        })}
      </div>

      {draggedCard && pointerPos && (
        <div
          className="cf-ghost"
          style={{
            left: pointerPos.x - itemOffset.x,
            top: pointerPos.y - itemOffset.y,
            width: ghostSize.width,
          }}
        >
          <span className="cf-card-content">{draggedCard.content}</span>
          {Object.entries(draggedCard.meta).map(([k, v]) => (
            <span key={k} className="cf-card-tag">{k}: {v}</span>
          ))}
        </div>
      )}

      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={!canSubmit}
          onClick={() => onSubmit(JSON.stringify(assignments))}
        >
          submit
        </button>
      )}
    </>
  )
}
