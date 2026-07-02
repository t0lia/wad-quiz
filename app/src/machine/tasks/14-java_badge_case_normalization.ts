import { createChoiceTaskState } from './_createChoiceTask'

export function javaBadgeCaseNormalizationTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The gate reads the emergency badge correctly, but the unlock rule compares a mixed-case value against one exact spelling and rejects the pass.\n\n' +
      '```java\n' +
      'boolean allows(Credential credential) {\n' +
      '    String level = credential.getAccessLevel();\n' +
      '    if ("maint_red".equals(level)) {\n' +
      '        return true;\n' +
      '    }\n' +
      '    return credential.hasSupervisorEscort();\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'force_gate_release',
        content: 'Bridge the lock manually and deal with the paperwork later',
        description: 'Open the path quickly by overriding the gate instead of trusting the code.',
      },
      {
        id: 'align_access_check',
        content: 'Normalize or compare the badge value the way the gate actually receives it',
        description: 'Fix the check so valid emergency clearance survives harmless case differences.',
      },
      {
        id: 'blame_reader',
        content: 'Blame the scanner hardware and retry the badge readout',
        description: 'Spend time at the reader instead of the access rule.',
      },
      {
        id: 'relax_gate_rule',
        content: 'Flatten the policy so every emergency badge gets through',
        description: 'Open the path by weakening the rule instead of fixing the comparison.',
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_2_result',
  })
}
