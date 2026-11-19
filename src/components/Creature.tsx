// Procedural placeholder creatures: same seed -> same critter. Original art, no sprites.
import type { ReactNode } from 'react'

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let a = seed || 1
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const c = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)))
  const r = c((n >> 16) & 255)
  const g = c((n >> 8) & 255)
  const b = c(n & 255)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/** Smooth closed blob through points using Catmull-Rom -> cubic Bézier. */
function blobPath(pts: [number, number][]): string {
  const n = pts.length
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`
  }
  return d + 'Z'
}

interface Props {
  seed: string
  color: string
  accent?: string
  size?: number
  silhouette?: boolean
  className?: string
}

export function Creature({ seed, color, accent, size = 96, silhouette = false, className }: Props) {
  const r = rng(hashString(seed))
  const pick = <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)]

  const cx = 50
  const cy = 58
  const rx = 26 + r() * 8
  const ry = 22 + r() * 8
  const pts: [number, number][] = []
  const N = 9
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2
    const wobble = 0.85 + r() * 0.25
    pts.push([cx + Math.cos(a) * rx * wobble, cy + Math.sin(a) * ry * wobble])
  }
  const top = cy - ry

  const body = silhouette ? '#1d1d2e' : color
  const dark = silhouette ? '#1d1d2e' : shade(color, -0.25)
  const light = silhouette ? '#1d1d2e' : shade(color, 0.28)
  const acc = silhouette ? '#1d1d2e' : accent ?? shade(color, -0.12)

  const topper = pick(['ears', 'horns', 'antenna', 'leaf', 'spikes', 'none'])
  const eyes = pick([1, 2, 2, 2, 3])
  const mouth = pick(['smile', 'o', 'fang', 'grin'])
  const hasFeet = r() > 0.25
  const hasTail = r() > 0.5
  const hasCheeks = r() > 0.4
  const spots = r() > 0.6 ? 2 + Math.floor(r() * 3) : 0
  const eyeY = cy - ry * 0.25
  const eyeSpread = 7 + r() * 5
  const eyeR = 4 + r() * 2.5

  const parts: ReactNode[] = []

  if (hasTail) {
    const side = r() > 0.5 ? 1 : -1
    const tx = cx + side * rx * 0.9
    parts.push(
      <path
        key="tail"
        d={`M${tx},${cy + 6} q${side * 16},-4 ${side * 14},-20 q${-side * 2},10 ${-side * 12},14`}
        fill={acc}
        stroke="#111"
        strokeWidth={2}
      />,
    )
  }

  if (topper === 'ears') {
    parts.push(
      <path key="el" d={`M${cx - 16},${top + 6} l-6,-16 l14,8 z`} fill={acc} stroke="#111" strokeWidth={2} />,
      <path key="er" d={`M${cx + 16},${top + 6} l6,-16 l-14,8 z`} fill={acc} stroke="#111" strokeWidth={2} />,
    )
  } else if (topper === 'horns') {
    parts.push(
      <path key="hl" d={`M${cx - 10},${top + 4} q-4,-14 -12,-16 q6,8 4,18 z`} fill="#f4ecd0" stroke="#111" strokeWidth={2} />,
      <path key="hr" d={`M${cx + 10},${top + 4} q4,-14 12,-16 q-6,8 -4,18 z`} fill="#f4ecd0" stroke="#111" strokeWidth={2} />,
    )
  } else if (topper === 'antenna') {
    parts.push(
      <line key="al" x1={cx} y1={top + 4} x2={cx + 4} y2={top - 14} stroke="#111" strokeWidth={2} />,
      <circle key="ab" cx={cx + 4} cy={top - 16} r={4} fill={silhouette ? body : '#ffe066'} stroke="#111" strokeWidth={2} />,
    )
  } else if (topper === 'leaf') {
    parts.push(
      <path key="leaf" d={`M${cx},${top + 4} q-2,-16 12,-20 q-2,14 -12,20 z`} fill={silhouette ? body : '#5fbf5f'} stroke="#111" strokeWidth={2} />,
    )
  } else if (topper === 'spikes') {
    parts.push(
      <path
        key="sp"
        d={`M${cx - 14},${top + 8} l4,-12 l5,9 l5,-12 l5,12 l5,-9 l4,12 z`}
        fill={acc}
        stroke="#111"
        strokeWidth={2}
      />,
    )
  }

  if (hasFeet) {
    parts.push(
      <ellipse key="fl" cx={cx - 12} cy={cy + ry * 0.95} rx={7} ry={4} fill={dark} stroke="#111" strokeWidth={2} />,
      <ellipse key="fr" cx={cx + 12} cy={cy + ry * 0.95} rx={7} ry={4} fill={dark} stroke="#111" strokeWidth={2} />,
    )
  }

  parts.push(<path key="body" d={blobPath(pts)} fill={body} stroke="#111" strokeWidth={2.5} />)
  if (!silhouette) {
    parts.push(<ellipse key="belly" cx={cx} cy={cy + ry * 0.35} rx={rx * 0.5} ry={ry * 0.4} fill={light} opacity={0.9} />)
    for (let i = 0; i < spots; i++) {
      parts.push(
        <circle
          key={`s${i}`}
          cx={cx + (r() - 0.5) * rx * 1.2}
          cy={cy + (r() - 0.6) * ry * 0.9}
          r={1.5 + r() * 2.5}
          fill={dark}
          opacity={0.55}
        />,
      )
    }
    const eyeXs = eyes === 1 ? [cx] : eyes === 2 ? [cx - eyeSpread, cx + eyeSpread] : [cx - eyeSpread - 2, cx, cx + eyeSpread + 2]
    eyeXs.forEach((ex, i) => {
      const er = eyes === 1 ? eyeR + 2 : eyeR
      parts.push(
        <g key={`eye${i}`}>
          <circle cx={ex} cy={eyeY} r={er} fill="#fff" stroke="#111" strokeWidth={1.8} />
          <circle cx={ex + 1} cy={eyeY + 0.5} r={er * 0.5} fill="#111" />
          <circle cx={ex + 2} cy={eyeY - 1} r={er * 0.18} fill="#fff" />
        </g>,
      )
    })
    if (hasCheeks) {
      parts.push(
        <circle key="cl" cx={cx - eyeSpread - 6} cy={eyeY + 8} r={3} fill="#ff7b9c" opacity={0.7} />,
        <circle key="cr" cx={cx + eyeSpread + 6} cy={eyeY + 8} r={3} fill="#ff7b9c" opacity={0.7} />,
      )
    }
    const my = eyeY + 11
    if (mouth === 'smile') parts.push(<path key="m" d={`M${cx - 5},${my} q5,5 10,0`} fill="none" stroke="#111" strokeWidth={2} strokeLinecap="round" />)
    if (mouth === 'o') parts.push(<ellipse key="m" cx={cx} cy={my + 1} rx={2.5} ry={3} fill="#5a1a2a" stroke="#111" strokeWidth={1.5} />)
    if (mouth === 'fang')
      parts.push(
        <g key="m">
          <path d={`M${cx - 6},${my} q6,4 12,0`} fill="none" stroke="#111" strokeWidth={2} strokeLinecap="round" />
          <path d={`M${cx - 3},${my + 1.5} l1.5,3 l1.5,-2.5`} fill="#fff" stroke="#111" strokeWidth={1} />
        </g>,
      )
    if (mouth === 'grin')
      parts.push(<path key="m" d={`M${cx - 7},${my - 1} q7,8 14,0 z`} fill="#5a1a2a" stroke="#111" strokeWidth={1.8} />)
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={silhouette ? 'Unknown creature' : 'Creature'}
    >
      {parts}
    </svg>
  )
}
