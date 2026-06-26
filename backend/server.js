const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const { Firestore, FieldValue } = require('@google-cloud/firestore')

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
const STEP_PATTERN = /^[A-Za-z0-9_-]{1,100}$/
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 60
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
      updatedAt: new Date().toISOString(),
    })
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
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )
  }
}

function createProgressStore() {
  if (process.env.GOOGLE_CLOUD_PROJECT || process.env.FIRESTORE_EMULATOR_HOST) {
    return new FirestoreProgressStore()
  }

  return new InMemoryProgressStore()
}

function createProgressRateLimiter() {
  const requestsByIp = new Map()
  let lastCleanupAt = 0

  return (req, res, next) => {
    const forwardedFor = typeof req.headers['x-forwarded-for'] === 'string' ? req.headers['x-forwarded-for'].split(',')[0].trim() : null
    const key = req.ip || forwardedFor

    if (!key) {
      return res.status(400).json({ error: 'Missing client IP' })
    }

    const now = Date.now()
    if (now - lastCleanupAt >= RATE_LIMIT_WINDOW_MS) {
      for (const [ip, entry] of requestsByIp.entries()) {
        if (entry.resetAt <= now) {
          requestsByIp.delete(ip)
        }
      }
      lastCleanupAt = now
    }

    const entry = requestsByIp.get(key)

    if (!entry || entry.resetAt <= now) {
      requestsByIp.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
      return next()
    }

    if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many progress updates' })
    }

    entry.count += 1
    return next()
  }
}

function createApp(progressStore = createProgressStore()) {
  const app = express()
  const publicDir = path.join(__dirname, 'public')
  const indexPath = path.join(publicDir, 'index.html')
  const hasStaticApp = fs.existsSync(indexPath)
  const indexHtml = hasStaticApp ? fs.readFileSync(indexPath, 'utf8') : null
  const progressRateLimiter = createProgressRateLimiter()

  app.set('trust proxy', true)
  app.use(express.json({ limit: '16kb' }))

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, storage: progressStore.kind })
  })

  app.post('/api/progress', progressRateLimiter, async (req, res) => {
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

module.exports = { createApp, createProgressStore }
