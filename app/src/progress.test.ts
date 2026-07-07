import { test } from 'node:test'
import assert from 'node:assert/strict'

// Provide a minimal browser-ish environment for progress.ts.
// progress.ts touches: window.localStorage, crypto (randomUUID + getRandomValues),
// fetch, and import.meta.env (Vite). Only the first two are used in the
// non-DEV branch we exercise here, so we stub the globals and let
// import.meta.env fall back to undefined (treated as "not dev" by the
// catch branch in reportProgress).

const STORAGE_KEY = 'wad-quiz-progress-uuid'

type FetchCall = { url: string; init: RequestInit }

function makeFetchSpy(impl: (url: string, init: RequestInit) => Promise<Response> | Response | never) {
  const calls: FetchCall[] = []
  const spy = async (input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString()
    calls.push({ url, init })
    return await impl(url, init)
  }
  return Object.assign(spy, { calls })
}

function installBrowserShim(uuid: string) {
  const stored = new Map<string, string>()
  ;(globalThis as { window?: object }).window = {
    localStorage: {
      getItem: (k: string) => stored.get(k) ?? null,
      setItem: (k: string, v: string) => void stored.set(k, v),
      removeItem: (k: string) => void stored.delete(k),
    },
  }
  Object.defineProperty(globalThis, 'crypto', {
    value: { randomUUID: () => uuid, getRandomValues: (a: Uint8Array) => a },
    configurable: true,
  })
  ;(globalThis as { fetch?: unknown }).fetch = undefined
}

function jsonResponse(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

test('reportProgress: network error does not throw and fetch is called once', async () => {
  installBrowserShim('11111111-1111-4111-8111-111111111111')
  const spy = makeFetchSpy(() => {
    throw new TypeError('NetworkError: backend down (mock)')
  })
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts')
  await assert.doesNotReject(() => reportProgress('section_1'))

  assert.equal(spy.calls.length, 1, 'fetch should be invoked exactly once')
  const init = spy.calls[0].init
  assert.equal(init.method, 'POST')
  assert.equal((init.headers as Record<string, string>)['Content-Type'], 'application/json')
  assert.equal(init.keepalive, true)
  const body = JSON.parse(init.body as string)
  assert.equal(body.uuid, '11111111-1111-4111-8111-111111111111')
  assert.equal(body.step, 'section_1')
})

test('reportProgress: 500 response is swallowed, no throw', async () => {
  installBrowserShim('22222222-2222-4222-8222-222222222222')
  const spy = makeFetchSpy(() => jsonResponse(500, { error: 'boom' }))
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts?reset=500')
  await assert.doesNotReject(() => reportProgress('section_2'))
  assert.equal(spy.calls.length, 1)
})

test('reportProgress: 4xx (validation error) is swallowed, no throw', async () => {
  installBrowserShim('33333333-3333-4333-8333-333333333333')
  const spy = makeFetchSpy(() => jsonResponse(400, { error: 'bad step' }))
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts?reset=400')
  await assert.doesNotReject(() => reportProgress('section_3'))
  assert.equal(spy.calls.length, 1)
})

test('reportProgress: 2xx response is treated as success, no retry', async () => {
  installBrowserShim('44444444-4444-4444-8444-444444444444')
  const spy = makeFetchSpy(() => jsonResponse(202, { ok: true }))
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts?reset=202')
  await assert.doesNotReject(() => reportProgress('section_4'))
  assert.equal(spy.calls.length, 1, 'should not retry on success')
})

test('reportProgress: empty step is a no-op (no fetch)', async () => {
  installBrowserShim('55555555-5555-4555-8555-555555555555')
  const spy = makeFetchSpy(() => jsonResponse(200))
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts?reset=empty')
  await reportProgress('')
  assert.equal(spy.calls.length, 0, 'empty step must skip the network call')
})

test('reportProgress: the first reportProgress for a uuid persists it in localStorage', async () => {
  const uuid = '66666666-6666-4666-8666-666666666666'
  installBrowserShim(uuid)
  const spy = makeFetchSpy(() => jsonResponse(202, { ok: true }))
  ;(globalThis as { fetch: typeof fetch }).fetch = spy as unknown as typeof fetch

  const { reportProgress } = await import('./progress.ts?reset=persist')
  await reportProgress('section_6')

  const stored = (globalThis as { window: { localStorage: { getItem(k: string): string | null } } }).window.localStorage.getItem(STORAGE_KEY)
  assert.equal(stored, uuid, 'uuid must be persisted in localStorage on first call')
  assert.equal(spy.calls.length, 1)
})
