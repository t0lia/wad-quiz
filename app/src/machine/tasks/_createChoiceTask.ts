import type { ChallengeSceneData } from '../../types/story'
import type { MetricsDelta } from '../../types/story'
import { addMetricsAction } from '../../machine'

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
              addMetricsAction(config.correctAnswer, config.options),
            ],
          },
          {
            guard: ({ event }: any) => event.answer === config.overrideAnswer,
            target: config.overrideTarget,
            actions: [
              { type: 'set', params: { [config.resultFlag]: 'override' } },
              addMetricsAction(config.overrideAnswer, config.options),
            ],
          },
          {
            target: config.incorrectTarget,
            actions: [
              { type: 'set', params: { [config.resultFlag]: 'incorrect' } },
              ({ event }: any) => addMetricsAction(event?.answer, config.options),
            ],
          },
        ],
      },
    },
  }
}