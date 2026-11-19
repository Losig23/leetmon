import type { Problem } from '../schema'

const g = (rows: string[]) => rows.map((r) => r.split(''))

export const graphsProblems: Problem[] = [
  {
    id: 'number-of-islands',
    leetcode: { number: 200, title: 'Number of Islands', slug: 'number-of-islands' },
    creature: 'Atollotl',
    type: 'graphs',
    role: 'wild',
    difficulty: 'Medium',
    level: 20,
    statement: `\`grid\` is a map of \`"1"\` (land) and \`"0"\` (water). An **island** is a group of land cells connected **horizontally or vertically** (not diagonally). Everything outside the grid is water.

Return the number of islands.

**Constraints**
- 1 ≤ rows, cols ≤ 300
- Each cell is the string \`"0"\` or \`"1"\`.`,
    signature: {
      kind: 'function',
      name: 'numIslands',
      params: [{ name: 'grid', type: 'string[][]' }],
      returns: 'number',
    },
    examples: [
      { args: [g(['11110', '11010', '11000', '00000'])], expected: 1 },
      { args: [g(['11000', '11000', '00100', '00011'])], expected: 3 },
    ],
    hiddenTests: [
      { args: [g(['0'])], expected: 0 },
      { args: [g(['1'])], expected: 1 },
      { args: [g(['10101'])], expected: 3 },
      { args: [g(['10', '01'])], expected: 2 },
      { args: [g(['111', '010', '111'])], expected: 1 },
      {
        args: [Array.from({ length: 40 }, (_, r) => Array.from({ length: 40 }, (_, c) => ((r + c) % 2 === 0 ? '1' : '0')))],
        expected: 800,
      },
    ],
    hint: 'Scan every cell. When you find unvisited land, count an island and flood-fill (DFS/BFS) all land connected to it so it is not counted again.',
    solution: `function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  const seen = grid.map((row) => row.map(() => false));
  let count = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] !== '1' || seen[r][c]) continue;
      count++;
      const stack = [[r, c]];
      seen[r][c] = true;
      while (stack.length) {
        const [y, x] = stack.pop();
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ny = y + dy, nx = x + dx;
          if (ny >= 0 && ny < R && nx >= 0 && nx < C && grid[ny][nx] === '1' && !seen[ny][nx]) {
            seen[ny][nx] = true;
            stack.push([ny, nx]);
          }
        }
      }
    }
  }
  return count;
}`,
  },
  {
    id: 'rotting-oranges',
    leetcode: { number: 994, title: 'Rotting Oranges', slug: 'rotting-oranges' },
    creature: 'Moldmander',
    type: 'graphs',
    role: 'wild',
    difficulty: 'Medium',
    level: 25,
    statement: `Each cell of \`grid\` is \`0\` (empty), \`1\` (fresh orange), or \`2\` (rotten orange). Every minute, each fresh orange that is **4-directionally adjacent** to a rotten one becomes rotten.

Return the number of minutes until no fresh orange remains, or \`-1\` if some orange can never rot.

**Constraints**
- 1 ≤ rows, cols ≤ 10
- grid[i][j] is 0, 1, or 2.`,
    signature: {
      kind: 'function',
      name: 'orangesRotting',
      params: [{ name: 'grid', type: 'number[][]' }],
      returns: 'number',
    },
    examples: [
      { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, explain: 'The bottom-left orange is cut off.' },
      { args: [[[0, 2]]], expected: 0, explain: 'No fresh oranges to begin with.' },
    ],
    hiddenTests: [
      { args: [[[0]]], expected: 0 },
      { args: [[[1]]], expected: -1 },
      { args: [[[2, 2], [1, 1]]], expected: 1 },
      { args: [[[2, 1, 1, 1, 1]]], expected: 4 },
      { args: [[[1, 1, 1], [1, 2, 1], [1, 1, 1]]], expected: 2 },
      { args: [[[2, 0, 1]]], expected: -1 },
    ],
    hint: 'Multi-source BFS: put ALL rotten oranges in the queue at minute 0, then spread level by level while counting fresh oranges left.',
    solution: `function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  let queue = [], fresh = 0, minutes = 0;
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  while (queue.length && fresh > 0) {
    const next = [];
    for (const [r, c] of queue)
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; fresh--; next.push([nr, nc]);
        }
      }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
  },
  {
    id: 'course-schedule',
    leetcode: { number: 207, title: 'Course Schedule', slug: 'course-schedule' },
    creature: 'Prereqoon',
    type: 'graphs',
    role: 'wild',
    difficulty: 'Medium',
    level: 27,
    statement: `There are \`numCourses\` courses labelled \`0\` to \`numCourses - 1\`. Each pair \`[a, b]\` in \`prerequisites\` means you must finish course \`b\` before course \`a\`.

Return \`true\` if it's possible to finish every course.

**Constraints**
- 1 ≤ numCourses ≤ 2000
- 0 ≤ prerequisites.length ≤ 5000
- All pairs are distinct.`,
    signature: {
      kind: 'function',
      name: 'canFinish',
      params: [
        { name: 'numCourses', type: 'number' },
        { name: 'prerequisites', type: 'number[][]' },
      ],
      returns: 'boolean',
    },
    examples: [
      { args: [2, [[1, 0]]], expected: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false, explain: 'Each course needs the other first: a cycle.' },
    ],
    hiddenTests: [
      { args: [1, []], expected: true },
      { args: [3, [[1, 0], [2, 1]]], expected: true },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
      { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]], expected: true },
      { args: [5, [[1, 4], [2, 4], [3, 1], [3, 2]]], expected: true },
      { args: [3, [[1, 1]]], expected: false },
      { args: [2, []], expected: true },
    ],
    hint: 'This is cycle detection in a directed graph. Kahn\'s algorithm: repeatedly take courses with zero remaining prerequisites; if you can take all of them, there is no cycle.',
    solution: `function canFinish(numCourses, prerequisites) {
  const indeg = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let taken = 0;
  while (queue.length) {
    const c = queue.pop();
    taken++;
    for (const n of adj[c]) if (--indeg[n] === 0) queue.push(n);
  }
  return taken === numCourses;
}`,
  },
  {
    id: 'word-ladder',
    leetcode: { number: 127, title: 'Word Ladder', slug: 'word-ladder' },
    creature: 'Ladderdillo',
    type: 'graphs',
    role: 'gym',
    difficulty: 'Hard',
    level: 48,
    statement: `Transform \`beginWord\` into \`endWord\` one letter at a time. Every intermediate word, **and** \`endWord\` itself, must appear in \`wordList\` (\`beginWord\` doesn't have to).

Return the number of words in the **shortest** such sequence, counting both ends, or \`0\` if it can't be done.

**Constraints**
- 1 ≤ beginWord.length ≤ 10; all words have the same length
- 1 ≤ wordList.length ≤ 5000
- All words are lowercase; \`beginWord ≠ endWord\`; wordList has no duplicates.`,
    signature: {
      kind: 'function',
      name: 'ladderLength',
      params: [
        { name: 'beginWord', type: 'string' },
        { name: 'endWord', type: 'string' },
        { name: 'wordList', type: 'string[]' },
      ],
      returns: 'number',
    },
    examples: [
      {
        args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']],
        expected: 5,
        explain: 'hit → hot → dot → dog → cog',
      },
      { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0, explain: '"cog" is not in the list.' },
    ],
    hiddenTests: [
      { args: ['a', 'c', ['a', 'b', 'c']], expected: 2 },
      { args: ['hot', 'dog', ['hot', 'dog']], expected: 0 },
      { args: ['hot', 'dog', ['hot', 'dot', 'dog']], expected: 3 },
      { args: ['lost', 'cost', ['most', 'fist', 'lost', 'cost', 'fish']], expected: 2 },
      { args: ['red', 'tax', ['ted', 'tex', 'red', 'tax', 'tad', 'den', 'rex', 'pee']], expected: 4 },
      { args: ['leet', 'code', ['lest', 'leet', 'lose', 'code', 'lode', 'robe', 'lost']], expected: 6 },
    ],
    hint: 'BFS from beginWord where neighbours differ by one letter. To find neighbours fast, try all 26 letters at each position and check a Set (or bucket words by wildcard patterns like "h*t").',
    solution: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  let level = [beginWord], steps = 1;
  words.delete(beginWord);
  while (level.length) {
    const next = [];
    for (const w of level) {
      if (w === endWord) return steps;
      for (let i = 0; i < w.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const cand = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
          if (words.has(cand)) { words.delete(cand); next.push(cand); }
        }
      }
    }
    level = next;
    steps++;
  }
  return 0;
}`,
  },
]
