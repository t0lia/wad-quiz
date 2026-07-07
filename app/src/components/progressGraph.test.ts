import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hydroMachine } from '../machine1'
import { buildSceneOrder, resolveProgress, isVisibleScene, type MachineConfigLike } from './progressGraph'

const machine = hydroMachine as unknown as MachineConfigLike

test('buildSceneOrder starts at the configured initial state', () => {
  const order = buildSceneOrder(machine)
  assert.ok(order.length > 0, 'order should not be empty')
  // initial state must be in the visited set, but only the visible
  // ones are recorded into `order`; section_1 has meta, so it does.
  assert.equal(order[0], 'section_1')
})

test('buildSceneOrder records every visible leaf exactly once', () => {
  const order = buildSceneOrder(machine)
  const states = machine.config?.states ?? {}
  const visibleIds = Object.entries(states)
    .filter(([, c]) => isVisibleScene(c))
    .map(([id]) => id)
  assert.equal(
    order.length,
    visibleIds.length,
    `order length (${order.length}) should equal number of visible scenes (${visibleIds.length})`,
  )
  assert.equal(new Set(order).size, order.length, 'order must be unique')
})

test('resolveProgress returns idx in [0, total-1]', () => {
  const { total } = resolveProgress(machine, 'section_1')
  for (const id of ['section_1', 'section_3', 'ending_3', 'section_10_debt_conclusion_clean']) {
    const { idx, progress, total: t } = resolveProgress(machine, id)
    assert.ok(idx >= 0 && idx < t, `idx ${idx} for ${id} should be in [0, ${t})`)
    assert.ok(progress >= 0 && progress <= 1, `progress ${progress} should be in [0, 1]`)
    assert.equal(t, total, `total must match between probes`)
  }
})

test('progress is monotonically non-decreasing along a sample path', () => {
  const order = buildSceneOrder(machine)
  const indexOf = (id: string) => order.indexOf(id)
  const path = ['section_1', 'section_2_standard_intro', 'section_3', 'ending_3']
  let prev = -1
  for (const id of path) {
    const { idx } = resolveProgress(machine, id)
    assert.ok(idx > prev, `progress should grow: ${prev} -> ${idx} at ${id} (order index: ${indexOf(id)})`)
    prev = idx
  }
})

test('resolveProgress returns 0 for an unknown state (defensive)', () => {
  const { idx, progress } = resolveProgress(machine, 'state_that_does_not_exist')
  assert.equal(idx, 0)
  assert.equal(progress, 0)
})
