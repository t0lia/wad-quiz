from __future__ import annotations

import argparse
import json
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

import yaml

from pydto.models import ChoiceAsset, ChoiceStage, ConclusionStage, NavigationDocument, ScoreValues, Stage, StageConfigDocument, TaskAsset, TaskOutcome, TaskPoolsDocument, TaskStage, TransitionCondition
from pydto.parsers import parse_choice_asset, parse_choice_markdown, parse_navigation_document, parse_stage_config_document, parse_task_asset, parse_task_markdown, parse_task_pools_document


ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT.parent
SRC_DIR = APP_DIR / "src"
PUBLIC_LOCATIONS_DIR = APP_DIR / "public" / "locations"
OUTPUT_DIR = SRC_DIR / "machine1"
OUTPUT_TASKS_DIR = OUTPUT_DIR / "tasks"


@dataclass(slots=True)
class LoadedTask:
    asset: TaskAsset
    source_stem: str


@dataclass(slots=True)
class LoadedWorld:
    navigation: NavigationDocument
    stage_config: StageConfigDocument
    task_pools: TaskPoolsDocument
    choices: dict[str, ChoiceAsset]
    tasks: dict[str, LoadedTask]

    @property
    def stages_by_id(self) -> dict[str, Stage]:
        return {stage.id: stage for stage in self.stage_config.stages}


def load_world(world_dir: Path) -> LoadedWorld:
    navigation = parse_navigation_document(yaml.safe_load((world_dir / "01_structure.yaml").read_text(encoding="utf-8")))
    stage_config = parse_stage_config_document(
        yaml.safe_load((world_dir / "stages" / "01-stages.yaml").read_text(encoding="utf-8"))
    )
    task_pools = parse_task_pools_document(yaml.safe_load((world_dir / "02_taskpools.yaml").read_text(encoding="utf-8")))

    choices: dict[str, ChoiceAsset] = {}
    for path in sorted((world_dir / "choices").glob("[0-9][0-9]-*.yaml")):
        asset = parse_choice_asset(parse_choice_markdown(path))
        choices[asset.id] = asset

    tasks: dict[str, LoadedTask] = {}
    for path in sorted((world_dir / "tasks").glob("[0-9][0-9]-*.yaml")):
        asset = parse_task_asset(parse_task_markdown(path))
        tasks[asset.id] = LoadedTask(asset=asset, source_stem=path.stem)

    return LoadedWorld(
        navigation=navigation,
        stage_config=stage_config,
        task_pools=task_pools,
        choices=choices,
        tasks=tasks,
    )


def ts_string(value: str) -> str:
    return json.dumps(value)


def indent(text: str, prefix: str) -> str:
    return "\n".join(f"{prefix}{line}" if line else prefix.rstrip() for line in text.splitlines())


def camel_case(parts: Iterable[str]) -> str:
    parts = [part for part in parts if part]
    if not parts:
        return ""
    first, *rest = parts
    return first + "".join(part[:1].upper() + part[1:] for part in rest)


def camel_from_identifier(identifier: str) -> str:
    return camel_case(identifier.replace("-", "_").split("_"))


def export_name_for_stage(stage_id: str) -> str:
    return f"{camel_from_identifier(stage_id)}States"


def task_helper_name(task_id: str) -> str:
    return f"{camel_from_identifier(task_id)}TaskState"


def score_payload(score: ScoreValues) -> str | None:
    values = {
        "technical": score.technical_skills,
        "dedication": score.dedication,
        "social": score.social_capital,
    }
    if not any(value != 0 for value in values.values()):
        return None
    rendered = ", ".join(f"{key}: {value:g}" for key, value in values.items())
    return f"{{ type: 'score', params: {{ {rendered} }} }}"


def flag_ops_payload(flag_modifications: list) -> str | None:
    if not flag_modifications:
        return None
    parts = []
    for item in flag_modifications:
        payload = f"{{ flag: {ts_string(item.flag)}, operation: {ts_string(item.operation.value)}"
        if item.operation.value != "remove":
            payload += f", value: {item.value}"
        payload += " }"
        parts.append(payload)
    return f"{{ type: 'flagOps', params: [{', '.join(parts)}] }}"


