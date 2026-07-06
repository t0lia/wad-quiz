/**
 * Collapses a machine state id down to the id of the narrative "scene" it
 * belongs to (per text/scene_graph.md), by stripping everything from the
 * first `_intro`, `_task_N`, or `_conclusion_*` token onward. Branch
 * states with no intro/task split (e.g. section_3, section_8_exit_clean)
 * have no such token and collapse to themselves.
 *
 * IMPORTANT: all states that share the same scene group must collapse to
 * the same id — otherwise React remounts ChallengeScene between them and
 * the accumulated segment history (intro, frozen task, outro) is lost.
 * Notably section_1 has state ids like `section_1_conclusion_choose_*`
 * where `_conclusion_` is in the middle, not at the end — anchor on the
 * suffix, not on end-of-string.
 */
export function sceneGroupId(stateId: string): string {
  // Strip a trailing `_intro` or `_task[_N]` token (no trailing `_`), or
  // anything from the first `_conclusion_*` onward. Anchoring the
  // conclusion match on the suffix handles both `section_2_unsigned_
  // conclusion_solved` (suffix at end) and `section_1_conclusion_choose_
  // standard` (suffix in the middle).
  const introOrTask = stateId.match(/^(.*?)(?:_(?:intro|task_\d+|task))$/)
  if (introOrTask) return introOrTask[1]
  const concIdx = stateId.search(/_conclusion_/)
  if (concIdx !== -1) return stateId.slice(0, concIdx)
  return stateId
}
