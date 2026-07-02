---
name: yaml-to-machine
description: 'Convert YAML story sections to XState machine states. Map narrative sections (intro → interaction → conclusion) to pages. Handle branch choices and problem tasks with multiple outcomes.'
argument-hint: 'Which section from 06-gn_structure.yaml should I convert?'
user-invocable: true
---

# YAML to XState Machine Conversion

## Core Concept

Hydroworld is a narrative graph. Each section in `06-gn_structure.yaml` maps to a story screen with three phases:

1. **Intro** (problem tasks only) — Read narrative, see dialogue
2. **Interaction** — Solve code (problem) OR choose a route (branch)
3. **Conclusion** — See outcome narrative before moving to next section

In XState, each phase becomes a separate state. Most sections generate 3–7 states depending on interaction type.

## Game Design Essentials

### What You're Actually Implementing

- **Choice node** (branch): Player picks a route. Each choice routes to a different next section and may set context flags.
- **Problem node** (problem): Player solves code. Results in `solved`, `incorrect`, or `override` outcome. Tasks are shuffled at runtime from a pool, so UI binds by `action.id`, not position.
- **Scoring**: Every choice carries deltas for `technical`, `dedication`, `social`. These accumulate and display on the final screen.
- **State flags**: Context flags like `boot_mode`, `route_choice`, `problem_X_result` drive later branches and endings.

### What the Player Sees

| Phase | Branch | Problem |
|-------|--------|---------|
| Intro | *none* | Narrative + dialogue + Continue button |
| Task | Options (tappable cards) + prompt | Code snippet + options + Submit button |
| Conclusion | Outcome narrative + Continue | Outcome narrative + Continue |

**Rendering rules:**
- Show: section title, location, prompt text, option labels, descriptions, code, dialogue, conclusion narrative
- Hide: section_id, action.id, pool_ids, result flags (`problem_X_result`), YAML structure keys

### Key Runtime Behavior

- **Task assembly**: One task is selected from the section's mapped pool and shuffled. UI must bind selections to `action.id` under the hood, never to a fixed position.
- **Modifiers**: Problems can have conditional prompt tweaks (e.g., "You have limited oxygen" if in danger). Apply based on current context flags.

---

## Implementation Workflow

### Step 1: Locate and Analyze YAML Section

Open `06-gn_structure.yaml` and find your section.

```yaml
- id: section_N
  title: "Section Title"
  intro:
    narrative: "Story text..."
    dialogue:
      - speaker: lina
        text: "Line of dialogue..."
  interaction:
    type: branch | problem
    prompt: "What does the player read?"
    modifiers: [{ condition: "if debt > 0", effect: "Extra context..." }]
    snippet: ["code line 1", "code line 2"]  # problems only
    actions:
      - id: action_a
        text: "Choice label shown to player"
        description: "Help text"
        sets_flag: "flag_name: value"
        metric_delta: { technical: 1, dedication: 0, social: -1 }
        next_section: section_Y
  conclusion:
    by_action:
      action_a:
        narrative: "Outcome text for this choice..."
        next_section: section_Z
```

**Decision**: Is `interaction.type` branch or problem?
- **Branch** → 2–3 states (no intro, goes: task → conclusions)
- **Problem** → 5–7 states (goes: intro → task → conclusions)

### Step 2: Create Intro State (Problem Only)

If problem, create a state for the intro narrative and dialogue.

```typescript
section_N: {
  meta: {
    id: 'section_N',
    text: 'intro.narrative',
    dialogue: [
      { speaker: 'lina', text: 'dialogue line text' },
      { speaker: 'alex', text: 'another line' },
    ],
    task: { type: 'one_tap_forward' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_N_task' },
},
```

**Dialogue rules:**
- One entry per YAML dialogue item
- Speaker names lowercase: `lina`, `alex`, `tony`, `vex`, `clara`, `ray`, `captain`, `elena`
- Only omit `dialogue` array if section has no dialogue
- Do NOT include speaker name in the `text` field

### Step 3: Create Task State

All sections (branch and problem) have a task state. This is where the player makes a decision.

```typescript
section_N_task: {
  meta: {
    id: 'section_N_task',
    text: 'interaction.prompt + any matching modifiers + code snippet',
    dialogue: [  // For branch only: dialogue goes here (no intro state for branches)
      { speaker: 'lina', text: 'dialogue line' },
    ],
    task: {
      type: 'single_choice',
      variant: 'branch',  // or 'problem'
      options: interaction.actions.map(a => ({
        id: a.id,        // Use action.id for runtime binding
        content: a.text, // Player-facing label
      })),
    },
  } as ChallengeSceneData,
  on: { NEXT: [...] },  // Step 4
},
```

**Modifiers** (problems only): If YAML lists conditional modifiers, append the matching ones to the prompt text based on current context.

### Step 4: Wire Transitions with Guards

Each action routes to a conclusion and may set flags or score.

**For problems** (3 outcomes per task):