def render_actions(flag_modifications: list, score: ScoreValues) -> str | None:
    actions = [payload for payload in [flag_ops_payload(flag_modifications), score_payload(score)] if payload]
    if not actions:
        return None
    if len(actions) == 1:
        return f"actions: [{actions[0]}]"
    return f"actions: [{', '.join(actions)}]"


def render_dialogue(dialogue: list) -> str:
    if not dialogue:
        return "[]"
    lines = [
        f"{{ speaker: {ts_string(item.speaker)}, text: {ts_string(item.text)} }}"
        for item in dialogue
    ]
    return "[\n" + indent(",\n".join(lines), "        ") + "\n      ]"


def render_options(options: list[tuple[str, str]]) -> str:
    rendered = [f"{{ id: {ts_string(option_id)}, content: {ts_string(content)} }}" for option_id, content in options]
    return "[\n" + indent(",\n".join(rendered), "          ") + "\n        ]"


def render_conditional_task_intro(modifiers: list) -> str | None:
    if not modifiers:
        return None
    rendered = [
        f"{{ condition: {ts_string(modifier.condition)}, text: {ts_string(modifier.effect)} }}"
        for modifier in modifiers
    ]
    return "[\n" + indent(",\n".join(rendered), "        ") + "\n      ]"


def render_meta(scene_id: str, *, text: str, task: str, image: str | None = None, title: str | None = None, dialogue: list | None = None, task_intro: str | None = None, conditional_task_intro: str | None = None) -> str:
    meta_lines = [f"id: {ts_string(scene_id)}"]
    if image is not None:
        meta_lines.append(f"image: {ts_string(image)}")
    if title:
        meta_lines.append(f"title: {ts_string(title)}")
    meta_lines.append(f"text: {ts_string(text)}")
    if dialogue:
        meta_lines.append(f"dialogue: {render_dialogue(dialogue)}")
    if task_intro:
        meta_lines.append(f"taskIntro: {ts_string(task_intro)}")
    if conditional_task_intro:
        meta_lines.append(f"conditionalTaskIntro: {conditional_task_intro}")
    meta_lines.append(f"task: {task}")
    return "meta: {\n" + indent(",\n".join(meta_lines), "      ") + "\n    } as ChallengeSceneData"


def render_task_descriptor(task_type: str, *, variant: str | None = None, options: str | None = None) -> str:
    lines = [f"type: '{task_type}'"]
    if variant is not None:
        lines.append(f"variant: '{variant}'")
    if options is not None:
        lines.append(f"options: {options}")
    return "{\n" + indent(",\n".join(lines), "        ") + "\n      }"


def render_condition_guard(extra: str | None = None) -> str | None:
    if not extra:
        return None
    uses_event = "event" in extra
    uses_context = "context" in extra
    if uses_event and uses_context:
        signature = "{ event, context }: any"
    elif uses_context:
        signature = "{ context }: any"
    elif uses_event:
        signature = "{ event }: any"
    else:
        signature = "_: any"
    return f"guard: ({signature}) => {extra}"


def render_transition(target: str, *, guard_expr: str | None = None, actions: str | None = None) -> str:
    fields = []
    guard = render_condition_guard(guard_expr)
    if guard:
        fields.append(guard)
    fields.append(f"target: {ts_string(target)}")
    if actions:
        fields.append(actions)
    return "{ " + ", ".join(fields) + " }"


def machine_target_id(world: LoadedWorld, raw_target_id: str) -> str:
    stage = world.stages_by_id.get(raw_target_id)
    if isinstance(stage, TaskStage):
        return f"{raw_target_id}_intro"
    return raw_target_id


def render_condition_expression(condition: str) -> str:
    return f"evaluateStoryCondition(context, {ts_string(condition)})"


