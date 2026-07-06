id: section_3
kind: branch_choice
title: Bandages or cargo containers?
prompt: 'Guide Alex towards Airlock #4'
actions:
- id: take_cargo_route
  text: Alex will see his luck through the Cargo management compartment
  description: Pass through freight operations and lean on Tony for access.
  conclusion: Alex cuts through freight corridors where everything smells like dust, metal, and accounting. Tony is already waiting by the freight checkpoint with a pass that should have worked the first time.
  flag_modifications:
  - flag: route_cargo
    operation: set
    value: 1
  - flag: route_medical
    operation: remove
  scores:
    technical_skills: 0.1
    dedication: 0.2
    social_capital: 0.0
- id: take_medical_route
  text: None has been sick lately so route through Medical looks like a safer bet
  description: Cut through the food block and let Clara solve the human paperwork.
  conclusion: Alex cuts through steam, vending noise, and medical scanners that look too awake for this hour. Clara gets Alex to the quarantine side gate, where the paperwork is present, signed, and still somehow failing to unlock the door.
  flag_modifications:
  - flag: route_medical
    operation: set
    value: 1
  - flag: route_cargo
    operation: remove
  scores:
    technical_skills: 0.0
    dedication: 0.1
    social_capital: 0.3
