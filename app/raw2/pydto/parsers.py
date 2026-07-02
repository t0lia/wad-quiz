from __future__ import annotations

from typing import Any, cast

from .models import ChoiceAction, ChoiceAsset, ChoiceStage, ConclusionStage, DialogueLine, FlagModification, FlagOperation, Modifier, NavigationDocument, NavigationStage, ScoreValues, Stage, StageConfigDocument, StageType, TaskAnswer, TaskAsset, TaskOutcome, TaskPoolDefinition, TaskPoolsDocument, TaskStage, TaskStageConclusion, TransitionCondition, TransitionTarget


def parse_score_values(data: dict[str, Any]) -> ScoreValues:
    return ScoreValues(
        technical_skills=float(data.get("technical_skills", 0.0)),
        dedication=float(data.get("dedication", 0.0)),
        social_capital=float(data.get("social_capital", 0.0)),
    )


def parse_dialogue_line(data: dict[str, Any]) -> DialogueLine:
    return DialogueLine(speaker=str(data["speaker"]), text=str(data["text"]))


def parse_modifier(data: dict[str, Any]) -> Modifier:
    return Modifier(condition=str(data["condition"]), effect=str(data["effect"]))


def parse_transition_condition(data: dict[str, Any]) -> TransitionCondition:
    return TransitionCondition(
        value=str(data["value"] if "value" in data else data["else"]),
        condition=str(data["if"]) if "if" in data else None,
        is_else="else" in data,
    )


def parse_flag_modification(data: dict[str, Any]) -> FlagModification:
    return FlagModification(
        flag=str(data["flag"]),
        operation=FlagOperation(str(data["operation"])),
        value=int(data.get("value", 0)),
    )


def parse_choice_action(data: dict[str, Any]) -> ChoiceAction:
    return ChoiceAction(
        id=str(data["id"]),
        text=str(data["text"]),
        description=str(data["description"]),
        conclusion=str(data.get("conclusion", "")),
        scores=parse_score_values(cast(dict[str, Any], data.get("scores", {}))),
        flag_modifications=[parse_flag_modification(item) for item in data.get("flag_modifications", [])],
    )


def parse_choice_asset(data: dict[str, Any]) -> ChoiceAsset:
    return ChoiceAsset(
        id=str(data["id"]),
        kind=str(data["kind"]),
        title=str(data["title"]),
        prompt=str(data["prompt"]),
        actions=[parse_choice_action(item) for item in data.get("actions", [])],
    )


def parse_task_answer(data: dict[str, Any]) -> TaskAnswer:
    return TaskAnswer(
        id=str(data["id"]),
        text=str(data["text"]),
        description=str(data["description"]),
        scores=parse_score_values(cast(dict[str, Any], data.get("scores", {}))),
        outcome=TaskOutcome(str(data.get("outcome", TaskOutcome.INCORRECT.value))),
        flag_modifications=[parse_flag_modification(item) for item in data.get("flag_modifications", [])],
    )


def parse_task_asset(data: dict[str, Any]) -> TaskAsset:
    return TaskAsset(
        id=str(data["id"]),
        pool=str(data["pool"]),
        language=str(data["language"]),
        bug_class=str(data["bug_class"]),
        mechanic_type=str(data["mechanic_type"]),
        slot_theme_fit=str(data["slot_theme_fit"]),
        prompt_surface=str(data["prompt_surface"]),
        answer_shape=str(data["answer_shape"]),
        title=str(data["title"]),
        prompt=str(data["prompt"]),
        snippet=[str(line) for line in data.get("snippet", [])],
        actions=[parse_task_answer(item) for item in data.get("actions", [])],
    )


def parse_task_pool_definition(pool_id: str, data: dict[str, Any]) -> TaskPoolDefinition:
    return TaskPoolDefinition(
        id=pool_id,
        title=str(data["title"]),
        slot_theme=str(data["slot_theme"]),
        task_ids=[str(task_id) for task_id in data.get("task_ids", [])],
    )


