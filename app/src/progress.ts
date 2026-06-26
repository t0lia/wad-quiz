const STORAGE_KEY = 'wad-quiz-progress-uuid'

function createFallbackUuid() {
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') {
    return null
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  // RFC 4122 UUID v4: set the version nibble on byte 6 and the variant bits on byte 8.
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function getOrCreateUuid() {
  const createdUuid =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : createFallbackUuid()

  if (!createdUuid) return null

  try {
    const existingUuid = window.localStorage.getItem(STORAGE_KEY)
    if (existingUuid) return existingUuid
    window.localStorage.setItem(STORAGE_KEY, createdUuid)
    return createdUuid
  } catch {
    return createdUuid
  }
}

export async function reportProgress(step: string) {
  if (!step) return

  const uuid = getOrCreateUuid()
  if (!uuid) return

  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uuid,
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
