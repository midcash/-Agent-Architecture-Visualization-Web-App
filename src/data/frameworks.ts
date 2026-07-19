import type { FrameworkPattern } from '../types/architecture'

export interface FrameworkEntry {
  id: string
  name: string
  version: string
  description: string
  url: string
  pattern: FrameworkPattern
  patternLabel: string
  category: string
  file: string
  color: string
  moduleCount: number
  flowCount: number
  phaseCount: number
}

export const frameworks: FrameworkEntry[] = [
  {
    id: 'langgraph',
    name: 'LangGraph',
    version: '0.4+',
    description: 'State graph execution model inspired by Pregel — super-steps with message-passing between nodes.',
    url: 'https://github.com/langchain-ai/langgraph',
    pattern: 'state-graph',
    patternLabel: 'State Graph (Pregel)',
    category: 'orchestration',
    file: 'langgraph.json',
    color: '#7c3aed',
    moduleCount: 7,
    flowCount: 9,
    phaseCount: 3,
  },
  {
    id: 'crewai',
    name: 'CrewAI',
    version: '0.100+',
    description: 'Role-based multi-agent with event-driven flow orchestration — decorator-driven @start/@listen/@router.',
    url: 'https://github.com/crewAIInc/crewAI',
    pattern: 'role-based',
    patternLabel: 'Role-Based + Event-Driven',
    category: 'multi-agent',
    file: 'crewai.json',
    color: '#2563eb',
    moduleCount: 8,
    flowCount: 10,
    phaseCount: 3,
  },
  {
    id: 'autogen',
    name: 'AutoGen',
    version: '0.7+',
    description: 'Actor model with pub/sub messaging — agents communicate via async topics with group chat coordination.',
    url: 'https://github.com/microsoft/autogen',
    pattern: 'actor-model',
    patternLabel: 'Actor Model + Pub/Sub',
    category: 'multi-agent',
    file: 'autogen.json',
    color: '#0891b2',
    moduleCount: 7,
    flowCount: 8,
    phaseCount: 3,
  },
  {
    id: 'openai-agents-sdk',
    name: 'OpenAI Agents SDK',
    version: '0.1+',
    description: 'Handoff-based agent architecture (Swarm) — agents dynamically delegate to specialists via handoff primitives.',
    url: 'https://github.com/openai/openai-agents-python',
    pattern: 'handoff',
    patternLabel: 'Handoff (Swarm)',
    category: 'orchestration',
    file: 'openai-agents-sdk.json',
    color: '#10b981',
    moduleCount: 7,
    flowCount: 8,
    phaseCount: 2,
  },
  {
    id: 'metagpt',
    name: 'MetaGPT',
    version: '0.8+',
    description: 'SOP-based multi-agent pipeline — applies Standard Operating Procedures to simulate a software company.',
    url: 'https://github.com/FoundationAgents/MetaGPT',
    pattern: 'sop-pipeline',
    patternLabel: 'SOP Pipeline',
    category: 'multi-agent',
    file: 'metagpt.json',
    color: '#f59e0b',
    moduleCount: 8,
    flowCount: 9,
    phaseCount: 4,
  },
  {
    id: 'agno',
    name: 'Agno',
    version: '1.0+',
    description: 'Component-based modular agent — clean separation into Brain (model), Body (tools), Knowledge, Storage, Memory.',
    url: 'https://github.com/agno-agi/agno',
    pattern: 'component-based',
    patternLabel: 'Component-Based',
    category: 'agent-framework',
    file: 'agno.json',
    color: '#ec4899',
    moduleCount: 9,
    flowCount: 12,
    phaseCount: 2,
  },
  {
    id: 'dify',
    name: 'Dify',
    version: '1.0+',
    description: 'Visual DAG platform with queue-based execution engine — decoupled front-end canvas and back-end Python runtime.',
    url: 'https://github.com/langgenius/dify',
    pattern: 'visual-dag',
    patternLabel: 'Visual DAG + Strategies',
    category: 'platform',
    file: 'dify.json',
    color: '#6366f1',
    moduleCount: 13,
    flowCount: 17,
    phaseCount: 2,
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    version: '2.1+',
    description: 'Master-loop architecture with tool orchestration — single-threaded while-loop agent, subagent dispatch, context compaction, async dual-buffer queue for real-time steering.',
    url: 'https://code.claude.com/docs/en/how-claude-code-works',
    pattern: 'master-loop',
    patternLabel: 'Master Loop + Tools',
    category: 'coding-agent',
    file: 'claude-code.json',
    color: '#d97706',
    moduleCount: 10,
    flowCount: 14,
    phaseCount: 3,
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    version: '2025+',
    description: 'Hub-and-spoke agent platform — gateway/runtime split, 40+ messaging channels, 75+ tools, Docker sandbox, layered memory (FTS5 + vector + knowledge graph).',
    url: 'https://github.com/codextech/openclaw-handbook',
    pattern: 'hub-and-spoke',
    patternLabel: 'Hub & Spoke',
    category: 'platform',
    file: 'openclaw.json',
    color: '#dc2626',
    moduleCount: 11,
    flowCount: 15,
    phaseCount: 3,
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    version: '0.13+',
    description: 'ReAct-loop agent with self-learning skill system — auto-extracts reusable SKILL.md from completed tasks, 70+ tools, 6 terminal backends, 18+ LLM providers.',
    url: 'https://github.com/NousResearch/hermes-agent',
    pattern: 'react-loop',
    patternLabel: 'ReAct + Skills',
    category: 'agent-framework',
    file: 'hermes.json',
    color: '#8b5cf6',
    moduleCount: 10,
    flowCount: 13,
    phaseCount: 3,
  },
  {
    id: 'pi-agent',
    name: 'Pi Agent',
    version: '0.8+',
    description: 'Layered TypeScript monorepo — strict 4-layer architecture (AI → Agent Core → Coding Agent → TUI), explicit context control, self-extensible tool system.',
    url: 'https://github.com/badlogic/pi-mono',
    pattern: 'layered',
    patternLabel: 'Layered ReAct',
    category: 'coding-agent',
    file: 'pi-agent.json',
    color: '#14b8a6',
    moduleCount: 9,
    flowCount: 11,
    phaseCount: 3,
  },
]

export function getFrameworkById(id: string): FrameworkEntry | undefined {
  return frameworks.find((f) => f.id === id)
}

export function getFrameworkByFile(file: string): FrameworkEntry | undefined {
  return frameworks.find((f) => f.file === file)
}
