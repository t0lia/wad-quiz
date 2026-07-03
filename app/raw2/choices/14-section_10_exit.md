id: section_10_exit
kind: branch_choice
title: Final Decision
prompt: Sector A is alive again. Sign off now, or keep digging into the new anomaly?
actions:
- id: stop_after_10
  text: Sign Off Now
  description: End the incident with the sector restored and leave the new logs untouched.
  conclusion: Alex closes the incident while the strange navigation warnings keep blinking in the corner of the screen. The ship is powered, alive, and still hiding something.
  scores:
    technical_skills: 0.0
    dedication: -0.2
    social_capital: 0.2
- id: continue_after_10
  text: Keep Digging
  description: Follow the fresh anomaly into whatever the ship has been hiding.
  conclusion: Alex keeps the session open and pulls the new log thread until the whole room changes shape. The technical incident is over. The larger story is not.
  scores:
    technical_skills: 0.3
    dedication: 0.3
    social_capital: -0.1
