import { createChoiceTaskState } from './_createChoiceTask'

export function javaModeSuffixAlignmentTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The drone only enables protected outside behavior for one exact EVA mode name, but the profile builder sends a shortened value and never trips the activation field.\n\n' +
      '```java\n' +
      'Map<String, Object> buildProfile(String mode) {\n' +
      '    Map<String, Object> payload = new HashMap<>();\n' +
      '    payload.put("mode", mode);\n' +
      '    payload.put("shellMode", false);\n' +
      '    if ("eva".equals(mode)) {\n' +
      '        payload.put("shellMode", true);\n' +
      '    }\n' +
      '    return payload;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'force_profile_override',
        content: 'Override the whole profile and rely on manual outside handling',
        description: 'Skip the normal contract and accept a brittle fallback.',
      },
      {
        id: 'fake_safe_mode',
        content: 'Keep the short mode name and compensate with a rough backup routine',
        description: 'Push forward without fixing the actual profile mismatch.',
      },
      {
        id: 'blame_hardware',
        content: 'Treat the failure like payload corruption on the drone itself',
        description: 'Spend time on the physical layer instead of the wrong mode value.',
      },
      {
        id: 'align_profile_value',
        content: 'Send the exact EVA mode value the activation rule expects',
        description: 'Align the mode name so the outside protection field turns on correctly.',
      },
    ],
    correctAnswer: 'align_profile_value',
    overrideAnswer: 'force_profile_override',
    resultFlag: 'problem_3_result',
  })
}
