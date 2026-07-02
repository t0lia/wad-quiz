import { createChoiceTaskState } from './_createChoiceTask'

export function jsTunnelPrefixFallbackTaskState(config: {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}) {
  return createChoiceTaskState({
    ...config,
    text:
      'The recovery helper picks a fallback prefix when none is passed, but that default is much wider than the one hull segment Alex is trying to restore.\n\n' +
      '```javascript\n' +
      'function buildTunnel(prefix = "10.90.0.0/8") {\n' +
      '  return {\n' +
      '    address: "10.90.4.12/24",\n' +
      '    route: prefix,\n' +
      '    gateway: "10.90.4.1"\n' +
      '  };\n' +
      '}\n' +
      '```',
    options: [
      {
        id: 'blame_switch',
        content: 'Treat the bleed like switch instability and restart the device path',
        description: 'Spend time on hardware symptoms instead of the route scope.',
      },
      {
        id: 'correct_network_boundary',
        content: 'Use the specific tunnel prefix the hull repair actually needs',
        description: 'Narrow the boundary so unrelated systems stop following the recovery route.',
      },
      {
        id: 'add_shortcut_route',
        content: 'Add another route on top without fixing the bad fallback scope',
        description: 'Push traffic through temporarily while keeping the wrong boundary.',
      },
      {
        id: 'force_recovery_tunnel',
        content: 'Force a direct tunnel and accept one more brittle workaround',
        description: 'Restore traffic quickly through a temporary rescue path.',
      },
    ],
    correctAnswer: 'correct_network_boundary',
    overrideAnswer: 'force_recovery_tunnel',
    resultFlag: 'problem_4_result',
  })
}
