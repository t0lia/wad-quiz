/**
 * Playwright-уровневые обёртки над приложением.
 *
 * Стратегия:
 *   - currentStage() читает localStorage['wad-quiz-progress'] — это persisted
 *     xstate snapshot, в нём .value === state id. Это надёжнее любого
 *     DOM-матчинга: snapshot обновляется ДО рендера новой сцены, а заголовки
 *     scene-title повторяются между стадиями одного narrative scene.
 *   - sceneGroup() сворачивает sub-state id до scene-group id — зеркалит
 *     src/machine/sceneGroup.ts.
 *   - Каждый прогон стартует с чистого storage (freshContext), чтобы диалог
 *     "Welcome back?" не появлялся и мы всегда начинали с entry.
 */

import type { BrowserContext, Page } from '@playwright/test'

const STORAGE_KEY = 'wad-quiz-progress'

export async function freshContext(context: BrowserContext): Promise<Page> {
  const page = await context.newPage()
  await page.addInitScript((key: string) => {
    try { window.localStorage.removeItem(key) } catch { /* sandboxed */ }
  }, STORAGE_KEY)
  return page
}

/**
 * Read the current xstate state id from the persisted snapshot.
 * Returns undefined if no snapshot is stored yet (e.g. before first render).
 */
export async function currentStage(page: Page): Promise<string | undefined> {
  return await page.evaluate((key: string) => {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return undefined
      const snap = JSON.parse(raw)
      const v = snap?.value
      return typeof v === 'string' ? v : JSON.stringify(v)
    } catch {
      return undefined
    }
  }, STORAGE_KEY)
}

/** Strip a trailing _intro / _task_N / _conclusion_* suffix — mirrors sceneGroup.ts. */
export function sceneGroup(stateId: string): string {
  const introOrTask = stateId.match(/^(.*?)(?:_(?:intro|task_\d+|task))$/)
  if (introOrTask) return introOrTask[1]
  const concIdx = stateId.search(/_conclusion_/)
  if (concIdx !== -1) return stateId.slice(0, concIdx)
  return stateId
}

/**
 * Subscribe to console + pageerror events. Returns a buffer that the caller
 * can assert is empty at the end of the walk.
 */
export function installErrorCapture(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`)
  })
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`)
  })
  page.on('requestfailed', (req) => {
    // ignore expected dev-server HMR pings
    const url = req.url()
    if (url.includes('/@vite/') || url.includes('/@fs/')) return
    errors.push(`requestfailed: ${req.method()} ${url} — ${req.failure()?.errorText}`)
  })
  return errors
}