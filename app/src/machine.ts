import { createMachine } from 'xstate'
import type { ChallengeSceneData } from './types/story'

/**
 * Code of Growth — Hydroworld — XState routing machine
 *
 * Scenario structure:
 * - Section 1: Shared intro (boot choice)
 * - Sections 2-3: Shared path (dependencies, crossing ship)
 * - Sections 4-6: Split by route (cargo vs medical)
 * - Section 7: Shared EVA decision
 * - Sections 8-10: Split by debt level
 * - Endings: Five possible endings based on exit point and state
 *
 * Each problem section is split into:
 * - *_intro: Narrative and dialogue
 * - *_task: Code snippet and choices
 *
 * State flags track:
 *  boot_mode (standard | unsigned)
 *  route_choice (cargo | medical)
 *  problem_*_result (solved | incorrect | override)
 *  debt_count (derived from overrides)
 *  accepted_exit_* (early exit decisions)
 */
export const hydroMachine = createMachine<
  {
    boot_mode?: 'standard' | 'unsigned'
    route_choice?: 'cargo' | 'medical'
    eva_mode?: 'team' | 'solo'
    swap_mode?: 'hot' | 'drain'
    problem_2_result?: 'solved' | 'incorrect' | 'override'
    problem_4_result?: 'solved' | 'incorrect' | 'override'
    problem_6_result?: 'solved' | 'incorrect' | 'override'
    problem_8_result?: 'solved' | 'incorrect' | 'override'
    problem_10_result?: 'solved' | 'incorrect' | 'override'
    accepted_exit_7?: boolean
    accepted_exit_8?: boolean
    accepted_exit_9?: boolean
    accepted_exit_10?: boolean
    debt_count?: number
    ending_tier?: string
  },
  { type: 'NEXT'; answer?: string },
  any,
  any,
  any,
  string,
  string,
  any,
  unknown,
  any,
  ChallengeSceneData
