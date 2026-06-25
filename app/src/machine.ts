import { storyDoc } from './story-loader'
import { buildMachineFromYaml } from './machine-builder'

export const hydroMachine = buildMachineFromYaml(storyDoc)
