---
name: yaml-to-machine
description: 'Convert YAML story sections to XState machine states (intro → task → conclusion pages). Use when adding new story sections, converting YAML to machine.ts, creating branching paths, or implementing problem tasks with multiple outcomes.'
argument-hint: 'Which YAML section should I convert?'
user-invocable: true
---

# YAML to XState Machine Conversion

## When to Use
- Adding a new section from YAML to machine.ts
- Converting `interaction.type: branch` (route choices, exits)
- Converting `interaction.type: problem` (code + multiple choice)
- Implementing conclusion pages for action outcomes
- Wiring context flags and conditional transitions
- Need to verify narrative flows through multiple pages

## Quick Outcome
Each YAML section becomes **3+ separate states** that display as individual pages:
1. **Intro page** → narrative + dialogue (one_tap_forward)
2. **Task page** → code + buttons OR branch options (single_choice)
3. **Conclusion page(s)** → outcome narratives (text_scene, one per action result)

---

## Step-by-Step Procedure

### Step 1: Identify Section Type
Open `06-gn_structure.yaml` and check `interaction.type`:
- **`type: branch`** → Route/choice decision (3 states, no intro)
- **`type: problem`** → Code + multiple choice (5+ states with intro)

### Step 2: Create Intro State (Problem Only)
Only for problems. Branch sections skip intro.

```typescript
section_N: {
  meta: {
    id: 'section_N',
    text: 'intro.narrative',
    dialogue: [
      { speaker: 'lina', text: 'dialogue line text' },
      { speaker: 'alex', text: 'dialogue line text' },
      // one entry per intro.dialogue item — speaker name in lowercase
    ],
    task: { type: 'one_tap_forward' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_N_task' },
},
```

**Rules for dialogue:**
- `text` contains only `intro.narrative` — no speaker lines
- `dialogue` is a `{ speaker: string; text: string }[]` array
- Speaker names are **lowercase** (matching YAML exactly: `lina`, `alex`, `tony`, `vex`, `clara`, `ray`, `captain`, `elena`)
- Omit `dialogue` entirely if the section has no dialogue lines

**Decision Point**: Is this a branch or problem?
- **Branch** → Skip intro, jump to Step 3
- **Problem** → Create intro, continue to Step 3

### Step 3: Create Task State
All sections (branch and problem) need a task state.

```typescript
section_N_task: {
  meta: {
    id: 'section_N_task',
    text: 'interaction.prompt + matching modifiers + code snippet',
    // Add dialogue field if this branch/task state has intro.dialogue lines
    // (branch sections have no separate intro state, so dialogue goes here)
    dialogue: [
      { speaker: 'lina', text: 'dialogue line text' },
    ],
    // branch sections:
    task: {
      type: 'single_choice',
      variant: 'branch',
      options: interaction.actions.map(a => ({ id: a.id, content: a.text }))
    },
    // problem sections:
    task: {
      type: 'single_choice',
      variant: 'problem',
      options: interaction.actions.map(a => ({ id: a.id, content: a.text }))
    },
  } as ChallengeSceneData,
  on: { NEXT: [...] },  // Step 4
}
```

**Quality Check**: 
- ✓ Snippet is real, readable code (not pseudo-code)
- ✓ Button labels match action.text exactly
- ✓ Modifiers matching context appended to prompt

### Step 4: Wire Transitions with Guards
Map each action to its conclusion or next section.

**For problems** (3 outcomes: solved, incorrect, override):
```typescript
on: {
  NEXT: [
    { guard: answer === 'correct_action', target: 'section_N_conclusion_solved', 
      actions: [{ type: 'set', params: { problem_X_result: 'solved' } }] },
    { guard: answer === 'override_action', target: 'section_N_conclusion_override',
      actions: [{ type: 'set', params: { problem_X_result: 'override' } }] },
    { target: 'section_N_conclusion_incorrect',
      actions: [{ type: 'set', params: { problem_X_result: 'incorrect' } }] },
  ]
}
```

**For branches** (2+ choices, each to conclusion then next section):
```typescript
on: {
  NEXT: [
    { guard: answer === 'choice_1', target: 'section_1_conclusion_choice1',
      actions: [{ type: 'set', params: { context_flag: 'value1' } }] },
    { guard: answer === 'choice_2', target: 'section_1_conclusion_choice2',
      actions: [{ type: 'set', params: { context_flag: 'value2' } }] },
  ]
}
```

