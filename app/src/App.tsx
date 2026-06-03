import { useState } from 'react'
import type { ChallengeSceneData } from './types/story'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

const scenes: ChallengeSceneData[] = [
  {
    id: 'scene_001',
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
  {
    id: 'scene_002',
    text: "The crisis is over. You have 10 developer-hours before the next deploy window. Allocate your team's time.",
    task: {
      type: 'resource_allocation',
      totalResource: 10,
      unit: 'h',
      items: [
        { id: 'r1', label: 'Root cause fix', min: 2, max: 6 },
        { id: 'r2', label: 'Test coverage', min: 1, max: 5 },
        { id: 'r3', label: 'Monitoring alerts', min: 0, max: 4 },
        { id: 'r4', label: 'Documentation', min: 0, max: 3 },
      ],
    },
  },
  {
    id: 'scene_003',
    text: 'The monitoring dashboard is lit up. Match each HTTP status code to its meaning.',
    task: {
      type: 'mapping',
      left: [
        { id: 'c1', content: '503' },
        { id: 'c2', content: '429' },
        { id: 'c3', content: '504' },
      ],
      right: [
        { id: 'm1', content: 'Service Unavailable' },
        { id: 'm2', content: 'Too Many Requests' },
        { id: 'm3', content: 'Gateway Timeout' },
      ],
    },
  },
  {
    id: 'scene_004',
    text: 'The ticket queue is exploding. Sort each issue into the right bucket.',
    task: {
      type: 'card_filter',
      cards: [
        { id: 'k1', content: 'Users cannot log in', meta: { severity: 'critical' } },
        { id: 'k2', content: 'Dark mode theme glitch', meta: { severity: 'low' } },
        { id: 'k3', content: 'Payment processing fails', meta: { severity: 'critical' } },
        { id: 'k4', content: 'Export button text misaligned', meta: { severity: 'low' } },
      ],
      buckets: [
        { id: 'b1', label: 'Fix now' },
        { id: 'b2', label: 'Fix later' },
      ],
    },
  },
  {
    id: 'scene_005',
    text: 'The logs are streaming in. Click the line that reveals the root cause.',
    task: {
      type: 'click_on_line',
      lines: [
        { id: 'l1', content: '03:12:01 [INFO]  Connection pool: 8/10 active' },
        { id: 'l2', content: '03:12:03 [INFO]  Migration step 4/7 complete' },
        { id: 'l3', content: '03:12:05 [ERROR] Deadlock on table user_sessions' },
        { id: 'l4', content: '03:12:05 [INFO]  Health check passed' },
        { id: 'l5', content: '03:12:07 [INFO]  Migration step 5/7 complete' },
      ],
    },
  },
  {
    id: 'scene_006',
    text: 'Alerts are flooding in. Triage each one — wake someone up or keep watching?',
    task: {
      type: 'swipe_cards',
      cards: [
        { id: 'a1', content: 'CPU spike: 95%', meta: { source: 'prod-db-01' } },
        { id: 'a2', content: 'Memory usage: 60%', meta: { source: 'app-server-02' } },
        { id: 'a3', content: 'Error rate: 0.1%', meta: { source: 'api-gateway' } },
        { id: 'a4', content: 'Latency: 4200ms p99', meta: { source: 'payment-service' } },
      ],
      options: [
        { id: 'o1', label: 'Wake someone up' },
        { id: 'o2', label: 'Monitor' },
      ],
    },
  },
  {
    id: 'scene_007',
    text: 'You need to roll back the bad commit. Build the git command from the blocks.',
    task: {
      type: 'block_builder',
      slots: 4,
      availableBlocks: [
        { id: 'b1', content: 'git' },
        { id: 'b2', content: 'revert' },
        { id: 'b3', content: 'HEAD~1' },
        { id: 'b4', content: '--no-edit' },
        { id: 'b5', content: 'push' },
        { id: 'b6', content: 'origin' },
      ],
    },
  },
  {
    id: 'scene_008',
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
    id: 'scene_009',
    text: 'The archive is secure. One last step.',
    task: { type: 'one_tap_forward' },
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
