import { useState, useRef } from 'react'
import type { DragAndDropTask, DragAndDropItem } from '../types/story'

type Props = { task: DragAndDropTask; submitted: boolean; onSubmit: (answer?: string) => void }

export default function DragAndDrop({ task, submitted, onSubmit }: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const ghostGeometry = useRef<{ left: number; width: number } | null>(null)

  const [order, setOrder] = useState<DragAndDropItem[]>(task.items)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [settledId, setSettledId] = useState<string | null>(null)
  const [pointerY, setPointerY] = useState<number | null>(null)
  const [itemOffset, setItemOffset] = useState(0)
  const [itemHeight, setItemHeight] = useState(0)

  function startDrag(e: React.PointerEvent<HTMLLIElement>, id: string) {
    if (submitted) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const itemRect = e.currentTarget.getBoundingClientRect()
    const listRect = listRef.current!.getBoundingClientRect()
    ghostGeometry.current = { left: listRect.left, width: listRect.width }
    setItemHeight(itemRect.height)
    setItemOffset(e.clientY - itemRect.top)
    setPointerY(e.clientY)
    setDraggedId(id)
    setOverId(id)
  }

  function moveDrag(e: React.PointerEvent<HTMLLIElement>) {
    if (!draggedId || !listRef.current) return
    setPointerY(e.clientY)
    for (const child of Array.from(listRef.current.children) as HTMLElement[]) {
      if (child.dataset.id === draggedId) continue
      const rect = child.getBoundingClientRect()
      if (e.clientY >= rect.top && e.clientY < rect.bottom) {
        setOverId(child.dataset.id ?? null)
        break
      }
    }
  }

  function endDrag() {
    if (draggedId && overId && draggedId !== overId) {
      setOrder((prev) => {
        const next = [...prev]
        const from = next.findIndex((x) => x.id === draggedId)
        const to = next.findIndex((x) => x.id === overId)
        next.splice(to, 0, next.splice(from, 1)[0])
        return next
      })
      setSettledId(draggedId)
    }
    setDraggedId(null)
    setOverId(null)
    setPointerY(null)
  }

  const dragIndex = order.findIndex((x) => x.id === draggedId)
  const overIndex = order.findIndex((x) => x.id === overId)
  const step = itemHeight + 8

  function getShift(i: number): number {
    if (!draggedId || i === dragIndex) return 0
    if (dragIndex < overIndex && i > dragIndex && i <= overIndex) return -step
    if (dragIndex > overIndex && i >= overIndex && i < dragIndex) return step
    return 0
  }

  return (
    <>
      <ul className="dnd-list" ref={listRef}>
        {order.map((item, i) => (
          <li
            key={item.id}
            data-id={item.id}
            className={[
              'dnd-item',
              draggedId === item.id ? 'dragging' : '',
              settledId === item.id ? 'settled' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ transform: `translateY(${getShift(i)}px)`, transition: draggedId ? 'transform 0.2s ease' : undefined }}
            onPointerDown={(e) => startDrag(e, item.id)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onAnimationEnd={() => { if (settledId === item.id) setSettledId(null) }}
          >
            <span className="dnd-handle" aria-hidden="true">⠿</span>
            {item.content}
          </li>
        ))}
      </ul>
      {draggedId && pointerY !== null && ghostGeometry.current && (
        <div
          className="dnd-ghost"
          style={{
            top: pointerY - itemOffset,
            left: ghostGeometry.current.left,
            width: ghostGeometry.current.width,
          }}
        >
          <span className="dnd-handle" aria-hidden="true">⠿</span>
          {order.find((x) => x.id === draggedId)?.content}
        </div>
      )}
      {!submitted && (
        <button
          type="button"
          className="submit-btn"
          onClick={() => onSubmit(order.map((item) => item.id).join(','))}
        >
          submit
        </button>
      )}
    </>
  )
}
