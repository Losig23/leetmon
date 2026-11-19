import type { Problem, TypeId } from '../schema'
import { arraysProblems } from './arrays'
import { backtrackingProblems } from './backtracking'
import { binarySearchProblems } from './binary-search'
import { dpProblems } from './dp'
import { graphsProblems } from './graphs'
import { leagueProblems } from './league'
import { linkedListProblems } from './linked-list'
import { slidingWindowProblems } from './sliding-window'
import { stackProblems } from './stack'
import { treesProblems } from './trees'
import { twoPointersProblems } from './two-pointers'

/** Order here = LeetDex order. To add a problem, add one entry to the matching file. */
export const PROBLEMS: Problem[] = [
  ...arraysProblems,
  ...twoPointersProblems,
  ...slidingWindowProblems,
  ...stackProblems,
  ...binarySearchProblems,
  ...linkedListProblems,
  ...treesProblems,
  ...graphsProblems,
  ...backtrackingProblems,
  ...dpProblems,
  ...leagueProblems,
]

export const PROBLEM_BY_ID: Record<string, Problem> = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]))

export const wildOfType = (type: TypeId) => PROBLEMS.filter((p) => p.type === type && p.role === 'wild')
export const gymOfType = (type: TypeId) => PROBLEMS.find((p) => p.type === type && p.role === 'gym')

/** Pokédex number: position in PROBLEMS, 1-based. */
export const dexNumber = (id: string) => PROBLEMS.findIndex((p) => p.id === id) + 1
