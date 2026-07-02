import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const srcRoot = fileURLToPath(new URL('.', import.meta.url))
const machine1Dir = path.join(srcRoot, 'machine1')
const machine1IndexPath = path.join(machine1Dir, 'index.ts')

test('generated machine1 output exists', () => {
  assert.equal(existsSync(machine1Dir), true)
  assert.equal(existsSync(machine1IndexPath), true)

  const generatedFiles = readdirSync(machine1Dir).filter((entry) => entry.endsWith('.ts'))
  assert.ok(generatedFiles.length > 1)
})

test('generated machine1 index exports runtime machine and states', () => {
  const indexContents = readFileSync(machine1IndexPath, 'utf8')

  assert.match(indexContents, /export const allMachineStates\s*=\s*\{/) 
  assert.match(indexContents, /export const hydroMachine\s*=\s*baseMachine\.provide\(/)
  assert.match(indexContents, /initial:\s*'section_1'/)
  assert.match(indexContents, /flagOps:/)
})