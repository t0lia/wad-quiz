/**
 * Greedy clicker — given a page that's already on some scene, find every
 * interactive element the user could plausibly click, click the unseen ones
 * in DOM order, and keep going until either the engine reaches a terminal
 * scene or we exhaust the visible interactive surface.
 *
 * Why "greedy" instead of graph-driven:
 *   - The graph tells us *where the world allows us to go*; it doesn't tell
 *     us *which buttons actually work* in the UI today. The greedy clicker
 *     exercises the UI as a user would: tap everything that's tappable.
 *   - Less brittle to engine-side reshuffling (variants, intro/task/conclusion
 *     substate naming). When the bundle shape changes, only the graph oracle
 *     needs updating — the clicker still does its job.
 *
 * Hybrid mode:
 *   - After every state change, we read the new scene and ask the graph
 *     oracle "is this a known scene?". An unknown scene → fail (the engine
 *     reached something the bundle doesn't know about, or the snapshot is
 *     corrupted).
 *   - We don't *drive* by the graph — we *verify* against it.
 *
 * Skip list (hardcoded, by class or attribute):
 *   - .restart-btn--fixed — the ↺ in the corner that wipes localStorage.
 *   - .dialog-btn — the "Continue?" modal buttons, irrelevant during a fresh
 *     walk (we start from a clean storage).
 *   - anything inside .dialog-overlay — same reason.
 *   - [disabled] — frozen segments from already-resolved scenes.
 *   - [aria-disabled="true"] — same intent.
 */

import type { Page } from '@playwright/test'
import {
  currentStage,
  sceneGroup,
  installErrorCapture,
  freshContext,
} from './appDriver.ts'
import type { StageGraph } from '../graphSchema.ts'

// --- Fingerprint: a stable signature for a DOM element -----------------------
//
// We can't use element indices (DOM re-renders shift them) and we can't rely
// on tag+class alone (the same `<button class="tap-hint">` is the "next" button
// for many scenes). What survives across re-renders is:
//   - the element's normalized text (trimmed, lowercased, collapsed whitespace)
//   - a discriminator (tag name + its position in its parent's child list)
//   - the role (button vs link vs option)
//
// The selector we hand to Playwright is built from the live DOM each tick —
// even if React swaps the underlying <button>, the new one with the same text
// in the same role will get the same fingerprint, so visited tracking survives.

export interface Fingerprint {
  text: string
  role: ClickRole
  siblingIndex: number
  /** Raw state id — see greedyWalkUntilTerminal for how visited-keys are built. */
  state: string
  key: string
}

type ClickRole = 'button' | 'option' | 'submit' | 'generic'

function normText(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase()
}

// --- Clickable discovery ------------------------------------------------------

const SKIP_CLASSES = ['restart-btn--fixed']
const SKIP_PARENT_CLASSES = ['dialog-overlay']

interface ClickableCandidate {
  /** Pre-built Playwright locator — no string selectors, just a chain. */
  locator: import('@playwright/test').Locator
  el: Fingerprint
}

/**
 * Discover every interactive element currently in the DOM that we are
 * willing to click. Returns an array ordered by DOM position (so we always
 * click the topmost-tap-leftmost element first — close to user intuition).
 *
 * Returns Locators (live, re-evaluated on each .click()) rather than string
 * selectors — so we don't need to invent CSS paths for the rare inner buttons
 * we have to click. We just filter by role + class + skip rules.
 */
