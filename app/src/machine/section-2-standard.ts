import type { ChallengeSceneData } from '../types/story'
import { jsStartBarrierMissingTaskState } from './tasks/01-js_start_barrier_missing'
import { pyReadinessGatherMissingTaskState } from './tasks/02-py_readiness_gather_missing'
import { javaFutureJoinMissingTaskState } from './tasks/03-java_future_join_missing'
import { jsRegistryRaceTaskState } from './tasks/04-js_registry_race'
import { javaReadinessFlagPrematureTaskState } from './tasks/13-java_readiness_flag_premature'

export const section2StandardStates = {
  // ── Section 2 Standard: Intro ────────────────────────────
  section_2_standard_intro: {
    meta: {
      id: 'section_2_standard_intro',
      text:
        'The enterprise console takes a little longer, but it arrives with calmer telemetry and fewer visual fireworks. The comfort lasts only until the dependency panel starts blinking. Sector A still cannot close the control handshake, and the same lock remains in place.\n\n' +
        'LINA: Slower boot, cleaner dashboard. Why is Sector A still dead?\n' +
        'ALEX: One startup module from the station update is racing ahead of its dependencies.\n' +
        'LINA: So even the safe build inherited the same bad idea?\n' +
        'ALEX: Yes. We still need `sector-link` to wait for the service chain before handshaking.\n' +
        'LINA: Then fix it once, and let\'s not debug this corridor again tonight.',
      task: {
        type: 'one_tap_forward',
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.rand < 0.2,
          target: 'section_2_standard_task_1',
        },
        {
          guard: ({ event }: any) => event.rand < 0.4,
          target: 'section_2_standard_task_2',
        },
        {
          guard: ({ event }: any) => event.rand < 0.6,
          target: 'section_2_standard_task_3',
        },
        {
          guard: ({ event }: any) => event.rand < 0.8,
          target: 'section_2_standard_task_4',
        },
        {
          target: 'section_2_standard_task_5',
        },
      ],
    },
  },

  ...jsStartBarrierMissingTaskState({
    stateId: 'section_2_standard_task_1',
    solvedTarget: 'section_2_standard_conclusion_solved',
    overrideTarget: 'section_2_standard_conclusion_override',
    incorrectTarget: 'section_2_standard_conclusion_incorrect',
  }),

  ...pyReadinessGatherMissingTaskState({
    stateId: 'section_2_standard_task_2',
    solvedTarget: 'section_2_standard_conclusion_solved',
    overrideTarget: 'section_2_standard_conclusion_override',
    incorrectTarget: 'section_2_standard_conclusion_incorrect',
  }),

  ...javaFutureJoinMissingTaskState({
    stateId: 'section_2_standard_task_3',
    solvedTarget: 'section_2_standard_conclusion_solved',
    overrideTarget: 'section_2_standard_conclusion_override',
    incorrectTarget: 'section_2_standard_conclusion_incorrect',
  }),

  ...jsRegistryRaceTaskState({
    stateId: 'section_2_standard_task_4',
    solvedTarget: 'section_2_standard_conclusion_solved',
    overrideTarget: 'section_2_standard_conclusion_override',
    incorrectTarget: 'section_2_standard_conclusion_incorrect',
  }),

  ...javaReadinessFlagPrematureTaskState({
    stateId: 'section_2_standard_task_5',
    solvedTarget: 'section_2_standard_conclusion_solved',
    overrideTarget: 'section_2_standard_conclusion_override',
    incorrectTarget: 'section_2_standard_conclusion_incorrect',
  }),

  // ── Section 2 Standard: Task 2 ───────────────────────────
  section_2_standard_task_2: {
    meta: {
      id: 'section_2_standard_task_2',
      text:
        'Problem 2 Standard: Missing Gather Barrier\n\n' +
        'The same startup race shows up in a different language, but the fix is still about waiting for readiness instead of guessing.\n\n' +
        '```python\n' +
        'async def boot_sector_link(services):\n' +
        '    tasks = [asyncio.create_task(service.start()) for service in services]\n' +
        '    link = await sector_link.handshake()\n' +
        '    if not link.ok:\n' +
        '        raise RuntimeError("sector-link offline")\n' +
        '    return "ready"\n' +
        '```\n\n' +
        'How should Alex fix this?',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'blame_controller', content: 'Blame the controller rack and restart it from the wall panel' },
          { id: 'sleep_then_retry', content: 'Add a fixed delay before the handshake' },
          { id: 'await_service_barrier', content: 'Await the startup tasks before the handshake begins' },
          { id: 'force_sector_link', content: 'Force sector-link up even if the startup tasks are still racing' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'await_service_barrier',
          target: 'section_2_standard_conclusion_solved',
          actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_sector_link',
          target: 'section_2_standard_conclusion_override',
          actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
        },
        {
          target: 'section_2_standard_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
        },
      ],
    },
  },

  // ── Section 2 Standard: Task 3 ───────────────────────────
  section_2_standard_task_3: {
    meta: {
      id: 'section_2_standard_task_3',
      text:
        'Problem 2 Standard: Missing Future Join\n\n' +
        'The experimental build moved startup work into futures, but the terminal still tries to talk to sector-link before those futures finish.\n\n' +
        '```java\n' +
        'String bootSectorLink(List<Service> services) throws Exception {\n' +
        '    services.forEach(service -> CompletableFuture.runAsync(service::start));\n' +
        '    Link link = sectorLink.handshake().get();\n' +
        '    if (!link.ok()) throw new IllegalStateException("sector-link offline");\n' +
        '    return "ready";\n' +
        '}\n' +
        '```\n\n' +
        'How should Alex fix this?',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'blame_controller', content: 'Reboot the controller rack and treat the symptom as a room failure' },
          { id: 'sleep_then_retry', content: 'Add a retry delay before the handshake call' },
          { id: 'await_service_barrier', content: 'Join the startup futures before sector-link handshakes' },
          { id: 'force_sector_link', content: 'Bypass readiness checks and bring sector-link up immediately' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'await_service_barrier',
          target: 'section_2_standard_conclusion_solved',
          actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_sector_link',
          target: 'section_2_standard_conclusion_override',
          actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
        },
        {
          target: 'section_2_standard_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
        },
      ],
    },
  },

  // ── Section 2 Standard: Task 4 ───────────────────────────
  section_2_standard_task_4: {
    meta: {
      id: 'section_2_standard_task_4',
      text:
        'Problem 2 Standard: Registry Readiness Race\n\n' +
        'The unsigned build marks services as running before registration finishes, so sector-link sees a healthy dashboard and still fails its first handshake.\n\n' +
        '```javascript\n' +
        'async function startService(service, registry) {\n' +
        '  registry[service.name] = "running";\n' +
        '  await service.register(registry);\n' +
        '}\n' +
        'async function bootSectorLink(services, registry) {\n' +
        '  services.forEach((service) => startService(service, registry));\n' +
        '  return sectorLink.handshake(registry);\n' +
        '}\n' +
        '```\n\n' +
        'How should Alex fix this?',
      task: {
        type: 'single_choice', variant: 'problem',
        options: [
          { id: 'blame_controller', content: 'Treat the warning panel as a controller problem and restart the room' },
          { id: 'sleep_then_retry', content: 'Add a delay and retry once the panel looks calmer' },
          { id: 'await_service_barrier', content: 'Wait for registration to finish before sector-link reads readiness' },
          { id: 'force_sector_link', content: 'Ignore the registry state and force sector-link through' },
        ]
      },
    } as ChallengeSceneData,
    on: {
      NEXT: [
        {
          guard: ({ event }: any) => event.answer === 'await_service_barrier',
          target: 'section_2_standard_conclusion_solved',
          actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
        },
        {
          guard: ({ event }: any) => event.answer === 'force_sector_link',
          target: 'section_2_standard_conclusion_override',
          actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
        },
        {
          target: 'section_2_standard_conclusion_incorrect',
          actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
        },
      ],
    },
  },

  section_2_standard_conclusion_incorrect: {
    meta: {
      id: 'section_2_standard_conclusion_incorrect',
      text: 'The controller room reboots, loses another minute, and comes back exactly as stubborn as before. Alex pokes the service order until the link finally answers.\n\nWater starts moving again, but the main valve farther down the ship is still blocked.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_standard_conclusion_solved: {
    meta: {
      id: 'section_2_standard_conclusion_solved',
      text: 'The startup order settles down, `sector-link` comes up cleanly, and the controller answers at last. The enterprise build stays stable, but only after Alex forces it to finish one conversation before starting the next.\n\nSector A finally responds, but the command path still points toward the next blocked compartment. Alex grabs the PDA and moves on before the station software finds a new way to surprise him.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },

  section_2_standard_conclusion_override: {
    meta: {
      id: 'section_2_standard_conclusion_override',
      text: 'Alex shoves sector-link past its checks and the controller answers with visible bad temper. The dashboard turns green faster than it turns trustworthy.\n\nWater moves again, but the ship now owes Alex one hidden failure and the main valve is still ahead.',
      task: { type: 'text_scene' },
    } as ChallengeSceneData,
    on: { NEXT: 'section_3' },
  },
}
