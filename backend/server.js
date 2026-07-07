const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const { Firestore, FieldValue } = require('@google-cloud/firestore')

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const STEP_PATTERN = /^[A-Za-z0-9_-]{1,100}$/
let sharedFirestoreClient

class InMemoryProgressStore {
  constructor() {
    this.kind = 'memory'
    this.progress = new Map()
  }

  async save({ uuid, step }) {
    this.progress.set(uuid, {
      uuid,
      step,
      lastVisitedAt: new Date().toISOString(),
    })
  }

  async list() {
    const entries = [...this.progress.values()]
    entries.sort((a, b) => (a.lastVisitedAt < b.lastVisitedAt ? 1 : -1))
    return entries
  }
}

class FirestoreProgressStore {
  constructor() {
    this.kind = 'firestore'
    if (!sharedFirestoreClient) {
      sharedFirestoreClient = new Firestore()
    }

    this.collection = sharedFirestoreClient.collection(process.env.PROGRESS_COLLECTION ?? 'quiz-progress')
  }

  async save({ uuid, step }) {
    await this.collection.doc(uuid).set(
      {
        uuid,
        step,
        lastVisitedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }

  async list() {
    const snapshot = await this.collection.orderBy('lastVisitedAt', 'desc').get()
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        uuid: data.uuid,
        step: data.step,
        lastVisitedAt:
          data.lastVisitedAt && typeof data.lastVisitedAt.toDate === 'function'
            ? data.lastVisitedAt.toDate().toISOString()
            : null,
      }
    })
  }
}

function createProgressStore() {
  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.FIRESTORE_EMULATOR_HOST) {
    return new FirestoreProgressStore()
  }

  return new InMemoryProgressStore()
}

function attachMinutesAgo(entries, now = Date.now()) {
  return entries.map((entry) => {
    const lastVisitedAt = entry.lastVisitedAt
    let minutesAgo = null

    if (lastVisitedAt) {
      const visitedMs = Date.parse(lastVisitedAt)
      if (!Number.isNaN(visitedMs)) {
        minutesAgo = Math.max(0, Math.round((now - visitedMs) / 60_000))
      }
    }

    return {
      uuid: entry.uuid,
      step: entry.step,
      lastVisitedAt,
      minutesAgo,
    }
  })
}

function createApp(progressStore = createProgressStore()) {
  const app = express()
  const publicDir = path.join(__dirname, 'public')
  const indexPath = path.join(publicDir, 'index.html')
  const hasStaticApp = fs.existsSync(indexPath)
  const indexHtml = hasStaticApp ? fs.readFileSync(indexPath, 'utf8') : null

  app.set('trust proxy', true)
  app.use(express.json({ limit: '16kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, storage: progressStore.kind })
  })

  app.post('/api/progress', async (req, res) => {
    const { uuid, step } = req.body ?? {}

    if (typeof uuid !== 'string' || !UUID_PATTERN.test(uuid)) {
      return res.status(400).json({ error: 'Invalid uuid' })
    }

    if (typeof step !== 'string' || !STEP_PATTERN.test(step)) {
      return res.status(400).json({ error: 'Invalid step' })
    }

    try {
      await progressStore.save({ uuid, step })
      return res.status(202).json({ ok: true })
    } catch (error) {
      console.error('Failed to store progress', error)
      return res.status(500).json({ error: 'Failed to store progress' })
    }
  })

  app.get('/api/progress', async (_req, res) => {
    try {
      const entries = await progressStore.list()
      return res.json({ entries: attachMinutesAgo(entries) })
    } catch (error) {
      console.error('Failed to list progress', error)
      return res.status(500).json({ error: 'Failed to list progress' })
    }
  })

  if (hasStaticApp) {
    app.use(express.static(publicDir))

    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next()
      }

      return res.type('html').send(indexHtml)
    })
  }

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' })
  })

  return app
}

if (require.main === module) {
  const port = Number(process.env.PORT ?? 8080)
  createApp().listen(port, () => {
    console.log(`Listening on ${port}`)
  })
}

module.exports = { createApp, createProgressStore, attachMinutesAgo }
