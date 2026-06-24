import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { load } from 'js-yaml'
import Ajv from 'ajv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SCHEMA_PATH = resolve(__dirname, '..', '..', 'data', '06-gn_structure.schema.json')

// ── types matching the schema ──────────────────────────────────────────────

interface NextWhenEntry {
  if?: string
  value?: string
  else?: string
}

interface ConclusionEntry {
  narrative: string
  next_section?: string
  next?: string
  next_section_when?: NextWhenEntry[]
  next_if_continue?: string | Record<string, string>
  next_if_stop?: string
}

interface BranchAction {
  id: string
  text: string
  description: string
  sets_flag?: string
  next?: string
}

interface ProblemAction {
  id: string
  text: string
  description: string
  outcome: 'solved' | 'incorrect' | 'override'
  sets_flag?: string
}

interface BranchInteraction {
  type: 'branch'
  title: string
  prompt: string
  actions: BranchAction[]
}

interface ProblemInteraction {
  type: 'problem'
  title: string
  prompt: string
  snippet?: string[]
  modifiers?: Array<{ condition: string; effect: string }>
  actions: ProblemAction[]
}

interface Section {
  id: string
  title: string
  location_id: string
  intro: { narrative: string; dialogue?: Array<{ speaker: string; text: string }> }
  interaction: BranchInteraction | ProblemInteraction
  conclusion:
    | { by_action: Record<string, ConclusionEntry> }
    | { by_outcome: Record<string, ConclusionEntry> }
}

interface Ending {
  id: string
  title: string
  tier: string
  condition: string
  summary: string
  epilogue: { narrative: string; [k: string]: unknown }
  variant_pool: { count: number; selection: string }
}

interface StoryDocument {
  format: string
  version: number
  language: string
  session: {
    post_node_exit_sections: Array<{ after_node: string; section_id: string }>
    [k: string]: unknown
  }
  scenario: {
    start_section: string
    sections: Section[]
    endings: Ending[]
    [k: string]: unknown
  }
  [k: string]: unknown
}

// ── referential integrity ──────────────────────────────────────────────────

function checkRefs(doc: StoryDocument): string[] {
  const errors: string[] = []
  const { sections, endings, start_section } = doc.scenario
  const sectionIds = new Set(sections.map(s => s.id))
  const endingIds = new Set(endings.map(e => e.id))
  const validTargets = new Set([...sectionIds, ...endingIds])

  function assertTarget(ref: string, ctx: string): void {
    if (!validTargets.has(ref)) {
      errors.push(`${ctx}: "${ref}" is not a known section or ending id`)
    }
  }

  function assertSection(ref: string, ctx: string): void {
    if (!sectionIds.has(ref)) {
      errors.push(`${ctx}: "${ref}" is not a known section id`)
    }
  }

  assertSection(start_section, 'scenario.start_section')

  doc.session.post_node_exit_sections.forEach((entry, i) => {
    assertSection(entry.section_id, `session.post_node_exit_sections[${i}].section_id`)
  })

  for (const section of sections) {
    const base = `section "${section.id}"`

    if (section.interaction.type === 'branch') {
      section.interaction.actions.forEach((action, i) => {
        if (action.next) {
          assertTarget(action.next, `${base} → interaction.actions[${i}].next`)
        }
      })
    }

    const conclusionMap: Record<string, ConclusionEntry> =
      'by_action' in section.conclusion
        ? section.conclusion.by_action
        : section.conclusion.by_outcome

    for (const [key, entry] of Object.entries(conclusionMap)) {
      const entryBase = `${base} → conclusion.${key}`
      if (entry.next) assertTarget(entry.next, `${entryBase}.next`)
      if (entry.next_section) assertTarget(entry.next_section, `${entryBase}.next_section`)
      if (entry.next_if_stop) assertTarget(entry.next_if_stop, `${entryBase}.next_if_stop`)
      if (entry.next_if_continue) {
        if (typeof entry.next_if_continue === 'string') {
          assertTarget(entry.next_if_continue, `${entryBase}.next_if_continue`)
        } else {
          for (const [k, v] of Object.entries(entry.next_if_continue)) {
            assertTarget(v, `${entryBase}.next_if_continue.${k}`)
          }
        }
      }
      if (entry.next_section_when) {
        entry.next_section_when.forEach((cond, i) => {
          const ref = 'value' in cond && cond.value ? cond.value : cond.else
          if (ref) assertTarget(ref, `${entryBase}.next_section_when[${i}]`)
        })
      }
    }
  }

  return errors
}

// ── main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: tsx scripts/validate-story-yaml.ts <path-to-yaml>')
    process.exitCode = 1
    return
  }

  let raw: string
  try {
    raw = await readFile(resolve(filePath), 'utf8')
  } catch {
    console.error(`Cannot read file: ${filePath}`)
    process.exitCode = 1
    return
  }

  let parsed: unknown
  try {
    parsed = load(raw)
  } catch (e: unknown) {
    console.error('YAML parse error:', e instanceof Error ? e.message : String(e))
    process.exitCode = 1
    return
  }

  const schemaRaw = await readFile(SCHEMA_PATH, 'utf8')
  const schema: object = JSON.parse(schemaRaw)

  const ajv = new Ajv({ allErrors: true })
  const valid = ajv.validate(schema, parsed)

  if (!valid) {
    console.error('Schema validation failed:')
    for (const err of ajv.errors ?? []) {
      const path = err.instancePath || '(root)'
      console.error(`  ${path}: ${err.message}`)
    }
    process.exitCode = 1
    return
  }

  const refErrors = checkRefs(parsed as StoryDocument)
  if (refErrors.length > 0) {
    console.error('Referential integrity errors:')
    for (const err of refErrors) {
      console.error('  ' + err)
    }
    process.exitCode = 1
    return
  }

  console.log('Validation passed.')
}

main().catch((e: unknown) => {
  console.error('Unexpected error:', e instanceof Error ? e.message : String(e))
  process.exitCode = 1
})