### Step 5: Create Conclusion States
One per action (for problems) or choice (for branches).

```typescript
section_N_conclusion_solved: {
  meta: {
    id: 'section_N_conclusion_solved',
    text: 'conclusion.by_action[action_id].narrative',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'conclusion.by_action[action_id].next_section' },
},
```

**Quality Check**:
- ✓ Each outcome has matching narrative
- ✓ Narrative explains consequence of that choice
- ✓ Next section from YAML (not hardcoded)

### Step 6: Verify Build
```bash
npm run build
```

**Quality Check**:
- ✓ No TypeScript errors
- ✓ All state IDs valid
- ✓ No circular transitions
- ✓ All context flags match type definitions

---

## Reference: YAML Section Structure

All sections in `06-gn_structure.yaml` follow this shape:

```yaml
- id: section_N
  title: string
  intro:
    narrative: string
    dialogue: [{ speaker, text }]
  interaction:
    type: branch | problem
    prompt: string
    modifiers: [{ condition, effect }]     # Optional, problems only
    snippet: [code_lines]                   # Optional, problems only
    actions: [{ id, text, outcome, sets_flag, next }]
  conclusion:
    by_action:
      action_id:
        narrative: string
        next_section: section_id
```

**Field Display Rules:**
- **ALWAYS shown**: intro.narrative, intro.dialogue, prompt, snippet, action.text, conclusion.narrative
- **CONDITIONAL**: modifiers.effect (shown if condition matches current context)
- **NEVER shown**: description, location_id, YAML structure keys

---

## Reference: Branch vs Problem Patterns

| Aspect | Branch (Route/Exit) | Problem (Task) |
|--------|-------------------|---|
| States created | 2-3 | 5-7 |
| Has intro? | No | Yes |
| Page sequence | Task → Conclusions | Intro → Task → Conclusions |
| Button count | 2-4 choices | 4 actions |
| Outcomes | 2+ (choice_1, choice_2, ...) | 3 (solved, incorrect, override) |
| Modifiers | Not used | Used to contextualize prompt |
| Example | Section 1 boot choice | Section 2 code problem |

---

## Reference: Context Flags

When `interaction.actions[].sets_flag` appears in YAML:

```yaml
sets_flag: "flag_name: value"  # YAML format
```

Convert to:

```typescript
actions: [{ type: 'set', params: { flag_name: 'value' } }]
```

**Known flags** (from context type definition):
- `boot_mode`: 'standard' | 'unsigned'
- `route_choice`: 'cargo' | 'medical'
- `eva_mode`: 'team' | 'solo'
- `swap_mode`: 'hot' | 'drain'
- `problem_X_result`: 'solved' | 'incorrect' | 'override'
- `drone_mode`: 'patch' | 'override'

---

## Reference: Naming Conventions

**State IDs** follow pattern: `section_N[_variant]_[stage]`
- **N**: Section number (1-10)
- **variant**: `_standard`, `_unsigned`, `_cargo`, `_medical`, `_clean`, `_debt`, `_fallout`
- **stage**: `_intro`, `_task`, `_conclusion_[outcome]`

**Examples**:
- `section_2_standard_intro` — Sector A intro, standard boot
- `section_2_standard_task` — Sector A problem, standard boot
- `section_2_standard_conclusion_solved` — Correct answer outcome
- `section_3_conclusion_cargo` — Route choice conclusion
- `section_8_debt_task` — Network problem variant

**Outcomes** (for conclusion suffixes):
- `_solved` — Problem solved correctly
- `_incorrect` — Wrong answer (fallback)
- `_override` — Shortcut/dirty fix taken
- `_[choice_id]` — Branch choice (e.g., `_cargo`, `_medical`, `_team`)

---

## Workflow Checklist

- [ ] **YAML Review**: Open section in 06-gn_structure.yaml
- [ ] **Type Check**: Identify `interaction.type` (branch or problem)
- [ ] **Intro State**: Create if problem, skip if branch
- [ ] **Task State**: Create with prompt + options
- [ ] **Transitions**: Add guards + actions for each choice
- [ ] **Conclusions**: Create outcome narrative states
- [ ] **Build**: Run `npm run build` and verify no errors
- [ ] **Context**: Ensure all flags match type definition
- [ ] **Narrative Flow**: Verify all next_section values link correctly
