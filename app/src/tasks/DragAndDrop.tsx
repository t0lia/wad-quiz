import { useState } from 'react'
import type { DragAndDropItem } from '../types/story'

type Props = {
  items: DragAndDropItem[]
  onReorder: (newItems: DragAndDropItem[]) => void
  disabled: boolean
}

export default function DragAndDrop({ items, onReorder, disabled }: Props) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  function handleDragStart(id: string) {
    setDraggedId(id)
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault()
    setOverId(id)
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) {
      reset()
      return
    }
    const next = [...items]
    const from = next.findIndex((x) => x.id === draggedId)
    const to = next.findIndex((x) => x.id === targetId)
    next.splice(to, 0, next.splice(from, 1)[0])
    onReorder(next)
    reset()
  }

  function reset() {
    setDraggedId(null)
    setOverId(null)
  }

  return (
    <ul className="dnd-list">
      {items.map((item) => (
        <li
          key={item.id}
          draggable={!disabled}
          className={[
            'dnd-item',
            draggedId === item.id ? 'dragging' : '',
            overId === item.id && draggedId !== item.id ? 'dragover' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onDragStart={() => handleDragStart(item.id)}
          onDragOver={(e) => handleDragOver(e, item.id)}
          onDrop={() => handleDrop(item.id)}
          onDragEnd={reset}
        >
          <span className="dnd-handle" aria-hidden="true">⠿</span>
          {item.content}
        </li>
      ))}
    </ul>
  )
}
