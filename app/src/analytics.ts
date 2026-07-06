declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const GA_MEASUREMENT_ID = 'G-1Z0TTXQ098'
const isProd = import.meta.env.PROD

export function initAnalytics(): void {
  if (!isProd) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID)
}

function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (!isProd || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
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
