import { assign } from 'xstate'
import type { ChallengeSceneData } from '../../types/story'
import type { MetricsDelta } from '../../types/story'

type Choice = { id: string; content: string; description?: string; metrics?: MetricsDelta }

type ChoiceTaskConfig = {
  stateId: string
  text: string
  options: Choice[]
  correctAnswer: string
  overrideAnswer: string
  resultFlag: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
}

function createAddMetricsAction(options: Choice[]) {
  return assign(({ context, event }: any) => {
    const selectedOption = options.find((opt: Choice) => opt.id === event.answer)

    if (selectedOption?.metrics) {
      const metrics = selectedOption.metrics
      return {
        tek_score: (context.tek_score || 0) + (metrics.tek || 0),
        ded_score: (context.ded_score || 0) + (metrics.ded || 0),
        soc_score: (context.soc_score || 0) + (metrics.soc || 0),
      }
    }
    return {}
  })
}

export function createChoiceTaskState(config: ChoiceTaskConfig) {
  return {
    [config.stateId]: {
      meta: {
        id: config.stateId,
        text: config.text,
        task: {
          type: 'multiple_choice',
          options: config.options,
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === config.correctAnswer,
            target: config.solvedTarget,
            actions: [
              { type: 'set', params: { [config.resultFlag]: 'solved' } },
              createAddMetricsAction(config.options),
            ],
          },
          {
            guard: ({ event }: any) => event.answer === config.overrideAnswer,
            target: config.overrideTarget,
            actions: [
              { type: 'set', params: { [config.resultFlag]: 'override' } },
              createAddMetricsAction(config.options),
            ],
          },
          {
            target: config.incorrectTarget,
            actions: [
              { type: 'set', params: { [config.resultFlag]: 'incorrect' } },
              createAddMetricsAction(config.options),
            ],
          },
        ],
      },
    },
  }
}