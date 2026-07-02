---
id: section_5_cargo
kind: branch_choice
---

# Drone Preparation

## Prompt
Choose how Alex prepares Shmiel for the outside cargo-side segment.

## Actions
```yaml
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
  conclusion: Vex loads a careful patch and the drone settles into a less offended
    idle pattern. The hatch can cycle once the outside follow profile stops arguing
    with the cargo clamp package.
  flag_modifications:
  - flag: drone_patch
    operation: set
    value: 1
  - flag: drone_override
    operation: remove
- id: override_drone
  text: Hard Override
  description: Force the drone into follow mode and deal with side effects later.
  conclusion: Vex slams the override path through and the drone obeys with the nervous
    energy of a badly supervised forklift. The hatch can cycle, provided Alex fixes
    the follow profile before the override starts improvising.
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
| override_drone | -0.4 | -0.5 | 0.2 |
