# Fiction Quiz Engine — Project Description

## Overview

A web application that delivers interactive fiction stories with embedded challenges.
Players read a narrative split into scenes. Each scene contains a story text followed by
an interactive task. The player's answer determines which branch of the story they enter next,
leading to one of several possible endings.

The project consists of two parts:

- **Engine** — the React application that reads a story JSON and renders it
- **Story data** — a JSON file describing scenes, tasks, and branches

---

## Goals for POC

- Render a complete branching story end-to-end
- Support a subset of task types sufficient to demonstrate variety
- Run smoothly on a mobile phone (portrait, ~390px viewport)
- Deploy to Vercel

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS |
| Validation | Zod |
| Deployment | Vercel |
| State management | React useState / useReducer (no external library) |

---

## Data Format

Stories are stored as a single JSON file. The engine imports and validates the file at startup
using Zod schemas.

### Top-level structure

```ts
type Story = {
  id: string
  title: string
  description: string
  startSceneId: string
  endings: string[]       // list of scene ids that are endings
  scenes: Record<string, Scene>
}
```

### Scene types

```ts
type SceneType = "story" | "challenge" | "ending"

type BaseScene = {
  id: string
  type: SceneType
  text: string
}

type StoryScene = BaseScene & {
  type: "story"
  next: string            // id of the next scene
}

type ChallengeScene = BaseScene & {
  type: "challenge"
  task: Task
  branches: Branch[]
}

type EndingScene = BaseScene & {
  type: "ending"
  endingType: "good" | "neutral" | "bad"
}

type Scene = StoryScene | ChallengeScene | EndingScene
```

### Branch conditions

Each branch has a `condition` and a `nextSceneId`. Branches are evaluated top to bottom.
`"default"` always matches and must be the last branch.

```ts
type Branch = {
  condition: Condition | "correct" | "default"
  nextSceneId: string
}

// Used for resource_allocation and click_on_line
type Condition =
  | { type: "resource"; itemId: string; operator: "gte" | "lte" | "eq"; value: number }
  | { type: "line";     lineId: string }
```

### Task types

#### `multiple_choice`
```ts
{
  type: "multiple_choice"
  options: { id: string; content: string }[]
  correctOptionId: string
}
```

#### `drag_and_drop`
```ts
{
  type: "drag_and_drop"
  items: { id: string; content: string }[]
  correctOrder: string[]   // ordered list of item ids
}
```

#### `resource_allocation`
```ts
{
  type: "resource_allocation"
  totalResource: number
  unit: string
  items: { id: string; label: string; min: number; max: number }[]
}
```

#### `mapping`
```ts
{
  type: "mapping"
  left:  { id: string; content: string }[]
  right: { id: string; content: string }[]
  correctPairs: { leftId: string; rightId: string }[]
}
```

#### `card_filter`
```ts
{
  type: "card_filter"
  cards: { id: string; content: string; meta: Record<string, string> }[]
  buckets: { id: string; label: string }[]
  correctAssignment: { cardId: string; bucketId: string }[]
}
```

#### `click_on_line`
```ts
{
  type: "click_on_line"
  lines: { id: string; content: string }[]
}
```

#### `swipe_cards`
```ts
{
  type: "swipe_cards"
  cards: { id: string; content: string; meta: Record<string, string> }[]
  options: { id: string; label: string }[]
  correctAssignment: { cardId: string; optionId: string }[]
}
```

#### `block_builder`
```ts
{
  type: "block_builder"
  availableBlocks: { id: string; content: string }[]
  slots: number
  correctSequence: string[]   // ordered list of block ids
}
```

---

## Application Structure

```
src/
  types/
    story.ts          # TypeScript types for all story entities
    schema.ts         # Zod schemas mirroring the types above

  engine/
    StoryEngine.tsx   # Root component — owns current scene state
    SceneRouter.tsx   # Renders StoryScene | ChallengeScene | EndingScene

  scenes/
    StoryScene.tsx    # Displays narrative text + Continue button
    ChallengeScene.tsx# Displays text + task component + handles branching
    EndingScene.tsx   # Displays ending text + restart option

  tasks/
    MultipleChoice.tsx
    DragAndDrop.tsx
    ResourceAllocation.tsx
    Mapping.tsx
    CardFilter.tsx
    ClickOnLine.tsx
    SwipeCards.tsx
    BlockBuilder.tsx
    TaskRouter.tsx    # Selects the correct task component by task.type

  data/
    story.json        # The demo story
    loader.ts         # Imports and validates story.json via Zod

  App.tsx
  main.tsx
```

