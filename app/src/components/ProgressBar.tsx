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

  const { idx, total, progress } = useMemo(
    () => resolveProgress(hydroMachine as unknown as MachineConfigLike, currentState),
    [currentState],
  )

  // Pulse halo on the leading edge every time progress advances.
  // CSS handles the rest; we only flip the class for the animation.
  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    el.classList.remove('is-moving')
    // Force a reflow so the animation restarts even on rapid consecutive
    // progress changes that the browser would otherwise coalesce.
    void el.offsetWidth
    el.classList.add('is-moving')
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
