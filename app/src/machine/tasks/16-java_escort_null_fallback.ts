import { createChoiceTaskState } from './_createChoiceTask'

export function javaEscortNullFallbackTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Escort Null Fallback\n\n' +
      'The gate falls back to supervisor escort when emergency clearance is absent, but the escort flag can be null and the rule trips over it instead of using the valid access data.\n\n' +
      '```java\n' +
      'boolean allows(Credential credential) {\n' +
      '    String level = credential.getAccessLevel();\n' +
      '    Boolean escort = credential.getSupervisorEscort();\n' +
      '    if ("MAINT_RED".equals(level)) return true;\n' +
      '    return escort.equals(true);\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_reader',
        content: 'Treat the error like another scanner hiccup and rescan the badge',
        description: 'Spend time on hardware symptoms instead of the access rule.',
      },
      {
        id: 'force_gate_release',
        content: 'Trigger the manual release and ignore the inconsistent record',
        description: 'Open the path quickly by overriding the gate instead of fixing the check.',
      },
      {
        id: 'relax_gate_rule',
        content: 'Remove the escort fallback so the gate never blocks emergency traffic',
        description: 'Weaken the policy instead of handling the nullable field safely.',
      },
      {
        id: 'align_access_check',
        content: 'Handle the escort fallback safely and keep the intended access comparison',
        description: 'Make the rule match the real record shape without flattening the policy.',
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_2_result',
  })
}
