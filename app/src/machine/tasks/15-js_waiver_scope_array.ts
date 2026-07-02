import { createChoiceTaskState } from './_createChoiceTask'

export function jsWaiverScopeArrayTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The gate receives a waiver with multiple approved areas, but the unlock check treats the whole list like one exact string and denies the corridor.\n\n' +
      '```javascript\n' +
      'function canOpen(record) {\n' +
      '  const scopes = record.waiverScopes;\n' +
      '  if (scopes === "quarantine-side") {\n' +
      '    return true;\n' +
      '  }\n' +
      '  return record.hasEscort === true;\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'relax_gate_rule',
        content: 'Bypass the scope list and approve every waived record',
        description: 'Open the path by weakening the policy instead of fixing the scope check.',
      },
      {
        id: 'blame_reader',
        content: 'Retry the scanner because the badge payload probably arrived corrupted',
        description: 'Treat the symptom as hardware noise instead of a logic mismatch.',
      },
      {
        id: 'align_access_check',
        content: 'Check the waiver scopes in the structure the gate actually receives',
        description: 'Read the approved scope list correctly so the valid waiver is recognized.',
      },
      {
        id: 'force_gate_release',
        content: 'Force the side gate open through the maintenance bridge',
        description: 'Move forward quickly by overriding the lock instead of trusting the code.',
      },
    ],
    correctAnswer: 'align_access_check',
    overrideAnswer: 'force_gate_release',
    resultFlag: 'problem_2_result',
  })
}
