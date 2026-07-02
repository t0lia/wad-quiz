from __future__ import annotations

import argparse
import os
import random
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

import yaml


PYDTO_DIR = Path(__file__).resolve().parent
WORLD_DIR = PYDTO_DIR.parent
REPO_ROOT = WORLD_DIR.parents[1]

sys.path.insert(0, str(WORLD_DIR))
sys.path.insert(0, str(REPO_ROOT))

from pydto.models import (  # noqa: E402
    ChoiceStage,
    ConclusionStage,
    FlagModification,
    FlagOperation,
    NavigationDocument,
    ScoreValues,
    StageConfigDocument,
    TaskAsset,
    TaskOutcome,
    TaskPoolsDocument,
    TaskStage,
    TransitionCondition,
)
from pydto.parsers import parse_choice_asset, parse_navigation_document, parse_stage_config_document, parse_task_asset, parse_task_pools_document  # noqa: E402
from scripts.hydroworld_content import parse_choice_markdown, parse_task_markdown  # noqa: E402


CONDITION_RE = re.compile(r"^([A-Za-z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$")


@dataclass(slots=True)
class RenderState:
    scores: ScoreValues = field(default_factory=ScoreValues)
    flags: dict[str, int] = field(default_factory=dict)
    path: list[str] = field(default_factory=list)


