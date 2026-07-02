# Logical Design
we have a game
The Game is a graph of stages which user navigates through interacting with individual stages

# Game Progress
User progresses through stages
Navigation between stages can depend on user answers

# Flags
Game state includes numeric flags.
Flags are addressed by string id and default to `0` when absent.
Each choice action or task answer can modify flags using one of these operations:
- `set`: assign a numeric value to a flag
- `remove`: delete the flag so later reads fall back to `0`
- `add`: increment or decrement the current numeric value

Navigation conditions and stage modifiers are numeric expressions evaluated against the current flag state.

# Stages
each stage is either 
- a task stage 
- a choice stage
- a conclusion stage

## Choice Stage Structure
- title
- intro narrative
- dialogue
- choice item
- conclusion (which is provided by choice)

### Choice Structure
- title
- several choice actions 
- scoring for each action according to scoring criteria defined

### Choice Action Structure
- id
- text
- description
- conclusion
- flag modifications

### Behavior
Outcome of choice item can impact which next stage is rendered for the user
Choice actions can also mutate flags, and later navigation can branch on those flags.

## Task Stage Structure
- title
- intro narrative
- dialogue
- task pool
- task stage conclusion 

### Task Pool Structure
Task pool contains several tasks. One of them will be selected by the engine when the game is rendered.


### Task Structure
- task intro
- code snippet
- question
- 4 answers of which 1 is correct, 2 are wrong and 1 is an override
- scoring for each task according to scoring criteria defined

### Task Answer Structure
- id
- text
- description
- outcome (`solved`, `incorrect`, `override`)
- flag modifications

### Task Stage Conclusion Structure
Each task stage conclusion has 3 options
- for correct answer
- for incorrect answer
- for override answer

### Behavior
Outcome of task pool can impact which next stage is rendered for the user
Task answers can also mutate flags, and those flags can drive later navigation or stage modifiers.

## Conclusion Stage Structure
- title
- text

# Rendering Rules

## Common Rendering Rules
- only render text which is present in the game design files, don't invent on the fly
- when evaluating navigation or modifiers, read missing flags as `0`

## dialogue rendering rules

## Rendering Choice Stage
- start from a clean screen
- render stage title
- render intro
- render dialogue
- render continue button and wait for user tap
- render choice title
- render choice options as single choice - text comes from choice action text
- render "Next" button and wait for user to make a selection and tap next
- render conclusion for the choice action selected by user

## Rendering Task Stage
- start from a clean screen
- render stage title
- render intro
- render dialogue
- render continue button and wait for user tap
- pick a random task from task pool
- render task intro
- render code snippet
- render answers as single choice
- render "Next" button and wait for user to make a selection and tap next
- render conclusion for the  answer selected by user. Take conclusion from Task Stage configs based on if answer was correct, wrong or override

## Rendering Conclusion Stage
- render title
- render text
- render accumulated scores