def parse_task_stage_conclusion(data: dict[str, Any]) -> TaskStageConclusion:
    return TaskStageConclusion(
        solved=str(data["solved"]),
        incorrect=str(data["incorrect"]),
        override=str(data["override"]),
    )


def parse_choice_stage(data: dict[str, Any]) -> ChoiceStage:
    return ChoiceStage(
        id=str(data["id"]),
        title=str(data.get("title", "")),
        location_id=str(data["location_id"]) if data.get("location_id") is not None else None,
        intro_narrative=str(data.get("intro_narrative", "")),
        dialogue=[parse_dialogue_line(item) for item in data.get("dialogue", [])],
        choice_id=str(data.get("choice_id", "")),
    )


def parse_task_stage(data: dict[str, Any]) -> TaskStage:
    conclusion_data = cast(dict[str, Any] | None, data.get("task_stage_conclusion"))
    return TaskStage(
        id=str(data["id"]),
        title=str(data.get("title", "")),
        location_id=str(data["location_id"]) if data.get("location_id") is not None else None,
        intro_narrative=str(data.get("intro_narrative", "")),
        dialogue=[parse_dialogue_line(item) for item in data.get("dialogue", [])],
        task_pool_id=str(data.get("task_pool_id", "")),
        task_pool_title=str(data.get("task_pool_title", "")),
        modifiers=[parse_modifier(item) for item in data.get("modifiers", [])],
        task_stage_conclusion=(parse_task_stage_conclusion(conclusion_data) if conclusion_data is not None else None),
    )


def parse_conclusion_stage(data: dict[str, Any]) -> ConclusionStage:
    return ConclusionStage(id=str(data["id"]), title=str(data.get("title", "")), text=str(data.get("text", "")))


def parse_stage(data: dict[str, Any]) -> Stage:
    stage_type = StageType(data["stage_type"])
    if stage_type is StageType.CHOICE:
        return parse_choice_stage(data)
    if stage_type is StageType.TASK:
        return parse_task_stage(data)
    return parse_conclusion_stage(data)


def parse_stage_config_document(data: dict[str, Any]) -> StageConfigDocument:
    return StageConfigDocument(
        format=str(data["format"]),
        source_world=str(data["source_world"]),
        stages=[parse_stage(stage) for stage in data.get("stages", [])],
    )


def parse_transition_target(value: Any) -> TransitionTarget:
    if isinstance(value, str):
        return value
    if isinstance(value, list):
        return [parse_transition_condition(cast(dict[str, Any], item)) for item in value]
    raise TypeError(f"Unsupported transition target: {value!r}")


def parse_navigation_stage(data: dict[str, Any]) -> NavigationStage:
    raw_actions = cast(dict[str, Any], data.get("next_by_action", {}))
    raw_outcomes = cast(dict[str, Any], data.get("next_by_outcome", {}))
    return NavigationStage(
        id=str(data["id"]),
        next_by_action={key: parse_transition_target(value) for key, value in raw_actions.items()},
        next_by_outcome={TaskOutcome(key): parse_transition_target(value) for key, value in raw_outcomes.items()},
    )


def parse_navigation_document(data: dict[str, Any]) -> NavigationDocument:
    return NavigationDocument(
        format=str(data["format"]),
        source_world=str(data["source_world"]),
        start_stage=str(data["start_stage"]),
        stages=[parse_navigation_stage(item) for item in data.get("stages", [])],
        terminal_stages=[str(item) for item in data.get("terminal_stages", [])],
    )


def parse_task_pools_document(data: dict[str, Any]) -> TaskPoolsDocument:
    pools = cast(dict[str, dict[str, Any]], data.get("task_pools", {}))
    return TaskPoolsDocument(
        task_pools={pool_id: parse_task_pool_definition(pool_id, pool) for pool_id, pool in pools.items()}
    )