# LeetMon task breakdown

Status as of 2026-11-20. ✅ = done and verified, ⬜ = not started.

The game is changing direction. Phases 1–3 built a **menu-based** game: pick a route on a map screen, fight a random wild problem. **Phase 4** replaces that with a **walkable, top-down overworld** of towns, routes, trainers, buildings, and gyms. The practice loop (editor, runner, tests, LeetDex) stays and becomes the battle screen.

---

## Done so far

### Phase 1: Foundation and vertical slice ✅
- ✅ Vite + React + TypeScript, CodeMirror 6, sucrase, marked, retro CSS
- ✅ Data schema (`src/data/schema.ts`): function and class signatures, ListNode/TreeNode, compare modes
- ✅ Shared harness (`src/runner/harness.ts`) + Web Worker runner (2.5s per-test timeout, console capture, error line numbers)
- ✅ JS/TS starter-code generator
- ✅ Screens: Map, Intro, Encounter (Run/Throw/Flee/Hint/Reveal), LeetDex, Hall of Fame
- ✅ localStorage progress v1 (`leetmon-progress-v1`) and Reset

### Phase 2: Content ✅
- ✅ 45 problems / 369 tests: 10 types × (3 wild + 1 gym), Elite Four (4), Champion (1)
- ✅ Gym leaders, Elite Four, and Champion with names and dialogue
- ✅ Statements in our own words; expected values cross-checked with brute force; "will time out" claims proven

### Phase 3: Verification ✅
- ✅ `npm run verify`, `npm run e2e:smoke`, `npm run e2e` (full playthrough), production build check
- ✅ Pushed to GitHub: `Losig23/leetmon`

---

## Game design v2: the overworld

### The world
A single linear chain to start (branching can come later):

```
Hello World Village (start, no gym)
  → Route 1  "Hashbrown Meadow"      → Bucketville       (Arrays & Hashing gym)
  → Route 2  "Converging Coast"      → Pincer Port       (Two Pointers gym)
  → Route 3  "Pane Pass"             → Paneford          (Sliding Window gym)
  → Route 4  "Pancake Peaks"         → Stackton          (Stack gym)
  → Route 5  "Halving Hills"         → Midpoint City     (Binary Search gym)
  → Route 6  "Chainlink Canal"       → Chainlink Harbor  (Linked List gym)
  → Route 7  "Recursive Forest"      → Rootwood          (Trees gym)
  → Route 8  "Adjacency Archipelago" → Vertex Village    (Graphs gym)
  → Route 9  "Choose-Unchoose Caverns" → Undoburg        (Backtracking gym)
  → Route 10 "Memo Marsh"            → Memoria           (DP gym)
  → Worst-Case Road (Victory Road)   → Asymptote Summit  (Elite Four + Champion)
```
Route names reuse the existing `route` field in `src/data/types.ts`. Town names are placeholders; rename freely.

### Movement and view
- Top-down **tile map** (grid), player moves one tile at a time with **arrow keys / WASD**. **Enter/Space** talks or interacts; **Esc** opens the menu.
- Collision with trees, water, walls, NPCs. Doors and map edges are **warps** to other maps (town ↔ route ↔ building interior ↔ gym).
- Camera follows the player. Original placeholder art only (CSS/SVG/emoji tiles and sprites). A retro look is nice but secondary.

### Trainers on routes (replaces wild encounters)
- **There are no wild encounters.** Each route has **trainers** standing on or beside the path.
- A trainer **spots you** when you step into their line of sight (N tiles in the direction they face). A "!" appears, they walk up, say a line, and the battle starts. You can also talk to them directly.
- A trainer's "team" is **1–2 random problems from ANY type** (not tied to the route's type). Their problems are fought **in a row**, and you beat the trainer by solving all of them.
- **Difficulty bands by route** keep it fair: Routes 1–3 mostly Easy, 4–7 Easy/Medium, 8–10 Medium, Worst-Case Road Medium/Hard.
- Teams are **rolled once per save** (seeded), so refreshing doesn't reroll them. Prefer problems you haven't solved yet; repeats are allowed when the pool runs out.
- **Fleeing or failing has no penalty**: the trainer stays undefeated and you can retry. Beaten trainers stay beaten. Talking to a beaten trainer can offer an optional rematch with a fresh problem (practice).
- Trainer classes are original, dev-themed, and silly: Intern, Bootcamper, Script Kiddie, Code Reviewer, Night Owl, Hackathon Hero, Recruiter, Staff Engineer, Open-Sourcerer… Each trainer has a name and a one-liner.

### Gym gate
- **You must beat every trainer on the route leading into a town before its gym opens.** Until then, an NPC or sign blocks the gym door ("The leader only sees challengers who cleared Route N").

### Gyms
- A gym is its own interior map: **2–3 gym trainers of the gym's type**, who block the aisle in order, then the **Gym Leader** at the back.
- Gym trainers use problems **from that type's pool** (the existing 3 wild problems per type). The leader uses the existing gym problem and dialogue from `types.ts`.
- Beating the leader awards the badge (same `badges` list as today).

