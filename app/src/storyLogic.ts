const CONDITION_RE = /^([A-Za-z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/

type Score = { technical: number; dedication: number; social: number }

export type EndingProfile = {
  category: 'Sapphire' | 'Teal' | 'Green' | 'Amber' | 'Slate'
  archetype: string
  reading: string
}

export type StoryFlagOperationSpec = {
  flag: string
  operation: 'set' | 'remove' | 'add'
  value?: number
}

const ENDING_PROFILE_RULES: Array<{ when: Partial<Record<keyof Score, string>>; result: EndingProfile }> = [
  {
    when: { technical: '>= 3' },
    result: {
      category: 'Sapphire',
      archetype: 'Sock Oracle',
      reading: 'Lucas finds every bug, wins both rare socks, and leaves the booth looking far too calm.',
    },
  },
  {
    when: { technical: '>= 2' },
    result: {
      category: 'Teal',
      archetype: 'Booth Closer',
      reading: 'Lucas solves most of the challenge, earns respect, and leaves with a story he will tell all day.',
    },
  },
  {
    when: { technical: '>= 1' },
    result: {
      category: 'Green',
      archetype: 'Curious Collector',
      reading: 'Lucas gets one good fix, learns the rest the hard way, and still leaves with pride.',
    },
  },
  {
    when: { technical: '>= 0' },
    result: {
      category: 'Amber',
      archetype: 'Lanyard Wanderer',
      reading: 'Lucas leaves with new respect for booth puzzles, one normal tote bag, and no rare socks.',
    },
  },
]

function parseConditionValue(rawValue: string): number | string {
  const trimmed = rawValue.trim()
  const numericValue = Number(trimmed)
  if (!Number.isNaN(numericValue)) {
    return numericValue
  }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }

  return trimmed
}

export function evaluateStoryCondition(context: Record<string, unknown>, condition: string): boolean {
  const match = CONDITION_RE.exec(condition.trim())
  if (!match) {
    return false
  }

  const [, flag, operator, rawValue] = match
  const left = Number(context[flag] ?? 0)
  const right = parseConditionValue(rawValue)

  if (typeof right === 'string') {
    const leftText = String(context[flag] ?? '')
    if (operator === '==') return leftText === right
    if (operator === '!=') return leftText !== right
    return false
  }

  if (operator === '==') return left === right
  if (operator === '!=') return left !== right
  if (operator === '>=') return left >= right
  if (operator === '<=') return left <= right
  if (operator === '>') return left > right
  return left < right
}

export function applyFlagOperations(
  context: Record<string, unknown>,
  operations: StoryFlagOperationSpec[],
): Record<string, unknown> {
  const nextContext: Record<string, unknown> = { ...context }

  for (const operation of operations) {
    if (operation.operation === 'remove') {
      delete nextContext[operation.flag]
      continue
    }

    if (operation.operation === 'set') {
      nextContext[operation.flag] = operation.value ?? 0
      continue
    }

    const currentValue = Number(nextContext[operation.flag] ?? 0)
    nextContext[operation.flag] = currentValue + (operation.value ?? 0)
  }

  return nextContext
}

function matchesThreshold(value: number, expression: string): boolean {
  const normalized = expression.trim()
  if (normalized === 'any' || normalized === 'otherwise') return true
  if (normalized.includes('..')) {
    const [minRaw, maxRaw] = normalized.split('..')
    const min = Number(minRaw)
    const max = Number(maxRaw)
    return value >= min && value <= max
  }

  const match = /^([<>]=?|==)\s*(-?\d+(?:\.\d+)?)$/.exec(normalized)
  if (!match) return false
  const [, operator, raw] = match
  const threshold = Number(raw)
  if (operator === '>=') return value >= threshold
  if (operator === '<=') return value <= threshold
  if (operator === '>') return value > threshold
  if (operator === '<') return value < threshold
  return value === threshold
}

export function resolveEndingProfile(score: Score): EndingProfile {
  for (const rule of ENDING_PROFILE_RULES) {
    const matches = Object.entries(rule.when).every(([axis, expression]) => matchesThreshold(score[axis as keyof Score], expression))
    if (matches) return rule.result
  }

  return {
    category: 'Amber',
    archetype: 'Developing Contributor',
    reading: 'Alex turned out to have real promise, and a few more steady reps should make the strengths louder than the general operational nonsense.',
  }
}

export function formatEndingProfileLine(profile: EndingProfile): string {
  return `${profile.archetype} — ${profile.reading}`
}

const CATEGORY_BG: Record<EndingProfile['category'], string> = {
  Sapphire: '#1e3a8a',
  Teal: '#0f766e',
  Green: '#15803d',
  Amber: '#b45309',
  Slate: '#475569',
}

export function categoryBackground(category: EndingProfile['category']): string {
  return CATEGORY_BG[category]
}
