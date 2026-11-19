# LeetMon task breakdown

Status as of 2026-11-18. ✅ = done and verified, ⬜ = not started.

## Phase 1: Foundation and vertical slice ✅

- ✅ 1.1 Scaffold Vite + React + TypeScript, CodeMirror 6, sucrase, marked, retro CSS
- ✅ 1.2 Data schema (`src/data/schema.ts`): function and class signatures, ListNode/TreeNode types, compare modes
- ✅ 1.3 Shared harness (`src/runner/harness.ts`): build/serialize lists and trees, class-op replay, comparators, console capture, error line numbers
- ✅ 1.4 Web Worker runner with per-test 2.5s timeout and `terminate()`, TS stripping, compile errors
- ✅ 1.5 Starter-code generator for JS (JSDoc) and TS
- ✅ 1.6 Screens: Map, Gym/League intro, Encounter (split view, Run/Throw/Flee/Hint/Reveal), LeetDex, Hall of Fame
- ✅ 1.7 localStorage progress (caught, attempts, fails, hints, badges, code per language, Elite streak) and Reset
- ✅ 1.8 Vertical slice: Arrays & Hashing (3 wild + gym), played end to end in headless Chrome

## Phase 2: Content ✅

- ✅ 2.1 10 types × (3 wild + 1 gym) = 40 problems
- ✅ 2.2 Elite Four (Sliding Window + Hashing, Graphs + DP, Trees + DP, Binary Search + DP) and Champion (Trie + Backtracking + Grids)
- ✅ 2.3 Gym leaders, Elite Four, and Champion with names and dialogue
- ✅ 2.4 Statements in our own words, LeetCode number and link on every problem
- ✅ 2.5 369 tests (6–10 per problem); tricky expected values cross-checked with independent Python brute force
- ✅ 2.6 Performance tests: brute-force versions confirmed to exceed the limit wherever a statement says "will time out"

## Phase 3: Verification ✅

- ✅ 3.1 `npm run verify`: all 45 reference solutions pass, starters compile, no starter passes its tests
- ✅ 3.2 `npm run e2e:smoke`: failure paths, TLE, console, runtime/syntax errors, TS mode, gym, persistence
- ✅ 3.3 `npm run e2e`: full playthrough (45 catches, 10 badges, Elite retreat reset, Champion, Hall of Fame)
- ✅ 3.4 Production build + smoke test against `vite preview`

## Phase 4: Practice-loop upgrades ⬜ (suggested next)

- ⬜ 4.1 **Custom input**: a "Run with my input" box (parse JSON args per the signature)
- ⬜ 4.2 **Encounter timer + personal best** per problem, shown in the LeetDex
- ⬜ 4.3 **Spaced repetition**: caught problems become "restless" after 1/3/7/14 days; a "Review" route serves them
- ⬜ 4.4 **Notes per problem** (markdown, saved in progress) shown after catching
- ⬜ 4.5 **Stats screen**: accuracy per type, first-try catches, hints used

## Phase 5: More content ⬜

- ⬜ 5.1 New type: **Heap / Priority Queue** (Kth Largest in a Stream 703, Last Stone Weight 1046, K Closest Points 973; gym: Find Median from Data Stream 295)
- ⬜ 5.2 4th/5th wild problem for existing types (Top K Frequent 347, Product of Array Except Self 238, Two Sum II 167, Permutation in String 567, Search in Rotated Sorted Array 33, Kth Smallest in BST 230, LCA of BST 235, Pacific Atlantic 417, Word Search 79, Word Break 139, LIS 300, Unique Paths 62)
- ⬜ 5.3 New types: Tries, Intervals, Greedy, Bit Manipulation, 2-D DP

## Phase 6: Harness features (unblock more problems) ⬜

- ⬜ 6.1 `outputArg` option: compare a mutated argument for void in-place problems (Rotate Image 48, Reorder List 143, Set Matrix Zeroes 73)
- ⬜ 6.2 Cyclic list input (`[3,2,0,-4]` + `pos`) for Linked List Cycle 141
- ⬜ 6.3 Graph-node input/output for Clone Graph 133
- ⬜ 6.4 Custom validator per problem for "any valid answer" outputs (Course Schedule II 210, Alien Dictionary 269)

## Phase 7: Polish and ship ⬜

- ⬜ 7.1 Resizable split panes; mobile layout pass
- ⬜ 7.2 Simple battle animations and sound toggle
- ⬜ 7.3 Unit tests for `harness.ts` (vitest) + GitHub Actions running verify/typecheck/build
- ⬜ 7.4 Deploy as a static site (GitHub Pages, Netlify, or Render static)
- ⬜ 7.5 Export/import progress JSON (backup between browsers)

---

## Prompt for a new chat

Attach `leetmon.zip` (or connect the project folder), then paste:

```
I'm continuing work on LeetMon, a barebones web game for practicing LeetCode-style interview problems.
It's attached as leetmon.zip (unzip it and run `npm install`). Read README.md and TASKS.md first.

Context:
- Stack: React + TypeScript + Vite, no backend. CodeMirror 6 editor; user code runs in a fresh Web Worker
  (src/runner/worker.ts) with a 2.5s per-test timeout. TypeScript is stripped with sucrase.
- src/runner/harness.ts is the shared, pure test harness (ListNode/TreeNode building, class-op replay,
  compare modes, console capture). It's used by both the worker and scripts/verify.ts. Keep it DOM-free.
- Problems live in src/data/problems/<type>.ts (one object per problem; schema in src/data/schema.ts,
  documented in README "Adding a problem"). Types and gym leaders are in src/data/types.ts;
  Elite Four and Champion are in src/data/league.ts.
- 45 problems / 369 tests today: 10 types × (3 wild + 1 gym), Elite Four, Champion.
- Progress is in localStorage key "leetmon-progress-v1". If you change its shape, keep old saves loading.

Rules:
- Statements in my own words; reference the LeetCode number/slug. No official Pokémon names, sprites, or logos
  (in-game terms are LeetDex and Code Capsule).
- Every problem needs ≥ 5 tests (aim for 6-9 with edge cases). Derive expected values independently
  (by hand or with a brute force), not from the reference solution.
- If a statement claims a slow approach times out, prove it by timing a brute-force version.
- Before finishing, run `npm run verify`, `npm run typecheck`, and `npm run build`. Then start `npm run dev`
  and run `npm run e2e:smoke` and `npm run e2e` (Playwright: set CHROME_PATH or run
  `npx playwright install chromium`). Update the e2e scripts if you change the UI they rely on.
- Update TASKS.md (check off what you finished) and README.md (if the schema or commands change).
  At the end, give me the updated project as a zip plus a fresh continuation prompt.

This session's task: <PICK FROM TASKS.md, e.g. "Phase 4.1 custom input + 4.2 timer/personal best">
```
