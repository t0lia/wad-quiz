import { useMemo, useState } from 'react'
import type { AnyStateMachine } from 'xstate'
import type { ChallengeSceneData } from './types/story'
import ChallengeScene from './scenes/ChallengeScene'
import StateTreeVisualization from './components/StateTreeVisualization'
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

function topoSortSceneKeys(hydroMachine: AnyStateMachine): string[] {
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

function getNextSections(stateNode: any): string[] {
  const targets = new Set<string>()
  collectTargetIds(stateNode?.on, targets)
  collectTargetIds(stateNode?.always, targets)
  collectTargetIds(stateNode?.after, targets)
  return Array.from(targets).sort()
}

export default function DebugApp({ hydroMachine }: { hydroMachine: AnyStateMachine }) {
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree')
  const stateNodes = useMemo(() => (hydroMachine as any).config?.states ?? hydroMachine.states, [])
  
  const scenes = useMemo(() => {
    const orderedKeys = topoSortSceneKeys(hydroMachine)

    return orderedKeys
      .map((key) => ({ key, scene: stateNodes[key]?.meta as ChallengeSceneData | undefined }))
      .filter((entry): entry is { key: string; scene: ChallengeSceneData } => entry.scene != null)
  }, [stateNodes])

  return (
    <main className="debug-page">
      <header className="debug-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h1 className="title">Hydroworld Debug</h1>
            <p className="meta">Total scenes: {scenes.length} | Viewport: 412x915 (Pixel 6)</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('tree')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'tree' ? '#0066cc' : '#e0e0e0',
                color: viewMode === 'tree' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === 'tree' ? '600' : '400',
              }}
            >
              Tree View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 16px',
                backgroundColor: viewMode === 'grid' ? '#0066cc' : '#e0e0e0',
                color: viewMode === 'grid' ? '#fff' : '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: viewMode === 'grid' ? '600' : '400',
              }}
            >
              Grid View
            </button>
          </div>
        </div>
      </header>

      {viewMode === 'tree' && <StateTreeVisualization hydroMachine={hydroMachine} />}

      {viewMode === 'grid' && (
        <section className="device-grid" aria-live="polite">
          {scenes.map(({ key, scene }) => {
            const nextSections = getNextSections(stateNodes[key])
            return (
              <div id={key} key={key}>
                <div className="tile-id">{shortStateId(key)}</div>
                <article className="tile">
                  <ChallengeScene scene={scene} context={{}} onComplete={() => {}} />
                </article>
                {nextSections.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <strong>Next:</strong>{' '}
                    {nextSections.map((s, idx) => (
                      <span key={s}>
                        <a href={`#${s}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                          {shortStateId(s)}
                        </a>
                        {idx < nextSections.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}
    </main>
  )
}
