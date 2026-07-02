---
id: section_5_cargo_fallout
kind: branch_choice
---

# Drone Preparation

## Prompt
Choose how Alex prepares Shmiel for the outside cargo-side segment after the messy gate entry.

## Actions
```yaml
- id: patch_drone
  text: Software Patch
  description: Update the drone properly before opening the hatch.
  conclusion: 'Alex chooses the slower patch and buys one honest component inside
    an increasingly dishonest evening.


    If the profile payload behaves, the airlock may still forgive the rest.'
  flag_modifications:
  - flag: drone_patch
    operation: set
    value: 1
  - flag: drone_override
    operation: remove
- id: override_drone
  text: Hard Override
  description: Force the drone into follow mode and accept one more shortcut.
  conclusion: 'Alex chooses speed again, and Vex decides that judgment can wait until
    everyone is back inside with all limbs attached.


    The hatch can cycle, but the drone link now carries the moral texture of wet duct
    tape.'
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