def render_target_transitions(world: LoadedWorld, target, *, answer_id: str | None = None, actions: str | None = None, map_stage_target: bool = False) -> list[str]:
    transitions: list[str] = []
    answer_expr = f"event.answer === {ts_string(answer_id)}" if answer_id is not None else None
    if isinstance(target, str):
        resolved_target = machine_target_id(world, target) if map_stage_target else target
        transitions.append(render_transition(resolved_target, guard_expr=answer_expr, actions=actions))
        return transitions

    for condition in target:
        guard_parts = []
        if answer_expr:
            guard_parts.append(answer_expr)
        if isinstance(condition, TransitionCondition) and condition.condition:
            guard_parts.append(render_condition_expression(condition.condition))
        guard_expr = " && ".join(guard_parts) if guard_parts else None
        resolved_target = machine_target_id(world, condition.value) if map_stage_target else condition.value
        transitions.append(render_transition(resolved_target, guard_expr=guard_expr, actions=actions if answer_expr else None))
        actions = None
    return transitions


def stage_file_name(stage_id: str) -> str:
    return stage_id.replace("_", "-") + ".ts"


def location_image_for_stage(stage: Stage) -> str | None:
    location_id = getattr(stage, "location_id", None)
    if not location_id:
        return None

    candidates = [f"{location_id}.png"]
    if location_id == "access_gate":
        if stage.id.endswith("_cargo"):
            candidates.insert(0, "access_gate-cargo.png")
        if stage.id.endswith("_medical"):
            candidates.insert(0, "access_gate-medical.png")

    for candidate in candidates:
        if (PUBLIC_LOCATIONS_DIR / candidate).exists():
            return f"/locations/{candidate}"
    return None


def choice_task_intro(choice: ChoiceAsset) -> str:
    heading = f"## {choice.title}" if choice.title else ""
    parts = [part for part in [heading, choice.prompt] if part]
    return "\n\n".join(parts)


def task_intro_markdown(task: TaskAsset) -> str:
    snippet = "\n".join(task.snippet)
    parts = [task.prompt]
    if snippet:
        parts.append(f"```{task.language}\n{snippet}\n```")
    return "\n\n".join(part for part in parts if part)


def render_choice_stage(world: LoadedWorld, stage: ChoiceStage) -> str:
    choice = world.choices[stage.choice_id]
    nav_stage = next(item for item in world.navigation.stages if item.id == stage.id)
    image = location_image_for_stage(stage)

    imports = ["import type { ChallengeSceneData } from '../types/story'"]
    needs_condition_helper = any(not isinstance(nav_stage.next_by_action[action.id], str) for action in choice.actions)
    if needs_condition_helper:
        imports.append("import { evaluateStoryCondition } from '../storyLogic'")

    interactive_transitions = []
    conclusion_states = []
    for action in choice.actions:
        action_state_id = f"{stage.id}_conclusion_{action.id}"
        interactive_transitions.extend(
            render_target_transitions(
                world,
                action_state_id,
                answer_id=action.id,
                actions=render_actions(action.flag_modifications, action.scores),
            )
        )

        next_transitions = render_target_transitions(world, nav_stage.next_by_action[action.id], map_stage_target=True)
        next_body = next_transitions[0] if len(next_transitions) == 1 and "guard:" not in next_transitions[0] else "[\n" + indent(",\n".join(next_transitions), "        ") + "\n      ]"
        conclusion_states.append(
            f"  {action_state_id}: {{\n"
            f"    {render_meta(action_state_id, text=action.conclusion, task=render_task_descriptor('text_scene'))},\n"
            f"    on: {{ NEXT: {next_body} }},\n"
            f"  }},"
        )

    state_text = (
        f"export const {export_name_for_stage(stage.id)} = {{\n"
        f"  {stage.id}: {{\n"
        f"    {render_meta(stage.id, image=image, title=stage.title, text=stage.intro_narrative, dialogue=stage.dialogue, task_intro=choice_task_intro(choice), task=render_task_descriptor('single_choice', variant='branch', options=render_options([(action.id, action.text) for action in choice.actions])))},\n"
        f"    on: {{\n"
        f"      NEXT: [\n{indent(',\n'.join(interactive_transitions), '        ')}\n      ],\n"
        f"    }},\n"
        f"  }},\n"
        f"\n" + "\n\n".join(conclusion_states) + "\n}\n"
    )
    return "\n".join(imports) + "\n\n\n" + state_text


