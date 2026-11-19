// Data schema for LeetMon problems. See README.md ("Adding a problem") for a walkthrough.

export type TypeId =
  | 'arrays'
  | 'two-pointers'
  | 'sliding-window'
  | 'stack'
  | 'binary-search'
  | 'linked-list'
  | 'trees'
  | 'graphs'
  | 'backtracking'
  | 'dp'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/** wild = route encounter, gym = gym leader's problem, elite/champion = league. */
export type Role = 'wild' | 'gym' | 'elite' | 'champion'

/**
 * Parameter / return type strings. Any TypeScript type works for display, but these
 * ones get special treatment in the test harness:
 *   'ListNode'   – test data is an array, e.g. [1,2,3]; built into a linked list.
 *   'TreeNode'   – test data is a level-order array with nulls, e.g. [3,9,20,null,null,15,7].
 *   'ListNode[]' / 'TreeNode[]' – arrays of the above.
 * Return values of those types are serialized back to arrays before comparing.
 */
export interface Param {
  name: string
  type: string
}

export interface FunctionSignature {
  kind: 'function'
  /** Name of the function the user must define, e.g. 'twoSum'. */
  name: string
  params: Param[]
  returns: string
}

export interface MethodSignature {
  name: string
  params: Param[]
  returns: string
}

/**
 * Design problems (Min Stack, LRU Cache...). Tests use LeetCode's format:
 *   args = [ ['MinStack','push','getMin'], [[], [5], []] ]
 *   expected = [null, null, 5]
 * The first op constructs the class; void methods should produce null.
 */
export interface ClassSignature {
  kind: 'class'
  className: string
  constructorParams: Param[]
  methods: MethodSignature[]
}

export type Signature = FunctionSignature | ClassSignature

export interface TestCase {
  /** Positional arguments for the function (or [ops, opArgs] for class problems). */
  args: unknown[]
  expected: unknown
  /** Optional explanation shown under the example. */
  explain?: string
}

/**
 * How output is compared with `expected`:
 *   exact          – deep equality (default)
 *   unordered      – top-level array order doesn't matter
 *   unorderedDeep  – order doesn't matter at the top level OR inside nested arrays
 *   float          – numbers compared with 1e-5 tolerance
 */
export type CompareMode = 'exact' | 'unordered' | 'unorderedDeep' | 'float'

export interface Problem {
  /** Unique slug, also used as the localStorage key. */
  id: string
  /** The original problem, so you can look it up. */
  leetcode: { number: number; title: string; slug: string }
  /** Invented creature name. */
  creature: string
  type: TypeId
  /** Elite Four problems mix two patterns. */
  secondaryType?: TypeId
  role: Role
  difficulty: Difficulty
  level: number
  /** Markdown. Written in our own words. Include constraints at the end. */
  statement: string
  signature: Signature
  /** Optional hand-written starters; otherwise generated from `signature`. */
  starter?: { js?: string; ts?: string }
  /** Shown in the statement AND run by the "Run" button. */
  examples: TestCase[]
  /** Run (together with the examples) by "Throw Pokéball". */
  hiddenTests: TestCase[]
  compare?: CompareMode
  /** Short nudge revealed by the hint button (the pattern name is shown too). */
  hint: string
  /** Reference solution in plain JavaScript. Verified by `npm run verify`. */
  solution: string
}
