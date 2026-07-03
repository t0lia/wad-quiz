id: section_5_cargo
kind: branch_choice
title: Drone Preparation
prompt: Choose how Alex prepares Shmiel for the outside cargo-side segment.
actions:
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
  conclusion: Vex loads a careful patch and the drone settles into a less offended idle pattern. The hatch can cycle once the outside follow profile stops arguing with the cargo clamp package.
  flag_modifications:
  - flag: drone_patch
    operation: set
    value: 1
  - flag: drone_override
    operation: remove
  scores:
    technical_skills: 0.5
    dedication: 0.4
    social_capital: 0.1
- id: override_drone
  text: Hard Override
  description: Force the drone into follow mode and deal with side effects later.
  conclusion: Vex slams the override path through and the drone obeys with the nervous energy of a badly supervised forklift. The hatch can cycle, provided Alex fixes the follow profile before the override starts improvising.
  flag_modifications:
  - flag: drone_override
    operation: set
    value: 1
  - flag: drone_patch
    operation: remove
  - flag: debt_count
    operation: add
    value: 1
  scores:
    technical_skills: -0.4
    dedication: -0.5
    social_capital: 0.2
