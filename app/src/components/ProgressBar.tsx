import { useEffect, useRef } from 'react'

// Milestones per major story section (collapsed from full state names)
// These are the "scene groups" that represent meaningful progress steps
const CARGO_PATH = [
  'section_1',
  'section_2',
  'section_3',
  'section_4',
  'section_5',
  'section_6',
  'section_7',
  'section_8',
  'section_9',
  'section_10',
]

const MEDICAL_PATH = [
  'section_1',
  'section_2',
  'section_3',
  'section_4',
  'section_5',
  'section_6',
  'section_7',
  'section_8',
  'section_9',
  'section_10',
]

const ENDINGS = ['ending_1', 'ending_2', 'ending_3', 'ending_4', 'ending_5']

/** Collapse a full state id to its narrative "scene group" milestone */
function milestone(stateId: string): string {
  return stateId
    .replace(/_conclusion_[a-z]+$/, '')
    .replace(/_intro$/, '')
    .replace(/_task$/, '')
    .replace(/_cargo$|_medical$/, '')
    .replace(/_[a-z]+$/, '') // remove last _word suffix (fallout, solved, etc.)
}

type Props = {
  currentState: string
  routeChoice?: 'cargo' | 'medical'
}

export default function ProgressBar({ currentState, routeChoice }: Props) {
  const dotRef = useRef<HTMLDivElement>(null)
  const path = routeChoice === 'medical' ? MEDICAL_PATH : CARGO_PATH

  // Find milestone index (or ending)
  const ms = milestone(currentState)
  let idx = path.indexOf(ms)
  let isEnding = false

  if (idx === -1 && ENDINGS.includes(ms)) {
    idx = path.length
    isEnding = true
  }

  const progress = idx === -1 ? 0 : idx / path.length

  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.left = `${progress * 100}%`
    }
  }, [progress])

  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div
          ref={dotRef}
          className="progress-bar__dot"
          style={{ left: `${progress * 100}%` }}
        />
      </div>
    </div>
  )
}
