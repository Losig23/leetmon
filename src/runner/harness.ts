// Pure test harness shared by the Web Worker (browser) and scripts/verify.ts (Node).
// No DOM or Node APIs in here.
import type {
  ClassSignature,
  CompareMode,
  FunctionSignature,
  Param,
  Signature,
  TestCase,
} from '../data/schema'

// ---------------------------------------------------------------------------
// Helper structures (injected into user code as globals)
// ---------------------------------------------------------------------------

export class ListNode {
  val: number
  next: ListNode | null
  constructor(val = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

export class TreeNode {
  val: number
  left: TreeNode | null
  right: TreeNode | null
  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val
    this.left = left
    this.right = right
  }
}

type AnyNode = { val: unknown; next?: unknown; left?: unknown; right?: unknown }

export function buildList(arr: unknown): ListNode | null {
  if (!Array.isArray(arr)) return null
  let head: ListNode | null = null
  for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i] as number, head)
  return head
}

const MAX_NODES = 200_000

/** Duck-typed so it works even if the user declared their own ListNode class. */
export function listToArray(head: unknown): unknown[] {
  const out: unknown[] = []
  let cur = head as AnyNode | null | undefined
  while (cur != null) {
    out.push(cur.val)
    if (out.length > MAX_NODES) throw new Error('Returned list is too long (cycle?)')
    cur = cur.next as AnyNode | null | undefined
  }
  return out
}

/** LeetCode level-order format: [3,9,20,null,null,15,7]. */
export function buildTree(arr: unknown): TreeNode | null {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] == null) return null
  const root = new TreeNode(arr[0] as number)
  const queue: TreeNode[] = [root]
  let i = 1
  let qi = 0
  while (qi < queue.length && i < arr.length) {
    const node = queue[qi++]
    if (i < arr.length && arr[i] != null) {
      node.left = new TreeNode(arr[i] as number)
      queue.push(node.left)
    }
    i++
    if (i < arr.length && arr[i] != null) {
      node.right = new TreeNode(arr[i] as number)
      queue.push(node.right)
    }
    i++
  }
  return root
}

export function treeToArray(root: unknown): unknown[] {
  const out: unknown[] = []
  if (root == null) return out
  const queue: (AnyNode | null)[] = [root as AnyNode]
  let qi = 0
  while (qi < queue.length) {
    const node = queue[qi++]
    if (node == null) {
      out.push(null)
      continue
    }
    out.push(node.val)
    if (out.length > MAX_NODES) throw new Error('Returned tree is too large (cycle?)')
    queue.push((node.left as AnyNode) ?? null, (node.right as AnyNode) ?? null)
  }
  while (out.length && out[out.length - 1] === null) out.pop()
  return out
}

// ---------------------------------------------------------------------------
// Type-driven conversion
// ---------------------------------------------------------------------------

function baseType(t: string): string {
  return t.replace(/\s*\|\s*null/g, '').trim()
}

export function convertIn(type: string, value: unknown): unknown {
  const t = baseType(type)
  if (t === 'ListNode') return buildList(value)
  if (t === 'TreeNode') return buildTree(value)
  if (t === 'ListNode[]') return (value as unknown[]).map(buildList)
  if (t === 'TreeNode[]') return (value as unknown[]).map(buildTree)
  return value === undefined ? undefined : structuredClone(value)
}

