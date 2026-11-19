import { useSyncExternalStore } from 'react'
import type { TypeId } from '../data/schema'
import type { Lang } from '../runner/starter'

const KEY = 'leetmon-progress-v1'

export interface Progress {
  version: 1
  /** problem id -> timestamp of first catch */
  caught: Record<string, number>
  /** problem id -> number of submissions ("throws") */
  attempts: Record<string, number>
  /** problem id -> number of failed submissions */
  fails: Record<string, number>
  /** problems you've encountered at least once */
  seen: Record<string, true>
  /** problems where you revealed the hint */
  hints: Record<string, true>
  badges: TypeId[]
  /** saved editor contents per problem and language */
  code: Record<string, Partial<Record<Lang, string>>>
  lang: Lang
  /** Elite Four members beaten in the current streak (0-4). */
  eliteIndex: number
  championAt: number | null
}

const fresh = (): Progress => ({
  version: 1,
  caught: {},
  attempts: {},
  fails: {},
  seen: {},
  hints: {},
  badges: [],
  code: {},
  lang: 'js',
  eliteIndex: 0,
  championAt: null,
})

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fresh()
    return { ...fresh(), ...(JSON.parse(raw) as Partial<Progress>) }
  } catch {
    return fresh()
  }
}

let state: Progress = load()
const listeners = new Set<() => void>()

function set(next: Progress) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked: keep going in memory */
  }
  listeners.forEach((l) => l())
}

function update(fn: (draft: Progress) => void) {
  const draft: Progress = structuredClone(state)
  fn(draft)
  set(draft)
}

export const progress = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  markSeen: (id: string) => {
    if (!state.seen[id]) update((d) => void (d.seen[id] = true))
  },
  recordSubmit: (id: string, passed: boolean) =>
    update((d) => {
      d.attempts[id] = (d.attempts[id] ?? 0) + 1
      if (!passed) d.fails[id] = (d.fails[id] ?? 0) + 1
      if (passed && !d.caught[id]) d.caught[id] = Date.now()
    }),
  useHint: (id: string) => update((d) => void (d.hints[id] = true)),
  addBadge: (type: TypeId) =>
    update((d) => {
      if (!d.badges.includes(type)) d.badges.push(type)
    }),
  saveCode: (id: string, lang: Lang, code: string) =>
    update((d) => {
      d.code[id] = { ...d.code[id], [lang]: code }
    }),
  clearCode: (id: string, lang: Lang) =>
    update((d) => {
      if (d.code[id]) delete d.code[id][lang]
    }),
  setLang: (lang: Lang) => update((d) => void (d.lang = lang)),
  setEliteIndex: (n: number) => update((d) => void (d.eliteIndex = n)),
  becomeChampion: () => update((d) => void (d.championAt = d.championAt ?? Date.now())),
  resetAll: () => set(fresh()),
}

export function useProgress(): Progress {
  return useSyncExternalStore(progress.subscribe, progress.get, progress.get)
}
