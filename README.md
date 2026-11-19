# LeetMon

A barebones monster-collecting game where every creature is a LeetCode-style interview problem. Solve a problem (pass every test) to catch it, beat each pattern's gym leader for a badge, then take on the Elite Four and the Champion.

The game layer is kept thin on purpose. The work went into the practice loop: a split-screen editor, a sandboxed runner with time limits, clear failure output, hints, saved code, and 45 hand-written problems with 369 tests, every one checked against a reference solution.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the game with hot reload. |
| `npm run verify` | Run every reference solution against all of its tests, check the data, and check that starters compile. Pass an id fragment to filter: `npm run verify two-sum`. |
| `npm run typecheck` | `tsc -b` over app, config, scripts, and e2e. |
| `npm run build` / `npm run preview` | Production build / serve it on :4173. |
| `npm run e2e:smoke` | Browser test of the failure paths (needs `npm run dev` running). |
| `npm run e2e` | Full headless playthrough: catches all 45 problems through the real worker, all gyms, Elite Four, Champion (about 2 minutes). |

The e2e scripts use Playwright. Either run `npx playwright install chromium` once, or point at an installed Chrome with `CHROME_PATH=/path/to/chrome`. Set `SHOTS=/some/dir` to save screenshots and `LEETMON_URL` to test another server (for example the preview build).

## How to play

1. **Map**: 10 routes, one per pattern type. *Explore* gives you a random uncaught problem of that type (*Rematch* once all are caught).
2. **Encounter**: the statement is on the left and the editor on the right (JavaScript or TypeScript).
   - **▶ Run examples** (`Ctrl/⌘+Enter`) runs only the visible examples.
   - **Throw Code Capsule** (`Ctrl/⌘+Shift+Enter`) runs the examples plus the hidden tests. If everything passes, the problem is caught.
   - If something fails, you see the first failing test's input, expected output, your output (or the error with a line number), and its `console.log` output. Retry as often as you like.
   - **💡 Hint** reveals the pattern name and a nudge. **📖 Reference solution** unlocks after you catch the problem or after 3 failed throws. **🏃 Flee** goes back.
3. **Gyms** unlock after catching 3 problems of a type. The leader's problem is a harder Medium/Hard of that pattern. Winning earns the badge.
4. **Victory Road**: with all 10 badges you can fight the **Elite Four** (4 mixed-pattern Hards in a row; retreating or fleeing resets the streak) and then the **Champion**.
5. **LeetDex**: every problem, filterable by type, status, and kind, with throw counts. Click a caught problem (or any wild one) to practice it again.

Progress (caught problems, attempts, badges, hints, saved code per problem and language, Elite streak) is stored in `localStorage` under `leetmon-progress-v1`. **Reset** in the top bar wipes it.

## Project layout

```
src/
  data/
    schema.ts              Types for problems, signatures, tests (the schema below)
    types.ts               The 10 pattern types, route names, gym leaders, GYM_UNLOCK_COUNT
    league.ts              Elite Four + Champion trainers (point at problem ids)
    problems/<type>.ts     One array per type: 3 wild problems + 1 gym problem
    problems/league.ts     Elite Four + Champion problems
    problems/index.ts      Concatenates everything (this order = LeetDex numbering)
  runner/
    harness.ts             Pure test harness shared by the browser worker and Node scripts
    worker.ts              Web Worker: TS → JS (sucrase), compile, run tests, capture console
    runCode.ts             Main-thread side: spawns the worker, per-test timeout, collects results
    starter.ts             Generates JS (JSDoc) and TS starter code from a signature
    protocol.ts            Worker message types
  game/
    progress.ts            localStorage-backed store + useProgress() hook
    battle.ts              Screen / battle-context types
  screens/                 MapScreen, IntroScreen, EncounterScreen, DexScreen, HallScreen
  components/
    Creature.tsx           Procedural SVG creature, seeded by problem id (original art)
    bits.tsx               Type chips, markdown, catch capsule, dialog box, LABELS
scripts/verify.ts          Reference-solution checker
e2e/                       Playwright smoke test + full playthrough
```

## How the code runner works

1. **Run** or **Throw** calls `runCode()`, which starts a **fresh Web Worker** and posts the code, language, signature, compare mode, and test cases.
2. In the worker, TypeScript is stripped to JS with **sucrase** (types only, no type checking). The code is wrapped and compiled with `new Function`, inside its own scope, with `ListNode`, `TreeNode`, and a capturing `console` injected. The wrapper returns the function or class named in the signature.
3. For each test, the worker posts `testStart`, deep-clones the inputs, converts `ListNode`/`TreeNode` params from arrays, calls your code (or replays the class operations), converts list/tree results back to arrays, compares, and posts `testResult` with the formatted output and that test's logs.
4. The main thread restarts a **2.5s timer** on every `testStart`. If a test hangs, the worker is `terminate()`d, that test is marked *Time Limit Exceeded*, and the rest are marked not run, so infinite loops can't freeze the UI. Loading your code has a 5s budget.
5. `scripts/verify.ts` imports the **same `harness.ts`**, so "the reference passes" in Node means the same thing as "you pass" in the browser.

## Adding a problem

Add **one object** to the array in the matching `src/data/problems/<type>.ts` file. That's it. The map, routes, LeetDex, and gym unlock counts all read from the data. Then run `npm run verify`.

