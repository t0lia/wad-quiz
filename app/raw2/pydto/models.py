from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Literal, TypeAlias


class StageType(str, Enum):
    TASK = "task"
    CHOICE = "choice"
    CONCLUSION = "conclusion"


class TaskOutcome(str, Enum):
    SOLVED = "solved"
    INCORRECT = "incorrect"
    OVERRIDE = "override"


class FlagOperation(str, Enum):
    SET = "set"
    REMOVE = "remove"
    ADD = "add"


@dataclass(slots=True)
class ScoreValues:
    technical_skills: float = 0.0
    dedication: float = 0.0
    social_capital: float = 0.0


@dataclass(slots=True)
class DialogueLine:
    speaker: str
    text: str


@dataclass(slots=True)
class Modifier:
    condition: str
    effect: str


@dataclass(slots=True)
class TransitionCondition:
    value: str
    condition: str | None = None
    is_else: bool = False


@dataclass(slots=True)
class FlagModification:
    flag: str
    operation: FlagOperation
    value: int = 0


TransitionTarget: TypeAlias = str | list[TransitionCondition]


@dataclass(slots=True)
class ChoiceAction:
    id: str
    text: str
    description: str
    conclusion: str = ""
    scores: ScoreValues = field(default_factory=ScoreValues)
    flag_modifications: list[FlagModification] = field(default_factory=list)


@dataclass(slots=True)
class ChoiceAsset:
    id: str
    kind: str
    title: str
    prompt: str
    actions: list[ChoiceAction]


@dataclass(slots=True)
class TaskAnswer:
    id: str
    text: str
    description: str
    scores: ScoreValues = field(default_factory=ScoreValues)
    outcome: TaskOutcome = TaskOutcome.INCORRECT
    flag_modifications: list[FlagModification] = field(default_factory=list)


@dataclass(slots=True)
class TaskAsset:
    id: str
    pool: str
    language: str
    bug_class: str
    mechanic_type: str
    slot_theme_fit: str
    prompt_surface: str
    answer_shape: str
    title: str
    prompt: str
    snippet: list[str]
    actions: list[TaskAnswer]


@dataclass(slots=True)
class TaskPoolDefinition:
    id: str
    title: str
    slot_theme: str
    task_ids: list[str]


@dataclass(slots=True)
class TaskStageConclusion:
    solved: str
    incorrect: str
    override: str


@dataclass(slots=True)
class ChoiceStage:
    id: str
    stage_type: Literal[StageType.CHOICE] = StageType.CHOICE
    title: str = ""
    location_id: str | None = None
    intro_narrative: str = ""
    dialogue: list[DialogueLine] = field(default_factory=list)
    choice_id: str = ""


@dataclass(slots=True)
class TaskStage:
    id: str
    stage_type: Literal[StageType.TASK] = StageType.TASK
    title: str = ""
    location_id: str | None = None
    intro_narrative: str = ""
    dialogue: list[DialogueLine] = field(default_factory=list)
    task_pool_id: str = ""
    task_pool_title: str = ""
    modifiers: list[Modifier] = field(default_factory=list)
    task_stage_conclusion: TaskStageConclusion | None = None


@dataclass(slots=True)
class ConclusionStage:
    id: str
    stage_type: Literal[StageType.CONCLUSION] = StageType.CONCLUSION
    title: str = ""
    text: str = ""


Stage: TypeAlias = ChoiceStage | TaskStage | ConclusionStage


@dataclass(slots=True)
class StageConfigDocument:
    format: str
    source_world: str
    stages: list[Stage]


@dataclass(slots=True)
class NavigationStage:
    id: str
    next_by_action: dict[str, TransitionTarget] = field(default_factory=dict)
    next_by_outcome: dict[TaskOutcome, TransitionTarget] = field(default_factory=dict)


@dataclass(slots=True)
class NavigationDocument:
    format: str
    source_world: str
    start_stage: str
    stages: list[NavigationStage]
    terminal_stages: list[str]


@dataclass(slots=True)
class TaskPoolsDocument:
    task_pools: dict[str, TaskPoolDefinition]