export function convertOut(type: string, value: unknown): unknown {
  // Forgetting to `return` should show up as undefined, not as an empty list/tree.
  if (value === undefined) return undefined
  const t = baseType(type)
  if (t === 'ListNode') return listToArray(value)
  if (t === 'TreeNode') return treeToArray(value)
  if (t === 'ListNode[]' && Array.isArray(value)) return value.map(listToArray)
  if (t === 'TreeNode[]' && Array.isArray(value)) return value.map(treeToArray)
  return value
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function formatValue(v: unknown, maxLen = 4000): string {
  const seen = new WeakSet<object>()
  const fmt = (x: unknown, depth: number): string => {
    if (x === undefined) return 'undefined'
    if (x === null) return 'null'
    if (typeof x === 'string') return JSON.stringify(x)
    if (typeof x === 'number') return Object.is(x, -0) ? '0' : String(x)
    if (typeof x === 'boolean' || typeof x === 'bigint') return String(x)
    if (typeof x === 'function') return `[Function ${x.name || 'anonymous'}]`
    if (typeof x === 'symbol') return x.toString()
    if (typeof x === 'object') {
      if (seen.has(x)) return '[Circular]'
      if (depth > 6) return '…'
      seen.add(x)
      const node = x as AnyNode
      if ('val' in node && 'next' in node && !Array.isArray(x)) {
        try {
          return `ListNode${fmt(listToArray(x), depth + 1)}`
        } catch {
          return 'ListNode[cycle]'
        }
      }
      if ('val' in node && 'left' in node && 'right' in node && !Array.isArray(x)) {
        try {
          return `TreeNode${fmt(treeToArray(x), depth + 1)}`
        } catch {
          return 'TreeNode[cycle]'
        }
      }
      if (Array.isArray(x)) return `[${x.map((e) => fmt(e, depth + 1)).join(',')}]`
      if (x instanceof Map) return `Map(${fmt([...x.entries()], depth + 1)})`
      if (x instanceof Set) return `Set(${fmt([...x.values()], depth + 1)})`
      const entries = Object.entries(x as Record<string, unknown>).map(
        ([k, val]) => `${k}: ${fmt(val, depth + 1)}`,
      )
      return `{${entries.join(', ')}}`
    }
    return String(x)
  }
  const s = fmt(v, 0)
  return s.length > maxLen ? s.slice(0, maxLen) + ` … (${s.length - maxLen} more chars)` : s
}

export function formatArgs(signature: Signature, args: unknown[]): string {
  if (signature.kind === 'class') {
    return `ops = ${formatValue(args[0], 1500)}\nargs = ${formatValue(args[1], 1500)}`
  }
  return signature.params.map((p, i) => `${p.name} = ${formatValue(args[i], 1500)}`).join('\n')
}

// ---------------------------------------------------------------------------
// Comparison
// ---------------------------------------------------------------------------

function canonical(x: unknown): string {
  return JSON.stringify(x, (_k, v) => (Object.is(v, -0) ? 0 : v === undefined ? '__undef__' : v))
}

function deepSort(x: unknown): unknown {
  if (!Array.isArray(x)) return x
  const inner = x.map(deepSort)
  return inner.sort((a, b) => (canonical(a) < canonical(b) ? -1 : canonical(a) > canonical(b) ? 1 : 0))
}

function topSort(x: unknown): unknown {
  if (!Array.isArray(x)) return x
  return [...x].sort((a, b) => (canonical(a) < canonical(b) ? -1 : canonical(a) > canonical(b) ? 1 : 0))
}

function deepEqual(a: unknown, b: unknown, tol: number): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true
    return tol > 0 ? Math.abs(a - b) <= tol : a === b
  }
  if (a === b) return true
  if (a === null || b === null || a === undefined || b === undefined) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], tol)) return false
    return true
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a as object)
    const kb = Object.keys(b as object)
    if (ka.length !== kb.length) return false
    return ka.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], tol),
    )
  }
  return false
}

export function compareOutput(actual: unknown, expected: unknown, mode: CompareMode = 'exact'): boolean {
  switch (mode) {
    case 'unordered':
      return deepEqual(topSort(actual), topSort(expected), 0)
    case 'unorderedDeep':
      return deepEqual(deepSort(actual), deepSort(expected), 0)
    case 'float':
      return deepEqual(actual, expected, 1e-5)
    default:
      return deepEqual(actual, expected, 0)
  }
}

// ---------------------------------------------------------------------------
// Console capture
// ---------------------------------------------------------------------------

const MAX_LOG_LINES = 200

export interface ConsoleCapture {
  console: Pick<Console, 'log' | 'info' | 'warn' | 'error' | 'debug'>
  take(): string[]
}

export function createConsoleCapture(): ConsoleCapture {
  let buf: string[] = []
  let dropped = 0
  const push = (prefix: string) => (...args: unknown[]) => {
    if (buf.length >= MAX_LOG_LINES) {
      dropped++
      return
    }
    buf.push(prefix + args.map((a) => (typeof a === 'string' ? a : formatValue(a, 1000))).join(' '))
  }
  return {
    console: {
      log: push(''),
      info: push(''),
      debug: push(''),
      warn: push('⚠ '),
      error: push('✖ '),
    },
    take() {
      const out = buf
      if (dropped) out.push(`… ${dropped} more log lines hidden`)
      buf = []
      dropped = 0
      return out
    },
  }
}

// ---------------------------------------------------------------------------
// Compiling user code
// ---------------------------------------------------------------------------