async function discoverClickables(page: Page): Promise<ClickableCandidate[]> {
  // Current raw state id — used as a fingerprint dimension so the same DOM
  // element rendered in two different sub-states gets two different fingerprints.
  // (Scene-group is too coarse: every intro and every task renders an
  // identical "tap to continue" button we want to click once per sub-state.)
  const state = await currentStage(page).catch(() => undefined) ?? ''
  // Build a list of (locator-chain, fingerprint) pairs.
  // We can't generate fingerprints from inside page.evaluate() because we
  // also need to return a usable Locator. Instead we collect everything
  // here in Node-land, then filter for clickability once.
  const candidates: ClickableCandidate[] = []

  // 1. Generic interactive elements
  for (const sel of ['button', 'a[href]', '[role="button"]', 'summary', 'input:not([type="hidden"])']) {
    const els = page.locator(sel)
    const count = await els.count()
    for (let i = 0; i < count; i++) {
      const el = els.nth(i)
      candidates.push({ locator: el, el: await makeFingerprint(el, 'button', i, state) })
    }
  }

  // 2. SingleChoice options
  const opts = page.locator('.option-list .option')
  const optCount = await opts.count()
  for (let i = 0; i < optCount; i++) {
    candidates.push({ locator: opts.nth(i), el: await makeFingerprint(opts.nth(i), 'option', i, state) })
  }

  // 3. Submit buttons (separate role so visited tracking disambiguates from generic buttons)
  const subs = page.locator('.submit-btn--problem')
  const subCount = await subs.count()
  for (let i = 0; i < subCount; i++) {
    candidates.push({ locator: subs.nth(i), el: await makeFingerprint(subs.nth(i), 'submit', i, state) })
  }

  // Filter: skip disabled, skip restart, skip inside dialog overlay.
  const filtered: ClickableCandidate[] = []
  for (const c of candidates) {
    if (!(await c.locator.isVisible().catch(() => false))) continue
    if (await c.locator.evaluate((el: Element) => (el as HTMLButtonElement | HTMLInputElement).disabled || el.getAttribute('aria-disabled') === 'true').catch(() => true)) continue
    const cls = await c.locator.evaluate((el: Element) => el.className || '').catch(() => '')
    const parentCls = await c.locator.evaluate((el: Element) => {
      let p: Element | null = el.parentElement
      let cls = ''
      while (p) { cls += ' ' + (p.className || ''); p = p.parentElement }
      return cls
    }).catch(() => '')
    if (SKIP_CLASSES.some(s => cls.includes(s))) continue
    if (SKIP_PARENT_CLASSES.some(s => parentCls.includes(s))) continue
    filtered.push(c)
  }
  return filtered
}

async function makeFingerprint(
  locator: import('@playwright/test').Locator,
  role: Fingerprint['role'],
  siblingIndex: number,
  state: string
): Promise<Fingerprint> {
  const text = await locator.evaluate((el: Element) => (el.textContent ?? '').replace(/\s+/g, ' ').trim()).catch(() => '')
  const tag = await locator.evaluate((el: Element) => el.tagName).catch(() => '?')
  const norm = normText(text)
  return {
    text: norm,
    role,
    siblingIndex,
    state,
    key: `${state}|${role}|${tag}|${siblingIndex}|${norm}`,
  }
}

// Exported for the debug-only test in full-graph.spec.ts.
export { discoverClickables }
export interface WalkResult {
  /** Every scene-group id we visited, in order, including repeats. */
  path: string[]
  /** Distinct clickable fingerprints we clicked. */
  clickedCount: number
  /** Whether we ended at a terminal stage. */
  reachedTerminal: boolean
  /** Any console / page errors observed during the walk. */
  errors: string[]
}

/**
 * Run the greedy clicker from the page's current state until either:
 *   - the engine reaches a terminal stage (graph.terminals), OR
 *   - we've made `maxIdleTicks` consecutive ticks without finding any new
 *     clickable (we're stuck — surface exhausted), OR
 *   - the overall `timeoutMs` deadline expires.
 *
 * The graph is consulted only as an oracle: every scene-group we land on
 * must be either `graph.entry`, in `graph.terminals`, or in `graph.stages`.
 * Anything else is a fail.
 */