class Hw2Renderer:
    def __init__(self, world_dir: Path, seed: int | None = None, debug: bool = False) -> None:
        self.world_dir = world_dir
        self.random = random.Random(seed)
        self.debug = debug
        self.navigation, self.stage_config, self.task_pools, self.choices, self.tasks = self._load_game(world_dir)
        self.stage_by_id = {stage.id: stage for stage in self.stage_config.stages}
        self.nav_by_id = {stage.id: stage for stage in self.navigation.stages}

    def _load_game(
        self,
        world_dir: Path,
    ) -> tuple[
        NavigationDocument,
        StageConfigDocument,
        TaskPoolsDocument,
        dict[str, object],
        dict[str, TaskAsset],
    ]:
        navigation = parse_navigation_document(
            yaml.safe_load((world_dir / "01_structure.yaml").read_text(encoding="utf-8"))
        )
        stage_config = parse_stage_config_document(
            yaml.safe_load((world_dir / "stages" / "01-stages.yaml").read_text(encoding="utf-8"))
        )
        task_pools = parse_task_pools_document(
            yaml.safe_load((world_dir / "02_taskpools.yaml").read_text(encoding="utf-8"))
        )
        tasks = {
            task.id: task
            for task in (
                parse_task_asset(parse_task_markdown(path))
                for path in sorted((world_dir / "tasks").glob("[0-9][0-9]-*.md"))
            )
        }
        choices = {
            choice.id: choice
            for choice in (
                parse_choice_asset(parse_choice_markdown(path))
                for path in sorted((world_dir / "choices").glob("[0-9][0-9]-*.md"))
            )
        }
        return navigation, stage_config, task_pools, choices, tasks

    def run(self) -> None:
        state = RenderState()
        current_stage_id = self.navigation.start_stage

        while True:
            stage = self.stage_by_id[current_stage_id]
            if isinstance(stage, ChoiceStage):
                current_stage_id = self._render_choice_stage(stage, state)
                continue
            if isinstance(stage, TaskStage):
                current_stage_id = self._render_task_stage(stage, state)
                continue
            self._render_conclusion_stage(stage, state)
            break

    def _render_choice_stage(self, stage: ChoiceStage, state: RenderState) -> str:
        self._clear_screen()
        self._render_stage_header(stage)
        self._render_dialogue(stage)
        self._wait_continue()

        choice = self.choices[stage.choice_id]
        self._print_debug_value("choice_id", choice.id)
        print(choice.title)
        if choice.prompt:
            print(choice.prompt)
        for index, action in enumerate(choice.actions, start=1):
            print(self._format_option(index, action.text, action.id))

        picked_action = choice.actions[self._choose_index(len(choice.actions))]
        self._wait_next()
        self._apply_choice_effects(picked_action.scores, picked_action.flag_modifications, state)
        state.path.append(f"{stage.id}:{picked_action.id}")
        if picked_action.conclusion:
            print(picked_action.conclusion)
        return self._resolve_choice_next(stage.id, picked_action.id, state)

    def _render_task_stage(self, stage: TaskStage, state: RenderState) -> str:
        self._clear_screen()
        self._render_stage_header(stage)
        self._render_dialogue(stage)
        self._wait_continue()

        for modifier in stage.modifiers:
            if self._evaluate_condition(state, modifier.condition):
                print(modifier.effect)

        task = self._pick_task(stage.task_pool_id)
        self._print_debug_value("task_pool_id", stage.task_pool_id)
        self._print_debug_value("task_id", task.id)
        print(task.title)
        print(task.prompt)
        print("```")
        for line in task.snippet:
            print(line)
        print("```")
        for index, action in enumerate(task.actions, start=1):
            print(self._format_option(index, action.text, action.id))

        picked_answer = task.actions[self._choose_index(len(task.actions))]
        self._wait_next()
        outcome = picked_answer.outcome
        self._apply_task_effects(picked_answer.scores, picked_answer.flag_modifications, state)
        state.path.append(f"{stage.id}:{outcome.value}")

        if stage.task_stage_conclusion is not None:
            if outcome is TaskOutcome.SOLVED:
                print(stage.task_stage_conclusion.solved)
            elif outcome is TaskOutcome.OVERRIDE:
                print(stage.task_stage_conclusion.override)
            else:
                print(stage.task_stage_conclusion.incorrect)

        return self._resolve_task_next(stage.id, outcome, state)

    def _render_conclusion_stage(self, stage: ConclusionStage, state: RenderState) -> None:
        self._print_debug_value("stage_id", stage.id)
        print(stage.title)
        print(stage.text)
        print("Accumulated scores")
        print(f"technical_skills: {state.scores.technical_skills:.1f}")
        print(f"dedication: {state.scores.dedication:.1f}")
        print(f"social_capital: {state.scores.social_capital:.1f}")

    def _render_stage_header(self, stage: ChoiceStage | TaskStage) -> None:
        self._print_debug_value("stage_id", stage.id)
        print(stage.title)
        if stage.intro_narrative:
            print(stage.intro_narrative)

    def _render_dialogue(self, stage: ChoiceStage | TaskStage) -> None:
        for line in stage.dialogue:
            print(f"{line.speaker}: {line.text}")

    def _pick_task(self, pool_id: str) -> TaskAsset:
        pool = self.task_pools.task_pools[pool_id]
        task_id = self.random.choice(pool.task_ids)
        return self.tasks[task_id]

    def _resolve_choice_next(self, stage_id: str, action_id: str, state: RenderState) -> str:
        nav = self.nav_by_id[stage_id]
        return self._resolve_target(nav.next_by_action[action_id], state)

    def _resolve_task_next(self, stage_id: str, outcome: TaskOutcome, state: RenderState) -> str:
        nav = self.nav_by_id[stage_id]
        return self._resolve_target(nav.next_by_outcome[outcome], state)

    def _resolve_target(self, target: str | list[TransitionCondition], state: RenderState) -> str:
        if isinstance(target, str):
            return target
        for condition in target:
            if condition.condition and self._evaluate_condition(state, condition.condition):
                return condition.value
            if condition.is_else:
                return condition.value
        raise ValueError("Unable to resolve next stage from transition conditions")

    def _apply_choice_effects(
        self,
        scores: ScoreValues,
        flag_modifications: list[FlagModification],
        state: RenderState,
    ) -> None:
        self._apply_scores(scores, state)
        self._apply_flag_modifications(flag_modifications, state)

    def _apply_task_effects(
        self,
        scores: ScoreValues,
        flag_modifications: list[FlagModification],
        state: RenderState,
    ) -> None:
        self._apply_scores(scores, state)
        self._apply_flag_modifications(flag_modifications, state)

    def _apply_scores(self, scores: ScoreValues, state: RenderState) -> None:
        state.scores.technical_skills += scores.technical_skills
        state.scores.dedication += scores.dedication
        state.scores.social_capital += scores.social_capital

    def _apply_flag_modifications(self, modifications: list[FlagModification], state: RenderState) -> None:
        for modification in modifications:
            if modification.operation is FlagOperation.SET:
                state.flags[modification.flag] = modification.value
            elif modification.operation is FlagOperation.REMOVE:
                state.flags.pop(modification.flag, None)
            elif modification.operation is FlagOperation.ADD:
                state.flags[modification.flag] = state.flags.get(modification.flag, 0) + modification.value

    def _evaluate_condition(self, state: RenderState, expression: str) -> bool:
        match = CONDITION_RE.match(expression.strip())
        if not match:
            return False

        key, operator, raw_value = match.groups()
        left = self._derived_value(state, key)
        right = self._parse_condition_value(raw_value)

        if operator == "==":
            return left == right
        if operator == "!=":
            return left != right
        if operator == ">=":
            return left is not None and left >= right
        if operator == "<=":
            return left is not None and left <= right
        if operator == ">":
            return left is not None and left > right
        if operator == "<":
            return left is not None and left < right
        return False

    def _derived_value(self, state: RenderState, key: str) -> int:
        return int(state.flags.get(key, 0))

    def _parse_condition_value(self, raw_value: str) -> str | bool | int:
        value = raw_value.strip().strip("\"'")
        lowered = value.lower()
        if lowered == "true":
            return True
        if lowered == "false":
            return False
        if value.isdigit():
            return int(value)
        return value

    def _choose_index(self, option_count: int) -> int:
        allowed = {str(index): index - 1 for index in range(1, option_count + 1)}
        while True:
            raw = input("Choose option number: ").strip()
            if raw in allowed:
                return allowed[raw]
            print(f"Please enter one of: {', '.join(allowed)}")

    def _format_option(self, index: int, text: str, element_id: str) -> str:
        if self.debug:
            return f"{index}. {text} [id: {element_id}]"
        return f"{index}. {text}"

    def _print_debug_value(self, label: str, value: str) -> None:
        if self.debug:
            print(f"[{label}: {value}]")

    def _wait_continue(self) -> None:
        input("Press Enter to continue... ")

    def _wait_next(self) -> None:
        input("Press Enter for Next... ")

    def _clear_screen(self) -> None:
        os.system("cls" if os.name == "nt" else "clear")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Render the Hydroworld2 game from the extracted HW2 content model.")
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
        help="Optional random seed for deterministic task selection.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    renderer = Hw2Renderer(WORLD_DIR, seed=args.seed)
    renderer.run()


if __name__ == "__main__":
    main()