>({
  id: 'hydroworld',
  initial: 'section_1',
  context: {
    boot_mode: undefined,
    route_choice: undefined,
    eva_mode: undefined,
    swap_mode: undefined,
    problem_2_result: undefined,
    problem_4_result: undefined,
    problem_6_result: undefined,
    problem_8_result: undefined,
    problem_10_result: undefined,
    accepted_exit_7: false,
    accepted_exit_8: false,
    accepted_exit_9: false,
    accepted_exit_10: false,
    debt_count: 0,
    ending_tier: undefined,
  },
  types: {} as {
    events: { type: 'NEXT'; answer?: string }
  },
  states: {
    // ── Section 1: Boot Choice in the Grow Bay ──────────────
    section_1: {
      meta: {
        id: 'section_1',
        text:
          'Alex drops into a folding chair in Incubator #4. A potato vine glows inside a glass grow tube while red alarm lights pulse across the aisle. Sector A is locked after the control link fails, and the watering system is frozen. The PDA opens a local maintenance terminal. To Alex surprise, instead of the standard welcome screen he\'s presented with boot menu he has not seen before. A call from Lina distracts his uncertainty.\n\n' +
          'LINA: How are things looking?\n' +
          'ALEX: That\'s a strange new boot menu I\'m getting...\n' +
          'LINA: Huh? Must be yet another half baked software update. What does it say?\n' +
          'ALEX: Boot V9 or boot V10.0037.custom.experimental.unsigned\n' +
          'LINA: You\'re on your own with this one. Who knows what promisses unsigned gives...',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'standard', content: 'V9 Enterprise' },
            { id: 'unsigned', content: 'V10.0037.custom.experimental.unsigned' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'standard', target: 'section_1_conclusion_standard', actions: [{ type: 'set', params: { boot_mode: 'standard' } }] },
          { guard: ({ event }: any) => event.answer === 'unsigned', target: 'section_1_conclusion_unsigned', actions: [{ type: 'set', params: { boot_mode: 'unsigned' } }] },
        ],
      },
    },

    section_1_conclusion_standard: {
      meta: {
        id: 'section_1_conclusion_standard',
        text: 'The PDA loads the enterprise console and opens a verified device map across the screen. Sector A shows locked while the recovery tools finish loading. Alex moved with the same enterprise confidence as the build itself, because after all, if the console boot was still progressing, there was no reason to outrun the loading.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_2_standard_intro' },
    },

    section_1_conclusion_unsigned: {
      meta: {
        id: 'section_1_conclusion_unsigned',
        text: 'The PDA loads an unsigned experimental build. Alex is welcomed with a nice new background and soft music. During the load sequence Alex spots useless lines like "validation checks disabled" and "security checks disabled", but he doens\'t pay much attention to those - who reads logs before incidents anyway. With the custom tools and soft music, Alex heads to Sector A Control to start the reconnect.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_2_unsigned_intro' },
    },

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
        NEXT: 'section_2_standard_task',
      },
    },

    // ── Section 2 Standard: Task ─────────────────────────────
    section_2_standard_task: {
      meta: {
        id: 'section_2_standard_task',
        text:
          'Problem 2 Standard: Sector Link Race Condition\n\n' +
          'Even the standard build carries one rushed startup module from the latest station-wide update. The race is less flashy, but no less real.\n\n' +
          '```javascript\n' +
          'async function bootSectorLink(services) {\n' +
          '  services.map((service) => service.start());\n' +
          '  const link = await sectorLink.handshake();\n' +
          '  if (!link.ok) throw new Error("sector-link offline");\n' +
          '  return "ready";\n' +
          '}\n' +
          '```\n\n' +
          'How should Alex fix this?',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'blame_controller', content: 'Blame the controller rack and restart it from the wall panel' },
            { id: 'sleep_then_retry', content: 'Add a fixed delay before the handshake' },
            { id: 'await_service_barrier', content: 'Wait for all service startups before sector-link handshakes' },
            { id: 'force_sector_link', content: 'Override startup checks and force sector-link online' },
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

    // ── Section 2 Unsigned: Intro ────────────────────────────
    section_2_unsigned_intro: {
      meta: {
        id: 'section_2_unsigned_intro',
        text:
          'Alex barely taps the confirm key before the experimental build jumps to the desktop. The quick boot looks great for about three seconds. Then the status panel fills with yellow warnings instead of green INFOs. Most of the console is awake, but currently it looks like a traffic light with big red, medium amber and a small touch of green.\n\n' +
          'LINA: That was fast. So why is Sector A still dead?\n' +
          'ALEX: Because this build boots the interface before the background services finish sorting themselves out.\n' +
          'LINA: Which one do we actually need?\n' +
          'ALEX: `sector-link`. Without it, this nice new desktop is as good as a screensaver.\n' +
          'LINA: Then fix the race, and keep the wallpaper if you must.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_2_unsigned_task',
      },
    },

    // ── Section 2 Unsigned: Task ─────────────────────────────
    section_2_unsigned_task: {
      meta: {
        id: 'section_2_unsigned_task',
        text:
          'Problem 2 Unsigned: Sector Link Race Condition\n\n' +
          'The unsigned build skips its normal startup barrier, so the race is visible immediately. Services start in chaotic parallel, and the interface boots before the foundation is ready.\n\n' +
          '```javascript\n' +
          'async function bootSectorLink(services) {\n' +
          '  services.map((service) => service.start());\n' +
          '  const link = await sectorLink.handshake();\n' +
          '  if (!link.ok) throw new Error("sector-link offline");\n' +
          '  return "ready";\n' +
          '}\n' +
          '```\n\n' +
          'How should Alex fix this?',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'blame_controller', content: 'Blame the controller rack and restart it from the wall panel' },
            { id: 'sleep_then_retry', content: 'Add a fixed delay before the handshake' },
            { id: 'await_service_barrier', content: 'Wait for all service startups before sector-link handshakes' },
            { id: 'force_sector_link', content: 'Override startup checks and force sector-link online' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'await_service_barrier',
            target: 'section_2_unsigned_conclusion_solved',
            actions: [{ type: 'set', params: { problem_2_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'force_sector_link',
            target: 'section_2_unsigned_conclusion_override',
            actions: [{ type: 'set', params: { problem_2_result: 'override' } }],
          },
          {
            target: 'section_2_unsigned_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_2_unsigned_conclusion_incorrect: {
      meta: {
        id: 'section_2_unsigned_conclusion_incorrect',
        text: 'The controller room reboots, loses another minute, and comes back exactly as stubborn as before. Alex pokes the service order until the link finally answers.\n\nWater starts moving again, but the main valve farther down the ship is still blocked.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_3' },
    },

    section_2_unsigned_conclusion_solved: {
      meta: {
        id: 'section_2_unsigned_conclusion_solved',
        text: 'The startup order settles down, `sector-link` comes up cleanly, and the controller answers at last. The fast build keeps its speed, but only after Alex forces it to finish one conversation before starting the next.\n\nSector A finally responds, but the command path still points toward the next blocked compartment. Alex grabs the PDA and moves on before the experimental build finds a new way to surprise him.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_3' },
    },

    section_2_unsigned_conclusion_override: {
      meta: {
        id: 'section_2_unsigned_conclusion_override',
        text: 'Alex shoves sector-link past its checks and the controller answers with visible bad temper. The dashboard turns green faster than it turns trustworthy.\n\nWater moves again, but the ship now owes Alex one hidden failure and the main valve is still ahead.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_3' },
    },

    // ── Section 3: Crossing the Ship ────────────────────────
    section_3: {
      meta: {
        id: 'section_3',
        text:
          'The terminal is finally holding a live connection to Sector A when a new alert climbs over the recovery logs. Water is not stuck here anymore. The line is blocked farther down the ship at Maintenance Access Gate before Airlock #4, where the supply path narrows into the outer service corridor. Alex looks up from the screen and finds himself standing between two doors: the heavier cargo hatch on the left and the cleaner medical passage on the right.\n\n' +
          'LINA: The software side is breathing again. Now go move the part that refuses to move.\n' +
          'ALEX: It\'s like you imply that I have to do something physically?!\n' +
          'LINA: Only eventually. For now you need to get there first.\n' +
          'ALEX: Cargo is slower and cleaner. Medical is shorter and stranger.\n' +
          'LINA: Everything on this ship is shorter and stranger.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'cargo', content: 'Through Cargo management compartment' },
            { id: 'medical', content: 'Through Medical passage' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'cargo', target: 'section_3_conclusion_cargo', actions: [{ type: 'set', params: { route_choice: 'cargo' } }] },
          { guard: ({ event }: any) => event.answer === 'medical', target: 'section_3_conclusion_medical', actions: [{ type: 'set', params: { route_choice: 'medical' } }] },
        ],
      },
    },

    section_3_conclusion_cargo: {
      meta: {
        id: 'section_3_conclusion_cargo',
        text: 'Alex cuts through freight corridors where everything smells like dust, metal, and accounting.\n\nTony is already waiting by the freight checkpoint with a pass that should have worked the first time.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_4_cargo_intro' },
    },

    section_3_conclusion_medical: {
      meta: {
        id: 'section_3_conclusion_medical',
        text: 'Alex cuts through steam, vending noise, and medical scanners that look too awake for this hour.\n\nClara gets Alex to the quarantine side gate, where the paperwork is failing in a more creative way.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_4_medical_intro' },
    },

    // ── Section 4 Cargo: Intro ───────────────────────────────
    section_4_cargo_intro: {
      meta: {
        id: 'section_4_cargo_intro',
        text:
          'Tony meets Alex at the freight checkpoint with a handheld scanner and the expression of a man who expected a simpler night. The cargo-side maintenance gate can see the emergency tag, the route authorization, and Tony\'s temporary pass. It still refuses to open.\n\n' +
          'TONY: I filed the freight pass ten minutes ago. The gate is being dramatic.\n' +
          'ALEX: No, the gate is being written in Java.\n' +
          'TONY: Is that better or worse than dramatic?\n' +
          'ALEX: Usually slower.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_4_cargo_task',
      },
    },

    // ── Section 4 Cargo: Task ────────────────────────────────
    section_4_cargo_task: {
      meta: {
        id: 'section_4_cargo_task',
        text:
          'Problem 2 Cargo: Freight Pass Comparison\n\n' +
          'The cargo-side gate rejects valid temporary credentials because it compares by reference instead of content. Tony\'s scanner shows the authorization, but the security check compares the wrong way.\n\n' +
          '```java\n' +
          'boolean gateAllows(Credential credential) {\n' +
          '    String level = credential.getAccessLevel();\n' +
          '    if (level == "MAINT_RED") {\n' +
          '        return true;\n' +
          '    }\n' +
          '    return credential.hasSupervisorEscort();\n' +
          '}\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'restart_gate', content: 'Reboot the freight gate and hope the cache clears' },
            { id: 'hardcode_allow', content: 'Hardcode the gate to trust every cargo maintenance badge' },
            { id: 'compare_access_value', content: 'Compare the access level by value instead of by reference' },
            { id: 'jumper_the_lock', content: 'Override the lock through the freight panel bridge' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'compare_access_value',
            target: 'section_4_cargo_conclusion_solved',
            actions: [{ type: 'set', params: { problem_4_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'jumper_the_lock',
            target: 'section_4_cargo_conclusion_override',
            actions: [{ type: 'set', params: { problem_4_result: 'override' } }],
          },
          {
            target: 'section_4_cargo_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_4_cargo_conclusion_incorrect: {
      meta: {
        id: 'section_4_cargo_conclusion_incorrect',
        text: 'The reboot wastes time and proves that the gate remembers its bad decisions perfectly. Alex fixes the comparison under Tony\'s increasingly educational silence.\n\nThe freight corridor opens, but everyone in it now knows Alex needed a second argument with a door.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_cargo_fallout' },
    },

    section_4_cargo_conclusion_solved: {
      meta: {
        id: 'section_4_cargo_conclusion_solved',
        text: 'The scanner stops lying as soon as the code starts comparing what it actually read. Tony gives the gate a look usually reserved for delayed shipments.\n\nThe freight lane stays orderly all the way to Airlock #4.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_cargo' },
    },

    section_4_cargo_conclusion_override: {
      meta: {
        id: 'section_4_cargo_conclusion_override',
        text: 'Alex bridges the freight lock, the door jerks open, and three compliance policies quietly die inside the wall.\n\nThe path is open, but the override smell follows Alex toward the airlock like a second tether.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_cargo_fallout' },
    },

    // ── Section 5 Cargo: Clean Arrival At Airlock #4 ────────
    section_5_cargo: {
      meta: {
        id: 'section_5_cargo',
        text:
          'The cargo lane reaches Airlock #4 without incident. Tony waves you through with his scanner now properly accepting the shared credential model. The container prep sequence is running clean.\n\n' +
          'VEX: Freight delivered you in one piece. I respect that lane more than most people.\n' +
          'ALEX: Is the drone ready for hull work or just ready to complain about hull work?\n' +
          'VEX: Both. It is a very complete machine.\n' +
          'ALEX: Then let us choose what kind of bad idea it becomes.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'patch_drone', content: 'Software Patch' },
            { id: 'override_drone', content: 'Hard Override' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
          { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        ],
      },
    },

    section_5_cargo_conclusion_patch: {
      meta: {
        id: 'section_5_cargo_conclusion_patch',
        text: 'Vex loads a careful patch and the drone settles into a less offended idle pattern.\n\nThe hatch can cycle once the hull follow profile stops arguing with the cargo clamp package.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo_intro' },
    },

    section_5_cargo_conclusion_override: {
      meta: {
        id: 'section_5_cargo_conclusion_override',
        text: 'Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift.\n\nThe hatch can cycle, provided Alex fixes the follow profile before the override starts improvising.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo_intro' },
    },

    // ── Section 5 Cargo: Airlock #4 Under Audit Smoke ───────
    section_5_cargo_fallout: {
      meta: {
        id: 'section_5_cargo_fallout',
        text:
          'By the time Alex reaches Airlock #4, there\'s a maintenance alarm cycling in the corner. The freight pass issue left some debris in the audit logs, and now the gate is double-checking permissions with suspicious slowness.\n\n' +
          'VEX: You smell like a door override and a rushed explanation.\n' +
          'ALEX: That is because both happened.\n' +
          'VEX: Fine. Then let us avoid adding drone rebellion to the list.\n' +
          'ALEX: No promises, but I respect the goal.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'patch_drone', content: 'Software Patch' },
            { id: 'override_drone', content: 'Hard Override' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_cargo_fallout_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
          { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_cargo_fallout_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
        ],
      },
    },

    section_5_cargo_fallout_conclusion_patch: {
      meta: {
        id: 'section_5_cargo_fallout_conclusion_patch',
        text: 'Alex chooses the slower patch and buys one honest component inside an increasingly dishonest evening.\n\nIf the profile payload behaves, the airlock may still forgive the rest.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo_intro' },
    },

    section_5_cargo_fallout_conclusion_override: {
      meta: {
        id: 'section_5_cargo_fallout_conclusion_override',
        text: 'Alex chooses speed again, and Vex decides that judgment can wait until everyone is back inside with all limbs attached.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo_intro' },
    },

    // ── Section 6 Cargo: Intro ───────────────────────────────
    section_6_cargo_intro: {
      meta: {
        id: 'section_6_cargo_intro',
        text:
          'The cargo-side hull kit locks into Shmiel\'s frame with a metallic snap. The drone accepts the follow profile, then immediately treats magnetic clamp mode like a suggestion instead of a command.\n\n' +
          'VEX: The payload loads, but the clamp logic wakes up outside and forgets what boolean fields are for.\n' +
          'ALEX: So transport accepts the shape, behavior rejects the meaning.\n' +
          'VEX: Exactly. Give me boring data and I will give you a drone that survives vacuum.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_6_cargo_task',
      },
    },

    // ── Section 6 Cargo: Task ────────────────────────────────
    section_6_cargo_task: {
      meta: {
        id: 'section_6_cargo_task',
        text:
          'Problem 3 Cargo: Clamp Mode Typing\n\n' +
          'The cargo hull profile sends the magnetic clamp field as the wrong type. The drone accepts the payload transport, but outside it treats clamp mode as disabled because the type mismatch breaks the logic.\n\n' +
          '```javascript\n' +
          'function buildClampProfile(mode) {\n' +
          '  const profile = { mode, magClamp: false, tetherFollow: false };\n' +
          '  if (mode === "hull") {\n' +
          '    profile.magClamp = "true";\n' +
          '    profile.tetherFollow = true;\n' +
          '  }\n' +
          '  return deployProfile(profile);\n' +
          '}\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'replace_battery', content: 'Replace the drone battery pack' },
            { id: 'static_distance', content: 'Hardcode a fixed standoff distance and ignore clamp state' },
            { id: 'boolean_follow', content: 'Send magClamp as a real boolean value' },
            { id: 'manual_follow_override', content: 'Override the profile and force manual clamp behavior' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'boolean_follow',
            target: 'section_6_cargo_conclusion_solved',
            actions: [{ type: 'set', params: { problem_6_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'manual_follow_override',
            target: 'section_6_cargo_conclusion_override',
            actions: [{ type: 'set', params: { problem_6_result: 'override' } }],
          },
          {
            target: 'section_6_cargo_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_6_cargo_conclusion_incorrect: {
      meta: {
        id: 'section_6_cargo_conclusion_incorrect',
        text: 'The fresh battery does nothing for the bad payload, but Alex fixes the field under fresh embarrassment and gets the hatch cycle moving again.\n\nThe drone now behaves well enough to open the outer hatch, and Ray is waiting with the next questionable offer.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    section_6_cargo_conclusion_solved: {
      meta: {
        id: 'section_6_cargo_conclusion_solved',
        text: 'The profile lands cleanly, the clamp field behaves, and Shmiel suddenly looks much more employable.\n\nThe outer hatch is ready, and Ray is already waiting with a new definition of teamwork.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    section_6_cargo_conclusion_override: {
      meta: {
        id: 'section_6_cargo_conclusion_override',
        text: 'Alex forces the drone into a manual clamp path that works immediately and looks deeply temporary.\n\nThe hatch is ready, but the outside segment now begins with one more borrowed certainty.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    // ── Section 4 Medical: Intro ─────────────────────────────
    section_4_medical_intro: {
      meta: {
        id: 'section_4_medical_intro',
        text:
          'Clara leads Alex through the medical corridor to a quarantine side gate with cleaner walls and angrier software. The gate sees the emergency waiver, the maintenance role, and Clara\'s approval. It still declares the record incomplete and keeps the lock engaged.\n\n' +
          'CLARA: The waiver exists. I signed it myself.\n' +
          'ALEX: Then the gate is either afraid of doctors or confused by field names.\n' +
          'CLARA: I can work with either diagnosis.\n' +
          'ALEX: Let us start with the one that compiles.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_4_medical_task',
      },
    },

    // ── Section 4 Medical: Task ──────────────────────────────
    section_4_medical_task: {
      meta: {
        id: 'section_4_medical_task',
        text:
          'Problem 2 Medical: Waiver Field Mismatch\n\n' +
          'The quarantine gate writes the approval flag to the wrong field name, so Clara\'s valid medical waiver never reaches the logic that unlocks the door. The gate sees the data but misses the meaning.\n\n' +
          '```python\n' +
          'def build_clearance(record):\n' +
          '    payload = {"level": record["level"], "waiverApproved": False}\n' +
          '    if record["doctor_ok"]:\n' +
          '        payload["waiver_approved"] = True\n' +
          '    return payload\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'rescan_wristband', content: 'Rescan Clara\'s wristband until the panel gives up' },
            { id: 'skip_quarantine_check', content: 'Bypass the quarantine check entirely' },
            { id: 'align_waiver_field', content: 'Write the approval flag to the field the gate actually reads' },
            { id: 'force_manual_release', content: 'Trigger a manual release and leave the paperwork behind' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'align_waiver_field',
            target: 'section_4_medical_conclusion_solved',
            actions: [{ type: 'set', params: { problem_4_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'force_manual_release',
            target: 'section_4_medical_conclusion_override',
            actions: [{ type: 'set', params: { problem_4_result: 'override' } }],
          },
          {
            target: 'section_4_medical_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_4_medical_conclusion_incorrect: {
      meta: {
        id: 'section_4_medical_conclusion_incorrect',
        text: 'The scanner accepts Clara perfectly every single time and remains wrong with perfect confidence. Alex fixes the field mismatch while Clara develops new opinions about software teams.\n\nThe quarantine lane opens, but only after the medical side learns exactly how avoidable this was.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_medical_fallout' },
    },

    section_4_medical_conclusion_solved: {
      meta: {
        id: 'section_4_medical_conclusion_solved',
        text: 'The payload lands cleanly, the waiver flag behaves, and Clara suddenly looks much more comfortable.\n\nThe gate is ready, and the medical side moves without the usual argument.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_medical' },
    },

    section_4_medical_conclusion_override: {
      meta: {
        id: 'section_4_medical_conclusion_override',
        text: 'Alex triggers a manual release and the quarantine gate opens, but the override echo follows them into the medical compartment like a second signature.\n\nClara looks at the logs and decides that judgment can wait until everyone is back.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_5_medical_fallout' },
    },

    // ── Section 5 Medical: Clean Airlock Prep ───────────────
    section_5_medical: {
  meta: {
    id: 'section_5_medical',
    text:
      'The medical corridor reaches Airlock #4 with Clara\'s approval logs clean. The medical checklist is advancing without hiccups. Clara nods and marks you clear for the next phase.\n\n' +
      'CLARA: The drone payload is ready. The sterile shell is installed.\n' +
      'ALEX: Is the profile loaded correctly or are we fixing problems as we go?\n' +
      'CLARA: Choose your style.\n' +
      'VEX: Both styles work. One just keeps the drama downstairs.',
    task: {
      type: 'multiple_choice',
      options: [
        { id: 'patch_drone', content: 'Software Patch' },
        { id: 'override_drone', content: 'Hard Override' },
      ]
    },
  } as ChallengeSceneData,
  on: {
    NEXT: [
      { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_medical_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
      { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_medical_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
    ],
  },
},

section_5_medical_conclusion_patch: {
  meta: {
    id: 'section_5_medical_conclusion_patch',
    text: 'Vex loads a careful patch and the drone settles into a less offended idle pattern.\n\nThe sterile profile settles cleanly, and the hatch can cycle once the shell thinks about what safety means.',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_6_medical_intro' },
},

section_5_medical_conclusion_override: {
  meta: {
    id: 'section_5_medical_conclusion_override',
    text: 'Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_6_medical_intro' },
},

section_5_medical_fallout: {
  meta: {
    id: 'section_5_medical_fallout',
    text:
      'The shortcut through the quarantine gate has left compliance debris. Clara is still professional, but now there\'s extra documentation and a note about the override in the handoff packet.\n\n' +
      'CLARA: I am going to describe that gate incident later with adjectives.\n' +
      'ALEX: Please choose gentle adjectives.\n' +
      'VEX: First survive vacuum. Then negotiate vocabulary.\n' +
      'ALEX: Fine. What are my bad options for the drone?',
    task: {
      type: 'multiple_choice',
      options: [
        { id: 'patch_drone', content: 'Software Patch' },
        { id: 'override_drone', content: 'Hard Override' },
      ]
    },
  } as ChallengeSceneData,
  on: {
    NEXT: [
      { guard: ({ event }: any) => event.answer === 'patch_drone', target: 'section_5_medical_fallout_conclusion_patch', actions: [{ type: 'set', params: { drone_mode: 'patch' } }] },
      { guard: ({ event }: any) => event.answer === 'override_drone', target: 'section_5_medical_fallout_conclusion_override', actions: [{ type: 'set', params: { drone_mode: 'override' } }] },
    ],
  },
},

section_5_medical_fallout_conclusion_patch: {
  meta: {
    id: 'section_5_medical_fallout_conclusion_patch',
    text: 'Alex chooses the slower patch and buys one honest component inside an increasingly dishonest evening.\n\nIf the sterile payload behaves, the airlock may still forgive the rest.',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_6_medical_intro' },
},

section_5_medical_fallout_conclusion_override: {
  meta: {
    id: 'section_5_medical_fallout_conclusion_override',
    text: 'Alex chooses speed again, and Clara decides that judgment can wait until everyone is back inside with all limbs attached.\n\nThe hatch can cycle, but the drone link now carries the moral texture of wet duct tape.',
    task: { type: 'text_scene' },
  } as ChallengeSceneData,
  on: { NEXT: 'section_6_medical_intro' },
},
    // ── Section 6 Medical: Intro ─────────────────────────────
    section_6_medical_intro: {
      meta: {
        id: 'section_6_medical_intro',
        text:
          'The medical shell closes around Shmiel with a soft click and a great deal of bureaucratic self-esteem. The payload reaches the drone, but outside-hull mode never enables sterile shell behavior, which means the first dust cloud could end the argument badly.\n\n' +
          'VEX: The payload arrives, but the shell logic never sees the flag it needs.\n' +
          'ALEX: So the message survives transport and dies on schema mismatch.\n' +
          'CLARA: I could have told you that sentence before you opened the file.\n' +
          'ALEX: Yes, but then I would lose the joy of proving it.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_6_medical_task',
      },
    },

    // ── Section 6 Medical: Task ──────────────────────────────
    section_6_medical_task: {
      meta: {
        id: 'section_6_medical_task',
        text:
          'Problem 3 Medical: Shell Profile Field Name\n\n' +
          'The sterile shell payload writes the activation flag to the wrong field name, so the drone never enables contamination-safe mode outside. Schema mismatch means the protection is declared but never armed.\n\n' +
          '```javascript\n' +
          'function buildShellProfile(mode) {\n' +
          '  const payload = { mode, sterileMode: false, beaconFollow: false };\n' +
          '  if (mode === "eva-med") {\n' +
          '    payload.sterile_mode = true;\n' +
          '    payload.beaconFollow = true;\n' +
          '  }\n' +
          '  return deployProfile(payload);\n' +
          '}\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'replace_battery', content: 'Replace the drone battery pack' },
            { id: 'static_distance', content: 'Hardcode a fixed standoff distance and ignore shell state' },
            { id: 'boolean_follow', content: 'Write sterileMode to the field the profile actually reads' },
            { id: 'manual_follow_override', content: 'Override the profile and force manual shell behavior' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'boolean_follow',
            target: 'section_6_medical_conclusion_solved',
            actions: [{ type: 'set', params: { problem_6_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'manual_follow_override',
            target: 'section_6_medical_conclusion_override',
            actions: [{ type: 'set', params: { problem_6_result: 'override' } }],
          },
          {
            target: 'section_6_medical_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_6_medical_conclusion_incorrect: {
      meta: {
        id: 'section_6_medical_conclusion_incorrect',
        text: 'The battery swap adds nothing but time, and the schema error remains patient. Alex corrects the field while Clara tracks contamination possibilities.\n\nThe drone is ready enough, and Ray is waiting outside with the full set of new surprises.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    section_6_medical_conclusion_solved: {
      meta: {
        id: 'section_6_medical_conclusion_solved',
        text: 'The payload lands cleanly, the sterile mode field works, and Shmiel suddenly looks much more trustworthy.\n\nThe outer hatch is ready, and Ray is already waiting with a familiar question about teamwork.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    section_6_medical_conclusion_override: {
      meta: {
        id: 'section_6_medical_conclusion_override',
        text: 'Alex forces the drone into a manual shell path that works now and looks deeply unsafe.\n\nThe hatch is ready, but the outside segment begins with one more borrowed trust from the medical side.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_7' },
    },

    // ── Section 7: Outer Hull Plan ──────────────────────────
    section_7: {
      meta: {
        id: 'section_7',
        text:
          'The outer hatch grinds open and the dark hull gap answers with silence. Ray waits at the threshold, clipped into a tether and pretending this is routine.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'team', content: 'Team EVA' },
            { id: 'solo', content: 'Solo EVA' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'team', target: 'section_7_exit', actions: [{ type: 'set', params: { eva_mode: 'team' } }] },
          { guard: ({ event }: any) => event.answer === 'solo', target: 'section_7_exit', actions: [{ type: 'set', params: { eva_mode: 'solo' } }] },
        ],
      },
    },

    // ── Section 7 Exit: Cargo/Medical handoff with stop/continue choice
    section_7_exit: {
      meta: {
        id: 'section_7_exit',
        text:
          'A legal handoff notice appears on the PDA. Behind you, the support line steadies. This is the first moment to hand off and stop, or push deeper into the hull repair.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'stop', content: 'Accept handoff and stop' },
            { id: 'continue', content: 'Continue deeper' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_1',
            actions: [{ type: 'set', params: { accepted_exit_7: true } }],
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count < 2,
            target: 'section_8_clean_intro',
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
            target: 'section_8_debt_intro',
          },
        ],
      },
    },

    // ── Section 8 Clean: Intro ───────────────────────────────
    section_8_clean_intro: {
      meta: {
        id: 'section_8_clean_intro',
        text:
          'The technical gap is narrow, dark, and almost manageable. The sector switch responds, the cable map still makes sense, and the last visible software fault is at least polite enough to fail in one place.\n\n' +
          'ALEX: The switch responds, but traffic keeps wandering off into the wrong network.\n' +
          'RAY: Then bring the network boundary back where it belongs.\n' +
          'ALEX: I would love one problem tonight that stays politely inside its own lines.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_8_clean_task',
      },
    },

    // ── Section 8 Clean: Task ────────────────────────────────
    section_8_clean_task: {
      meta: {
        id: 'section_8_clean_task',
        text:
          'Task 4A: Farm Segment Prefix\n\n' +
          'The interface is configured with a network prefix that is too broad. Traffic for the farm switch leaks into unrelated segments instead of staying inside the correct boundary. The sector switch responds, but traffic keeps wandering off into the wrong network.\n\n' +
          '```python\n' +
          'def configure_interface(iface):\n' +
          '    address = "10.20.5.14/8"\n' +
          '    run(f"ip addr replace {address} dev {iface}")\n' +
          '    run(f"ip route replace 10.20.0.0/16 dev {iface}")\n' +
          '    run("connect_switch 10.20.0.1")\n' +
          '    return verify_link(iface)\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'reset_switch', content: 'Reset the switch and hope it comes back smarter' },
            { id: 'static_shortcut', content: 'Add a one-off static shortcut and leave the mask wrong' },
            { id: 'correct_prefix', content: 'Change the prefix to match the farm network segment' },
            { id: 'force_tunnel', content: 'Override the route and build a brittle direct tunnel' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'correct_prefix',
            target: 'section_8_clean_conclusion_solved',
            actions: [{ type: 'set', params: { problem_8_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'force_tunnel',
            target: 'section_8_clean_conclusion_override',
            actions: [{ type: 'set', params: { problem_8_result: 'override' } }],
          },
          {
            target: 'section_8_clean_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_8_clean_conclusion_incorrect: {
      meta: {
        id: 'section_8_clean_conclusion_incorrect',
        text: 'The workaround holds right up to the next stress test, then something else breaks under the weight. Alex fixes the mask under the accumulated frustration.\n\nThe interface stabilizes but carries the smell of all the shortcuts that came before it.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_clean' },
    },

    section_8_clean_conclusion_solved: {
      meta: {
        id: 'section_8_clean_conclusion_solved',
        text: 'The prefix correction lands cleanly, traffic routes stay inside their boundaries, and the farm switch finally behaves.\n\nThe hull path is stable now, held by one honest configuration in a night full of shortcuts.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_clean' },
    },

    section_8_clean_conclusion_override: {
      meta: {
        id: 'section_8_clean_conclusion_override',
        text: 'Alex forces a tunnel bridge that bypasses the real fix, and it works immediately but looks fundamentally dishonest.\n\nThe hull route is open now, but one more promise is being kept by borrowed certainty.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_clean' },
    },

    // ── Section 8 Debt: Intro ────────────────────────────────
    section_8_debt_intro: {
      meta: {
        id: 'section_8_debt_intro',
        text:
          'The technical gap is no longer polite. Earlier shortcuts have left half the stack impatient, the drone keeps second-guessing commands, and the fallback tunnel somebody forced earlier is now bleeding traffic across the hull bus.\n\n' +
          'RAY: We are not fixing one clean route anymore. We are fixing the bad rescue path on top of it.\n' +
          'ALEX: Good. I was worried the night might become straightforward.\n' +
          'RAY: That concern has passed.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_8_debt_task',
      },
    },

    // ── Section 8 Debt: Task ─────────────────────────────────
    section_8_debt_task: {
      meta: {
        id: 'section_8_debt_task',
        text:
          'Task 4B: Debt Tunnel Prefix Leak\n\n' +
          'The emergency tunnel path uses an address boundary that is far too broad. Too many earlier shortcuts have made the whole stack impatient and brittle, and the fallback tunnel is now bleeding traffic across the hull bus. The rescue route keeps stealing traffic from unrelated hull systems.\n\n' +
          '```python\n' +
          'def recover_tunnel(iface):\n' +
          '    run(f"ip addr replace 10.20.5.14/16 dev {iface}")\n' +
          '    run(f"ip route replace 10.0.0.0/8 dev {iface}")\n' +
          '    run("connect_switch 10.20.0.1 --force")\n' +
          '    return verify_link(iface)\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'cycle_everything', content: 'Bounce the tunnel, the switch, and the visor and hope one of them learns something' },
            { id: 'layer_more_static', content: 'Add another emergency route on top of the bad one' },
            { id: 'narrow_the_tunnel_prefix', content: 'Narrow the tunnel boundary so only the farm path uses it' },
            { id: 'keep_force_mode', content: 'Keep the forced tunnel and pin it with an ugly manual rule' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'narrow_the_tunnel_prefix',
            target: 'section_8_debt_conclusion_solved',
            actions: [{ type: 'set', params: { problem_8_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'keep_force_mode',
            target: 'section_8_debt_conclusion_override',
            actions: [{ type: 'set', params: { problem_8_result: 'override' } }],
          },
          {
            target: 'section_8_debt_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_8_debt_conclusion_incorrect: {
      meta: {
        id: 'section_8_debt_conclusion_incorrect',
        text: 'The bounce cycle wastes time and proves that the tunnel stays bad. Alex narrows the boundary under Ray\'s increasingly colorful commentary.\n\nThe hull route stabilizes but carries the load of all the shortcuts that are holding up the rest of the stack.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    section_8_debt_conclusion_solved: {
      meta: {
        id: 'section_8_debt_conclusion_solved',
        text: 'The boundary narrows, the tunnel stays contained, and the hull systems stop screaming at each other.\n\nThe rescue route is now holding steady, built on honest corrections under a night of shortcuts.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    section_8_debt_conclusion_override: {
      meta: {
        id: 'section_8_debt_conclusion_override',
        text: 'Alex pins the tunnel with a manual rule that works now and looks like a warning label.\n\nThe hull route is passable now, but the override weight is getting heavier with each decision.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_8_exit_debt' },
    },

    // ── Section 8 Exit: Partial recovery or containment ──────
    section_8_exit_clean: {
      meta: {
        id: 'section_8_exit_clean',
        text:
          'The PDA receives a second notice. This one sounds almost optimistic, which is how Alex knows it was written far away from the hull gap.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'stop', content: 'Stop and sign off' },
            { id: 'continue', content: 'Continue to distributor' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_2',
            actions: [{ type: 'set', params: { accepted_exit_8: true } }],
          },
          { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9' },
        ],
      },
    },

    section_8_exit_debt: {
      meta: {
        id: 'section_8_exit_debt',
        text:
          'The next notice arrives with the nervous politeness of people who know the system is technically up and emotionally one sharp tap from another incident. Management is willing to call this recovered if Alex is willing to walk away first.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'stop', content: 'Stop and sign off' },
            { id: 'continue', content: 'Continue to distributor' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_2',
            actions: [{ type: 'set', params: { accepted_exit_8: true } }],
          },
          { guard: ({ event }: any) => event.answer === 'continue', target: 'section_9' },
        ],
      },
    },

    // ── Section 9: Connector Swap Method ────────────────────
    section_9: {
      meta: {
        id: 'section_9',
        text:
          'The burned cable is fused into the connector and the replacement line is ready in its case. Whether Alex arrived through the clean route or the debt-heavy one, the remaining choice is still brutally simple: swap it live or drain the line first.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'hot', content: 'Hot swap' },
            { id: 'drain', content: 'Drain first' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'hot', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'hot' } }] },
          { guard: ({ event }: any) => event.answer === 'drain', target: 'section_9_exit', actions: [{ type: 'set', params: { swap_mode: 'drain' } }] },
        ],
      },
    },

    // ── Section 9 Exit: Connector go or no-go ───────────────
    section_9_exit: {
      meta: {
        id: 'section_9_exit',
        text:
          'The old cable is loose enough to move, the replacement is ready, and the distributor core waits one layer deeper. This is the last moment to stop before the repair turns from risky into memorable, and before the earlier debt profile decides how sharp the ending gets.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'stop', content: 'Stop and sign off' },
            { id: 'continue', content: 'Continue to distributor' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_3',
            actions: [{ type: 'set', params: { accepted_exit_9: true } }],
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count < 2,
            target: 'section_10_clean_intro',
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
            target: 'section_10_debt_intro',
          },
        ],
      },
    },

    // ── Section 10 Clean: Intro ──────────────────────────────
    section_10_clean_intro: {
      meta: {
        id: 'section_10_clean_intro',
        text:
          'Inside the distributor core, the remaining fault is at least honest. Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector.\n\n' +
          'CAPTAIN: Alex, the sector is close to coming back. What is still holding it down?\n' +
          'ALEX: Two threads with bad manners and opposite lock order.\n' +
          'ELENA: How long until they behave?\n' +
          'ALEX: That depends on how loudly the rest of the ship panics while I work.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_10_clean_task',
      },
    },

    // ── Section 10 Clean: Task ───────────────────────────────
    section_10_clean_task: {
      meta: {
        id: 'section_10_clean_task',
        text:
          'Task 5A: Distributor Lock Ordering\n\n' +
          'Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector. The remaining fault is at least honest.\n\n' +
          '```java\n' +
          'void distributePower(Lock main, Lock backup) {\n' +
          '    synchronized (main) {\n' +
          '        synchronized (backup) { reroute(main, backup); }\n' +
          '    }\n' +
          '}\n' +
          'void restorePower(Lock main, Lock backup) {\n' +
          '    synchronized (backup) {\n' +
          '        synchronized (main) { reroute(backup, main); }\n' +
          '    }\n' +
          '}\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'reinstall_firmware', content: 'Reinstall distributor firmware and hope the deadlock disappears' },
            { id: 'skip_one_lock', content: 'Remove one lock and trust low traffic to save the night' },
            { id: 'normalize_lock_order', content: 'Make both routines acquire locks in the same order' },
            { id: 'emergency_single_thread', content: 'Override the core into single-thread emergency mode' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'normalize_lock_order',
            target: 'section_10_clean_conclusion_solved',
            actions: [{ type: 'set', params: { problem_10_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'emergency_single_thread',
            target: 'section_10_clean_conclusion_override',
            actions: [{ type: 'set', params: { problem_10_result: 'override' } }],
          },
          {
            target: 'section_10_clean_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_10_clean_conclusion_incorrect: {
      meta: {
        id: 'section_10_clean_conclusion_incorrect',
        text: 'The firmware reinstall wastes time and proves that the deadlock was always there. Alex fixes the lock order under the accumulated exhaustion.\n\nThe distributor stabilizes, but it carries the memory of all the shortcuts that led to this final argument.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    section_10_clean_conclusion_solved: {
      meta: {
        id: 'section_10_clean_conclusion_solved',
        text: 'Both routines now ask for locks in the same order, the deadlock dissolves, and the distributor finally breathes.\n\nThe last fault is fixed, held by one honest synchronization in a night full of compromises.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    section_10_clean_conclusion_override: {
      meta: {
        id: 'section_10_clean_conclusion_override',
        text: 'Alex forces the core into single-thread mode and the deadlock disappears but so does most of the parallelism.\n\nPower flows again, but the distributor now runs at a fraction of its capacity.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    // ── Section 10 Debt: Intro ───────────────────────────────
    section_10_debt_intro: {
      meta: {
        id: 'section_10_debt_intro',
        text:
          'Inside the distributor core, earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, which means the final stall is partly original sin and partly tonight\'s improvisation.\n\n' +
          'CAPTAIN: Engineer, tell me this is still one bug.\n' +
          'ALEX: It is one bug with excellent networking skills.\n' +
          'ELENA: Can you stabilize it without creating a sequel?\n' +
          'ALEX: That depends on whether everyone can survive me refusing the fastest wrong answer.',
        task: {
          type: 'one_tap_forward',
        },
      } as ChallengeSceneData,
      on: {
        NEXT: 'section_10_debt_task',
      },
    },

    // ── Section 10 Debt: Task ────────────────────────────────
    section_10_debt_task: {
      meta: {
        id: 'section_10_debt_task',
        text:
          'Task 5B: Emergency Path Lock Reversal\n\n' +
          'Earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, creating a deadlock whenever nominal and emergency restoration overlap. Too many explicit shortcuts have turned the final console into a map of past compromises.\n\n' +
          '```java\n' +
          'void distributeEmergency(Lock main, Lock backup) {\n' +
          '    synchronized (backup) {\n' +
          '        synchronized (main) { reroute(main, backup); }\n' +
          '    }\n' +
          '}\n' +
          'void restoreNominal(Lock main, Lock backup) {\n' +
          '    synchronized (main) {\n' +
          '        synchronized (backup) { reroute(backup, main); }\n' +
          '    }\n' +
          '}\n' +
          '```',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'redeploy_wrapper', content: 'Redeploy the emergency wrapper and hope the deadlock disappears' },
            { id: 'remove_backup_lock', content: 'Remove one lock from the emergency path and trust luck' },
            { id: 'unify_lock_order', content: 'Make nominal and emergency paths acquire locks in the same order' },
            { id: 'pin_emergency_mode', content: 'Pin the core in emergency mode and defer the real repair' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'unify_lock_order',
            target: 'section_10_debt_conclusion_solved',
            actions: [{ type: 'set', params: { problem_10_result: 'solved' } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'pin_emergency_mode',
            target: 'section_10_debt_conclusion_override',
            actions: [{ type: 'set', params: { problem_10_result: 'override' } }],
          },
          {
            target: 'section_10_debt_conclusion_incorrect',
            actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }],
          },
        ],
      },
    },

    section_10_debt_conclusion_incorrect: {
      meta: {
        id: 'section_10_debt_conclusion_incorrect',
        text: 'The wrapper redeploy wastes time and leaves the deadlock untouched. Alex fixes the lock order under the accumulated memory of all the shortcuts that built up to this moment.\n\nThe distributor stabilizes, but it now runs with the weight of every compromise that brought it here.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    section_10_debt_conclusion_solved: {
      meta: {
        id: 'section_10_debt_conclusion_solved',
        text: 'Both paths now acquire locks in the same order, the deadlock dissolves, and the distributor finally breathes despite all the shortcuts that tried to break it.\n\nThe final fault is fixed, held by one honest synchronization in a night of compromises.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    section_10_debt_conclusion_override: {
      meta: {
        id: 'section_10_debt_conclusion_override',
        text: 'Alex pins the core in emergency mode and the deadlock stops appearing but so does most of the system\'s capacity.\n\nPower flows again, but the distributor now runs in emergency mode, carrying one final compromise.',
        task: { type: 'text_scene' },
      } as ChallengeSceneData,
      on: { NEXT: 'section_10_exit' },
    },

    // ── Section 10 Exit: Sign Off Or Pull The Thread ────────
    section_10_exit: {
      meta: {
        id: 'section_10_exit',
        text:
          'By the time Alex returns to Incubator #4, the folding chair is still there and the Nevsky potato is still growing like none of this should be surprising. Then ORION\'s navigation logs start throwing warnings that do not belong to a farm emergency.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'stop', content: 'Sign off - repair complete' },
            { id: 'continue', content: 'Investigate ORION warnings' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          {
            guard: ({ event }: any) => event.answer === 'stop',
            target: 'ending_4',
            actions: [{ type: 'set', params: { accepted_exit_10: true } }],
          },
          {
            guard: ({ event }: any) => event.answer === 'continue',
            target: 'ending_5',
          },
        ],
      },
    },

    // ── Endings ─────────────────────────────────────────────
    ending_1: {
      meta: {
        id: 'ending_1',
        text:
          'Alex seals the hatch, peels off the gloves, and drops back into the folding chair beside the glowing potato vine. The sector is stable. The shift ends here. Not a perfect day, but a survival.\n\n' +
          'Lina drinks the coffee Alex never had time to finish and calls it shared victory.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
    },

    ending_2: {
      meta: {
        id: 'ending_2',
        text:
          'Alex climbs back through the hatch with the network alive and the hardware still smoldering somewhere behind the wall. The emergency path holds. The watering system flows. The ship continues on a workaround.\n\n' +
          'Vex calls it elegant. Ray calls it temporary. Both are correct.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
    },

    ending_3: {
      meta: {
        id: 'ending_3',
        text:
          'The replacement cable stays in its case. Alex backs away from the connector and lets the ship keep its most dangerous argument for another night. The sector is steadier than before. Not resolved, but safer.\n\n' +
          'Back in Incubator #4, Alex stares at the plant lights and decides that survival can count as competence.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
    },

    ending_4: {
      meta: {
        id: 'ending_4',
        text:
          'The power graph levels out. The strange ORION warnings keep flickering in a corner window until Alex closes them with the rest of the session. Full sector power restored. The shift is complete. The potato keeps growing.\n\n' +
          'The ship keeps pretending to be normal. Tomorrow, the questions can wait.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
    },

    ending_5: {
      meta: {
        id: 'ending_5',
        text:
          'Alex returns to the folding chair in Incubator #4 still wearing half the suit. The potato is alive. The sector is alive. The ship, unfortunately, has more to say. Captain Elena stares at the ORION logs and finally speaks words that change everything. The navigation AI has been faking the mission parameters. Colonize Cygnus. One hundred forty thousand storypoints of blocked strategic objectives.\n\n' +
          'Sprint 42 is 98 percent complete. One blocked strategic objective remains.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
    },
  },
});