def render_task_stage(world: LoadedWorld, stage: TaskStage) -> str:
    nav_stage = next(item for item in world.navigation.stages if item.id == stage.id)
    pool = world.task_pools.task_pools[stage.task_pool_id]
    image = location_image_for_stage(stage)
    imported_tasks = [world.tasks[task_id] for task_id in pool.task_ids]

    imports = ["import type { ChallengeSceneData } from '../types/story'"]
    for loaded_task in imported_tasks:
        imports.append(
            f"import {{ {task_helper_name(loaded_task.asset.id)} }} from './tasks/{loaded_task.source_stem}'"
        )
    needs_condition_helper = any(not isinstance(target, str) for target in nav_stage.next_by_outcome.values())
    if needs_condition_helper:
        imports.append("import { evaluateStoryCondition } from '../storyLogic'")

    task_count = len(imported_tasks)
    intro_transitions = []
    for index, loaded_task in enumerate(imported_tasks):
        guard_expr = None if index == task_count - 1 else f"event.rand < {(index + 1) / task_count:g}"
        intro_transitions.append(render_transition(f"{stage.id}_task_{index + 1}", guard_expr=guard_expr))

    task_state_spreads = []
    conditional_task_intro = render_conditional_task_intro(stage.modifiers)
    for index, loaded_task in enumerate(imported_tasks, start=1):
        config_lines = [
            f"stateId: {ts_string(f'{stage.id}_task_{index}')}",
            f"solvedTarget: {ts_string(f'{stage.id}_conclusion_solved')}",
            f"overrideTarget: {ts_string(f'{stage.id}_conclusion_override')}",
            f"incorrectTarget: {ts_string(f'{stage.id}_conclusion_incorrect')}",
        ]
        if conditional_task_intro is not None:
            config_lines.append(f"conditionalTaskIntro: {conditional_task_intro}")
        task_state_spreads.append(
            f"  ...{task_helper_name(loaded_task.asset.id)}({{\n{indent(',\n'.join(config_lines), '    ')}\n  }}),"
        )

    conclusion_states = []
    outcome_to_text = {
        TaskOutcome.SOLVED: stage.task_stage_conclusion.solved if stage.task_stage_conclusion else "",
        TaskOutcome.INCORRECT: stage.task_stage_conclusion.incorrect if stage.task_stage_conclusion else "",
        TaskOutcome.OVERRIDE: stage.task_stage_conclusion.override if stage.task_stage_conclusion else "",
    }
    for outcome in [TaskOutcome.SOLVED, TaskOutcome.INCORRECT, TaskOutcome.OVERRIDE]:
        state_id = f"{stage.id}_conclusion_{outcome.value}"
        next_target = nav_stage.next_by_outcome[outcome]
        transitions = render_target_transitions(world, next_target, map_stage_target=True)
        next_body = transitions[0] if len(transitions) == 1 and "guard:" not in transitions[0] else "[\n" + indent(",\n".join(transitions), "        ") + "\n      ]"
        conclusion_states.append(
            f"  {state_id}: {{\n"
            f"    {render_meta(state_id, text=outcome_to_text[outcome], task=render_task_descriptor('text_scene'))},\n"
            f"    on: {{ NEXT: {next_body} }},\n"
            f"  }},"
        )

    state_text = (
        f"export const {export_name_for_stage(stage.id)} = {{\n"
        f"  {stage.id}_intro: {{\n"
        f"    {render_meta(f'{stage.id}_intro', image=image, title=stage.title, text=stage.intro_narrative, dialogue=stage.dialogue, task=render_task_descriptor('one_tap_forward'))},\n"
        f"    on: {{\n"
        f"      NEXT: [\n{indent(',\n'.join(intro_transitions), '        ')}\n      ],\n"
        f"    }},\n"
        f"  }},\n\n"
        + "\n\n".join(task_state_spreads)
        + "\n\n"
        + "\n\n".join(conclusion_states)
        + "\n}\n"
    )
    return "\n".join(imports) + "\n\n\n" + state_text


