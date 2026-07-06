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
      reading: 'Delivers the fix, protects the team, and keeps standards intact under pressure.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 0.75', technical: '>= 2.5' },
    result: {
      category: 'Teal',
      archetype: 'Controlled Expert',
      reading: 'Technically decisive and still safe to operate around.',
    },
  },
  {
    when: { dedication: '>= 2.5', social: '>= 0.75', technical: '>= 0.75' },
    result: {
      category: 'Teal',
      archetype: 'Steady Executor',
      reading: 'Pushes work through responsibly, even if not always elegantly.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 2.5', technical: '-0.74..2.49' },
    result: {
      category: 'Teal',
      archetype: 'Team-First Operator',
      reading: 'Protects trust and shared execution, even when the technical edge is moderate.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '>= 0.75', technical: '>= 0.75' },
    result: {
      category: 'Green',
      archetype: 'Balanced Contributor',
      reading: 'A dependable all-round performer without a single standout signature.',
    },
  },
  {
    when: { dedication: '>= 2.5', social: '-0.74..0.74', technical: '>= 0.75' },
    result: {
      category: 'Green',
      archetype: 'Relentless Fixer',
      reading: 'Keeps driving toward resolution, but does not consistently widen the circle of trust.',
    },
  },
  {
    when: { dedication: '-0.74..0.74', social: '>= 0.75', technical: '>= 2.5' },
    result: {
      category: 'Green',
      archetype: 'Technical Specialist',
      reading: 'Strong at solving the incident, with enough operational awareness to stay credible.',
    },
  },
  {
    when: { dedication: '-0.74..0.74', social: '-0.74..0.74', technical: '>= 0.75' },
    result: {
      category: 'Amber',
      archetype: 'Narrow Optimizer',
      reading: 'Can produce results, but too much of the success depends on one axis only.',
    },
  },
  {
    when: { dedication: '>= 0.75', social: '<= -0.75', technical: '>= 0.75' },
    result: {
      category: 'Amber',
      archetype: 'Lone Rescuer',
      reading: 'Gets important things done, but leaves avoidable trust damage behind.',
    },
  },
  {
    when: { dedication: '<= -0.75', social: '>= 0.75', technical: '-0.74..0.74' },
    result: {
      category: 'Amber',
      archetype: 'Careful Deferrer',
      reading: 'Protects people reasonably well, but struggles to carry technical momentum.',
    },
  },
  {
    when: { dedication: '<= -2.5', technical: '<= -0.75' },
    result: {
      category: 'Slate',
      archetype: 'Control Breach Risk',
      reading: 'Repeatedly sacrifices discipline and compounds technical risk.',
    },
  },
  {
    when: { social: '<= -2.5' },
    result: {
      category: 'Slate',
      archetype: 'Trust Erosion Risk',
      reading: 'Progress comes with visible damage to teammates, handoffs, or operational confidence.',
    },
  },
  {
    when: { dedication: '<= -0.75', social: '<= -0.75', technical: '<= -0.75' },
    result: {
      category: 'Slate',
      archetype: 'Unsteady Operator',
      reading: 'Harmful patterns show up across all three axes and need intervention.',
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
    reading: 'Mixed signals dominate; the player shows potential but not yet a stable profile.',
  }
}

export function formatEndingProfileLine(profile: EndingProfile): string {
  return `${profile.category}: ${profile.archetype} — ${profile.reading}`
}