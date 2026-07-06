import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { formatEndingProfileLine, resolveEndingProfile } from './storyLogic'

const srcRoot = fileURLToPath(new URL('.', import.meta.url))
const machine1Dir = path.join(srcRoot, 'machine1')
const machine1IndexPath = path.join(machine1Dir, 'index.ts')

test('generated machine1 output exists', () => {
  assert.equal(existsSync(machine1Dir), true)
  assert.equal(existsSync(machine1IndexPath), true)

  const generatedFiles = readdirSync(machine1Dir).filter((entry) => entry.endsWith('.ts'))
  assert.ok(generatedFiles.length > 1)
})

test('resolveEndingProfile maps score bands to archetypes', () => {
  const profile = resolveEndingProfile({ technical: 3, dedication: 3, social: 3 })
  assert.equal(profile.category, 'Sapphire')
  assert.equal(profile.archetype, 'Trusted Stabilizer')
  assert.match(profile.reading, /Delivers the fix/)
})

test('formatEndingProfileLine combines category archetype and reading', () => {
  const line = formatEndingProfileLine({
    category: 'Amber',
    archetype: 'Developing Contributor',
    reading: 'Mixed signals dominate.',
  })
  assert.equal(line, 'Amber: Developing Contributor — Mixed signals dominate.')
})

