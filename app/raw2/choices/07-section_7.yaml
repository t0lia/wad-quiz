id: section_7
kind: branch_choice
title: EVA Plan
prompt: Choose how Alex handles the outside segment.
actions:
- id: team_eva
  text: Shared Tether with Ray
  description: Take Ray on support and split the outside work.
  conclusion: Ray clips into the shared plan and starts mirroring Alex's checklist from the inner panel. The ship offers one polite chance to stop before the deeper outside repair begins.
  flag_modifications:
  - flag: eva_team
    operation: set
    value: 1
  - flag: eva_solo
    operation: remove
  scores:
    technical_skills: 0.1
    dedication: 0.2
    social_capital: 0.7
- id: solo_eva
  text: Solo Tether
  description: Go alone and keep every decision in one suit.
  conclusion: Alex takes the single tether and leaves Ray at the hatch with a look that means I told you so in advance. The ship offers one polite chance to stop before Alex has to earn the rest of the night.
  flag_modifications:
  - flag: eva_solo
    operation: set
    value: 1
  - flag: eva_team
    operation: remove
  - flag: debt_count
    operation: add
    value: 1
  scores:
    technical_skills: 0.2
    dedication: 0.1
    social_capital: -0.5
