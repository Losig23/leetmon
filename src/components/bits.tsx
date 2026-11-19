import { marked } from 'marked'
import { useMemo } from 'react'
import type { Difficulty, Problem, TypeId } from '../data/schema'
import { TYPE_BY_ID } from '../data/types'
import { Creature } from './Creature'

/** In-game names (kept original; no official franchise terms). */
export const LABELS = {
  game: 'LeetMon',
  dex: 'LeetDex',
  ball: 'Code Capsule',
}

export function TypeChip({ type, small }: { type: TypeId; small?: boolean }) {
  const t = TYPE_BY_ID[type]
  return (
    <span className={`type-chip${small ? ' small' : ''}`} style={{ background: t.color }}>
      {t.name}
    </span>
  )
}

export function DifficultyTag({ d }: { d: Difficulty }) {
  return <span className={`diff diff-${d.toLowerCase()}`}>{d}</span>
}

export function ProblemSprite({
  problem,
  size,
  silhouette,
  className,
}: {
  problem: Problem
  size?: number
  silhouette?: boolean
  className?: string
}) {
  return (
    <Creature
      seed={problem.id}
      color={TYPE_BY_ID[problem.type].color}
      accent={problem.secondaryType ? TYPE_BY_ID[problem.secondaryType].color : undefined}
      size={size}
      silhouette={silhouette}
      className={className}
    />
  )
}

export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => marked.parse(text, { async: false }) as string, [text])
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
}

/** Original catch device: a two-tone code capsule with a curly-brace emblem. */
export function CodeBall({ size = 64, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <g transform="rotate(-35 32 32)">
        <path d="M32 14 H18 a18 18 0 0 0 0 36 H32 Z" fill="#7b5cff" stroke="#1b1b2b" strokeWidth="3" />
        <path d="M32 14 H46 a18 18 0 0 1 0 36 H32 Z" fill="#f5f2ea" stroke="#1b1b2b" strokeWidth="3" />
        <rect x="12" y="19" width="10" height="4" rx="2" fill="#fff" opacity="0.45" />
        <text x="45" y="37" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#7b5cff" fontFamily="monospace">
          {'{}'}
        </text>
      </g>
    </svg>
  )
}

export function Dialog({ speaker, text }: { speaker: string; text: string }) {
  return (
    <div className="dialog-box">
      <div className="dialog-speaker">{speaker}</div>
      <p>{text}</p>
    </div>
  )
}
