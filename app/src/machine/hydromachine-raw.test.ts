import assert from 'node:assert/strict'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { parse as parseYaml } from 'yaml'

import { hydroMachine } from '../machine'

const rawRoot = fileURLToPath(new URL('../../raw', import.meta.url))
const reportPath = fileURLToPath(new URL('../../hydromachine-raw-report.txt', import.meta.url))

const TEXT_KEYS = new Set([
  'title',
  'text',
  'speaker',
  'content',
  'label',
  'prompt',
  'narrative',
  'closing_beat',
  'message',
  'body',
  'unit',
])

const SKIP_KEYS = new Set([
  'id',
  'image',
  'type',
  'variant',
  'meta',
  'stateId',
  'correctAnswer',
  'overrideAnswer',
  'resultFlag',
  'solvedTarget',
  'overrideTarget',
  'incorrectTarget',
])

function normalizeText(value: string) {
  return value.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim().toLowerCase()
}

function extractTextBlocks(value: string) {
  return value
    .split(/\n{2,}/)
    .filter(Boolean)
    .filter((block) => {
      const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
      if (normalizeText(block) === 'How should Alex fix this?') {
        return false
      }

      return !(lines.length > 1 && lines.every((line) => /^[A-Z][A-Z0-9_ ]+:\s/.test(line)))
    })
    .map(normalizeText)
    .filter(Boolean)
}

function listRawFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return listRawFiles(fullPath)
    }

    if (/\.(md|ya?ml)$/i.test(entry.name)) {
      return [fullPath]
    }

    return []
  })
}

function collectVisibleStrings(value: unknown, key?: string): string[] {
  if (typeof value === 'string') {
    if (!key || !TEXT_KEYS.has(key)) {
      return []
    }

    if (key === 'text' || key === 'prompt' || key === 'narrative' || key === 'message' || key === 'body' || key === 'closing_beat') {
      return extractTextBlocks(value)
    }

    return [normalizeText(value)]
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectVisibleStrings(entry, key))
  }

  if (!value || typeof value !== 'object') {
    return []
  }

  if ('speaker' in value && 'text' in value && typeof (value as any).speaker === 'string' && typeof (value as any).text === 'string') {
    return [normalizeText(`${String((value as any).speaker).toUpperCase()}: ${(value as any).text}`)]
  }

  return Object.entries(value).flatMap(([childKey, childValue]) => {
    if (SKIP_KEYS.has(childKey)) {
      return []
    }

    return collectVisibleStrings(childValue, childKey)
  })
}

function unique(values: string[]) {
  return [...new Set(values.map(normalizeText).filter(Boolean))]
}

function collectYamlStrings(value: unknown): string[] {
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectYamlStrings)
  }

  if (!value || typeof value !== 'object') {
    return []
  }

  if ('speaker' in value && 'text' in value && typeof (value as any).speaker === 'string' && typeof (value as any).text === 'string') {
    return [`${String((value as any).speaker).toUpperCase()}: ${(value as any).text}`]
  }

  return Object.values(value).flatMap(collectYamlStrings)
}

const rawTexts = unique(
  listRawFiles(rawRoot).map((filePath) => {
    const fileContents = readFileSync(filePath, 'utf8')

    if (/\.(ya?ml)$/i.test(filePath)) {
      return collectYamlStrings(parseYaml(fileContents)).join(' ')
    }

    return fileContents
  })
)

const machineText = unique(
  Object.values((hydroMachine as any).states ?? {}).flatMap((state: any) => collectVisibleStrings(state.meta))
)

const machineButtonTexts = unique(
  Object.values((hydroMachine as any).states ?? {}).flatMap((state: any) => {
    const options = state?.meta?.task?.options

    if (!Array.isArray(options)) {
      return []
    }

    return options.flatMap((option: { content?: unknown; label?: unknown; description?: unknown }) => {
      const values = [option.content, option.label, option.description].filter((value): value is string => typeof value === 'string')
      return values
    })
  })
)

test('hydroMachine text is authored in raw markdown and yaml', () => {
  const rawCorpus = rawTexts.join('\n')
  const missing = machineText.filter((text) => !rawCorpus.includes(text))
  const missingButtons = machineButtonTexts.filter((text) => !rawCorpus.includes(text))
  const extra = rawTexts.filter((text) => !machineText.some((candidate) => text.includes(candidate)))

  const summary = [
    `report path: ${reportPath}`,
    `hydroMachine text count: ${machineText.length}`,
    `hydroMachine button text count: ${machineButtonTexts.length}`,
    `raw text count: ${rawTexts.length}`,
    `missing machine snippets: ${missing.length}`,
    ...missing.slice(0, 10).map((entry) => `- machine missing in raw: ${entry}`),
    `missing button snippets: ${missingButtons.length}`,
    ...missingButtons.slice(0, 10).map((entry) => `- button missing in raw: ${entry}`),
    `unmatched raw excerpts: ${extra.length}`,
    ...extra.slice(0, 10).map((entry) => `- raw not represented in machine: ${entry.slice(0, 180)}`),
  ].join('\n')

  writeFileSync(reportPath, `${summary}\n`, 'utf8')
  console.error(summary)
  
  // Check both main text and button text
  if (missing.length > 0 || missingButtons.length > 0) {
    assert.fail(summary)
  }
})