export async function greedyWalkUntilTerminal(
  page: Page,
  graph: StageGraph,
  opts: { maxIdleTicks?: number; timeoutMs?: number } = {}
): Promise<WalkResult> {
  // Defaults: 30 ticks × 500ms = 15s window for the engine to react after a
  // click that triggered a dialogue (~5–8s on slow scenes).
  const maxIdle = opts.maxIdleTicks ?? 30
  const deadline = Date.now() + (opts.timeoutMs ?? 600_000)
  const errors = installErrorCapture(page)

  const path: string[] = []
  // visited-key strategy: `<elKey>@<stateVisitN>` — stateVisitN increments
  // *every time we enter the same raw state id*, so the same DOM button
  // clicked twice within one state is allowed (we may need to click "tap to
  // continue" twice in `section_1` — once to reveal dialogue, once to skip
  // past it to the task). When the state changes, stateVisitN resets.
  const visited = new Set<string>()
  const stateVisitN = new Map<string, number>()
  let clickedCount = 0
  let idleTicks = 0
  let ticksSinceLastClick = 0

  const startRaw = await currentStage(page)
  const startGroup = startRaw ? sceneGroup(startRaw) : ''
  if (!startGroup) throw new Error('greedyWalkUntilTerminal: no scene in snapshot at start')
  path.push(startGroup)
  assertKnownScene(startGroup, graph)

  while (Date.now() < deadline) {
    // Stop condition: terminal.
    const curRaw = await currentStage(page)
    const curGroup = curRaw ? sceneGroup(curRaw) : ''
    if (curGroup && graph.terminals.includes(curGroup)) {
      return { path, clickedCount, reachedTerminal: true, errors }
    }

    // Re-discover clickables every tick (DOM changes as we click).
    const candidates = await discoverClickables(page)
    const visit = curRaw ? (stateVisitN.get(curRaw) ?? 0) : 0
    const fresh = candidates.filter(c => !visited.has(`${c.el.key}@${visit}`))
    if (fresh.length === 0) {
      idleTicks++
      ticksSinceLastClick++
      if (idleTicks >= maxIdle) {
        return { path, clickedCount, reachedTerminal: false, errors }
      }
      const wait = ticksSinceLastClick < 5 ? 800 : 500
      await page.waitForTimeout(wait)
      continue
    }
    idleTicks = 0
    ticksSinceLastClick = 0

    // Click the first fresh candidate.
    const target = fresh[0]
    visited.add(`${target.el.key}@${visit}`)
    const beforeRaw = curRaw
    const beforeGroup = curGroup
    try {
      await target.locator.click({ timeout: 3_000 })
      clickedCount++
    } catch (err) {
      const retry = await discoverClickables(page)
      const match = retry.find(c => !visited.has(`${c.el.key}@${(stateVisitN.get(c.el.state) ?? 0)}`))
      if (match) {
        await match.locator.click({ timeout: 3_000 }).catch(() => { /* engine reacted */ })
        visited.add(`${match.el.key}@${stateVisitN.get(match.el.state) ?? 0}`)
        clickedCount++
      }
    }
    // Bump the visit counter for whatever state we just clicked in — this is
    // what lets the same DOM button be clicked twice within one state (e.g.
    // two consecutive "tap to continue" reveals in section_1).
    stateVisitN.set(target.el.state, (stateVisitN.get(target.el.state) ?? 0) + 1)

    // Brief settle to let React effects queue up the next snapshot.
    await page.waitForTimeout(300)
    const afterRaw = await currentStage(page)
    const afterGroup = afterRaw ? sceneGroup(afterRaw) : ''
    if (afterRaw && afterRaw !== beforeRaw) {
      // state changed — bump visit counter for the *new* state so its stale
      // visited entries from prior visits get a fresh shot.
      stateVisitN.set(afterRaw, (stateVisitN.get(afterRaw) ?? 0) + 1)
    }
    if (afterGroup && afterGroup !== beforeGroup) {
      assertKnownScene(afterGroup, graph)
      path.push(afterGroup)
    }
  }
  throw new Error(`greedyWalkUntilTerminal: timed out after ${opts.timeoutMs ?? 600_000}ms; path=${path.join(' -> ')}`)
}

function assertKnownScene(group: string, graph: StageGraph): void {
  if (group === graph.entry) return
  if (graph.terminals.includes(group)) return
  if (graph.stages[group]) return
  throw new Error(
    `scene "${group}" is not in graph (entry=${graph.entry}, terminals=${graph.terminals.length}, stages=${Object.keys(graph.stages).length})`
  )
}

// --- Convenience wrapper -----------------------------------------------------

/**
 * One-shot helper: spin up a fresh BrowserContext, navigate, and run the
 * greedy walker until terminal or idle. Use this from a single Playwright
 * test() so each scenario gets a clean storage.
 */
export async function runGreedyScenario(
  browser: import('@playwright/test').Browser,
  graph: StageGraph
): Promise<WalkResult> {
  const ctx = await browser.newContext()
  try {
    const page = await freshContext(ctx)
    await page.goto('/')
    // wait for the engine to persist its first snapshot
    await page.waitForFunction(() => {
      try { return !!localStorage.getItem('wad-quiz-progress') } catch { return false }
    }, undefined, { timeout: 10_000 })
    return await greedyWalkUntilTerminal(page, graph)
  } finally {
    await ctx.close()
  }
}