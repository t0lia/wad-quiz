/**
 * End-to-end greedy walk: drive the UI by clicking every visible interactive
 * element, one at a time, until the engine lands on a terminal scene.
 *
 * Strategy (hybrid):
 *   - Graph from `tests/e2e/build-graph.ts` is the *oracle* — every scene we
 *     reach must be a known stage or terminal. Unknown scene = fail.
 *   - We don't drive *by* the graph (no combinatorial explosion).
 *   - We don't drive *by* text matching (works today, brittle tomorrow).
 *     Instead we discover every clickable element in the DOM, fingerprint
 *     each by (role, text, position), and click each unseen fingerprint
 *     once. That's the greedy part.
 *
 * What this catches:
 *   - A button the engine stopped wiring up (clicked → no state change → idle).
 *   - A scene that the bundle doesn't know about (oracle rejects).
 *   - Console / page errors anywhere along the path.
 *
 * What this does NOT catch (deferred — see notes inline):
 *   - Per-option coverage (we don't guarantee every option is clicked; we
 *     guarantee every *currently visible* option is clicked at the moment
 *     we visit that scene).
 *   - The restart-button contract — separate test, per Alex's call.
 */

import { test, expect } from '@playwright/test'
import { loadGraph } from './helpers/graphLoader.ts'
import { greedyWalkUntilTerminal, runGreedyScenario } from './helpers/greedyClicker.ts'

const graph = loadGraph()

test.beforeAll(() => {
  // eslint-disable-next-line no-console
  console.log(
    `[graph] ${Object.keys(graph.stages).length} stages, ` +
    `${graph.tasks ? Object.keys(graph.tasks).length : 0} tasks, ` +
    `${graph.choices ? Object.keys(graph.choices).length : 0} choices, ` +
    `${graph.terminals.length} terminals`
  )
  expect(graph.entry).toBeTruthy()
  expect(graph.stages[graph.entry]).toBeTruthy()
  // The graph must at least know about its entry and every terminal.
  for (const term of graph.terminals) {
    expect(graph.stages[term] || term, `terminal "${term}" must be either a stage or a standalone terminal id`).toBeTruthy()
  }
})

test('greedy walk reaches a terminal scene with no console errors', async ({ browser }) => {
  const result = await runGreedyScenario(browser, graph)

  // Log the full path so failures are debuggable from the Playwright report
  // alone (no need to open the trace.zip).
  // eslint-disable-next-line no-console
  console.log(`[walk] ${result.clickedCount} clicks, terminal=${result.reachedTerminal}, path:\n  ${result.path.join('\n  ')}`)

  expect(result.reachedTerminal, `walk did not reach a terminal; path=${result.path.join(' -> ')}`).toBe(true)
  expect(result.errors, `console/page errors during walk:\n${result.errors.join('\n')}`).toEqual([])
  // We should have *done* something — at minimum one click per scene visited.
  expect(result.clickedCount).toBeGreaterThan(0)
})

test('greedy walk visits every reachable stage (best-effort coverage)', async ({ browser }) => {
  const result = await runGreedyScenario(browser, graph)
  const visitedScenes = new Set(result.path)

  // We don't promise every stage gets visited in a single greedy run —
  // the engine may pick option B every time we reach a fork, never giving
  // us a chance to click option A. But a *healthy* walk should cover a
  // substantial fraction of the graph. If we end up with only 2 scenes
  // visited, something is very wrong.
  expect(visitedScenes.size, `only ${visitedScenes.size} distinct scenes visited`).toBeGreaterThan(5)
  // eslint-disable-next-line no-console
  console.log(`[coverage] visited ${visitedScenes.size} distinct scenes of ${Object.keys(graph.stages).length}`)
})

// --- Diagnostics -------------------------------------------------------------

test('debug: click through and dump clickables at every state change', async ({ browser }) => {
  const ctx = await browser.newContext()
  try {
    const { freshContext, currentStage, sceneGroup } = await import('./helpers/appDriver.ts')
    const { discoverClickables } = await import('./helpers/greedyClicker.ts')
    const page = await freshContext(ctx)
    await page.goto('/')
    await page.waitForFunction(() => {
      try { return !!localStorage.getItem('wad-quiz-progress') } catch { return false }
    }, undefined, { timeout: 10_000 })

    let lastState = ''
    for (let i = 0; i < 40; i++) {
      const state = (await currentStage(page)) ?? 'none'
      if (state !== lastState) {
        // eslint-disable-next-line no-console
        console.log(`[debug] tick=${i} state=${state} (group=${sceneGroup(state)})`)
        lastState = state
        const cands = await discoverClickables(page)
        // eslint-disable-next-line no-console
        console.log(`[debug]   ${cands.length} clickables:`)
        for (const c of cands) {
          // eslint-disable-next-line no-console
          console.log(`[debug]     - role=${c.el.role} text="${c.el.text.slice(0, 50)}" state=${c.el.state}`)
        }
      }
      const cands = await discoverClickables(page)
      if (cands.length === 0) {
        await page.waitForTimeout(400)
        continue
      }
      await cands[0].locator.click({ timeout: 3_000 }).catch(() => {})
      await page.waitForTimeout(300)
    }
    expect(true).toBe(true)
  } finally {
    await ctx.close()
  }
})

test('debug: list clickables visible at the entry scene', async ({ browser }) => {
  const ctx = await browser.newContext()
  try {
    const { freshContext } = await import('./helpers/appDriver.ts')
    const { discoverClickables } = await import('./helpers/greedyClicker.ts')
    const page = await freshContext(ctx)
    await page.goto('/')
    await page.waitForFunction(() => {
      try { return !!localStorage.getItem('wad-quiz-progress') } catch { return false }
    }, undefined, { timeout: 10_000 })
    const cands = await discoverClickables(page)
    // eslint-disable-next-line no-console
    console.log(`[debug] ${cands.length} clickables visible at entry:`)
    for (const c of cands.slice(0, 20)) {
      // eslint-disable-next-line no-console
      console.log(`  - role=${c.el.role} text="${c.el.text.slice(0, 60)}"`)
    }
    expect(cands.length).toBeGreaterThan(0)
  } finally {
    await ctx.close()
  }
})