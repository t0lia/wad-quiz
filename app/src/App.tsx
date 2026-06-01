import { useState } from 'react'
import type { ChallengeSceneData } from './types/story'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

const scenes: ChallengeSceneData[] = [
  {
    id: 'scene_001',
    text: 'The migration script has been running for 20 minutes. The database CPU is at 90%. What should you check first? (Select all that apply)',
    task: {
      type: 'multiple_choice',
      options: [
        { id: 'a', content: 'Query execution plan' },
        { id: 'b', content: 'Disk space' },
        { id: 'c', content: 'Slow query log' },
        { id: 'd', content: 'Network latency' },
      ],
    },
  },
  {
    id: 'scene_002',
    text: "It's 3am. You found the bug. Put the deployment steps in the correct order.",
    task: {
      type: 'drag_and_drop',
      items: [
        { id: 's1', content: 'Create a database backup' },
        { id: 's2', content: 'Run migration scripts' },
        { id: 's3', content: 'Deploy the new build' },
        { id: 's4', content: 'Run smoke tests' },
      ],
    },
  },
]

export default function App() {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="ending">
        <h1>The archive was saved.</h1>
        <p>Every file intact. The city kept its memory.</p>
      </div>
    )
  }

  return (
    <ChallengeScene
      key={scenes[index].id}
      scene={scenes[index]}
      isLast={index === scenes.length - 1}
      onComplete={() => {
        if (index === scenes.length - 1) setDone(true)
        else setIndex((i) => i + 1)
      }}
    />
  )
}
