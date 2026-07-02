import { createChoiceTaskState } from './_createChoiceTask'

export function jsBeaconNestedFieldTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The drone reads follow settings from a nested EVA block, but the profile writes the beacon flag at the top level where outside mode never looks.\n\n' +
      '```javascript\n' +
      'function buildProfile(mode) {\n' +
      '  const profile = { mode, eva: { shellMode: false, beaconFollow: false } };\n' +
      '  if (mode === "eva-med") {\n' +
      '    profile.eva.shellMode = true;\n' +
      '    profile.beaconFollow = true;\n' +
      '  }\n' +
      '  return profile;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'align_profile_value',
        content: 'Write the follow flag in the nested EVA field the drone actually reads',
        description: 'Fix the payload shape so outside mode gets both required signals.',
      },
      {
        id: 'blame_hardware',
        content: 'Assume the antenna is drifting and replace external parts first',
        description: 'Spend time on hardware symptoms instead of the profile structure.',
      },
      {
        id: 'force_profile_override',
        content: 'Force the drone into manual chase mode and accept the brittle fallback',
        description: 'Skip the normal checks and rely on a more fragile override.',
      },
      {
        id: 'fake_safe_mode',
        content: 'Keep the wrong payload and add a rough backup behavior around it',
        description: 'Work around the issue instead of fixing the field placement.',
      },
    ],
    correctAnswer: 'align_profile_value',
    overrideAnswer: 'force_profile_override',
    resultFlag: 'problem_3_result',
  })
}
