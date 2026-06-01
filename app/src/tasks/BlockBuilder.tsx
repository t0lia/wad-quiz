import { useState } from 'react'
import type { BlockBuilderTask } from '../types/story'

type Props = { task: BlockBuilderTask; submitted: boolean; onSubmit: () => void }

export default function BlockBuilder({ task, submitted, onSubmit }: Props) {
  const [sequence, setSequence] = useState<(string | null)[]>(Array(task.slots).fill(null))

  const usedIds = new Set(sequence.filter(Boolean) as string[])
  const allFilled = sequence.every((s) => s !== null)

  function addBlock(blockId: string) {
    if (submitted || usedIds.has(blockId)) return
    setSequence((prev) => {
      const next = [...prev]
      const slot = next.indexOf(null)
      if (slot === -1) return prev
      next[slot] = blockId
      return next
    })
  }

  function removeBlock(slotIndex: number) {
    if (submitted) return
    setSequence((prev) => {
      const next = [...prev]
      next[slotIndex] = null
      return next
    })
  }

  function getContent(id: string) {
    return task.availableBlocks.find((b) => b.id === id)?.content ?? ''
  }

  return (
    <>
      <div className="block-slots">
        {sequence.map((blockId, i) => (
          <button
            key={i}
            type="button"
            className={`block-slot${blockId ? ' filled' : ''}`}
            onClick={() => blockId && removeBlock(i)}
            disabled={submitted || !blockId}
          >
            {blockId ? getContent(blockId) : <span className="slot-num">{i + 1}</span>}
          </button>
        ))}
      </div>
      <div className="block-available">
        {task.availableBlocks.map((block) => (
          <button
            key={block.id}
            type="button"
            className={`block-btn${usedIds.has(block.id) ? ' used' : ''}`}
            onClick={() => addBlock(block.id)}
            disabled={submitted || usedIds.has(block.id)}
          >
            {block.content}
          </button>
        ))}
      </div>
      {!submitted && (
        <button type="button" className="submit-btn" disabled={!allFilled} onClick={onSubmit}>
          Submit
        </button>
      )}
    </>
  )
}
