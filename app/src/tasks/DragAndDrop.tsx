import { useState, useRef } from 'react'
import type { DragAndDropItem } from '../types/story'

type Props = {
  items: DragAndDropItem[]
  onReorder: (newItems: DragAndDropItem[]) => void
  disabled: boolean
}

export default function DragAndDrop({ items, onReorder, disabled }: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  function startDrag(e: React.PointerEvent<HTMLLIElement>, id: string) {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDraggedId(id)
    setOverId(id)
  }

  function moveDrag(e: React.PointerEvent<HTMLLIElement>) {
    if (!draggedId || !listRef.current) return
    const children = Array.from(listRef.current.children) as HTMLElement[]
    for (const child of children) {
      const rect = child.getBoundingClientRect()
      if (e.clientY >= rect.top && e.clientY < rect.bottom) {
        setOverId(child.dataset.id ?? null)
        break
      }
    }
  }

  function endDrag() {
    if (draggedId && overId && draggedId !== overId) {
      const next = [...items]
      const from = next.findIndex((x) => x.id === draggedId)
      const to = next.findIndex((x) => x.id === overId)
      next.splice(to, 0, next.splice(from, 1)[0])
      onReorder(next)
    }
    setDraggedId(null)
    setOverId(null)
  }

  return (
    <ul className="dnd-list" ref={listRef}>
      {items.map((item) => (
        <li
          key={item.id}
          data-id={item.id}
          className={[
            'dnd-item',
            draggedId === item.id ? 'dragging' : '',
            overId === item.id && draggedId !== item.id ? 'dragover' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onPointerDown={(e) => startDrag(e, item.id)}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className="dnd-handle" aria-hidden="true">⠿</span>
          {item.content}
        </li>
      ))}
    </ul>
  )
}
