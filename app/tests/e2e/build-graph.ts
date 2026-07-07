/**
 * Build the test graph from the drop-in World/ YAML bundle.
 *
 *   raw2/World/01_structure.yaml        — graph topology + entry/terminals
 *   raw2/World/stages/01-stages.yaml     — per-stage content + choice/task ids
 *   raw2/World/02_taskpools.yaml         — pool → task_ids
 *   raw2/World/choices/*.yaml            — choice option definitions
 *   raw2/World/tasks/*.yaml              — task variant definitions
 *
 * Output: tests/e2e/.cache/graph.json (consumed by the Playwright spec).
 *
 * Run: `npx tsx tests/e2e/build-graph.ts`
 *
 * The parser deliberately ignores engine-specific fields (intro_narrative,
 * dialogue, modifiers, scores, …). It only emits what the test needs to
 * drive the UI: which buttons exist at each stage and where they lead.
 * If the engine's TS DTOs change, that's their problem — this file
 * re-derives everything from the bundle's actual YAML shape.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import type {
  ChoiceDef,
  ChoiceOption,
  NextRef,
  StageGraph,
  StageNode,
  StageTransitionMap,
  TaskOption,
  TaskVariant,
} from './graphSchema.ts'
import { expandTargets } from './graphSchema.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const APP_ROOT = resolve(__dirname, '..', '..')           // app/
const BUNDLE = join(APP_ROOT, 'raw2', 'World')
const OUT_DIR = join(__dirname, '.cache')
const OUT_FILE = join(OUT_DIR, 'graph.json')

// ---------- YAML helpers ------------------------------------------------------

function loadYaml<T = unknown>(rel: string): T {
  const path = join(BUNDLE, rel)
  const raw = readFileSync(path, 'utf8')
  return YAML.parse(raw) as T
}

function listDir(rel: string): string[] {
  return readdirSync(join(BUNDLE, rel)).filter(f => f.endsWith('.yaml'))
}

// ---------- Structure / stages / choices / tasks ------------------------------

interface RawStructureStage {
  id: string
  next_by_action?: StageTransitionMap
  next_by_outcome?: StageTransitionMap
}

interface RawStructure {
  start_stage: string
  stages: RawStructureStage[]
  terminal_stages: string[]
}

interface RawStageConfig {
  id: string
  stage_type: 'choice' | 'task' | 'conclusion'
  title: string
  image?: string
  choice_id?: string
  task_pool_id?: string
}

interface RawStages {
  stages: RawStageConfig[]
}

interface RawTaskPool {
  task_pools: Record<string, { title: string; task_ids: string[] }>
}

interface RawChoice {
  id: string
  kind: string
  title: string
  actions: Array<{
    id: string
    text: string
    description?: string
    conclusion?: string
    outcome?: string
    flag_modifications?: unknown[]
    scores?: Record<string, number>
  }>
}

interface RawTask {
  id: string
  pool: string
  language: string
  bug_class?: string
  title: string
  actions: Array<{
    id: string
    text: string
    outcome?: string
    description?: string
    flag_modifications?: unknown[]
    scores?: Record<string, number>
  }>
}

// ---------- Build stages ------------------------------------------------------

function buildStages(structure: RawStructure, stageConfigs: RawStageConfig[]): Record<string, StageNode> {
  const byId = new Map<string, StageNode>()
  for (const cfg of stageConfigs) {
    byId.set(cfg.id, {
      id: cfg.id,
      stageType: cfg.stage_type,
      title: cfg.title,
      image: cfg.image,
      choiceId: cfg.choice_id,
      taskPoolId: cfg.task_pool_id,
    })
  }
  // terminal stages may live in structure but not in stages config — synthesize minimal nodes
  for (const stage of structure.stages) {
    if (!byId.has(stage.id)) {
      const isTerminal = structure.terminal_stages.includes(stage.id)
      byId.set(stage.id, {
        id: stage.id,
        stageType: isTerminal ? 'conclusion' : 'task',
        title: stage.id,
      })
    }
  }
  return Object.fromEntries(byId)
}

function buildTransitions(structure: RawStructure): Record<string, StageTransitionMap> {
  const out: Record<string, StageTransitionMap> = {}
  for (const stage of structure.stages) {
    out[stage.id] = {
      ...(stage.next_by_action ?? {}),
      ...(stage.next_by_outcome ?? {}),
    }
  }
  return out
}

// ---------- Build choices -----------------------------------------------------

function buildChoices(): Record<string, ChoiceDef> {
  const out: Record<string, ChoiceDef> = {}
  for (const file of listDir('choices')) {
    const raw = loadYaml<RawChoice>(join('choices', file))
    const options: ChoiceOption[] = raw.actions.map(a => ({ id: a.id, text: a.text }))
    out[raw.id] = { id: raw.id, kind: raw.kind, title: raw.title, options }
  }
  return out
}

// ---------- Build tasks -------------------------------------------------------

function buildTasks(pools: RawTaskPool): Record<string, TaskVariant> {
  const out: Record<string, TaskVariant> = {}
  const poolByTask = new Map<string, string>()
  for (const [poolId, pool] of Object.entries(pools.task_pools)) {
    for (const taskId of pool.task_ids) {
      poolByTask.set(taskId, poolId)
    }
  }

  for (const file of listDir('tasks')) {
    const raw = loadYaml<RawTask>(join('tasks', file))
    // file basename = task id per World/README convention
    const id = basename(file, '.yaml')
    const poolId = poolByTask.get(id) ?? raw.pool
    const options: TaskOption[] = raw.actions
      .filter(a => a.outcome) // only count answerable actions
      .map(a => ({
        id: a.id,
        text: a.text,
        outcome: a.outcome as TaskOption['outcome'],
      }))
    out[id] = {
      id,
      poolId,
      language: raw.language,
      title: raw.title,
      options,
    }
  }
  return out
}

// ---------- Validation --------------------------------------------------------

class ValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`graph validation failed:\n  - ${issues.join('\n  - ')}`)
  }
}

function validate(graph: StageGraph): void {
  const issues: string[] = []

  // 1. entry exists
  if (!graph.stages[graph.entry]) {
    issues.push(`entry stage "${graph.entry}" not in stages`)
  }

  // 2. every transition target exists as a stage
  for (const [from, trans] of Object.entries(graph.transitions)) {
    for (const [key, ref] of Object.entries(trans)) {
      for (const stageId of expandTargets(ref as NextRef)) {
        if (!graph.stages[stageId]) {
          issues.push(`transition ${from}.${key} -> "${stageId}" not in stages`)
        }
      }
    }
  }

  // 3. every terminal in stages
  for (const term of graph.terminals) {
    if (!graph.stages[term]) {
      issues.push(`terminal "${term}" not in stages`)
    }
  }

  // 4. reachability — BFS from entry
  const reachable = new Set<string>()
  const stack: string[] = [graph.entry]
  while (stack.length) {
    const cur = stack.pop()!
    if (reachable.has(cur)) continue
    reachable.add(cur)
    const trans = graph.transitions[cur] ?? {}
    for (const ref of Object.values(trans)) {
      for (const stageId of expandTargets(ref as NextRef)) {
        if (!reachable.has(stageId)) stack.push(stageId)
      }
    }
  }
  for (const id of Object.keys(graph.stages)) {
    if (!reachable.has(id)) {
      issues.push(`stage "${id}" is unreachable from entry "${graph.entry}"`)
    }
  }
  for (const term of graph.terminals) {
    if (!reachable.has(term)) {
      issues.push(`terminal "${term}" is unreachable from entry "${graph.entry}"`)
    }
  }

  // 5. choices referenced by stages exist
  for (const stage of Object.values(graph.stages)) {
    if (stage.choiceId && !graph.choices[stage.choiceId]) {
      issues.push(`stage "${stage.id}" references missing choice "${stage.choiceId}"`)
    }
    if (stage.taskPoolId) {
      // task pool is informational here — variants are referenced by id from structure
      // but we also want at least one variant to exist for the test to be meaningful
      const variantsInPool = Object.values(graph.tasks).filter(t => t.poolId === stage.taskPoolId)
      if (variantsInPool.length === 0) {
        issues.push(`stage "${stage.id}" references task pool "${stage.taskPoolId}" which has no variants`)
      }
    }
  }

  // 6. terminal stages must have NO outgoing transitions
  for (const term of graph.terminals) {
    const t = graph.transitions[term] ?? {}
    if (Object.keys(t).length > 0) {
      issues.push(`terminal "${term}" has outgoing transitions: ${Object.keys(t).join(', ')}`)
    }
  }

  if (issues.length) throw new ValidationError(issues)
}

// ---------- Main --------------------------------------------------------------

function build(): StageGraph {
  const structure = loadYaml<RawStructure>('01_structure.yaml')
  const stageConfigs = loadYaml<RawStages>('stages/01-stages.yaml').stages
  const pools = loadYaml<RawTaskPool>('02_taskpools.yaml')

  const stages = buildStages(structure, stageConfigs)
  const transitions = buildTransitions(structure)
  const choices = buildChoices()
  const tasks = buildTasks(pools)

  const graph: StageGraph = {
    entry: structure.start_stage,
    terminals: structure.terminal_stages,
    stages,
    transitions,
    choices,
    tasks,
    meta: {
      builtAt: new Date().toISOString(),
      bundleRoot: BUNDLE,
      stageCount: Object.keys(stages).length,
      taskCount: Object.keys(tasks).length,
      choiceCount: Object.keys(choices).length,
    },
  }

  validate(graph)
  return graph
}

function main() {
  try {
    const graph = build()
    mkdirSync(OUT_DIR, { recursive: true })
    writeFileSync(OUT_FILE, JSON.stringify(graph, null, 2))
    // eslint-disable-next-line no-console
    console.log(
      `[build-graph] OK · ${graph.meta.stageCount} stages, ` +
      `${graph.meta.taskCount} tasks, ${graph.meta.choiceCount} choices, ` +
      `${graph.terminals.length} terminals · ${OUT_FILE}`
    )
  } catch (err) {
    if (err instanceof ValidationError) {
      // eslint-disable-next-line no-console
      console.error(`[build-graph] ${err.message}`)
      process.exit(1)
    }
    throw err
  }
}

main()