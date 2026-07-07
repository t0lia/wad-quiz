'use strict'

const assert = require('node:assert/strict')
const { test } = require('node:test')
const http = require('node:http')

const { createApp, attachMinutesAgo } = require('../server.js')

test('attachMinutesAgo computes whole minutes from a fixed clock', () => {
  const now = Date.parse('2026-07-07T12:00:00Z')
  const entries = [
    { uuid: 'a', step: 'section_1', lastVisitedAt: '2026-07-07T11:58:00Z' },
    { uuid: 'b', step: 'section_2', lastVisitedAt: '2026-07-07T11:55:00Z' },
    { uuid: 'c', step: 'section_3', lastVisitedAt: '2026-07-07T12:00:00Z' },
  ]

  assert.deepEqual(attachMinutesAgo(entries, now), [
    { uuid: 'a', step: 'section_1', lastVisitedAt: '2026-07-07T11:58:00Z', minutesAgo: 2 },
    { uuid: 'b', step: 'section_2', lastVisitedAt: '2026-07-07T11:55:00Z', minutesAgo: 5 },
    { uuid: 'c', step: 'section_3', lastVisitedAt: '2026-07-07T12:00:00Z', minutesAgo: 0 },
  ])
})

test('attachMinutesAgo returns null minutesAgo for missing or unparseable timestamps', () => {
  const out = attachMinutesAgo(
    [
      { uuid: 'a', step: 's1', lastVisitedAt: null },
      { uuid: 'b', step: 's2', lastVisitedAt: 'not-a-date' },
    ],
    Date.now(),
  )
  assert.equal(out[0].minutesAgo, null)
  assert.equal(out[1].minutesAgo, null)
})

test('InMemory store: save + list with minutesAgo', async () => {
  const { createApp } = require('../server.js')
  const app = createApp()
  const server = app.listen(0)
  const port = server.address().port

  const uuid1 = '11111111-1111-4111-8111-111111111111'
  const uuid2 = '22222222-2222-4222-8222-222222222222'

  await postJson(port, '/api/progress', { uuid: uuid1, step: 'section_1' })
  await sleep(5)
  await postJson(port, '/api/progress', { uuid: uuid2, step: 'section_2' })

  const list = await getJson(port, '/api/progress')
  assert.equal(list.entries.length, 2)
  // sorted desc by lastVisitedAt
  assert.equal(list.entries[0].uuid, uuid2)
  assert.equal(list.entries[1].uuid, uuid1)
  assert.equal(list.entries[0].step, 'section_2')
  assert.equal(list.entries[1].step, 'section_1')
  assert.equal(typeof list.entries[0].minutesAgo, 'number')
  assert.ok(list.entries[0].minutesAgo >= 0)
  assert.ok(list.entries[1].minutesAgo >= 0)
  // uuid2 saved later → smaller minutesAgo
  assert.ok(list.entries[1].minutesAgo >= list.entries[0].minutesAgo)

  server.close()
})

test('POST /api/progress rejects bad payload (no rate limiter involved)', async () => {
  const app = createApp()
  const server = app.listen(0)
  const port = server.address().port

  const badUuid = await postJson(port, '/api/progress', { uuid: 'nope', step: 'section_1' })
  assert.equal(badUuid.status, 400)

  const badStep = await postJson(port, '/api/progress', {
    uuid: '11111111-1111-4111-8111-111111111111',
    step: 'has spaces',
  })
  assert.equal(badStep.status, 400)

  server.close()
})

test('GET /api/health still works', async () => {
  const app = createApp()
  const server = app.listen(0)
  const port = server.address().port

  const res = await getJson(port, '/api/health')
  assert.equal(res.ok, true)
  assert.equal(res.storage, 'memory')

  server.close()
})

function postJson(port, path, body) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body))
    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        path,
        method: 'POST',
        headers: { 'content-type': 'application/json', 'content-length': data.length },
      },
      (res) => {
        let buf = ''
        res.on('data', (c) => (buf += c))
        res.on('end', () => resolve({ status: res.statusCode, body: buf }))
      },
    )
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

function getJson(port, path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port, path }, (res) => {
        let buf = ''
        res.on('data', (c) => (buf += c))
        res.on('end', () => resolve({ status: res.statusCode, body: buf, json: safeParse(buf) }))
      })
      .on('error', reject)
  })
}

function safeParse(s) {
  try { return JSON.parse(s) } catch { return null }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }
