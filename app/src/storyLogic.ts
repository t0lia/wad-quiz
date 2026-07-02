const CONDITION_RE = /^([A-Za-z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/

export type StoryFlagOperationSpec = {
  flag: string
  operation: 'set' | 'remove' | 'add'
  value?: number
}

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