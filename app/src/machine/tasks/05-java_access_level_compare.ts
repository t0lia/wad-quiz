import { createChoiceTaskState } from './_createChoiceTask'

export function javaAccessLevelCompareTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The gate reads a temporary access level, but the unlock path checks it the wrong way and rejects a valid emergency pass.\n\n' +
      '```java\n' +
      'boolean gateAllows(Credential credential) {\n' +
      '    String level = credential.getAccessLevel();\n' +
      '    if (level == "MAINT_RED") {\n' +
      '        return true;\n' +
      '    }\n' +
      '    return credential.hasSupervisorEscort();\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_reader',
        content: 'Treat the failure like a scanner problem and retry the hardware path',
        description: 'Treat the failure like a scanner problem and retry the hardware path',
      },
      {
        id: 'relax_gate_rule',
        content: 'Flatten the gate rule so every emergency badge gets through',
        description: 'Flatten the gate rule so every emergency badge gets through',
      },
      {
        id: 'align_access_check',
        content: 'Compare the access value the way the gate actually needs',
        description: 'Fix the comparison so valid temporary clearance is recognized.',
      },
      {
        id: 'force_gate_release',
        content: 'Force the gate open through a manual bridge',
        description: 'Force the gate open through a manual bridge',
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_4_result',
  })
}