export function entryName(signature: Signature): string {
  return signature.kind === 'function' ? signature.name : signature.className
}

const WRAP_PREFIX = '"use strict";return (function(){"use strict";\n'

function wrap(code: string, name: string): string {
  // The user's code runs in its own inner scope so they can redeclare ListNode/TreeNode
  // without clashing with the injected parameters.
  return `${WRAP_PREFIX}${code}\n;return typeof ${name} !== 'undefined' ? ${name} : undefined;})();`
}

let lineOffset: number | null = null

/** Number of lines the wrapper adds before user line 1 (engine dependent). */
function getLineOffset(): number {
  if (lineOffset !== null) return lineOffset
  try {
    new Function('ListNode', 'TreeNode', 'console', wrap('throw new Error("probe")', 'x'))(
      ListNode,
      TreeNode,
      console,
    )
  } catch (e) {
    const m = /<anonymous>:(\d+):\d+/.exec(String((e as Error).stack))
    lineOffset = m ? Number(m[1]) - 1 : 0
  }
  return lineOffset ?? 0
}

/** Best-effort "line N" for errors thrown inside user code. */
export function userLineFromError(err: unknown): number | null {
  const stack = String((err as Error)?.stack ?? '')
  const m = /<anonymous>:(\d+):\d+/.exec(stack)
  if (!m) return null
  const line = Number(m[1]) - getLineOffset()
  return line > 0 ? line : null
}

export function describeError(err: unknown): string {
  if (err instanceof Error) {
    const line = userLineFromError(err)
    return `${err.name}: ${err.message}${line ? ` (line ${line})` : ''}`
  }
  return `Thrown: ${formatValue(err)}`
}

/** Compiles JS source and returns the function/class named by the signature (or undefined). */
export function compileUserCode(
  jsCode: string,
  signature: Signature,
  consoleObj: ConsoleCapture['console'],
): unknown {
  getLineOffset()
  const factory = new Function('ListNode', 'TreeNode', 'console', wrap(jsCode, entryName(signature)))
  return factory(ListNode, TreeNode, consoleObj)
}

// ---------------------------------------------------------------------------
// Running a single test
// ---------------------------------------------------------------------------

export interface ExecResult {
  passed: boolean
  actual: string
  error?: string
}

function convertArgs(params: Param[], args: unknown[]): unknown[] {
  return params.map((p, i) => convertIn(p.type, args[i]))
}

function runFunction(fn: unknown, sig: FunctionSignature, test: TestCase): unknown {
  if (typeof fn !== 'function') throw new Error(`${sig.name} is not a function`)
  const ret = (fn as (...a: unknown[]) => unknown)(...convertArgs(sig.params, test.args))
  return convertOut(sig.returns, ret)
}

function runClass(Cls: unknown, sig: ClassSignature, test: TestCase): unknown {
  if (typeof Cls !== 'function') throw new Error(`${sig.className} is not a class`)
  const [ops, opArgs] = test.args as [string[], unknown[][]]
  const out: unknown[] = []
  let inst: Record<string, unknown> | null = null
  for (let i = 0; i < ops.length; i++) {
    if (i === 0) {
      inst = new (Cls as new (...a: unknown[]) => Record<string, unknown>)(
        ...convertArgs(sig.constructorParams, opArgs[0] ?? []),
      )
      out.push(null)
      continue
    }
    const method = sig.methods.find((m) => m.name === ops[i])
    const impl = inst?.[ops[i]]
    if (!method) throw new Error(`Unknown operation "${ops[i]}" in test data`)
    if (typeof impl !== 'function') throw new Error(`Method ${sig.className}.${ops[i]}() is not defined`)
    const ret = (impl as (...a: unknown[]) => unknown).apply(inst, convertArgs(method.params, opArgs[i] ?? []))
    out.push(method.returns === 'void' ? null : ret === undefined ? undefined : convertOut(method.returns, ret))
  }
  return out
}

export function executeTest(
  compiled: unknown,
  signature: Signature,
  test: TestCase,
  compare: CompareMode | undefined,
): ExecResult {
  try {
    const actual =
      signature.kind === 'class'
        ? runClass(compiled, signature, test)
        : runFunction(compiled, signature, test)
    return { passed: compareOutput(actual, test.expected, compare), actual: formatValue(actual) }
  } catch (err) {
    return { passed: false, actual: '', error: describeError(err) }
  }
}
