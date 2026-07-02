import { createChoiceTaskState } from './_createChoiceTask'

export function javaProfileMergeResetTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Profile Merge Reset\n\n' +
      'The drone profile sets the EVA flag correctly, then merges defaults afterward and quietly turns the activation field off again.\n\n' +
      '```java\n' +
      'Map<String, Object> buildProfile(String mode) {\n' +
      '    Map<String, Object> profile = new HashMap<>();\n' +
      '    profile.put("sealedMode", false);\n' +
      '    if ("eva-cargo".equals(mode)) profile.put("sealedMode", true);\n' +
      '    profile.putAll(Map.of("tetherFollow", true, "sealedMode", false));\n' +
      '    return profile;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'fake_safe_mode',
        content: 'Keep the bad payload and ask the drone to improvise a fallback routine',
        description: 'Push the mission forward without fixing the real activation field.',
      },
      {
        id: 'align_profile_value',
        content: 'Merge defaults without overwriting the EVA activation field',
        description: 'Preserve the value the outside mode actually needs.',
      },
      {
        id: 'force_profile_override',
        content: 'Force a manual backup profile and trust the operator to compensate',
        description: 'Skip the normal profile contract and rely on a brittle override.',
      },
      {
        id: 'blame_hardware',
        content: 'Swap external components first and assume the drone ignored the payload',
        description: 'Spend time on the physical layer instead of the bad profile merge.',
      },
    ],
    correctAnswer: 'align_profile_value',
    overrideAnswer: 'force_profile_override',
    resultFlag: 'problem_3_result',
  })
}
