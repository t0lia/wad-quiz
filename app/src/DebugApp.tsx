import { useMemo } from 'react'
import type { ChallengeSceneData } from './types/story'
import { hydroMachine } from './machine'
import ChallengeScene from './scenes/ChallengeScene'
import './App.css'

function shortStateId(fullId: string): string {
  const dot = fullId.indexOf('.')
  return dot >= 0 ? fullId.slice(dot + 1) : fullId
}

function collectTargetIds(value: unknown, targets: Set<string>): void {
  if (!value) return

  if (typeof value === 'string') {
    targets.add(value)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => collectTargetIds(entry, targets))
    return
  }

  if (typeof value !== 'object') return

  const record = value as Record<string, unknown>
  if ('target' in record) {
    collectTargetIds(record.target, targets)
    return
  }

  Object.values(record).forEach((entry) => collectTargetIds(entry, targets))
}

function topoSortSceneKeys(): string[] {
  const machineStates = (hydroMachine as any).config?.states ?? hydroMachine.states
  const entries = Object.entries(machineStates) as Array<[string, any]>
  const sequence = new Map(entries.map(([key], index) => [key, index]))
  const adjacency = new Map<string, Set<string>>()
  const indegree = new Map<string, number>()

  for (const [key] of entries) {
    adjacency.set(key, new Set())
    indegree.set(key, 0)
  }

  for (const [key, node] of entries) {
    const targets = new Set<string>()
    collectTargetIds(node?.on, targets)
    collectTargetIds(node?.always, targets)
    collectTargetIds(node?.after, targets)

    for (const target of targets) {
      if (!adjacency.has(target) || target === key) continue
      const neighbors = adjacency.get(key)!
      if (neighbors.has(target)) continue

      neighbors.add(target)
      indegree.set(target, (indegree.get(target) ?? 0) + 1)
    }
  }

  const compareBySequence = (left: string, right: string) => (sequence.get(left) ?? 0) - (sequence.get(right) ?? 0)
  const ready = entries.map(([key]) => key).filter((key) => (indegree.get(key) ?? 0) === 0).sort(compareBySequence)
  const ordered: string[] = []

  while (ready.length > 0) {
    const current = ready.shift()!
    ordered.push(current)

    for (const neighbor of adjacency.get(current) ?? []) {
      const nextDegree = (indegree.get(neighbor) ?? 0) - 1
      indegree.set(neighbor, nextDegree)

      if (nextDegree === 0) {
        ready.push(neighbor)
        ready.sort(compareBySequence)
      }
    }
  }

  if (ordered.length !== entries.length) {
    return entries.map(([key]) => key).sort(compareBySequence)
  }

  return ordered
}

export default function DebugApp() {
  const scenes = useMemo(() => {
    const stateNodes = (hydroMachine as any).config?.states ?? hydroMachine.states
    const orderedKeys = topoSortSceneKeys()

    return orderedKeys
      .map((key) => ({ key, scene: stateNodes[key]?.meta as ChallengeSceneData | undefined }))
      .filter((entry): entry is { key: string; scene: ChallengeSceneData } => entry.scene != null)
  }, [])

  return (
    <main className="debug-page">
      <header className="debug-header">
        <h1 className="title">Hydroworld Debug</h1>
        <p className="meta">Total scenes: {scenes.length} | Viewport: 412x915 (Pixel 6)</p>
      </header>

      <section className="device-grid" aria-live="polite">
        {scenes.map(({ key, scene }) => (
          <div>
            <div className="tile-id">{shortStateId(key)}</div>
            <article className="tile" key={key}>
              <ChallengeScene scene={scene} onComplete={() => {}} />
            </article>
          </div>
        ))}
      </section>
    </main>
  )
}
