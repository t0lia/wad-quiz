# Hydroworld Tasks

This folder contains the pooled task bodies used by Hydroworld problem slots.

## Authoring Rules

- Keep one task per file.
- Prefix each filename with a number.
- Keep all task files flat in this folder. Do not create subdirectories.
- Keep narrative in the task minimal and local to the technical incident.
- Put prompt, snippet, and action options here.
- Add a scoring table for every action id in the task file.
- Do not put outcome prose here.
- Do not put slot branching here.

## Ownership Split

- Task markdown owns: prompt, snippet, actions, scoring deltas.
- Scenario YAML owns: section narrative, modifiers, `result_flag`, `action_outcomes`, and `conclusion.by_outcome` prose.
- Pool structure lives in [worlds/hydroworld/07-section_task_pools.yaml](worlds/hydroworld/07-section_task_pools.yaml) and [worlds/hydroworld/08-task_pools.yaml](worlds/hydroworld/08-task_pools.yaml).

## Validation

After editing a task file, validate by loading the live scenario:

```powershell
python -c "import scripts.hydroworld_demo as demo; demo.load_scenario_from_path('worlds/hydroworld/06-gn_structure.yaml'); print('scenario ok')"
```