import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toDirectedGraph } from 'xstate/graph'
import { hydroMachine } from '../src/machine.ts'

type DirectedGraphNode = {
  id: string
  children?: DirectedGraphNode[]
  edges?: Array<{
    source?: { id?: string }
    target?: { id?: string }
    transition?: unknown
  }>
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const publicOutputDir = join(__dirname, '..', 'public', 'diagrams')
const publicOutputMmd = join(publicOutputDir, 'hydroMachine.mmd')
const distOutputDir = join(__dirname, '..', 'dist', 'diagrams')
const distOutputMmd = join(distOutputDir, 'hydroMachine.mmd')

function shortStateId(stateId: string): string {
  const firstDot = stateId.indexOf('.')
  return firstDot >= 0 ? stateId.slice(firstDot + 1) : stateId
}

function collectNodes(graph: DirectedGraphNode): Map<string, string> {
  const nodes = new Map<string, string>()

  function visit(node: DirectedGraphNode): void {
    const stateId = shortStateId(node.id)
    nodes.set(node.id, stateId)

    for (const child of node.children ?? []) {
      visit(child)
    }
  }

  visit(graph)
  return nodes
}

function collectEdges(graph: DirectedGraphNode): Array<{ source: string; target: string; label: string }> {
  const edges: Array<{ source: string; target: string; label: string }> = []

function extractGuardSource(guard: unknown): string {
  if (typeof guard === 'string') {
    return guard.trim()
  }
  if (typeof guard === 'function') {
    return guard.toString().trim()
  }
  if (guard && typeof guard === 'object') {
    const maybeSource = (guard as { source?: unknown }).source
    if (typeof maybeSource === 'string') {
      return maybeSource.trim()
    }
  }
  return ''
}

function readEventLabel(transition: unknown): string {
  if (!transition || typeof transition !== 'object') {
    return ''
  }

  const candidate = transition as {
    eventType?: unknown
    event?: { type?: unknown }
    guard?: unknown
  }

  if (candidate.guard) {
    const guardSource = extractGuardSource(candidate.guard)
    if (guardSource) {
      const arrowIndex = guardSource.indexOf('=>')
      if (arrowIndex >= 0) {
        let body = guardSource.slice(arrowIndex + 2).trim()
        if (body.startsWith('{') && body.endsWith('}')) {
          body = body.slice(1, -1).trim()
        }
        if (body.startsWith('return ')) {
          body = body.slice(7).trim()
        }
        if (body.endsWith(';')) {
          body = body.slice(0, -1).trim()
        }
        body = body.replace(/"([^\"]*)"/g, "'$1'")
        return body
      }
      return guardSource.replace(/"([^\"]*)"/g, "'$1'")
    }
  }

  if (typeof candidate.eventType === 'string') {
    return candidate.eventType
  }
  if (candidate.event && typeof candidate.event.type === 'string') {
    return candidate.event.type
  }

  return ''
  }

  function visit(node: DirectedGraphNode): void {
    for (const edge of node.edges ?? []) {
      const sourceId = edge.source?.id
      const targetId = edge.target?.id
      if (!sourceId || !targetId) {
        continue
      }

      edges.push({
        source: sourceId,
        target: targetId,
        label: readEventLabel(edge.transition),
      })
    }

    for (const child of node.children ?? []) {
      visit(child)
    }
  }

  visit(graph)
  return edges
}

function escapeMermaidLabel(label: string): string {
  return label
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
}

function formatMermaidLabel(label: string): string {
  const escaped = escapeMermaidLabel(label)
  return `|"${escaped}"|`
}

function createMermaid(graph: DirectedGraphNode): string {
  const nodes = collectNodes(graph)
  const edges = collectEdges(graph)

  const nodeKeys = [...nodes.keys()].sort()
  const tokenByNodeId = new Map<string, string>()
  nodeKeys.forEach((nodeId, idx) => {
    tokenByNodeId.set(nodeId, `S${idx + 1}`)
  })

  const lines: string[] = []
  lines.push('flowchart TD')
  lines.push('  %% Generated from src/machine.ts (hydroMachine)')

  for (const nodeId of nodeKeys) {
    const token = tokenByNodeId.get(nodeId)
    const label = nodes.get(nodeId)
    if (!token || !label) {
      continue
    }

    lines.push(`  ${token}["${label}"]`)

    if (label.startsWith('task_')) {
      lines.push(`  class ${token} taskNode`)
    } else if (label.startsWith('ending_')) {
      lines.push(`  class ${token} endingNode`)
    } else if (label.startsWith('text_') || label === 'intro') {
      lines.push(`  class ${token} textNode`)
    }
  }

  const seen = new Set<string>()
  for (const edge of edges) {
    const sourceToken = tokenByNodeId.get(edge.source)
    const targetToken = tokenByNodeId.get(edge.target)
    if (!sourceToken || !targetToken) {
      continue
    }

    const edgeKey = `${sourceToken}->${targetToken}:${edge.label}`
    if (seen.has(edgeKey)) {
      continue
    }
    seen.add(edgeKey)

    const escapedLabel = escapeMermaidLabel(edge.label)
    if (escapedLabel) {
      lines.push(`  ${sourceToken} -->${formatMermaidLabel(edge.label)} ${targetToken}`)
    } else {
      lines.push(`  ${sourceToken} --> ${targetToken}`)
    }
  }

  lines.push('')
  lines.push('  classDef taskNode fill:#d9f5ff,stroke:#0b7285,stroke-width:2px,color:#073642')
  lines.push('  classDef textNode fill:#fff7db,stroke:#a07800,stroke-width:1px,color:#4d3a00')
  lines.push('  classDef endingNode fill:#e9f7ef,stroke:#2f9e44,stroke-width:2px,color:#1b5e20')

  return `${lines.join('\n')}\n`
}

async function main(): Promise<void> {
  const directedGraph = toDirectedGraph(hydroMachine) as DirectedGraphNode
  const mermaidText = createMermaid(directedGraph)

  await mkdir(distOutputDir, { recursive: true })
  await mkdir(publicOutputDir, { recursive: true })
  await writeFile(distOutputMmd, mermaidText, 'utf8')
  await writeFile(publicOutputMmd, mermaidText, 'utf8')

  console.log(`Mermaid diagram written: ${distOutputMmd}`)
  console.log(`Mermaid diagram written: ${publicOutputMmd}`)
}


main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error('Failed to generate Mermaid source:', message)
  process.exitCode = 1
})