def render_endings(stages: list[ConclusionStage]) -> str:
    blocks = []
    for stage in stages:
        blocks.append(
            f"  {stage.id}: {{\n"
            f"    type: 'final',\n"
            f"    {render_meta(stage.id, title=stage.title, text=stage.text, task=render_task_descriptor('text_scene'))},\n"
            f"  }},"
        )
    return (
        "import type { ChallengeSceneData } from '../types/story'\n\n\n"
        "export const endingStates = {\n"
        + "\n\n".join(blocks)
        + "\n}\n"
    )


def render_generated_task_helper() -> str:
    return """import type { ChallengeSceneData, ConditionalText } from '../../types/story'
import type { StoryFlagOperationSpec } from '../../storyLogic'

type Choice = { id: string; content: string; description?: string }
type ScoreDelta = { technical?: number; dedication?: number; social?: number }
type GeneratedAnswer = {
  id: string
  outcome: 'solved' | 'incorrect' | 'override'
  score?: ScoreDelta
  flagOps?: StoryFlagOperationSpec[]
}

export type GeneratedTaskStateConfig = {
  stateId: string
  solvedTarget: string
  overrideTarget: string
  incorrectTarget: string
  conditionalTaskIntro?: ConditionalText[]
}

type InternalGeneratedTaskStateConfig = GeneratedTaskStateConfig & {
  text: string
  taskIntro: string
  options: Choice[]
  answers: GeneratedAnswer[]
}

function targetForOutcome(config: GeneratedTaskStateConfig, outcome: GeneratedAnswer['outcome']) {
  if (outcome === 'solved') return config.solvedTarget
  if (outcome === 'override') return config.overrideTarget
  return config.incorrectTarget
}

function hasScore(score?: ScoreDelta) {
  return !!score && ((score.technical ?? 0) !== 0 || (score.dedication ?? 0) !== 0 || (score.social ?? 0) !== 0)
}

function actionsForAnswer(answer: GeneratedAnswer) {
  const actions: Array<{ type: string; params: unknown }> = []
  if (answer.flagOps?.length) {
    actions.push({ type: 'flagOps', params: answer.flagOps })
  }
  if (hasScore(answer.score)) {
    actions.push({ type: 'score', params: answer.score })
  }
  return actions
}

export function createGeneratedTaskState(config: InternalGeneratedTaskStateConfig) {
  return {
    [config.stateId]: {
      meta: {
        id: config.stateId,
        text: config.text,
        taskIntro: config.taskIntro,
        conditionalTaskIntro: config.conditionalTaskIntro,
        task: {
          type: 'single_choice',
          variant: 'problem',
          options: config.options.map(option => ({ id: option.id, content: option.content })),
        },
      } as ChallengeSceneData,
      on: {
        NEXT: config.answers.map((answer) => {
          const actions = actionsForAnswer(answer)
          return {
            guard: ({ event }: any) => event.answer === answer.id,
            target: targetForOutcome(config, answer.outcome),
            ...(actions.length ? { actions } : {}),
          }
        }),
      },
    },
  }
}
"""