---

## Engine Behaviour

1. On load, `loader.ts` imports `story.json`, parses and validates it with Zod.
   If validation fails, a clear error screen is shown.
2. `StoryEngine` holds `currentSceneId` in state, initialised to `story.startSceneId`.
3. `SceneRouter` looks up the current scene and renders the matching scene component.
4. **StoryScene** shows text and a Continue button → advances to `scene.next`.
5. **ChallengeScene** shows text, renders the task via `TaskRouter`, waits for the player
   to submit an answer, evaluates branches top-to-bottom, advances to the matching `nextSceneId`.
6. **EndingScene** shows the ending text and a Restart button that resets to `startSceneId`.
7. No persistence — refreshing the page restarts the story.

### Branch evaluation logic

```ts
function evaluateBranches(branches: Branch[], answer: Answer): string {
  for (const branch of branches) {
    if (branch.condition === "default") return branch.nextSceneId
    if (branch.condition === "correct" && answer.isCorrect) return branch.nextSceneId
    if (branch.condition.type === "line" && answer.selectedLineId === branch.condition.lineId)
      return branch.nextSceneId
    if (branch.condition.type === "resource") {
      const val = answer.allocation[branch.condition.itemId]
      if (compare(val, branch.condition.operator, branch.condition.value))
        return branch.nextSceneId
    }
  }
  throw new Error("No branch matched — missing default branch")
}
```

---

## Mobile UX Requirements

- Minimum target: 390px viewport width (iPhone 14)
- No horizontal scroll
- Touch-friendly tap targets: minimum 44×44px
- Drag & Drop uses touch events (not mouse-only)
- Swipe cards support swipe gesture on mobile
- Font size minimum 16px for body text to prevent iOS zoom on input focus
- Fixed bottom action bar for confirm/submit buttons so they are always reachable

---

## POC Task Types to Implement

For the POC, implement these 4 task types (enough to demonstrate variety):

| Priority | Type | Reason |
|---|---|---|
| 1 | `multiple_choice` | Simplest, covers most scenes |
| 2 | `click_on_line` | Visually distinctive, technical feel |
| 3 | `drag_and_drop` | Shows ordering mechanic |
| 4 | `swipe_cards` | Shows stream/flow mechanic |

The remaining types (`resource_allocation`, `mapping`, `card_filter`, `block_builder`)
are defined in types/schema but not rendered — `TaskRouter` shows a placeholder for them.

---

## Demo Story: "The Night Migration"

A short branching story about a developer who must fix a failing data migration at 2am.
Designed to demonstrate all 4 POC task types and produce 3 different endings.

### Scene map

```
scene_001 (story)
    ↓
scene_002 (challenge: click_on_line)  ← find the bug in the log
    ├── correct line → scene_010
    └── default      → scene_011 (story: wrong assumption)
                            ↓
                         scene_012 (challenge: multiple_choice)

scene_010 (story: found the bug)
    ↓
scene_020 (challenge: drag_and_drop)  ← order the deploy steps
    ├── correct → scene_030
    └── default → scene_031 (story: deploy failed)
                        ↓
                     scene_032 (challenge: multiple_choice) ← hotfix decision

scene_030 (story: deploy succeeded)
    ↓
scene_040 (challenge: swipe_cards)   ← triage incoming requests
    ├── correct → scene_099 (ending: good)
    └── default → scene_100 (ending: neutral)

scene_012 branches:
    ├── option A → scene_099 (ending: good)   ← lucky guess
    └── option B → scene_101 (ending: bad)

scene_032 branches:
    ├── option A → scene_100 (ending: neutral)
    └── option B → scene_101 (ending: bad)
```

### Endings

| Id | Type | Text |
|---|---|---|
| scene_099 | good | The archive was saved. Every file intact. The city kept its memory. |
| scene_100 | neutral | Half the archive survived. It could have been worse. Probably. |
| scene_101 | bad | System failure. All data lost. Three years of work, gone by morning. |

---

## Out of Scope for POC

- Story editor UI
- User accounts / progress persistence
- Analytics / tracking
- Localisation
- Accessibility audit (basic a11y only)
- `resource_allocation`, `mapping`, `card_filter`, `block_builder` task rendering

---

## Definition of Done for POC

- [ ] Story JSON validates against Zod schema without errors
- [ ] Player can start the story and reach all 3 endings
- [ ] All 4 task types render and are interactive on a real mobile device
- [ ] Correct branch is taken based on player answer
- [ ] Restart works from any ending
- [ ] Deployed and accessible on Vercel