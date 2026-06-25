import { load } from 'js-yaml'
import type { StoryDocument } from './types/yaml-story'
import rawYaml from '../../data/06-gn_structure.yaml?raw'

export const storyDoc = load(rawYaml) as StoryDocument
