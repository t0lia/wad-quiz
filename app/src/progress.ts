const STORAGE_KEY = 'wad-quiz-progress-uuid'

function createFallbackUuid() {
  const segment = (length: number) => Math.random().toString(16).slice(2).padEnd(length, '0').slice(0, length)
  return `${segment(8)}-${segment(4)}-4${segment(3)}-8${segment(3)}-${segment(12)}`
}

function getOrCreateUuid() {
  const createdUuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : createFallbackUuid()

  try {
    const existingUuid = window.localStorage.getItem(STORAGE_KEY)
    if (existingUuid) return existingUuid
    window.localStorage.setItem(STORAGE_KEY, createdUuid)
  } catch {
    return createdUuid
  }

  return createdUuid
}

export async function reportProgress(step: string) {
  if (!step) return

  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid: getOrCreateUuid(),
        step,
      }),
      keepalive: true,
    })
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to report progress', error)
    }
  }
}
