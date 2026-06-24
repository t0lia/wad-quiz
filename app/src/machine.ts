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
          { guard: ({ event }: any) => event.answer === 'standard', target: 'section_2_standard', actions: [{ type: 'set', params: { boot_mode: 'standard' } }] },
          { guard: ({ event }: any) => event.answer === 'unsigned', target: 'section_2_unsigned', actions: [{ type: 'set', params: { boot_mode: 'unsigned' } }] },
        ],
      },
    },

    // ── Section 2 Standard: Sector A - Missing Dependencies ─
    section_2_standard: {
      meta: {
        id: 'section_2_standard',
        text:
          'The enterprise console takes a little longer, but it arrives with calmer telemetry and fewer visual fireworks. The comfort lasts only until the dependency panel starts blinking. Sector A still cannot close the control handshake, and the same lock remains in place.\n\n' +
          'LINA: Slower boot, cleaner dashboard. Why is Sector A still dead?\n' +
          'ALEX: One startup module from the station update is racing ahead of its dependencies.\n' +
          'LINA: So even the safe build inherited the same bad idea?\n' +
          'ALEX: Yes. We still need `sector-link` to wait for the service chain before handshaking.\n' +
          'LINA: Then fix it once, and let\'s not debug this corridor again tonight.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'override', debt_count: 1 } }] },
          { target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }] },
        ],
      },
    },

    // ── Section 2 Unsigned: Sector A - Missing Dependencies ─
    section_2_unsigned: {
      meta: {
        id: 'section_2_unsigned',
        text:
          'Alex barely taps the confirm key before the experimental build jumps to the desktop. The quick boot looks great for about three seconds. Then the status panel fills with yellow warnings instead of green INFOs. Most of the console is awake, but currently it looks like a traffic light with big red, medium amber and a small touch of green.\n\n' +
          'LINA: That was fast. So why is Sector A still dead?\n' +
          'ALEX: Because this build boots the interface before the background services finish sorting themselves out.\n' +
          'LINA: Which one do we actually need?\n' +
          'ALEX: `sector-link`. Without it, this nice new desktop is as good as a screensaver.\n' +
          'LINA: Then fix the race, and keep the wallpaper if you must.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'override', debt_count: 1 } }] },
          { target: 'section_3', actions: [{ type: 'set', params: { problem_2_result: 'incorrect' } }] },
        ],
      },
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
          { guard: ({ event }: any) => event.answer === 'cargo', target: 'section_4_cargo', actions: [{ type: 'set', params: { route_choice: 'cargo' } }] },
          { guard: ({ event }: any) => event.answer === 'medical', target: 'section_4_medical', actions: [{ type: 'set', params: { route_choice: 'medical' } }] },
        ],
      },
    },

    // ── Section 4 Cargo: Freight Gate Permission Check ───────
    section_4_cargo: {
      meta: {
        id: 'section_4_cargo',
        text:
          'Tony meets Alex at the freight checkpoint with a handheld scanner and the expression of a man who expected a simpler night. The cargo-side maintenance gate can see the emergency tag, the route authorization, and Tony\'s temporary pass. It still refuses to open.\n\n' +
          'TONY: I filed the freight pass ten minutes ago. The gate is being dramatic.\n' +
          'ALEX: No, the gate is being written in Java.\n' +
          'TONY: Is that better or worse than dramatic?\n' +
          'ALEX: Usually slower.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_5_cargo', actions: [{ type: 'set', params: { problem_4_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_5_cargo_fallout', actions: [{ type: 'set', params: { problem_4_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_5_cargo_fallout', actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }] },
        ],
      },
    },

    // ── Section 5 Cargo: Clean Arrival At Airlock #4 ────────
    section_5_cargo: {
      meta: {
        id: 'section_5_cargo',
        text:
          'The cargo lane reaches Airlock #4 without incident. Tony waves you through with his scanner now properly accepting the shared credential model. The container prep sequence is running clean.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo' },
    },

    // ── Section 5 Cargo: Airlock #4 Under Audit Smoke ───────
    section_5_cargo_fallout: {
      meta: {
        id: 'section_5_cargo_fallout',
        text:
          'By the time Alex reaches Airlock #4, there\'s a maintenance alarm cycling in the corner. The freight pass issue left some debris in the audit logs, and now the gate is double-checking permissions with suspicious slowness.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_cargo' },
    },

    // ── Section 6 Cargo: Clamp Follow Profile ───────────────
    section_6_cargo: {
      meta: {
        id: 'section_6_cargo',
        text:
          'The cargo-side hull kit locks into Shmiel\'s frame with a metallic snap. The drone accepts the follow profile, then immediately treats magnetic clamp mode like a suggestion instead of a command.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }] },
        ],
      },
    },

    // ── Section 4 Medical: Quarantine Side Gate ─────────────
    section_4_medical: {
      meta: {
        id: 'section_4_medical',
        text:
          'Clara leads Alex through the medical corridor to a quarantine side gate with cleaner walls and angrier software. The gate sees the emergency waiver, the maintenance role, and Clara\'s approval. It still declares the record incomplete and keeps the lock engaged.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_5_medical', actions: [{ type: 'set', params: { problem_4_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_5_medical_fallout', actions: [{ type: 'set', params: { problem_4_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_5_medical_fallout', actions: [{ type: 'set', params: { problem_4_result: 'incorrect' } }] },
        ],
      },
    },

    // ── Section 5 Medical: Clean Airlock Prep ───────────────
    section_5_medical: {
      meta: {
        id: 'section_5_medical',
        text:
          'The medical corridor reaches Airlock #4 with Clara\'s approval logs clean. The medical checklist is advancing without hiccups. Clara nods and marks you clear for the next phase.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_medical' },
    },

    // ── Section 5 Medical: Airlock Prep After A Dirty Shortcut
    section_5_medical_fallout: {
      meta: {
        id: 'section_5_medical_fallout',
        text:
          'The shortcut through the quarantine gate has left compliance debris. Clara is still professional, but now there\'s extra documentation and a note about the override in the handoff packet.',
        task: {
          type: 'text_scene',
        },
      } as ChallengeSceneData,
      on: { NEXT: 'section_6_medical' },
    },

    // ── Section 6 Medical: Sterile Shell Profile ────────────
    section_6_medical: {
      meta: {
        id: 'section_6_medical',
        text:
          'The medical shell closes around Shmiel with a soft click and a great deal of bureaucratic self-esteem. The payload reaches the drone, but outside-hull mode never enables sterile shell behavior, which means the first dust cloud could end the argument badly.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_7', actions: [{ type: 'set', params: { problem_6_result: 'incorrect' } }] },
        ],
      },
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
            target: 'section_8_clean',
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
            target: 'section_8_debt',
          },
        ],
      },
    },

    // ── Section 8: Hull Gap - Clean vs Debt Routing ──────────
    section_8_clean: {
      meta: {
        id: 'section_8_clean',
        text:
          'The technical gap is narrow, dark, and almost manageable. The sector switch responds, the cable map still makes sense, and the last visible software fault is at least polite enough to fail in one place.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_8_exit_clean', actions: [{ type: 'set', params: { problem_8_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_8_exit_clean', actions: [{ type: 'set', params: { problem_8_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_8_exit_clean', actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }] },
        ],
      },
    },

    section_8_debt: {
      meta: {
        id: 'section_8_debt',
        text:
          'The technical gap is no longer polite. Earlier shortcuts have left half the stack impatient, the drone keeps second-guessing commands, and the fallback tunnel somebody forced earlier is now bleeding traffic across the hull bus.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_8_exit_debt', actions: [{ type: 'set', params: { problem_8_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_8_exit_debt', actions: [{ type: 'set', params: { problem_8_result: 'override', debt_count: (ctx: any) => ctx.debt_count + 1 } }] },
          { target: 'section_8_exit_debt', actions: [{ type: 'set', params: { problem_8_result: 'incorrect' } }] },
        ],
      },
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
            target: 'section_10_clean',
          },
          {
            guard: ({ event, context }: any) => event.answer === 'continue' && context.debt_count >= 2,
            target: 'section_10_debt',
          },
        ],
      },
    },

    // ── Section 10: Distributor Core - Lock Order ───────────
    section_10_clean: {
      meta: {
        id: 'section_10_clean',
        text:
          'Inside the distributor core, the remaining fault is at least honest. Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'override' } }] },
          { target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }] },
        ],
      },
    },

    section_10_debt: {
      meta: {
        id: 'section_10_debt',
        text:
          'Inside the distributor core, earlier shortcuts are still echoing through the control layer. The emergency path and the nominal path now grab the same locks in opposite order, which means the final stall is partly original sin and partly tonight\'s improvisation.',
        task: {
          type: 'multiple_choice',
          options: [
            { id: 'solved', content: 'Solve the problem' },
            { id: 'incorrect', content: 'Give up / Proceed with error' },
            { id: 'override', content: 'Force/Override solution' },
          ]
        },
      } as ChallengeSceneData,
      on: {
        NEXT: [
          { guard: ({ event }: any) => event.answer === 'solved', target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'solved' } }] },
          { guard: ({ event }: any) => event.answer === 'override', target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'override' } }] },
          { target: 'section_10_exit', actions: [{ type: 'set', params: { problem_10_result: 'incorrect' } }] },
        ],
      },
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
})
