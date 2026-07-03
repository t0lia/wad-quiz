import unittest
from pathlib import Path
import sys

import yaml


PYDTO_DIR = Path(__file__).resolve().parent
WORLD_DIR = PYDTO_DIR.parent
REPO_ROOT = WORLD_DIR.parents[1]

sys.path.insert(0, str(WORLD_DIR))
sys.path.insert(0, str(REPO_ROOT))

from pydto.render_hw2 import Hw2Renderer, RenderState

from pydto import (
    ChoiceStage,
    ConclusionStage,
    FlagOperation,
    StageType,
    TaskOutcome,
    TaskStage,
)
from pydto.parsers import (
    parse_choice_asset,
    parse_choice_markdown,
    parse_navigation_document,
    parse_stage_config_document,
    parse_task_asset,
    parse_task_markdown,
    parse_task_pools_document,
)


class Hydroworld2DtoTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.navigation = parse_navigation_document(
            yaml.safe_load((WORLD_DIR / "01_structure.yaml").read_text(encoding="utf-8"))
        )
        cls.stage_config = parse_stage_config_document(
            yaml.safe_load((WORLD_DIR / "stages" / "01-stages.yaml").read_text(encoding="utf-8"))
        )
        cls.task_pools = parse_task_pools_document(
            yaml.safe_load((WORLD_DIR / "02_taskpools.yaml").read_text(encoding="utf-8"))
        )
        cls.task_assets = {
            task.id: task
            for task in (
                parse_task_asset(parse_task_markdown(path))
                for path in sorted((WORLD_DIR / "tasks").glob("[0-9][0-9]-*.yaml"))
            )
        }
        cls.choice_assets = {
            choice.id: choice
            for choice in (
                parse_choice_asset(parse_choice_markdown(path))
                for path in sorted((WORLD_DIR / "choices").glob("[0-9][0-9]-*.yaml"))
            )
        }

    def test_navigation_document_matches_real_graph(self) -> None:
        self.assertEqual(self.navigation.format, "StageNavigationV1")
        self.assertEqual(self.navigation.source_world, "hydroworld")
        self.assertEqual(self.navigation.start_stage, "section_1")
        self.assertEqual(len(self.navigation.stages), 24)
        self.assertEqual(len(self.navigation.terminal_stages), 5)

        stage_ids = {stage.id for stage in self.navigation.stages}
        self.assertIn("section_7", stage_ids)
        self.assertIn("section_10_exit", stage_ids)

        section_7 = next(stage for stage in self.navigation.stages if stage.id == "section_7")
        team_target = section_7.next_by_action["team_eva"]
        self.assertIsInstance(team_target, list)
        self.assertEqual(team_target[0].condition, "route_cargo >= 1")
        self.assertEqual(team_target[0].value, "section_7_exit_cargo")
        self.assertTrue(team_target[1].is_else)
        self.assertEqual(team_target[1].value, "section_7_exit_medical")

        section_2_standard = next(stage for stage in self.navigation.stages if stage.id == "section_2_standard")
        self.assertEqual(section_2_standard.next_by_outcome[TaskOutcome.SOLVED], "section_3")
        self.assertEqual(section_2_standard.next_by_outcome[TaskOutcome.INCORRECT], "section_3")
        self.assertEqual(section_2_standard.next_by_outcome[TaskOutcome.OVERRIDE], "section_3")

    def test_stage_config_document_matches_real_stage_shapes(self) -> None:
        self.assertEqual(self.stage_config.format, "StageConfigsV1")
        self.assertEqual(self.stage_config.source_world, "hydroworld")
        self.assertEqual(len(self.stage_config.stages), 29)

        choice_stages = [stage for stage in self.stage_config.stages if isinstance(stage, ChoiceStage)]
        task_stages = [stage for stage in self.stage_config.stages if isinstance(stage, TaskStage)]
        conclusion_stages = [stage for stage in self.stage_config.stages if isinstance(stage, ConclusionStage)]

        self.assertEqual(len(choice_stages), 14)
        self.assertEqual(len(task_stages), 10)
        self.assertEqual(len(conclusion_stages), 5)

        for stage in choice_stages:
            self.assertEqual(stage.stage_type, StageType.CHOICE)
            self.assertTrue(stage.choice_id)
            self.assertTrue(stage.dialogue)

        for stage in task_stages:
            self.assertEqual(stage.stage_type, StageType.TASK)
            self.assertTrue(stage.task_pool_id)
            self.assertIsNotNone(stage.task_stage_conclusion)
            self.assertTrue(stage.task_stage_conclusion.solved)
            self.assertTrue(stage.task_stage_conclusion.incorrect)
            self.assertTrue(stage.task_stage_conclusion.override)

        for stage in conclusion_stages:
            self.assertEqual(stage.stage_type, StageType.CONCLUSION)
            self.assertTrue(stage.title)
            self.assertTrue(stage.text)

    def test_task_pools_document_matches_stage_references(self) -> None:
        self.assertEqual(len(self.task_pools.task_pools), 5)
        task_pool_ids = set(self.task_pools.task_pools)
        referenced_pool_ids = {
            stage.task_pool_id
            for stage in self.stage_config.stages
            if isinstance(stage, TaskStage)
        }
        self.assertEqual(referenced_pool_ids, task_pool_ids)

        for pool in self.task_pools.task_pools.values():
            self.assertTrue(pool.title)
            self.assertTrue(pool.slot_theme)
            self.assertTrue(pool.task_ids)
            for task_id in pool.task_ids:
                self.assertIn(task_id, self.task_assets)

    def test_task_assets_match_pool_and_answer_model(self) -> None:
        pooled_task_ids = {
            task_id
            for pool in self.task_pools.task_pools.values()
            for task_id in pool.task_ids
        }
        self.assertEqual(set(self.task_assets), pooled_task_ids)

        for task in self.task_assets.values():
            self.assertTrue(task.pool)
            self.assertTrue(task.language)
            self.assertTrue(task.bug_class)
            self.assertTrue(task.mechanic_type)
            self.assertTrue(task.slot_theme_fit)
            self.assertTrue(task.prompt_surface)
            self.assertEqual(task.answer_shape, "action_id")
            self.assertTrue(task.title)
            self.assertTrue(task.prompt)
            self.assertTrue(task.snippet)
            self.assertEqual(len(task.actions), 4)

            for action in task.actions:
                self.assertTrue(action.id)
                self.assertTrue(action.text)
                self.assertTrue(action.description)
                self.assertIsInstance(action.scores.technical_skills, float)
                self.assertIsInstance(action.scores.dedication, float)
                self.assertIsInstance(action.scores.social_capital, float)
                self.assertTrue(action.flag_modifications)
                self.assertIn(action.outcome, {TaskOutcome.SOLVED, TaskOutcome.INCORRECT, TaskOutcome.OVERRIDE})

        starter = self.task_assets["js_start_barrier_missing"]
        self.assertEqual(starter.pool, "boot_terminal_concurrency")
        self.assertEqual(starter.language, "javascript")
        self.assertEqual(starter.actions[1].id, "await_service_barrier")
        self.assertEqual(starter.actions[1].outcome, TaskOutcome.SOLVED)
        self.assertEqual(starter.actions[3].outcome, TaskOutcome.OVERRIDE)

    def test_choice_assets_match_stage_references_and_action_model(self) -> None:
        referenced_choice_ids = {
            stage.choice_id
            for stage in self.stage_config.stages
            if isinstance(stage, ChoiceStage)
        }
        self.assertEqual(set(self.choice_assets), referenced_choice_ids)

        for choice in self.choice_assets.values():
            self.assertEqual(choice.kind, "branch_choice")
            self.assertTrue(choice.title)
            self.assertTrue(choice.prompt)
            self.assertGreaterEqual(len(choice.actions), 2)
            for action in choice.actions:
                self.assertTrue(action.id)
                self.assertTrue(action.text)
                self.assertTrue(action.description)
                self.assertTrue(action.conclusion)
                self.assertIsInstance(action.scores.technical_skills, float)
                self.assertIsInstance(action.scores.dedication, float)
                self.assertIsInstance(action.scores.social_capital, float)
                if action.id in {
                    "choose_standard",
                    "choose_unsigned",
                    "take_cargo_route",
                    "take_medical_route",
                    "patch_drone",
                    "override_drone",
                    "team_eva",
                    "solo_eva",
                    "hot_swap",
                    "full_drain",
                }:
                    self.assertTrue(action.flag_modifications)

        boot_choice = self.choice_assets["section_1"]
        self.assertEqual(boot_choice.actions[0].id, "choose_standard")
        self.assertIn("Sector A", boot_choice.prompt)
        self.assertEqual(boot_choice.actions[0].flag_modifications[0].operation, FlagOperation.SET)
        self.assertEqual(boot_choice.actions[1].flag_modifications[-1].flag, "debt_count")

    def test_flag_mutations_drive_navigation(self) -> None:
        renderer = Hw2Renderer(WORLD_DIR, seed=1)

        cargo_state = RenderState()
        route_choice = self.choice_assets["section_3"]
        cargo_action = next(action for action in route_choice.actions if action.id == "take_cargo_route")
        renderer._apply_flag_modifications(cargo_action.flag_modifications, cargo_state)

        self.assertEqual(cargo_state.flags["route_cargo"], 1)
        self.assertNotIn("route_medical", cargo_state.flags)
        self.assertEqual(
            renderer._resolve_target(renderer.nav_by_id["section_7"].next_by_action["team_eva"], cargo_state),
            "section_7_exit_cargo",
        )

        medical_state = RenderState()
        medical_action = next(action for action in route_choice.actions if action.id == "take_medical_route")
        renderer._apply_flag_modifications(medical_action.flag_modifications, medical_state)

        self.assertEqual(medical_state.flags["route_medical"], 1)
        self.assertNotIn("route_cargo", medical_state.flags)
        self.assertEqual(
            renderer._resolve_target(renderer.nav_by_id["section_7"].next_by_action["team_eva"], medical_state),
            "section_7_exit_medical",
        )

        debt_action = next(
            action
            for action in self.task_assets["js_clamp_boolean_payload"].actions
            if action.id == "force_profile_override"
        )
        renderer._apply_flag_modifications(debt_action.flag_modifications, cargo_state)

        self.assertEqual(cargo_state.flags["completed_tasks"], 1)
        self.assertEqual(cargo_state.flags["override_count"], 1)
        self.assertEqual(cargo_state.flags["debt_count"], 1)
        self.assertEqual(
            renderer._resolve_target(
                renderer.nav_by_id["section_7_exit_cargo"].next_by_action["continue_after_7"],
                cargo_state,
            ),
            "section_8_clean",
        )

        renderer._apply_flag_modifications(debt_action.flag_modifications, cargo_state)
        self.assertEqual(cargo_state.flags["debt_count"], 2)
        self.assertEqual(
            renderer._resolve_target(
                renderer.nav_by_id["section_7_exit_cargo"].next_by_action["continue_after_7"],
                cargo_state,
            ),
            "section_8_debt",
        )

    def test_cross_document_ids_and_endings_are_consistent(self) -> None:
        stage_ids = {stage.id for stage in self.stage_config.stages}
        non_conclusion_stage_ids = {
            stage.id
            for stage in self.stage_config.stages
            if not isinstance(stage, ConclusionStage)
        }
        conclusion_stage_ids = {
            stage.id
            for stage in self.stage_config.stages
            if isinstance(stage, ConclusionStage)
        }

        self.assertEqual({stage.id for stage in self.navigation.stages}, non_conclusion_stage_ids)
        self.assertEqual(set(self.navigation.terminal_stages), conclusion_stage_ids)
        self.assertTrue({"ending_1", "ending_2", "ending_3", "ending_4", "ending_5"}.issubset(stage_ids))


if __name__ == "__main__":
    unittest.main()