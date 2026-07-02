---
id: section_5_medical
kind: branch_choice
---

# Drone Preparation

## Prompt
Choose how Alex prepares Shmiel for the outside medical-side segment.

## Actions
```yaml
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
  conclusion: 'Vex loads the clean patch and the drone settles into a sterile idle
    pattern that feels almost respectable.


    The hatch can cycle once the shell profile and the beacon profile agree on the
    same naming scheme.'
  flag_modifications:
  - flag: drone_patch
    operation: set
    value: 1
  - flag: drone_override
    operation: remove
- id: override_drone
  text: Hard Override
  description: Force the drone into follow mode and deal with side effects later.
  conclusion: 'Vex forces the override through and the drone accepts it with the tense
    obedience of a machine filing a complaint internally.


    The hatch can cycle if Alex fixes the profile before the shell starts disobeying
    in public.'
  flag_modifications:
  - flag: drone_override
    operation: set
    value: 1
  - flag: drone_patch
    operation: remove
  - flag: debt_count
    operation: add
    value: 1
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| patch_drone | 0.5 | 0.4 | 0.1 |
| override_drone | -0.4 | -0.5 | -0.2 |
