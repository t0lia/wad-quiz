import { useEffect, useMemo, useRef } from 'react'
import { hydroMachine } from '../machine1'
import { resolveProgress, type MachineConfigLike } from './progressGraph'

type Props = {
  currentState: string
  /** kept for API compatibility with App.tsx; not needed any more */
  routeChoice?: 'cargo' | 'medical'
}

export default function ProgressBar({ currentState, routeChoice }: Props) {
  // routeChoice intentionally ignored — order is now graph-derived.
  void routeChoice
  const fillRef = useRef<HTMLDivElement>(null)
  const prevProgress = useRef<number | null>(null)

  const { idx, total, progress } = useMemo(
    () => resolveProgress(hydroMachine as unknown as MachineConfigLike, currentState),
    [currentState],
  )

  // On every progress change (after the first mount), the bar briefly
  // swells from its resting 2px to 4px and eases back down.
  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    if (prevProgress.current === null) {
      prevProgress.current = progress
      return
    }
    if (prevProgress.current === progress) return
    prevProgress.current = progress
    el.style.height = '4px'
    el.style.marginTop = '0px'
    const t = window.setTimeout(() => {
      el.style.height = ''
      el.style.marginTop = ''
    }, 250)
    return () => window.clearTimeout(t)
  }, [progress])

  return (
    <div className="progress-bar" data-state={currentState} data-idx={idx} data-pages={total}>
      <div
        className="progress-bar__track"
        style={{ '--progress': progress } as React.CSSProperties}
      >
        <div ref={fillRef} className="progress-bar__fill" />
      </div>
    </div>
  )
}