```ts
{
  id: 'product-of-array-except-self',            // unique slug, also the save key
  leetcode: { number: 238, title: 'Product of Array Except Self', slug: 'product-of-array-except-self' },
  creature: 'Multiplicub',                       // invented name, must be unique
  type: 'arrays',
  role: 'wild',                                  // 'wild' | 'gym' | 'elite' | 'champion'
  difficulty: 'Medium',
  level: 24,                                     // rough guide: Easy 4-10, Medium 17-42, Hard 44-70
  statement: `Markdown, **in your own words**. End with a **Constraints** list.`,
  signature: {
    kind: 'function',
    name: 'productExceptSelf',
    params: [{ name: 'nums', type: 'number[]' }],
    returns: 'number[]',
  },
  examples: [                                    // shown in the statement AND used by "Run"
    { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], explain: 'optional note' },
  ],
  hiddenTests: [                                 // run (with the examples) by "Throw"
    { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
  ],
  compare: 'exact',                              // optional, see below
  hint: 'One short nudge. The pattern name is shown automatically.',
  solution: `function productExceptSelf(nums) { /* plain JS reference */ }`,
}
```

### Field reference

| Field | Notes |
| --- | --- |
| `id` | Unique slug. Changing it orphans saved progress for that problem. |
| `leetcode` | `{ number, title, slug }`. The encounter links to `leetcode.com/problems/<slug>/`. |
| `creature` | Invented creature name (no official franchise names). |
| `type` / `secondaryType` | Pattern type id from `src/data/types.ts`. Elite problems need a `secondaryType`. |
| `role` | `wild` (route encounter), `gym` (exactly one per type), `elite`/`champion` (referenced from `src/data/league.ts`). |
| `difficulty`, `level` | Display only. |
| `statement` | Markdown, rendered with `marked`. |
| `signature` | Drives the starter code **and** the harness. See below. |
| `starter` | Optional `{ js?, ts? }` to hand-write starter code instead of generating it. |
| `examples` | Visible tests. Need at least 1. |
| `hiddenTests` | Hidden tests. `verify` requires **≥ 5 tests in total**; aim for 6–9 with edge cases. |
| `compare` | `exact` (default), `unordered` (top-level order ignored), `unorderedDeep` (order ignored at every nesting level), `float` (1e-5 tolerance). |
| `hint` | Shown with the pattern name when the player asks. |
| `solution` | Plain JavaScript string. Avoid backticks inside it (it lives in a template literal). |

### Signatures and special types

**Functions:** `{ kind: 'function', name, params: [{ name, type }], returns }`. Type strings are TypeScript types used for the starter. These get special handling in the harness:

| Type | In test data | Your code receives / returns |
| --- | --- | --- |
| `ListNode` | `[1,2,3]` (`[]` = null) | a real linked list; returned lists are read back into arrays |
| `TreeNode` | level order with nulls: `[3,9,20,null,null,15,7]` | a real binary tree; returned trees are serialized the same way (trailing nulls trimmed) |
| `ListNode[]`, `TreeNode[]` | arrays of the above | arrays of nodes |

`ListNode(val, next)` and `TreeNode(val, left, right)` are injected as globals. Players can also declare their own classes; returned nodes are read by duck typing.

**Design / class problems:** use LeetCode's operation format.

```ts
signature: {
  kind: 'class',
  className: 'MinStack',
  constructorParams: [],
  methods: [
    { name: 'push', params: [{ name: 'val', type: 'number' }], returns: 'void' },
    { name: 'getMin', params: [], returns: 'number' },
  ],
},
examples: [{
  args: [['MinStack', 'push', 'getMin'], [[], [5], []]],   // [ops, argsPerOp]
  expected: [null, null, 5],                               // constructor and void methods → null
}],
```

### Checklist for a new problem

- [ ] Statement in your own words, with constraints.
- [ ] Edge cases: empty, single element, duplicates, negatives, extremes.
- [ ] If the statement says a slow approach times out, add a large hidden test and **check** that brute force exceeds 2.5s.
- [ ] Expected outputs derived independently (by hand or brute force), not copied from your own solution.
- [ ] `npm run verify` is green.

**Adding a new pattern type:** add the id to `TypeId` in `schema.ts`, add an entry (color, emoji, route, gym leader) to `TYPES` in `types.ts`, create `problems/<type>.ts` with ≥ 3 wild problems and 1 gym problem, and spread it into `problems/index.ts`.

## Naming and art

No official franchise names, sprites, or logos. In-game terms are **LeetDex** and **Code Capsule** (an original pill-shaped catch device); both live in `LABELS` in `src/components/bits.tsx`. Creatures are procedurally generated SVG blobs (color = type, accent = secondary type) seeded by the problem id, so a new problem gets a creature automatically.

## Future ideas

- **More content**: a Heap / Priority Queue type (Kth Largest in a Stream, Last Stone Weight, K Closest Points, gym: Find Median from Data Stream), plus Tries, Intervals, Greedy, Bit Manipulation, and 2-D DP. More wild problems per type.
- **Harness features**: an in-place output option (for problems like Rotate Image and Reorder List), cyclic list input (Linked List Cycle), graph-node input (Clone Graph), and custom validators for "any valid answer" problems (Course Schedule II, Alien Dictionary).
- **Practice loop**: spaced-repetition review (caught problems "escape" after N days), a per-encounter timer and personal bests, custom-input runs, per-problem notes, per-type accuracy stats, and a diff view against the reference.
- **Game layer**: simple battle animations, sound, trainer card export, and type-effectiveness flavor.
- **Out of scope for now**: tile-based overworld, multiplayer, accounts, and a backend.
