/**
 * Collapses a machine state id down to the id of the narrative "scene" it
 * belongs to (per text/scene_graph.md), by stripping the intro/task_N/
 * conclusion_* suffixes this codebase uses. Branch states with no
 * intro/task split (e.g. section_3, section_8_exit_clean) have no suffix
 * to strip and collapse to themselves.
 *
 * IMPORTANT: all states that share the same scene group must collapse to
 * the same id — otherwise React remounts ChallengeScene between them and
 * the accumulated segment history (intro, frozen task, outro) is lost.
 */
export function sceneGroupId(stateId: string): string {
  return stateId
    .replace(/_conclusion_[a-z0-9]+$/, '')
    .replace(/_task_\d+$/, '')
    .replace(/_(intro|task)$/, '')
}