```typescript
on: {
  NEXT: [
    {
      guard: answer === 'correct_action_id',
      target: 'section_N_conclusion_solved',
      actions: [
        { type: 'set', params: { problem_N_result: 'solved' } },
        { type: 'score', params: { technical: 2, dedication: 1, social: 0 } },
      ],
    },
    {
      guard: answer === 'override_action_id',
      target: 'section_N_conclusion_override',
      actions: [
        { type: 'set', params: { problem_N_result: 'override' } },
        { type: 'score', params: { technical: 1, dedication: -1, social: -1 } },
      ],
    },
    {
      // Fallback (no guard) for incorrect answer
      target: 'section_N_conclusion_incorrect',
      actions: [
        { type: 'set', params: { problem_N_result: 'incorrect' } },
        { type: 'score', params: { technical: -1, dedication: 0, social: 0 } },
      ],
    },
  ],
}
```

**For branches** (2+ choices, one per action):

```typescript
on: {
  NEXT: [
    {
      guard: answer === 'cargo_choice_id',
      target: 'section_N_conclusion_cargo',
      actions: [
        { type: 'set', params: { route_choice: 'cargo' } },
        { type: 'score', params: { technical: 0, dedication: 1, social: 0 } },
      ],
    },
    {
      guard: answer === 'medical_choice_id',
      target: 'section_N_conclusion_medical',
      actions: [
        { type: 'set', params: { route_choice: 'medical' } },
        { type: 'score', params: { technical: 1, dedication: -1, social: 0 } },
      ],
    },
  ],
}
```

**Scoring convention:**
- `solved` (clean fix): technical +2, dedication +1, social 0
- `override` (shortcut): technical +1, dedication −1, social −1
- `incorrect` (wrong): technical −1, dedication 0, social 0
- Branch choices: match narrative tone (teamwork → social/dedication up; solo/reckless → tech/dedication trade-off)

### Step 5: Create Conclusion States

One state per outcome. Conclusion shows result narrative, then continues.

```typescript
section_N_conclusion_solved: {
  meta: {
    id: 'section_N_conclusion_solved',
    text: 'conclusion.by_action[correct_action_id].narrative',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: {
    NEXT: 'section_Y',  // Next section from conclusion.by_action[...].next_section
  },
},

section_N_conclusion_override: {
  meta: {
    id: 'section_N_conclusion_override',
    text: 'conclusion.by_action[override_action_id].narrative',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_Y' },
},

section_N_conclusion_incorrect: {
  meta: {
    id: 'section_N_conclusion_incorrect',
    text: 'conclusion.by_action[some_action_id].narrative',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_Y' },
},
```

---

## Reference: State Naming

Use pattern: `section_N[_variant]_[stage]`

- **N**: Section number (1–10)
- **variant** (optional): `_standard`, `_unsigned`, `_cargo`, `_medical`, `_clean`, `_debt`, `_fallout`
- **stage**: `_intro`, `_task`, `_conclusion_OUTCOME`

Outcomes:
- `_solved` — Correct answer
- `_incorrect` — Wrong answer
- `_override` — Dirty fix / shortcut
- `_[choice_id]` — Branch choice (e.g., `_cargo`, `_medical`)

Examples:
- `section_2_intro` — Standard intro
- `section_5_cargo_task` — Cargo route variant task
- `section_7_conclusion_solved` — Conclusion after solving correctly

---

## Reference: Context Flags

These are set by player choices or problem outcomes. Always use the exact flag name from the type definition.

**Common flags:**
- `boot_mode`: 'standard' | 'unsigned'
- `route_choice`: 'cargo' | 'medical'
- `eva_mode`: 'team' | 'solo'
- `swap_mode`: 'hot' | 'drain'
- `problem_X_result`: 'solved' | 'incorrect' | 'override'
- `drone_mode`: 'patch' | 'override'

Set via:
```typescript
{ type: 'set', params: { flag_name: 'value' } }
```

---

## Reference: Score Metrics

Three dimensions accumulate across all choices:

- **technical**: Code quality, technical decisions (problem correct = +2, wrong = −1)
- **dedication**: Effort, patience, persistence (team choice = +1, shortcut = −1)
- **social**: Team collaboration, communication (helped others = +1, solo/reckless = −1)

Track in:
```typescript
{ type: 'score', params: { technical: 2, dedication: 1, social: 0 } }
```

All decision branches must include a `score` action; totals display on the final screen.

---

## Verification Checklist

After converting a section:

- [ ] States created match interaction type (2–3 for branch, 5–7 for problem)
- [ ] All state IDs follow naming convention
- [ ] Intro state exists only for problems
- [ ] Task state has correct variant (`branch` or `problem`)
- [ ] Each action.id appears in exactly one guard (or is the fallback)
- [ ] All conclusions reference next_section from YAML
- [ ] Every NEXT transition includes both `set` (flags) and `score` actions
- [ ] Build succeeds: `npm run build`
- [ ] No circular transitions
- [ ] All referenced flags exist in context type definition
