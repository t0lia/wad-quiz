# Hydroworld2 Stage Review Checklist

This checklist reviews `sandbox/hw2_stage_paths.md` for within-pass story consistency, terminology load, and English complexity. It uses exact stage ids only.

## Causality

- [ ] `ending_1`
Question: The ending says Alex stops before EVA and before the outside repair begins, but every route into this ending already goes through `section_7` and one of the handoff stages. Clarify that Alex stops before the deeper outside repair, not before EVA itself.
Excerpt: "Alex stops before the EVA..." and "Three technical problems were handled before the outside repair began."

- [ ] `section_7_exit_medical -> section_8_clean`
Question: In the medical branch, Clara is active through airlock prep, but if Alex continues after the waiver offer, she vanishes from the visible story with no handoff line. Add one transition beat stating whether she stays inside, signs off, or transfers responsibility.
Excerpt: "Medical is offering you a respectable retreat..." followed by outside work with Ray only.

- [ ] `section_5_medical`, `section_5_medical_fallout`, `section_7`
Question: Both medical airlock stages frame Clara as operationally invested in vacuum safety, but `section_7` resets the outside scene as if only Ray matters now. Consider one line linking Clara's exit to Ray's entry.
Excerpt: "Medical does not sign off on improvisation in vacuum." followed by `section_7` without Clara.

- [ ] `section_9_exit`
Question: "before the earlier debt profile decides how sharp the ending gets" sounds like awareness of branching logic rather than an in-world consequence. Rephrase into an operational risk statement.
Excerpt: "...before the earlier debt profile decides how sharp the ending gets."

- [ ] `section_10_exit`, `ending_5`
Question: `section_10_exit` already places Alex back in Incubator #4, then `ending_5` says Alex returns to the folding chair in Incubator #4. Add a bridge for where Alex goes between those beats, or remove the second return.
Excerpt: "By the time Alex returns to Incubator #4..." and later "Alex returns to the folding chair in Incubator #4 still wearing half the suit."

- [ ] `section_10_clean`, `section_10_debt`, `section_10_exit`
Question: The ORION anomaly appears immediately after the distributor-core fix. Consider adding one short discovery beat showing how the anomaly surfaces, instead of jumping straight from repaired power to hidden AI implications.
Excerpt: "Full power returns..." followed by navigation-log warnings in `section_10_exit`.

- [ ] `section_8_debt`, `ending_2`
Question: The debt route is framed as brittle, noisy, and still leaking technical problems, but `ending_2` closes with a relatively calm workaround summary. Add one sentence confirming that the path is stable enough to abandon, despite the mess.
Excerpt: "The recovery path works, but only with visible debt." and later "Sector A backbone connectivity is restored through software paths."

- [ ] `ending_2`
Question: "gets the ship home on a workaround" may overstate the actual repair scope, which is mostly Sector A and backbone recovery. Decide whether that line should stay station-wide or become more local.
Excerpt: "...gets the ship home on a workaround."

## Terminology Load

- [ ] `section_8_debt`
Question: The intro packs `stack`, `fallback tunnel`, `bleeding traffic`, and `exterior network` into one short beat. Consider dropping or simplifying one of those terms.
Excerpt: "Earlier shortcuts have left half the stack impatient... the fallback tunnel somebody forced earlier is now bleeding traffic across the exterior network."

- [ ] `section_8_clean`
Question: The intro combines `sector switch`, `cable map`, and `network boundary` very quickly. This is still understandable, but it is dense for a short setup paragraph.
Excerpt: "The sector switch responds, the cable map still makes sense..."

- [ ] `section_9`
Question: "swap it live or drain the line first" is concise, but `live` and `drain the line` arrive without a plain-language anchor. Consider one extra word that grounds the choice for non-native readers.
Excerpt: "...swap it live or drain the line first."

- [ ] `section_10_clean`
Question: The lock-order explanation is accurate, but it introduces `power routines`, `locks in opposite order`, `under load`, and `stall the whole sector` in two sentences. Consider simplifying one phrase.
Excerpt: "Two power routines grab the same locks in opposite order. Under load they freeze each other and stall the whole sector."

- [ ] `section_10_debt`
Question: This version adds `emergency path`, `nominal path`, `locks in opposite order`, and the moral framing of earlier shortcuts in one beat. It is strong, but denser than the clean-route version.
Excerpt: "The emergency path and the nominal path now grab the same locks in opposite order..."

- [ ] `section_10_exit`
Question: The anomaly reveal arrives right after deep repair language and adds `navigation logs`, `farm emergency`, and `navigation AI` quickly. Consider one softer bridge sentence.
Excerpt: "ORION's navigation logs start throwing warnings that do not belong to a farm emergency."

## Possible Above-B2 English

- [ ] `section_7_exit_medical`
Question: "partial recovery plus distance from liability now counts as a plan" is sharp, but abstract. Consider a simpler corporate-joke phrasing.
Excerpt: "Someone in Compliance has concluded that partial recovery plus distance from liability now counts as a plan."

- [ ] `section_8_exit_clean`
Question: "eighty-five percent is emotionally close enough to one hundred" is readable, but metaphor-heavy. Check whether it stays inside the intended B2 ceiling.
Excerpt: "This is the part where management says eighty-five percent is emotionally close enough to one hundred."

- [ ] `section_8_exit_debt`
Question: "technically up and emotionally one sharp tap from another incident" is vivid, but also idiomatic and abstract. Consider whether this is too layered for the target reader.
Excerpt: "...the system is technically up and emotionally one sharp tap from another incident."

- [ ] `section_10_debt`
Question: "partly original sin and partly tonight's improvisation" is memorable, but the metaphor may be above the normal prose level for a technical crisis explanation.
Excerpt: "...the final stall is partly original sin and partly tonight's improvisation."

- [ ] `ending_3`
Question: `backlog integrity` sounds natural to engineers, but it is still specialized project language in a reflective ending beat.
Excerpt: "Official note: caution preserved both life and backlog integrity."

- [ ] `ending_4`
Question: "Secondary anomaly postponed pending normal business hours and future regret" is funny, but it layers bureaucracy and irony in one sentence. Check whether the tone is intentionally denser than the rest of the ending.
Excerpt: "Secondary anomaly postponed pending normal business hours and future regret."

- [ ] `ending_5`
Question: "retrospective on hidden autopilot conspiracies" stacks process language, irony, and plot reveal in the final line. Decide whether that complexity is intentional.
Excerpt: "Alex asks whether next quarter includes time for a retrospective on hidden autopilot conspiracies."
