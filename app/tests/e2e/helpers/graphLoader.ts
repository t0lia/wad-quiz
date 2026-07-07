/**
 * Loads the pre-parsed graph from disk. The test never re-parses YAML —
 * `build-graph.ts` runs once (locally or in CI) and writes JSON that this
 * module loads.
 */

import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StageGraph } from './graphSchema.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CACHE = join(__dirname, '..', '.cache', 'graph.json')

let cached: StageGraph | undefined

export function loadGraph(): StageGraph {
  if (cached) return cached
  if (!existsSync(CACHE)) {
    throw new Error(
      `graph.json not found at ${CACHE}. ` +
      `Run: npx tsx tests/e2e/build-graph.ts`
    )
  }
  const raw = readFileSync(CACHE, 'utf8')
  cached = JSON.parse(raw) as StageGraph
  return cached
}