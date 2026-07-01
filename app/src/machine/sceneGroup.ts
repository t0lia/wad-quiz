/**
 * Collapses a machine state id down to the id of the narrative "scene" it
 * belongs to (per text/scene_graph.md), by stripping the intro/task/
 * conclusion_* suffixes this codebase uses. Branch states with no
 * intro/task split (e.g. section_3, section_8_exit_clean) have no suffix
 * to strip and collapse to themselves.
 */
export function sceneGroupId(stateId: string): string {
  return stateId
    .replace(/_conclusion_[a-z0-9]+$/, '')
    .replace(/_(intro|task)$/, '')
}
