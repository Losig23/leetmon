// Failure-path smoke test (starter fails, TLE, console.log, errors, gym, persistence).
// Needs the dev server running. Run: npm run e2e:smoke
import { chromium, type Page } from 'playwright'
import { PROBLEMS } from '../src/data/problems/index.ts'

const SHOTS = process.env.SHOTS // set to a folder to save screenshots
const URL = process.env.LEETMON_URL ?? 'http://localhost:5173'
const log = (...a: unknown[]) => console.log('•', ...a)
const fail = (msg: string) => {
  console.error('✖ FAIL:', msg)
  process.exit(1)
}

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] })
const page: Page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
const errors: string[] = []
const shot = async (name: string, fullPage = false) => {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}`, fullPage })
}
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL)
await page.evaluate(() => localStorage.clear())
await page.reload()
await page.waitForSelector('.route-card')
await shot('01-map.png', true)
log('map loaded')

async function setCode(code: string) {
  await page.click('.cm-content')
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.keyboard.insertText(code)
}

async function currentProblem() {
  const title = (await page.textContent('.statement h2'))!.trim()
  const p = PROBLEMS.find((x) => x.leetcode.title === title)
  if (!p) fail(`unknown problem title ${title}`)
  return p!
}

async function throwBall(): Promise<string> {
  await page.click('.btn-throw')
  await page.waitForSelector('.banner', { timeout: 15000 })
  return (await page.textContent('.banner'))!.trim()
}

// --- wild encounter #1: failure paths, console, TLE, then catch ---
const arraysCard = page.locator('.route-card').first()
await arraysCard.getByRole('button', { name: /Explore/ }).click()
await page.waitForSelector('.statement h2')
let prob = await currentProblem()
log('encountered', prob.id)
await shot('02-encounter.png')

await page.getByRole('button', { name: /Run examples/ }).click()
await page.waitForSelector('.banner')
let banner = (await page.textContent('.banner'))!
if (!/Some examples fail/.test(banner)) fail('starter code should fail examples: ' + banner)
log('starter run ->', banner.trim())

banner = await throwBall()
if (!/broke free/.test(banner)) fail('starter throw should break free: ' + banner)
const detail = await page.textContent('.test-detail')
if (!/Input/.test(detail!) || !/Expected/.test(detail!) || !/Your output/.test(detail!)) fail('failing test detail missing')
await shot('03-fail.png')
log('starter throw ->', banner)

const fnName = prob.signature.kind === 'function' ? prob.signature.name : prob.signature.className
await setCode(`function ${fnName}() { while (true) {} }`)
const t0 = Date.now()
banner = await throwBall()
const tle = await page.textContent('.test-detail')
if (!/Time Limit/.test(tle!)) fail('infinite loop should hit time limit: ' + tle)
log(`infinite loop -> TLE after ${Date.now() - t0}ms`)

await setCode(`console.log("top level hello");\n${prob.solution}\nconsole.log("loaded", [1,2,{a:3}]);`)
await page.getByRole('button', { name: /Run examples/ }).click()
await page.waitForSelector('.banner')
banner = (await page.textContent('.banner'))!
if (!/All examples pass/.test(banner)) fail('solution should pass examples: ' + banner)
await page.getByRole('button', { name: /Console/ }).click()
const logs = await page.textContent('pre.logs')
if (!/top level hello/.test(logs!) || !/loaded \[1,2,\{a: 3\}\]/.test(logs!)) fail('console capture missing: ' + logs)
log('console capture ok')

await setCode('function ' + fnName + '(x) { throw new Error("boom") }\n')
banner = await throwBall()
const errDetail = await page.textContent('.test-detail')
if (!/Error: boom \(line 1\)/.test(errDetail!)) fail('runtime error should show line: ' + errDetail)
log('runtime error ->', errDetail!.match(/Error: boom[^E]*/)?.[0])

await setCode('function ' + fnName + '( {\n')
banner = await throwBall()
if (!/didn't load/.test(banner)) fail('syntax error should not load: ' + banner)
log('syntax error ->', banner.replace(/\s+/g, ' ').slice(0, 90))

await setCode(prob.solution)
banner = await throwBall()
await page.waitForSelector('.overlay-card')
await shot('04-caught.png')
log('caught', prob.id)
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForSelector('.route-card')

// --- catch the rest of the wild arrays problems, one in TypeScript ---
let tsDone = false
for (let i = 0; i < 5; i++) {
  const btn = arraysCard.getByRole('button', { name: /Explore|Rematch/ })
  if ((await btn.textContent())!.includes('Rematch')) break
  await btn.click()
  await page.waitForSelector('.statement h2')
  prob = await currentProblem()
  if (!tsDone) {
    await page.getByRole('button', { name: 'TypeScript' }).click()
    const starter = await page.textContent('.cm-content')
    if (!/: /.test(starter!)) fail('TS starter should have type annotations: ' + starter)
    // add type annotations to the reference solution's first line
    const typed = prob.solution.replace(/\(([^)]*)\)/, (_m, params: string) =>
      '(' + params.split(',').map((s) => (s.trim() ? `${s.trim()}: any` : s)).join(', ') + '): any',
    )
    await setCode(`type Unused = { a: number };\n${typed}`)
    tsDone = true
    log('TS mode for', prob.id)
  } else {
    await setCode(prob.solution)
  }
  banner = await throwBall()
  if (!/Gotcha/.test(banner)) fail(`${prob.id} should be caught: ${banner}`)
  log('caught', prob.id)
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.waitForSelector('.route-card')
}
await page.getByRole('button', { name: 'JavaScript' }).count() // no-op

// --- gym ---
const gymBtn = arraysCard.getByRole('button', { name: /Gym/ })
if (await gymBtn.isDisabled()) fail('gym should be unlocked after catching all wild problems')
await gymBtn.click()
await page.waitForSelector('.intro')
await shot('05-gym-intro.png')
await page.getByRole('button', { name: /Battle/ }).click()
await page.waitForSelector('.statement h2')
prob = await currentProblem()
if (prob.role !== 'gym') fail('gym battle should load the gym problem')
// The editor remembers the TS language choice; switch back to JS
await page.getByRole('button', { name: 'JavaScript' }).click()
await setCode(prob.solution)
banner = await throwBall()
const overlay = await page.textContent('.overlay-card')
if (!/Bucket Badge/.test(overlay!)) fail('gym win should award badge: ' + overlay)
await shot('06-badge.png')
log('gym beaten:', prob.id)
await page.getByRole('button', { name: /Continue/ }).click()
await page.waitForSelector('.route-card')
await shot('07-map-after.png', true)

// --- persistence ---
await page.reload()
await page.waitForSelector('.route-card')
const trainer = await page.textContent('.trainer')
if (!/Caught 4/.test(trainer!.replace(/\s+/g, ' ')) || !/Badges 1/.test(trainer!.replace(/\s+/g, ' ')))
  fail('progress should persist: ' + trainer)
log('persisted ->', trainer!.replace(/\s+/g, ' '))

// --- dex ---
await page.getByRole('button', { name: 'LeetDex' }).click()
await page.waitForSelector('.dex-table')
await shot('08-dex.png', true)
const rows = await page.locator('.dex-table tbody tr').count()
await page.selectOption('.dex-filters select >> nth=1', 'caught')
const caughtRows = await page.locator('.dex-table tbody tr').count()
log(`dex rows: ${rows}, caught filter: ${caughtRows}`)
if (caughtRows !== 4) fail('caught filter should show 4')
await page.locator('.dex-table tbody tr').first().click()
await page.waitForSelector('.statement h2')
const saved = await page.textContent('.cm-content')
if (!saved || saved.length < 30) fail('saved code should be restored')
log('dex -> practice opens with saved code')

if (errors.length) fail('page errors: ' + errors.join(' | '))
log('no page errors')
await browser.close()
console.log('\n✔ smoke test passed')
