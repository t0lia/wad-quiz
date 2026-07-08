import { useMemo } from 'react'
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

  const { idx, total, progress } = useMemo(
    () => resolveProgress(hydroMachine as unknown as MachineConfigLike, currentState),
    [currentState],
  )

  return (
    <div className="progress-bar" data-state={currentState} data-idx={idx} data-pages={total}>
      <div
        className="progress-bar__track"
        style={{ '--progress': progress } as React.CSSProperties}
      >
        <div className="progress-bar__fill" />
      </div>
    </div>
  )
}