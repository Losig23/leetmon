// Full playthrough: every problem solved through the real Web Worker, all gyms, Elite Four, Champion.
// Needs the dev server running. Run: npm run e2e
import { chromium, type Page } from 'playwright'
import { PROBLEMS } from '../src/data/problems/index.ts'
import { TYPES } from '../src/data/types.ts'

const SHOTS = process.env.SHOTS // set to a folder to save screenshots
const URL = process.env.LEETMON_URL ?? 'http://localhost:5173'
const log = (...a: unknown[]) => console.log('•', ...a)
const fail = (msg: string): never => {
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
page.on('dialog', (d) => d.accept())

await page.goto(URL)
await page.evaluate(() => localStorage.clear())
await page.reload()
await page.waitForSelector('.route-card')

async function setCode(code: string) {
  await page.click('.cm-content')
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Delete')
  await page.keyboard.insertText(code)
}
async function current() {
  const title = (await page.textContent('.statement h2'))!.trim()
  return PROBLEMS.find((x) => x.leetcode.title === title) ?? fail('unknown title ' + title)
}
async function throwAndExpectCatch(id: string) {
  await page.click('.btn-throw')
  await page.waitForSelector('.banner', { timeout: 20000 })
  const banner = (await page.textContent('.banner'))!
  if (!/Gotcha/.test(banner)) {
    const detail = await page.textContent('.results-body')
    fail(`${id} not caught: ${banner} :: ${detail?.slice(0, 600)}`)
  }
  await page.waitForSelector('.overlay-card')
}
async function solveCurrent(lang: 'js' | 'ts' = 'js', override?: string) {
  const p = await current()
  await page.getByRole('button', { name: lang === 'ts' ? 'TypeScript' : 'JavaScript', exact: true }).click()
  await setCode(override ?? p.solution)
  await throwAndExpectCatch(p.id)
  return p
}
const cont = async () => {
  await page.getByRole('button', { name: /Continue/ }).click()
}

// TypeScript versions for a ListNode problem, a TreeNode problem, and a class problem.
const TS: Record<string, string> = {
  'reverse-linked-list': `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null
  while (head) { const next: ListNode | null = head.next; head.next = prev; prev = head; head = next }
  return prev
}`,
  'invert-binary-tree': `function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) return null
  ;[root.left, root.right] = [invertTree(root.right), invertTree(root.left)]
  return root
}`,
  'min-stack': `interface Entry { val: number; min: number }
class MinStack {
  private items: Entry[] = []
  push(val: number): void {
    const min = this.items.length ? Math.min(val, this.items[this.items.length - 1].min) : val
    this.items.push({ val, min })
  }
  pop(): void { this.items.pop() }
  top(): number { return this.items[this.items.length - 1].val }
  getMin(): number { return this.items[this.items.length - 1].min }
}`,
}

// --- hint + reveal-after-3-fails on the first encounter ---
let firstDone = false
for (const t of TYPES) {
  const card = page.locator('.route-card', { hasText: t.route })
  for (let guard = 0; guard < 10; guard++) {
    const explore = card.getByRole('button', { name: /Explore|Rematch/ })
    if ((await explore.textContent())!.includes('Rematch')) break
    await explore.click()
    await page.waitForSelector('.statement h2')
    const p = await current()
    if (!firstDone) {
      await page.getByRole('button', { name: /Show hint/ }).click()
      const hint = await page.textContent('.hint-box')
      if (!hint!.includes(t.name) || !hint!.includes(p.hint.slice(0, 20))) fail('hint should show pattern + hint')
      if (await page.getByRole('button', { name: /Reference solution/ }).count()) fail('solution should be hidden at first')
      for (let i = 0; i < 3; i++) {
        await page.click('.btn-throw')
        await page.waitForSelector('.banner', { timeout: 20000 })
      }
      await page.getByRole('button', { name: /Reference solution/ }).click()
      const sol = await page.textContent('.solution pre')
      if (!sol!.includes(p.solution.slice(0, 30))) fail('reveal should show the reference solution')
      log('hint shown; solution revealed after 3 fails on', p.id)
      firstDone = true
    }
    await solveCurrent(TS[p.id] ? 'ts' : 'js', TS[p.id])
    log(`caught ${p.id}${TS[p.id] ? ' (TypeScript)' : ''}`)
    await cont()
    await page.waitForSelector('.route-card')
  }
  await card.getByRole('button', { name: /Gym/ }).click()
  await page.waitForSelector('.intro')
  await page.getByRole('button', { name: /Battle/ }).click()
  await page.waitForSelector('.statement h2')
  const g = await solveCurrent()
  const overlay = await page.textContent('.overlay-card')
  if (!overlay!.includes(t.gym.badge)) fail('missing badge text for ' + t.id)
  log(`🏅 ${t.gym.badge} from ${t.gym.name} (${g.id})`)
  await cont()
  await page.waitForSelector('.route-card')
}
await shot('10-all-badges.png', true)

// --- Elite Four: beat #1, retreat (streak resets), then run the whole league ---
await page.getByRole('button', { name: /Enter the League/ }).click()
await page.waitForSelector('.intro')
await shot('11-elite-intro.png')
await page.getByRole('button', { name: /Battle/ }).click()
await page.waitForSelector('.statement h2')
await solveCurrent()
await cont()
await page.waitForSelector('.intro')
await page.getByRole('button', { name: /Retreat/ }).click()
await page.waitForSelector('.route-card')
const leagueBtn = (await page.getByRole('button', { name: /Enter the League/ }).textContent())!
if (!leagueBtn.includes('0/4')) fail('retreat should reset the elite streak: ' + leagueBtn)
log('retreat resets streak ->', leagueBtn.trim())

await page.getByRole('button', { name: /Enter the League/ }).click()
for (let i = 0; i < 5; i++) {
  await page.waitForSelector('.intro')
  const who = (await page.textContent('.intro .trainer-name'))!.trim()
  await page.getByRole('button', { name: /Battle/ }).click()
  await page.waitForSelector('.statement h2')
  const p = await solveCurrent()
  if (i === 4) await shot('12-champion-caught.png')
  log(`defeated ${who} (${p.id})`)
  await cont()
}
await page.waitForSelector('.hall')
await shot('13-hall.png', true)
const hall = (await page.textContent('.hall'))!.replace(/\s+/g, ' ')
if (!hall.includes(`${PROBLEMS.length}/${PROBLEMS.length} caught`)) fail('hall should show everything caught: ' + hall)
log('hall:', hall.slice(0, 120))

await page.getByRole('button', { name: 'LeetDex' }).click()
await page.waitForSelector('.dex-table')
await shot('14-dex-full.png', true)
await page.selectOption('.dex-filters select >> nth=0', 'graphs')
const graphsRows = await page.locator('.dex-table tbody tr').count()
log('dex graphs filter rows:', graphsRows)

if (errors.length) fail('page errors: ' + errors.join(' | '))
await browser.close()
console.log('\n✔ full playthrough passed')
