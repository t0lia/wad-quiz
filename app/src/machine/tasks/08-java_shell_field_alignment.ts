import { createChoiceTaskState } from './_createChoiceTask'

export function javaShellFieldAlignmentTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Shell Profile Field Name\n\n' +
      'The medical shell closes around Shmiel with a soft click. The drone gets the new settings, but once it moves into outside mode, it never turns on the clean shell setting.\n\n' +
      '```java\n' +
      'Map<String, Object> buildShellProfile(String mode) {\n' +
      '    Map<String, Object> payload = new HashMap<>();\n' +
      '    payload.put("mode", mode);\n' +
      '    payload.put("sterileMode", false);\n' +
      '    payload.put("beaconFollow", false);\n' +
      '    if ("eva-med".equals(mode)) {\n' +
      '        payload.put("sterile_mode", true);\n' +
      '        payload.put("beaconFollow", true);\n' +
      '    }\n' +
      '    return payload;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_hardware',
        content: 'Treat the failure like hardware drift and swap components first',
        description: 'Treat the failure like hardware drift and swap components first',
      },
      {
        id: 'fake_safe_mode',
        content: 'Work around the setting with a rough fallback behavior',
        description: 'Work around the setting with a rough fallback behavior',
      },
      {
        id: 'align_profile_value',
        content: 'Write the activation field the way the drone actually reads it',
        description: 'Write the activation field the way the drone actually reads it',
      },
      {
        id: 'force_profile_override',
        content: 'Override the profile and force a manual backup mode',
        description: 'Override the profile and force a manual backup mode',
      },
    ],
    correctAnswer: 'align_profile_value',
    overrideAnswer: 'force_profile_override',
    resultFlag: 'problem_6_result',
  })
}