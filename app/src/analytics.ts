declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = 'G-1Z0TTXQ098'
const isProd = import.meta.env.PROD

// gtag.js only reliably picks up custom `event` calls once its own script has
// actually loaded and started watching the dataLayer — events pushed in the
// same tick as the initial `config` call (e.g. from a React effect firing on
// first mount) can race the script's network fetch and get silently dropped,
// even though the automatic Enhanced Measurement events (page_view, etc.)
// still show up because the library fires those itself only once ready.
// Buffer calls made before `onload` and flush them once it's safe to send.
let gtagReady = false
let pendingCalls: Array<() => void> = []

export function initAnalytics(): void {
  if (!isProd) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  script.onload = () => {
    gtagReady = true
    pendingCalls.forEach((fn) => fn())
    pendingCalls = []
  }
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!isProd) return
  const fire = () => {
    if (typeof window.gtag === 'function') window.gtag('event', name, params)
  }
  if (gtagReady) fire()
  else pendingCalls.push(fire)
}

function sectionNumber(groupId: string): number | undefined {
  const match = /^section_(\d+)/.exec(groupId)
  return match ? Number(match[1]) : undefined
}

export function trackTutorialBegin(): void {
  trackEvent('tutorial_begin')
}

export function trackTutorialComplete(): void {
  trackEvent('tutorial_complete')
}

export function trackLevelStart(groupId: string): void {
  trackEvent('level_start', { level_name: groupId, level: sectionNumber(groupId) })
}

export function trackLevelEnd(groupId: string): void {
  trackEvent('level_end', { level_name: groupId, level: sectionNumber(groupId), success: true })
}

export function trackEndingReached(
  endingId: string,
  title: string | undefined,
  score: { technical: number; dedication: number; social: number },
): void {
  trackEvent('unlock_achievement', { achievement_id: endingId, title })
  ;(['technical', 'dedication', 'social'] as const).forEach((dimension) => {
    trackEvent('post_score', { level_name: endingId, character: dimension, score: score[dimension] })
  })
}
