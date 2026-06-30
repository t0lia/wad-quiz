import type { ChallengeSceneData } from '../../types/story'

type Choice = { id: string; content: string }

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
            actions: [{ type: 'set', params: { [config.resultFlag]: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === config.overrideAnswer,
            target: config.overrideTarget,
            actions: [{ type: 'set', params: { [config.resultFlag]: 'override' } }],
          },
          {
            target: config.incorrectTarget,
            actions: [{ type: 'set', params: { [config.resultFlag]: 'incorrect' } }],
          },
        ],
      },
    },
  }
}