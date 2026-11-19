// Runs every reference solution through the same harness the game uses.
//   npm run verify            all problems
//   npm run verify two-sum    only problems whose id contains "two-sum"
import { transform } from 'sucrase'
import { PROBLEMS } from '../src/data/problems/index.ts'
import { CHAMPION, ELITE_FOUR } from '../src/data/league.ts'
import { GYM_UNLOCK_COUNT, TYPES } from '../src/data/types.ts'
import type { Problem } from '../src/data/schema.ts'
import { compileUserCode, createConsoleCapture, executeTest, formatArgs, formatValue } from '../src/runner/harness.ts'
import { starterFor } from '../src/runner/starter.ts'

const MIN_TESTS = 5
const SLOW_MS = 1000

const filter = process.argv[2]
const errors: string[] = []
const warnings: string[] = []
const err = (p: Problem | null, msg: string) => errors.push(`${p ? `[${p.id}] ` : ''}${msg}`)
const warn = (p: Problem | null, msg: string) => warnings.push(`${p ? `[${p.id}] ` : ''}${msg}`)

// ---- structural checks ---------------------------------------------------
const ids = new Set<string>()
const creatures = new Set<string>()
for (const p of PROBLEMS) {
  if (ids.has(p.id)) err(p, 'duplicate id')
  ids.add(p.id)
  if (creatures.has(p.creature)) err(p, `duplicate creature name ${p.creature}`)
  creatures.add(p.creature)
  if (!TYPES.some((t) => t.id === p.type)) err(p, `unknown type ${p.type}`)
  if (!p.statement.trim()) err(p, 'empty statement')
  if (!p.hint.trim()) err(p, 'empty hint')
  if (p.examples.length === 0) err(p, 'needs at least one example')
  const total = p.examples.length + p.hiddenTests.length
  if (total < MIN_TESTS) err(p, `only ${total} tests (minimum ${MIN_TESTS})`)
  if (p.role === 'elite' && !p.secondaryType) err(p, 'elite problems need a secondaryType')
}

for (const t of TYPES) {
  const wild = PROBLEMS.filter((p) => p.type === t.id && p.role === 'wild')
  const gyms = PROBLEMS.filter((p) => p.type === t.id && p.role === 'gym')
  if (wild.length === 0 && gyms.length === 0) {
    warn(null, `type "${t.id}" has no problems yet`)
    continue
  }
  if (wild.length < GYM_UNLOCK_COUNT) err(null, `type "${t.id}" has ${wild.length} wild problems; gym needs ${GYM_UNLOCK_COUNT}`)
  if (gyms.length !== 1) err(null, `type "${t.id}" should have exactly 1 gym problem (has ${gyms.length})`)
}

for (const m of [...ELITE_FOUR, CHAMPION]) {
  const p = PROBLEMS.find((x) => x.id === m.problemId)
  if (!p) warn(null, `league member ${m.name} points at missing problem "${m.problemId}"`)
  else if (p.role !== (m === CHAMPION ? 'champion' : 'elite')) err(p, `role should match league slot for ${m.name}`)
}

// ---- run reference solutions -----------------------------------------------
let passedProblems = 0
let totalTests = 0
const rows: string[] = []

for (const p of PROBLEMS) {
  if (filter && !p.id.includes(filter)) continue
  const cap = createConsoleCapture()
  const tests = [...p.examples, ...p.hiddenTests]
  totalTests += tests.length

  let compiled: unknown
  try {
    compiled = compileUserCode(p.solution, p.signature, cap.console)
  } catch (e) {
    err(p, `reference solution failed to compile: ${(e as Error).message}`)
    rows.push(`✖ ${p.id}`)
    continue
  }
  if (compiled === undefined) {
    err(p, 'reference solution does not define the signature name')
    rows.push(`✖ ${p.id}`)
    continue
  }

  let ok = true
  let slowest = 0
  tests.forEach((t, i) => {
    const t0 = performance.now()
    const res = executeTest(compiled, p.signature, t, p.compare)
    const ms = performance.now() - t0
    slowest = Math.max(slowest, ms)
    if (!res.passed) {
      ok = false
      err(
        p,
        `test #${i + 1} failed\n    input:    ${formatArgs(p.signature, t.args).replace(/\n/g, '; ')}\n    expected: ${formatValue(t.expected, 300)}\n    actual:   ${res.error ?? res.actual.slice(0, 300)}`,
      )
    }
    if (ms > SLOW_MS) warn(p, `test #${i + 1} took ${ms.toFixed(0)}ms with the reference solution`)
  })

  // Starter code must compile in both languages and must not already pass.
  for (const lang of ['js', 'ts'] as const) {
    try {
      const src = starterFor(p, lang)
      const js = lang === 'ts' ? transform(src, { transforms: ['typescript'], disableESTransforms: true }).code : src
      const fn = compileUserCode(js, p.signature, createConsoleCapture().console)
      if (fn === undefined) err(p, `${lang} starter does not define the entry point`)
      else if (tests.every((t) => executeTest(fn, p.signature, t, p.compare).passed))
        warn(p, `${lang} starter code already passes every test (tests too weak?)`)
    } catch (e) {
      err(p, `${lang} starter failed to compile: ${(e as Error).message}`)
    }
  }

  if (ok) passedProblems++
  rows.push(`${ok ? '✔' : '✖'} ${p.id.padEnd(40)} ${String(tests.length).padStart(2)} tests  slowest ${slowest.toFixed(1)}ms`)
}

console.log(rows.join('\n'))
console.log(`\n${passedProblems} problems passed, ${totalTests} test cases total.`)
if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n  ` + warnings.join('\n  '))
if (errors.length) {
  console.log(`\nErrors (${errors.length}):\n  ` + errors.join('\n  '))
  process.exit(1)
}
console.log('\nAll reference solutions pass. ✔')
