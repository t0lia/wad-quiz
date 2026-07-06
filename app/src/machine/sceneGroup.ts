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

/**
 * Hardcoded mapping from narrative scene group -> location illustration.
 *
 * Restore-point: prior to the Hydroworld2 -> main merge (commit 2aa6160),
 * each section-* machine file embedded an `image: '/locations/...'`
 * field on every state. The new machine1/* layout no longer carries that
 * field, so scenes render without backgrounds. Rather than rebuild the
 * per-state metadata across ~30 files, we collapse to sceneGroupId() and
 * resolve the image here — keeping content changes to a single file.
 *
 * Mapping is sourced from the previous-main commit e35cafb "convert images"
 * (which still had image: on each section-*.ts scene). Suffixes beyond
 * section_8 are routed by their narrative prefix; unknown groups fall
 * back to exterior_hull so a missing entry never blanks a background.
 */
const SCENE_IMAGE_PREFIX: Record<string, string> = {
  section_1: '/locations/incubator_4.webp',
  section_2: '/locations/exterior_hull.webp',
  section_3: '/locations/cross_ship_route.webp',
  section_4_cargo: '/locations/access_gate-cargo.webp',
  section_4_medical: '/locations/access_gate-medical.webp',
  section_5: '/locations/airlock_4.webp',
  section_6: '/locations/airlock_4.webp',
  section_7: '/locations/exterior_hull.webp',
  section_8_clean: '/locations/technical_gap.webp',
  section_8_debt: '/locations/technical_gap.webp',
  // exit + 10 all map back to the starting location (vignette closer)
  section_10: '/locations/incubator_4.webp',
}

const DEFAULT_SCENE_IMAGE = '/locations/exterior_hull.webp'

export function sceneImageFor(stateId: string): string {
  const group = sceneGroupId(stateId)
  for (const [prefix, image] of Object.entries(SCENE_IMAGE_PREFIX)) {
    if (group === prefix || group.startsWith(prefix + '_')) return image
  }
  return DEFAULT_SCENE_IMAGE
}