def render_task_helper(task: TaskAsset) -> str:
    answer_lines = []
    for answer in task.actions:
        line_parts = [
            f"id: {ts_string(answer.id)}",
            f"outcome: {ts_string(answer.outcome.value)}",
        ]
        score = score_payload(answer.scores)
        if score is not None:
            score_object = score.removeprefix("{ type: 'score', params: ").removesuffix(" }")
            line_parts.append(f"score: {score_object}")
        flag_ops = flag_ops_payload(answer.flag_modifications)
        if flag_ops is not None:
            params = flag_ops.removeprefix("{ type: 'flagOps', params: ").removesuffix(" }")
            line_parts.append(f"flagOps: {params}")
        answer_lines.append("{ " + ", ".join(line_parts) + " }")

    option_lines = [
        "{ "
        + ", ".join(
            [
                f"id: {ts_string(answer.id)}",
                f"content: {ts_string(answer.text)}",
                f"description: {ts_string(answer.description)}",
            ]
        )
        + " }"
        for answer in task.actions
    ]

    return (
        "import { createGeneratedTaskState } from './_createGeneratedTaskState'\n"
        "import type { GeneratedTaskStateConfig } from './_createGeneratedTaskState'\n\n\n"
        f"export function {task_helper_name(task.id)}(config: GeneratedTaskStateConfig) {{\n"
        "  return createGeneratedTaskState({\n"
        "    ...config,\n"
        f"    text: {ts_string(task.title)},\n"
        f"    taskIntro: {ts_string(task_intro_markdown(task))},\n"
        "    options: [\n"
        + indent(",\n".join(option_lines), "      ")
        + "\n    ],\n"
        "    answers: [\n"
        + indent(",\n".join(answer_lines), "      ")
        + "\n    ],\n"
        "  })\n"
        "}\n"
    )


def render_index(stage_exports: list[tuple[str, str]]) -> str:
    import_lines = [
        "import { assign, createMachine } from 'xstate'",
        "import type { AnyStateMachine } from 'xstate'",
        "",
        "import { applyFlagOperations } from '../storyLogic'",
        "import type { StoryFlagOperationSpec } from '../storyLogic'",
        "import type { ChallengeSceneData } from '../types/story'",
    ]
    import_lines.extend([
        f"import {{ {export_name} }} from './{file_stem.removesuffix('.ts')}'"
        for file_stem, export_name in stage_exports
    ])
    import_lines.append("import { endingStates } from './endings'")
    spread_lines = [f"  ...{export_name}," for _, export_name in stage_exports]
    spread_lines.append("  ...endingStates,")
    return (
        "\n".join(import_lines)
        + "\n\ntype ScoreDelta = { technical?: number; dedication?: number; social?: number }\n\n"
        + "type MachineContext = {\n"
        + "  [key: string]: unknown\n"
        + "  boot_mode?: 'standard' | 'unsigned'\n"
        + "  route_choice?: 'cargo' | 'medical'\n"
        + "  eva_mode?: 'team' | 'solo'\n"
        + "  swap_mode?: 'hot' | 'drain'\n"
        + "  drone_mode?: 'patch' | 'override'\n"
        + "  problem_2_result?: 'solved' | 'incorrect' | 'override'\n"
        + "  problem_4_result?: 'solved' | 'incorrect' | 'override'\n"
        + "  problem_6_result?: 'solved' | 'incorrect' | 'override'\n"
        + "  problem_8_result?: 'solved' | 'incorrect' | 'override'\n"
        + "  problem_10_result?: 'solved' | 'incorrect' | 'override'\n"
        + "  accepted_exit_7?: boolean\n"
        + "  accepted_exit_8?: boolean\n"
        + "  accepted_exit_9?: boolean\n"
        + "  accepted_exit_10?: boolean\n"
        + "  debt_count?: number\n"
        + "  ending_tier?: string\n"
        + "  score: { technical: number; dedication: number; social: number }\n"
        + "}\n\n"
        + "const initialScore = { technical: 0, dedication: 0, social: 0 }\n\n"
        + "export const allMachineStates = {\n"
        + "\n".join(spread_lines)
        + "\n}\n\n"
        + "const baseMachine = createMachine<\n"
        + "  MachineContext,\n"
        + "  { type: 'NEXT'; answer?: string; rand?: number },\n"
        + "  never,\n"
        + "  never,\n"
        + "  never,\n"
        + "  string,\n"
        + "  string,\n"
        + "  never,\n"
        + "  unknown,\n"
        + "  never,\n"
        + "  ChallengeSceneData,\n"
        + "  { rand: number }\n"
        + ">({\n"
        + "  id: 'hydroworld',\n"
        + "  initial: 'section_1',\n"
        + "  context: {\n"
        + "    boot_mode: undefined,\n"
        + "    route_choice: undefined,\n"
        + "    eva_mode: undefined,\n"
        + "    swap_mode: undefined,\n"
        + "    drone_mode: undefined,\n"
        + "    problem_2_result: undefined,\n"
        + "    problem_4_result: undefined,\n"
        + "    problem_6_result: undefined,\n"
        + "    problem_8_result: undefined,\n"
        + "    problem_10_result: undefined,\n"
        + "    accepted_exit_7: false,\n"
        + "    accepted_exit_8: false,\n"
        + "    accepted_exit_9: false,\n"
        + "    accepted_exit_10: false,\n"
        + "    debt_count: 0,\n"
        + "    ending_tier: undefined,\n"
        + "    score: initialScore,\n"
        + "  },\n"
        + "  types: {} as {\n"
        + "    events: { type: 'NEXT'; answer?: string; rand?: number }\n"
        + "  },\n"
        + "  states: allMachineStates as any,\n"
        + "})\n\n"
        + "export const hydroMachine = baseMachine.provide({\n"
        + "  actions: {\n"
        + "    set: assign(({ context }, params: Record<string, unknown>) => ({\n"
        + "      ...context,\n"
        + "      ...params,\n"
        + "    })),\n"
        + "    score: assign(({ context }, params: ScoreDelta) => ({\n"
        + "      score: {\n"
        + "        technical: context.score.technical + (params.technical ?? 0),\n"
        + "        dedication: context.score.dedication + (params.dedication ?? 0),\n"
        + "        social: context.score.social + (params.social ?? 0),\n"
        + "      },\n"
        + "    })),\n"
        + "    flagOps: assign(({ context }, params: StoryFlagOperationSpec[]) => applyFlagOperations(context, params)),\n"
        + "  },\n"
        + "}) as unknown as AnyStateMachine\n"
    )


