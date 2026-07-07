/**
 * Build the ordered list of visible pages in the hydroWorld machine
 * by walking `config.states` from the initial state and following
 * NEXT transitions.
 *
 * Exported separately so unit tests can validate the ordering without
 * mounting React.
 */

type MetaHolder = { meta?: unknown }
type StateConfig = MetaHolder & {
  on?: { NEXT?: unknown }
}

export type MachineConfigLike = {
  config?: {
    initial?: string
    states?: Record<string, StateConfig | undefined>
  }
}

export function isVisibleScene(config: unknown): boolean {
  return !!config && typeof config === 'object' && 'meta' in (config as object)
}

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function collectTargets(v: unknown, out: string[]): void {
  if (v == null) return
  if (isString(v)) { out.push(v); return }
  if (Array.isArray(v)) { v.forEach((x) => collectTargets(x, out)); return }
  if (typeof v === 'object') {
    const obj = v as Record<string, unknown>
    if ('target' in obj) {
      collectTargets(obj.target, out)
      return
    }
    for (const key of Object.keys(obj)) {
      collectTargets(obj[key], out)
    }
  }
}

export function nextTargets(config: StateConfig | undefined): string[] {
  const next = config?.on?.NEXT
  if (next === undefined) return []
  const out: string[] = []
  collectTargets(next, out)
  return out
}

/** BFS over the hydroWorld graph from the initial state. */
export function buildSceneOrder(machine: MachineConfigLike): string[] {
  const states = (machine.config?.states ?? {}) as Record<string, StateConfig | undefined>
  const initialId = machine.config?.initial ?? Object.keys(states)[0] ?? ''
  const order: string[] = []
  const visited = new Set<string>()
  const queue: string[] = [initialId]
  while (queue.length) {
    const id = queue.shift() as string
    if (visited.has(id)) continue
    visited.add(id)
    const cfg = states[id]
    if (cfg && isVisibleScene(cfg)) order.push(id)
    for (const t of nextTargets(cfg)) {
      if (!visited.has(t) && states[t] !== undefined) queue.push(t)
    }
  }
  return order
}

/**
 * Resolve the progress fraction for an arbitrary state id.
 * Returns a value in [0, 1]; falls back to 0 if id is not part of the
 * visited set (defensive — `data-idx` should never disappear now).
 */
export function resolveProgress(
  machine: MachineConfigLike,
  stateId: string,
): { idx: number; total: number; progress: number } {
  const order = buildSceneOrder(machine)
  const idxFor = new Map<string, number>()
  order.forEach((id, i) => idxFor.set(id, i))
  const idx = idxFor.get(stateId)
  const safeIdx = idx === undefined ? 0 : idx
  const last = Math.max(order.length - 1, 1)
  return { idx: safeIdx, total: order.length, progress: safeIdx / last }
}
