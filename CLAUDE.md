# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `app/` subdirectory:

```bash
cd app
npm run dev       # start Vite dev server
npm run build     # type-check (tsc -b) then bundle
npm run lint      # ESLint
npm run preview   # serve the dist/ build locally
```

No test suite is configured yet.

## Architecture

The React app lives entirely under `app/src/`. At the time of writing, `App.tsx` is still the Vite default template — the planned module structure below reflects the README spec and is what should be built:

```
src/
  types/
    story.ts        # TypeScript types for all story entities
    schema.ts       # Zod schemas mirroring those types

  engine/
    StoryEngine.tsx # owns currentSceneId state, entry point
    SceneRouter.tsx # dispatches to the correct scene component

  scenes/
    StoryScene.tsx      # narrative text + Continue button → scene.next
    ChallengeScene.tsx  # text + task + branch evaluation on submit
    EndingScene.tsx     # ending text + Restart resets to startSceneId

  tasks/
    TaskRouter.tsx      # selects task component by task.type
    MultipleChoice.tsx
    ClickOnLine.tsx
    DragAndDrop.tsx
    SwipeCards.tsx
    # remaining types (resource_allocation, mapping, card_filter, block_builder)
    # are defined in schema but render a placeholder

  data/
    story.json      # the demo story ("The Night Migration")
    loader.ts       # imports and Zod-validates story.json at startup
```

**State management:** `useState`/`useReducer` only — no external state library.

**Data flow:** `loader.ts` validates `story.json` via Zod on load (shows error screen on failure) → `StoryEngine` holds `currentSceneId` → `SceneRouter` renders the matching scene component → on answer submit, `ChallengeScene` runs branch evaluation and advances state.

**Branch evaluation:** iterate `branches` top-to-bottom; `"default"` always matches and must be the last branch. Conditions: `"correct"` (answer.isCorrect), `{ type: "line", lineId }` (answer.selectedLineId), `{ type: "resource", itemId, operator, value }` (answer.allocation[itemId]).

## Mobile-first constraints

Target: 390px viewport (iPhone 14), portrait only.

- No horizontal scroll
- Touch targets minimum 44×44px
- Drag & Drop must use touch events, not mouse-only APIs
- Swipe cards must support swipe gestures
- Body text minimum 16px (prevents iOS auto-zoom on input focus)
- Submit/confirm buttons in a fixed bottom action bar

## Tech stack notes

- **Tailwind CSS** and **Zod** are in the README spec but not yet in `package.json` — add them before building the engine.
- Deployment target is Vercel.