def write_text(path: Path, contents: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(contents, encoding="utf-8")


def generate_machine(world: LoadedWorld, output_dir: Path) -> None:
    if output_dir.exists():
        shutil.rmtree(output_dir)
    OUTPUT_TASKS_DIR.mkdir(parents=True, exist_ok=True)

    write_text(OUTPUT_TASKS_DIR / "_createGeneratedTaskState.ts", render_generated_task_helper())

    for loaded_task in world.tasks.values():
        write_text(OUTPUT_TASKS_DIR / f"{loaded_task.source_stem}.ts", render_task_helper(loaded_task.asset))

    stage_exports: list[tuple[str, str]] = []
    conclusion_stages: list[ConclusionStage] = []

    for stage in world.stage_config.stages:
        if isinstance(stage, ConclusionStage):
            conclusion_stages.append(stage)
            continue

        file_name = stage_file_name(stage.id)
        export_name = export_name_for_stage(stage.id)
        stage_exports.append((file_name, export_name))
        contents = render_choice_stage(world, stage) if isinstance(stage, ChoiceStage) else render_task_stage(world, stage)
        write_text(output_dir / file_name, contents)

    write_text(output_dir / "endings.ts", render_endings(conclusion_stages))
    write_text(output_dir / "index.ts", render_index(stage_exports))


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate src/machine1 from raw2 narrative assets")
    parser.add_argument("--world-dir", type=Path, default=ROOT, help="Path to the raw2 world directory")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR, help="Path to the machine1 output directory")
    args = parser.parse_args()

    world = load_world(args.world_dir)
    generate_machine(world, args.output_dir)


if __name__ == "__main__":
    main()