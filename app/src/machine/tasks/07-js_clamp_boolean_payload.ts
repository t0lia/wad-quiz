import { createChoiceTaskState } from './_createChoiceTask'

export function jsClampBooleanPayloadTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'Clamp Mode Typing\n\n' +
      'The cargo kit clicks onto Shmiel with a sharp snap. The drone accepts the new settings, but once it starts the outside setup, it acts like the magnetic clamp is optional.\n\n' +
      '```javascript\n' +
      'function buildClampProfile(mode) {\n' +
      '  const profile = { mode, magClamp: false, tetherFollow: false };\n' +
      '  if (mode === "hull") {\n' +
      '    profile.magClamp = "true";\n' +
      '    profile.tetherFollow = true;\n' +
      '  }\n' +
      '  return deployProfile(profile);\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_hardware',
        content: 'Treat the failure like hardware drift and swap components first',
        description: 'Treat the failure like hardware drift and swap components first',
        metrics: { tek: 0, ded: 0, soc: 0 },
      },
      {
        id: 'fake_safe_mode',
        content: 'Work around the setting with a rough fallback behavior',
        description: 'Work around the setting with a rough fallback behavior',
        metrics: { tek: 0, ded: 0, soc: 1 },
      },
      {
        id: 'align_profile_value',
        content: 'Send the activation value in the format the drone actually expects',
        description: 'Send the activation value in the format the drone actually expects',
        metrics: { tek: 1, ded: 1, soc: 1 },
      },
      {
        id: 'force_profile_override',
        content: 'Override the profile and force a manual backup mode',
        description: 'Override the profile and force a manual backup mode',
        metrics: { tek: 0, ded: 1, soc: 0 },
      },
    ],
    correctAnswer: 'align_profile_value',
    overrideAnswer: 'force_profile_override',
    resultFlag: 'problem_6_result',
  })
}