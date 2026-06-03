import { useState, useRef } from 'react'
import type { BlockBuilderTask } from '../types/story'

type Props = { task: BlockBuilderTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function BlockBuilder({ task, submitted, onSubmit }: Props) {
  const [sequence, setSequence] = useState<(string | null)[]>(Array(task.slots).fill(null))
  const [settledSlot, setSettledSlot] = useState<number | null>(null)

  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dragSource, setDragSource] = useState<'available' | number | null>(null)
  const [overSlotIndex, setOverSlotIndex] = useState<number | null>(null)
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null)
  const [ghostSize, setGhostSize] = useState({ width: 0 })
  const [itemOffset, setItemOffset] = useState({ x: 0, y: 0 })

  const slotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const pendingDrag = useRef<{ blockId: string; fromSlot: 'available' | number; startX: number; startY: number } | null>(null)
  const isDragging = useRef(false)
  const suppressClick = useRef(false)

  const usedIds = new Set(sequence.filter(Boolean) as string[])
  const allFilled = sequence.every((s) => s !== null)

  function addBlock(blockId: string) {
    if (submitted || usedIds.has(blockId)) return
    setSequence((prev) => {
      const next = [...prev]
      const slot = next.indexOf(null)
      if (slot === -1) return prev
      next[slot] = blockId
      setSettledSlot(slot)
      return next
    })
  }

  function removeBlock(slotIndex: number) {
    if (submitted) return
    setSequence((prev) => { const next = [...prev]; next[slotIndex] = null; return next })
  }

  function getContent(id: string) {
    return task.availableBlocks.find((b) => b.id === id)?.content ?? ''
  }

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, blockId: string, fromSlot: 'available' | number) {
    if (submitted) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    pendingDrag.current = { blockId, fromSlot, startX: e.clientX, startY: e.clientY }
    isDragging.current = false
    setGhostSize({ width: rect.width })
    setItemOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  function moveDrag(e: React.PointerEvent<HTMLButtonElement>) {
    if (!pendingDrag.current) return
    const { blockId, fromSlot, startX, startY } = pendingDrag.current
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    if (!isDragging.current && Math.sqrt(dx * dx + dy * dy) > 8) {
      isDragging.current = true
      setDraggedBlockId(blockId)
      setDragSource(fromSlot)
    }
    if (!isDragging.current) return

    setPointerPos({ x: e.clientX, y: e.clientY })
    let found: number | null = null
    slotRefs.current.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom) found = i
    })
    setOverSlotIndex(found)
  }

  function endDrag() {
    if (isDragging.current && pendingDrag.current) {
      suppressClick.current = true
      const { blockId, fromSlot } = pendingDrag.current

      if (overSlotIndex !== null) {
        setSequence((prev) => {
          const next = [...prev]
          const displaced = next[overSlotIndex]
          if (displaced !== null) {
            if (typeof fromSlot === 'number') next[fromSlot] = displaced
            else return prev // can't overwrite filled slot from available
          } else if (typeof fromSlot === 'number') {
            next[fromSlot] = null
          }
          next[overSlotIndex] = blockId
          return next
        })
        setSettledSlot(overSlotIndex)
      }
    }
    isDragging.current = false
    pendingDrag.current = null
    setDraggedBlockId(null)
    setDragSource(null)
    setOverSlotIndex(null)
    setPointerPos(null)
  }

  const draggedContent = draggedBlockId ? getContent(draggedBlockId) : ''

  return (
    <>
      <div className="block-slots">
        {sequence.map((blockId, i) => {
          const isDraggedFrom = dragSource === i && !!draggedBlockId
          const isOver = overSlotIndex === i
          const isSettled = settledSlot === i
          return (
            <button
              key={i}
              ref={(el) => { slotRefs.current[i] = el }}
              type="button"
              className={[
                'block-slot',
                blockId ? 'filled' : '',
                isDraggedFrom ? 'dragging' : '',
                isOver ? 'over' : '',
                isSettled ? 'settled' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => {
                if (suppressClick.current) { suppressClick.current = false; return }
                blockId && removeBlock(i)
              }}
              onPointerDown={blockId ? (e) => startDrag(e, blockId, i) : undefined}
              onPointerMove={blockId ? moveDrag : undefined}
              onPointerUp={blockId ? endDrag : undefined}
              onPointerCancel={blockId ? endDrag : undefined}
              onAnimationEnd={() => { if (settledSlot === i) setSettledSlot(null) }}
              disabled={submitted || (!blockId && overSlotIndex !== i)}
            >
              {isDraggedFrom
                ? <span className="slot-num">{i + 1}</span>
                : blockId
                  ? getContent(blockId)
                  : <span className="slot-num">{i + 1}</span>}
            </button>
          )
        })}
      </div>

      <div className="block-available">
        {task.availableBlocks.map((block) => {
          const isDraggedFrom = draggedBlockId === block.id && dragSource === 'available'
          const isUsed = usedIds.has(block.id)
          return (
            <button
              key={block.id}
              type="button"
              className={[
                'block-btn',
                isUsed ? 'used' : '',
                isDraggedFrom ? 'dragging' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => {
                if (suppressClick.current) { suppressClick.current = false; return }
                addBlock(block.id)
              }}
              onPointerDown={!isUsed ? (e) => startDrag(e, block.id, 'available') : undefined}
              onPointerMove={!isUsed ? moveDrag : undefined}
              onPointerUp={!isUsed ? endDrag : undefined}
              onPointerCancel={!isUsed ? endDrag : undefined}
              disabled={submitted || isUsed}
            >
              {block.content}
            </button>
          )
        })}
      </div>

      {draggedBlockId && pointerPos && (
        <div
          className="block-ghost"
          style={{
            left: pointerPos.x - itemOffset.x,
            top: pointerPos.y - itemOffset.y,
            width: ghostSize.width,
          }}
        >
          {draggedContent}
        </div>
      )}

      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          disabled={!allFilled}
          onClick={() => onSubmit(sequence[0] ? getContent(sequence[0]) : undefined)}
        >
          Submit
        </button>
      )}
    </>
  )
}
