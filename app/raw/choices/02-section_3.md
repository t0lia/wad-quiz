---
id: section_3
kind: branch_choice
---

# Bandages or cargo containers?

## Prompt
Guide Alex towards Airlock #4

## Actions
```yaml
- id: take_cargo_route
  text: 'Alex will see his luck through the Cargo management compartment'
  description: 'Pass through freight operations and lean on Tony for access.'
  conclusion: |-
    Alex cuts through freight corridors where everything smells like dust, metal, and accounting.
    
    Tony is already waiting by the freight checkpoint with a pass that should have worked the first time.
- id: take_medical_route
  text: 'None has been sick lately so route through Medical looks like a safer bet'
  description: 'Cut through the food block and let Clara solve the human paperwork.'
  conclusion: |-
    Alex cuts through steam, vending noise, and medical scanners that look too awake for this hour.
    
    Clara gets Alex to the quarantine side gate, where the paperwork is present, signed, and still somehow failing to unlock the door.
```

## Scoring
| ACTION_ID | TECH | DED | SOC |
|-----------|------|-----|-----|
| take_cargo_route | 0.1 | 0.2 | 0 |
| take_medical_route | 0 | 0.1 | 0.3 |
