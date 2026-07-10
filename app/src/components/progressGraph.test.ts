import { test } from 'node:test'
import assert from 'node:assert/strict'
import { hydroMachine } from '../machine1'
import { buildSceneOrder, resolveProgress, isVisibleScene, type MachineConfigLike } from './progressGraph'

const machine = hydroMachine as unknown as MachineConfigLike

test('buildSceneOrder starts at the configured initial state', () => {
  const order = buildSceneOrder(machine)
  assert.ok(order.length > 0, 'order should not be empty')
  // socks world initial state is `intro`, which has meta, so it shows up first.
  assert.equal(order[0], 'intro')
})

test('buildSceneOrder records every visible leaf exactly once', () => {
  const order = buildSceneOrder(machine)
  const states = machine.config?.states ?? {}
  // Build the same visited set BFS uses so we only count reachable scenes.
  const reachable = new Set(order)
  const visibleIds = Object.entries(states)
    .filter(([, c]) => isVisibleScene(c))
    .map(([id]) => id)
    .filter((id) => reachable.has(id))
  assert.equal(
    order.length,
    visibleIds.length,
    `order length (${order.length}) should equal number of reachable visible scenes (${visibleIds.length})`,
  )
  assert.equal(new Set(order).size, order.length, 'order must be unique')
})

test('resolveProgress returns idx in [0, total-1]', () => {
  const { total } = resolveProgress(machine, 'intro')
  for (const id of ['intro', 'task_1', 'task_2_hot_streak', 'final_choice', 'the_end']) {
    const { idx, progress, total: t } = resolveProgress(machine, id)
    assert.ok(idx >= 0 && idx < t, `idx ${idx} for ${id} should be in [0, ${t})`)
    assert.ok(progress >= 0 && progress <= 1, `progress ${progress} should be in [0, 1]`)
    assert.equal(t, total, `total must match between probes`)
  }
})

test('progress is monotonically non-decreasing along a sample path', () => {
  const order = buildSceneOrder(machine)
  const indexOf = (id: string) => order.indexOf(id)
  const path = ['intro', 'task_1_intro', 'task_3_perfect_intro', 'final_choice', 'final_choice_conclusion_keep', 'the_end'] // socks-world sample path
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
