import { useState } from 'react'
import type { YamlSceneData, YamlBranchTask, YamlProblemTask } from '../types/story'
import type { YamlSection, BranchAction, ProblemAction, ConclusionEntry } from '../types/yaml-story'
import TaskRouter from '../tasks/TaskRouter'

type Props = {
  scene: YamlSceneData
  onComplete: (answer: string) => void
}

function buildTask(section: YamlSection): YamlBranchTask | YamlProblemTask {
  const { interaction } = section
  if (interaction.type === 'branch') {
    return {
      type: 'yaml_branch',
      prompt: interaction.prompt,
      actions: (interaction.actions as BranchAction[]).map((a) => ({
        id: a.id,
        text: a.text,
        description: a.description,
      })),
    }
  }
  return {
    type: 'yaml_problem',
    prompt: interaction.prompt,
    snippet: interaction.snippet,
    actions: (interaction.actions as ProblemAction[]).map((a) => ({
      id: a.id,
      text: a.text,
      description: a.description,
      outcome: a.outcome,
    })),
  }
}

function lookupConclusion(section: YamlSection, actionId: string): ConclusionEntry | undefined {
  if ('by_action' in section.conclusion) {
    return section.conclusion.by_action[actionId]
  }
  // by_outcome: find the action's outcome and use that as the key
  const action = section.interaction.actions.find((a) => a.id === actionId) as ProblemAction | undefined
  return action ? section.conclusion.by_outcome[action.outcome] : undefined
}

export default function ChallengeScene({ scene, onComplete }: Props) {
  const { section } = scene
  const [chosen, setChosen] = useState<string | null>(null)

  const task = buildTask(section)
  const conclusionEntry = chosen ? lookupConclusion(section, chosen) : undefined

  function handleAction(actionId: string) {
    setChosen(actionId)
  }

  return (
    <div className="scene">
      {/* Intro */}
      <h2 className="section-title">{section.title}</h2>
      <p className="scene-text">{section.intro.narrative}</p>

      {section.intro.dialogue && section.intro.dialogue.length > 0 && (
        <div className="dialogue">
          {section.intro.dialogue.map((line, i) => (
            <p key={i} className="dialogue-line">
              <strong className="speaker">{line.speaker}:</strong> {line.text}
            </p>
          ))}
        </div>
      )}

      {/* Interaction (hidden once action chosen) */}
      {!chosen && (
        <TaskRouter
          task={task}
          submitted={false}
          onSubmit={(answer) => { if (answer) handleAction(answer) }}
        />
      )}

      {/* Conclusion */}
      {chosen && conclusionEntry && (
        <div className="conclusion">
          <p className="conclusion-text">{conclusionEntry.narrative}</p>
          <button
            type="button"
            className="submit-btn"
            onClick={() => onComplete(chosen)}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
