id: section_5_medical_fallout
kind: branch_choice
title: Drone Preparation
prompt: Choose how Alex prepares Shmiel for the outside medical-side segment after the quarantine mess.
actions:
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
  conclusion: Alex finally takes the careful option, and everyone in the room notices. The shell profile still needs one real fix before the outer hatch can open without embarrassment.
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
  description: Force the drone into follow mode and accept one more shortcut.
  conclusion: Alex doubles down on urgency, and even the drone seems to find that suspicious. The airlock can cycle, but the next payload problem will now arrive inside a far less patient atmosphere.
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
    social_capital: -0.2
