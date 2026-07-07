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
    when: { dedication: '>= 2.5', social: '>= 2.5', technical: '>= 2.5' },
    result: {
      category: 'Sapphire',
      archetype: 'Trusted Stabilizer',
      reading: 'Alex has shown the rare talent of fixing the problem, calming the humans, and making the whole incident look almost professional.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 0.75', technical: '>= 2.5' },
    result: {
      category: 'Teal',
      archetype: 'Controlled Expert',
      reading: 'Alex turned out to be the kind of engineer who makes sharp technical calls while the blinking lights politely fail to cause a panic.',
    },
  },
  {
    when: { dedication: '>= 2.5', social: '>= 0.75', technical: '>= 0.75' },
    result: {
      category: 'Teal',
      archetype: 'Steady Executor',
      reading: 'Alex has shown steady hands, practical judgment, and the suspicious ability to keep a bad night moving in the right direction.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 2.5', technical: '-0.74..2.49' },
    result: {
      category: 'Teal',
      archetype: 'Team-First Operator',
      reading: 'Alex turned out to be the person who keeps the team together, the trust intact, and the incident from becoming a group hobby.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 0.75', technical: '>= 0.75' },
    result: {
      category: 'Green',
      archetype: 'Balanced Contributor',
      reading: 'Alex has shown the comforting habit of making important things work quietly, which is about as close to glamour as operations usually gets.',
    },
  },
  {
    when: { dedication: '>= 2.5', social: '-0.74..0.74', technical: '>= 0.75' },
    result: {
      category: 'Green',
      archetype: 'Relentless Fixer',
      reading: 'Alex turned out to be wonderfully hard to stop once the fix was in sight, and the next upgrade is letting a few more people into the hero shot.',
    },
  },
  {
    when: { dedication: '-0.74..0.74', social: '>= 0.75', technical: '>= 2.5' },
    result: {
      category: 'Green',
      archetype: 'Technical Specialist',
      reading: 'Alex has shown a fluent command of technical chaos, and the system seems to behave better once it realizes it is being judged.',
    },
  },
  {
    when: { dedication: '-0.74..0.74', social: '-0.74..0.74', technical: '>= 0.75' },
    result: {
      category: 'Amber',
      archetype: 'Narrow Optimizer',
      reading: 'Alex turned out to be very capable in a strong lane, and the next step is widening that lane until it stops looking like a tactical side quest.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '<= -0.75', technical: '>= 0.75' },
    result: {
      category: 'Amber',
      archetype: 'Lone Rescuer',
      reading: 'Alex has shown a real talent for pulling off the rescue, and the next level is making it feel slightly less like everyone else was dragged behind it.',
    },
  },
  {
    when: { dedication: '<= -0.75', social: '>= 0.75', technical: '-0.74..0.74' },
    result: {
      category: 'Amber',
      archetype: 'Careful Deferrer',
      reading: 'Alex turned out to have good instincts and welcome caution, and the next boost is trusting that caution to move a little faster.',
    },
  },
  {
    when: { dedication: '<= -2.5', technical: '<= -0.75' },
    result: {
      category: 'Slate',
      archetype: 'Control Breach Risk',
      reading: 'Alex has shown that operations can become exciting very quickly, and a little more structure would help keep the excitement in the optional category.',
    },
  },
  {
    when: { social: '<= -2.5' },
    result: {
      category: 'Slate',
      archetype: 'Trust Erosion Risk',
      reading: 'Alex turned out to move fast enough to leave sparks, and the next win is making the people nearby feel as supported as the machinery eventually does.',
    },
  },
  {
    when: { dedication: '<= -0.75', social: '<= -0.75', technical: '<= -0.75' },
    result: {
      category: 'Slate',
      archetype: 'Unsteady Operator',
      reading: 'Alex has shown the opening chapter of a very dramatic growth arc, which is a generous way of saying the sequel should go much better.',
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