### Towns and buildings
- Each town has the gym plus **2–3 enterable buildings**. Each building is a small interior map with an NPC or two who give flavor dialogue. **They don't do much yet.**
- Buildings are the hooks for **future features** (Phase 5), so make them easy to attach things to: an NPC or object can open a feature panel. Planned examples:
  - **Settings Studio**: IDE theme switcher (dark/light editor windows), UI dark mode, font size, vim keybindings
  - **Library**: per-pattern cheat sheets
  - **Rest House**: review queue (spaced repetition of solved problems)
  - **Stats Office**: accuracy per type, first-try solves, hints used
  - **Practice Dojo**: run a problem with custom input
- Use original names. No "Pokémon Center", "Poké Mart", or official trainer classes.

### League
- After Memoria, **Worst-Case Road** has tougher mixed trainers. **Asymptote Summit** has the Elite Four as rooms fought in sequence (retreating resets the streak, as today), then the Champion, then the Hall of Fame. Reuse `src/data/league.ts`.

### What stays, what goes
- **Stays**: the runner, harness, verify script, problem data, LeetDex (now opened from the Esc menu), Hall of Fame, and EncounterScreen (becomes the **battle screen**, with the trainer's name, class, and line in the header and "Problem 2/2" when a team has more than one).
- **Goes**: MapScreen's route-card grid and random wild encounters. "Caught" becomes **"Solved"** in the LeetDex (the same data).
- **Menu (Esc)**: LeetDex, Badges / Trainer card, Settings (later), Reset save.

### Save format v2
`leetmon-progress-v2` keeps everything in v1 and adds `player { map, x, y, facing }`, `beatenTrainers`, `trainerTeams` (rolled teams), `gymProgress`, and a `seed`. **Migrate v1 saves** automatically: v1 `caught` → `solved`, and keep badges, code, attempts, and hints. Existing badges should open the matching gyms and routes.

---

## Phase 4: Overworld ⬜ (next up)

Build a **vertical slice first**: Hello World Village → Route 1 (2–3 trainers) → Bucketville (2 houses + gym with 2 trainers and the leader). Make it playable and tested end to end, then expand to all towns.

- ⬜ 4.1 **World data model** in `src/data/world/`: maps as ASCII tile grids + legend, warps, NPCs, signs, trainers (id, name, class, facing, sight range, team size, difficulty band), gym config, building interiors. Adding a trainer or building should be **one entry**, like problems.
- ⬜ 4.2 **Save v2 + migration** from v1; seeded team rolling (`trainerTeams`).
- ⬜ 4.3 **Tile engine**: renderer, player movement, collision, camera, warps between maps, interaction key, simple dialogue box.
- ⬜ 4.4 **Route trainers**: line of sight, "!" + walk-up, dialogue → battle; multi-problem teams; win/flee back to the overworld at the same spot.
- ⬜ 4.5 **Gym gate + gym interiors**: blocked until the route is cleared; gym trainers in order; leader; badge.
- ⬜ 4.6 **Town buildings**: 2–3 enterable houses per town with flavor NPCs and a reusable "feature hook" for Phase 5.
- ⬜ 4.7 **Esc menu** (LeetDex, badges/trainer card, reset); retire MapScreen; rename "caught" → "solved" in the UI.
- ⬜ 4.8 **Expand** to all 10 towns and routes, then **Worst-Case Road + Asymptote Summit** (Elite Four rooms + Champion + Hall of Fame).
- ⬜ 4.9 **Tests**: `verify` also validates world data (warps resolve, ids unique, every gym maps to a type, trainer bands have enough problems, and **a BFS proves the league is reachable from the start**). Add dev-only debug hooks (teleport, clear route, grant badges) so the e2e tests don't walk every tile. Rewrite the e2e smoke + playthrough for the overworld.
- ⬜ 4.10 **Docs**: README "How to play", world-data schema ("Adding a trainer / building / town"), controls.

## Phase 5: Building features ⬜ (after the overworld)
- ⬜ 5.1 **Settings Studio**: IDE theme switcher (dark/light + a few CodeMirror themes), UI dark mode, font size, vim keybindings (saved in progress)
- ⬜ 5.2 **Practice Dojo**: run with custom input (JSON args per the signature)
- ⬜ 5.3 **Rest House**: spaced-repetition review queue (solved problems come due after 1/3/7/14 days)
- ⬜ 5.4 **Library**: pattern cheat sheets; per-problem notes (markdown, saved)
- ⬜ 5.5 **Stats Office**: accuracy per type, first-try solves, timer + personal bests per problem

## Phase 6: More content ⬜
- ⬜ 6.1 New type: **Heap / Priority Queue** (Kth Largest in a Stream 703, Last Stone Weight 1046, K Closest Points 973; gym: Find Median from Data Stream 295), which adds a town and route
- ⬜ 6.2 More problems per type, needed for gym trainers and varied route teams (Top K Frequent 347, Product of Array Except Self 238, Two Sum II 167, Permutation in String 567, Search in Rotated Sorted Array 33, Kth Smallest in BST 230, LCA of BST 235, Pacific Atlantic 417, Word Search 79, Word Break 139, LIS 300, Unique Paths 62)
- ⬜ 6.3 New types: Tries, Intervals, Greedy, Bit Manipulation, 2-D DP

## Phase 7: Harness features ⬜
- ⬜ 7.1 `outputArg` for in-place problems (Rotate Image 48, Reorder List 143, Set Matrix Zeroes 73)
- ⬜ 7.2 Cyclic list input for Linked List Cycle 141
- ⬜ 7.3 Graph-node input/output for Clone Graph 133
- ⬜ 7.4 Custom validators for "any valid answer" problems (Course Schedule II 210, Alien Dictionary 269)

## Phase 8: Polish and ship ⬜
- ⬜ 8.1 Resizable split panes; mobile/touch controls
- ⬜ 8.2 Battle transition animations, sound toggle
- ⬜ 8.3 Unit tests for `harness.ts` (vitest) + GitHub Actions (verify/typecheck/build)
- ⬜ 8.4 Static deploy (GitHub Pages, Netlify, or Render static)
- ⬜ 8.5 Export/import save JSON

---

## Prompt for a new chat

Connect the project folder (`/Users/ani/Documents/dev/leetmon`) in the new chat, then paste:

```
I'm continuing work on LeetMon, a web game for practicing LeetCode-style interview problems.
Work directly in my local clone at /Users/ani/Documents/dev/leetmon (also on GitHub as Losig23/leetmon).
Run `npm install`, then read README.md and TASKS.md before changing anything. TASKS.md has the new
design ("Game design v2: the overworld") and the stage breakdown (Phase 4).

Where things stand:
- Stack: React + TypeScript + Vite, no backend. CodeMirror 6 editor; user code runs in a fresh Web Worker
  (src/runner/worker.ts) with a 2.5s per-test timeout; TypeScript is stripped with sucrase.
- src/runner/harness.ts is the shared, pure test harness used by both the worker and scripts/verify.ts.
  Keep it DOM-free.
- Problems: src/data/problems/<type>.ts (schema in src/data/schema.ts, documented in README).
  Types and gym leaders: src/data/types.ts. Elite Four and Champion: src/data/league.ts.
  45 problems / 369 tests.
- The current game is menu-based (src/screens/MapScreen.tsx: pick a route → random wild problem).
  We're replacing it with a walkable top-down overworld: towns linked by routes; trainers on routes who
  challenge you with 1-2 random problems from ANY type (difficulty bands by route); you must beat every
  trainer on a route before that town's gym opens; gyms hold 2-3 same-type trainers before the leader;
  towns have enterable buildings that are mostly flavor for now but must be easy to attach features to
  later (e.g. an IDE dark-mode toggle). The full design is in TASKS.md.
- Keep the practice loop: EncounterScreen becomes the battle screen; the runner, harness, verify script
  and problem data should barely change. Progress moves to save v2 with automatic migration from
  "leetmon-progress-v1".

This session's task: the Phase 4 vertical slice. Do 4.1-4.6 for Hello World Village → Route 1 →
Bucketville (2 houses + gym with 2 trainers and the leader), plus enough of 4.7 and 4.9 to play and test
it end to end. Start with a short plan (world data format, tile engine approach, save v2 shape). Get the
slice playable and tested before expanding. If time remains, continue with the next unchecked stage
in TASKS.md.

Rules:
- No official Pokémon names, sprites, or logos (no "Pokémon Center", "Poké Mart", or official trainer
  classes). Original placeholder art only (CSS/SVG/emoji). In-game terms: LeetDex, Code Capsule.
- New problems: statements in my own words with the LeetCode number/slug; ≥ 5 tests (aim for 6-9 with
  edge cases); derive expected values independently, not from the reference solution; if a statement
  says a slow approach times out, prove it by timing a brute force.
- World data should be as easy to extend as problems (one entry per trainer/building/map), and verify
  should validate it, including that the league is reachable from the start.
- Before finishing, run `npm run verify`, `npm run typecheck`, and `npm run build`. Then start
  `npm run dev` and run the e2e tests (Playwright: set CHROME_PATH or run `npx playwright install
  chromium`). Update the e2e tests for the overworld, using dev-only debug hooks instead of walking
  every tile.
- Update TASKS.md (check off what you finished) and README.md (how to play, controls, world-data schema).
- Don't commit or push. Leave the changes in my working tree; I'll review and commit them myself.

At the very end, give me a ready-to-paste prompt for a new chat to continue with the next stage. Make
it self-contained: where the code is, what's done, what the next stage is, and these same rules
(including "don't commit or push"). Also ask that chat to end with a prompt for the stage after it.
```
