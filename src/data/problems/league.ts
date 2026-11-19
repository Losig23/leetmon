import type { Problem } from '../schema'
import { TREE_NOTE } from './trees'

// Elite Four (fought in order) and the Champion. See src/data/league.ts for the trainers.
const snake = (n: number) =>
  Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r * n + (r % 2 === 0 ? c : n - 1 - c)))

export const leagueProblems: Problem[] = [
  {
    id: 'minimum-window-substring',
    leetcode: { number: 76, title: 'Minimum Window Substring', slug: 'minimum-window-substring' },
    creature: 'Spanseeker',
    type: 'sliding-window',
    secondaryType: 'arrays',
    role: 'elite',
    difficulty: 'Hard',
    level: 55,
    statement: `Return the **shortest contiguous substring** of \`s\` that contains every character of \`t\`, **including duplicates** (if \`t\` has two \`a\`s, the window needs at least two). Return \`""\` if no such window exists.

Every test has exactly one shortest window.

**Constraints**
- 1 ≤ s.length, t.length ≤ 10⁵
- Upper- and lowercase English letters.

**Follow-up:** O(m + n) time.`,
    signature: {
      kind: 'function',
      name: 'minWindow',
      params: [
        { name: 's', type: 'string' },
        { name: 't', type: 'string' },
      ],
      returns: 'string',
    },
    examples: [
      { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { args: ['a', 'a'], expected: 'a' },
      { args: ['a', 'aa'], expected: '', explain: 't needs two a\'s, s only has one.' },
    ],
    hiddenTests: [
      { args: ['ab', 'b'], expected: 'b' },
      { args: ['bba', 'ab'], expected: 'ba' },
      { args: ['aa', 'aa'], expected: 'aa' },
      { args: ['cabwefgewcwaefgcf', 'cae'], expected: 'cwae' },
      { args: ['abc', 'd'], expected: '' },
      { args: ['acbbaca', 'aba'], expected: 'baca' },
    ],
    hint: 'Count what t needs (hash map). Expand right until every count is satisfied, then shrink from the left as long as it stays satisfied, recording the best window each time.',
    solution: `function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let missing = t.length, left = 0, bestL = 0, bestLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      if (need.get(c) > 0) missing--;
      need.set(c, need.get(c) - 1);
    }
    while (missing === 0) {
      if (right - left + 1 < bestLen) { bestLen = right - left + 1; bestL = left; }
      const d = s[left++];
      if (need.has(d)) {
        need.set(d, need.get(d) + 1);
        if (need.get(d) > 0) missing++;
      }
    }
  }
  return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);
}`,
  },
  {
    id: 'longest-increasing-path-in-a-matrix',
    leetcode: { number: 329, title: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix' },
    creature: 'Climbatrix',
    type: 'graphs',
    secondaryType: 'dp',
    role: 'elite',
    difficulty: 'Hard',
    level: 58,
    statement: `Moving up, down, left, or right (no diagonals, no wrapping), find the longest path through \`matrix\` whose values are **strictly increasing**. Return its length (number of cells).

**Constraints**
- 1 ≤ rows, cols ≤ 200
- 0 ≤ matrix[i][j] ≤ 2³¹ - 1

A plain DFS from every cell explodes on the hidden 20×20 "snake" grid. Remember what you've already computed.`,
    signature: {
      kind: 'function',
      name: 'longestIncreasingPath',
      params: [{ name: 'matrix', type: 'number[][]' }],
      returns: 'number',
    },
    examples: [
      { args: [[[9, 9, 4], [6, 6, 8], [2, 1, 1]]], expected: 4, explain: '1 → 2 → 6 → 9' },
      { args: [[[3, 4, 5], [3, 2, 6], [2, 2, 1]]], expected: 4, explain: '3 → 4 → 5 → 6' },
      { args: [[[1]]], expected: 1 },
    ],
    hiddenTests: [
      { args: [[[1, 2]]], expected: 2 },
      { args: [[[7, 7, 7]]], expected: 1 },
      { args: [[[1, 2, 3], [6, 5, 4], [7, 8, 9]]], expected: 9 },
      { args: [snake(20)], expected: 400 },
    ],
    hint: 'Each cell\'s answer depends only on strictly larger neighbours, so the "increasing" graph has no cycles. DFS + memo: best(cell) = 1 + max(best(bigger neighbour)).',
    solution: `function longestIncreasingPath(matrix) {
  const R = matrix.length, C = matrix[0].length;
  const memo = Array.from({ length: R }, () => new Array(C).fill(0));
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const dfs = (r, c) => {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && matrix[nr][nc] > matrix[r][c])
        best = Math.max(best, 1 + dfs(nr, nc));
    }
    return (memo[r][c] = best);
  };
  let ans = 0;
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) ans = Math.max(ans, dfs(r, c));
  return ans;
}`,
  },
  {
    id: 'binary-tree-maximum-path-sum',
    leetcode: { number: 124, title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum' },
    creature: 'Branchwraith',
    type: 'trees',
    secondaryType: 'dp',
    role: 'elite',
    difficulty: 'Hard',
    level: 60,
    statement: `A **path** is a sequence of nodes where each consecutive pair is joined by an edge, and no node appears twice. It doesn't have to pass through the root, but it must contain **at least one** node.

Return the largest possible sum of node values along any path.

${TREE_NOTE}

**Constraints**
- 1 ≤ number of nodes ≤ 3 · 10⁴
- -1000 ≤ Node.val ≤ 1000`,
    signature: {
      kind: 'function',
      name: 'maxPathSum',
      params: [{ name: 'root', type: 'TreeNode' }],
      returns: 'number',
    },
    examples: [
      { args: [[1, 2, 3]], expected: 6, explain: '2 → 1 → 3' },
      { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42, explain: '15 → 20 → 7' },
    ],
    hiddenTests: [
      { args: [[-3]], expected: -3 },
      { args: [[2, -1]], expected: 2 },
      { args: [[-2, -1]], expected: -1 },
      { args: [[1, -2, 3]], expected: 4 },
      { args: [[5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]], expected: 48 },
      { args: [[9, 6, -3, null, null, -6, 2, null, null, 2, null, -6, -6, -6]], expected: 16 },
    ],
    hint: 'Post-order DFS returning the best "downward" path from each node (clamped at 0). At each node, a path bending through it is node.val + leftGain + rightGain; track the global max.',
    solution: `function maxPathSum(root) {
  let best = -Infinity;
  const gain = (node) => {
    if (!node) return 0;
    const l = Math.max(0, gain(node.left));
    const r = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`,
  },
  {
    id: 'russian-doll-envelopes',
    leetcode: { number: 354, title: 'Russian Doll Envelopes', slug: 'russian-doll-envelopes' },
    creature: 'Matryoshkat',
    type: 'binary-search',
    secondaryType: 'dp',
    role: 'elite',
    difficulty: 'Hard',
    level: 62,
    statement: `Each envelope is \`[width, height]\`. One envelope fits inside another only if **both** its width and height are strictly smaller. You can't rotate envelopes.

Return the maximum number of envelopes you can nest one inside another.

**Constraints**
- 1 ≤ envelopes.length ≤ 10⁵
- 1 ≤ width, height ≤ 10⁵

The O(n²) DP times out on the hidden 100,000-envelope test. You need O(n log n).`,
    signature: {
      kind: 'function',
      name: 'maxEnvelopes',
      params: [{ name: 'envelopes', type: 'number[][]' }],
      returns: 'number',
    },
    examples: [
      { args: [[[5, 4], [6, 4], [6, 7], [2, 3]]], expected: 3, explain: '[2,3] → [5,4] → [6,7]' },
      { args: [[[1, 1], [1, 1], [1, 1]]], expected: 1 },
    ],
    hiddenTests: [
      { args: [[[1, 1]]], expected: 1 },
      { args: [[[4, 5], [4, 6], [6, 7], [2, 3], [1, 1]]], expected: 4 },
      { args: [[[1, 3], [3, 5], [6, 7], [6, 8], [8, 4], [9, 5]]], expected: 3 },
      {
        args: [[[2, 100], [3, 200], [4, 300], [5, 500], [5, 400], [5, 250], [6, 370], [6, 360], [7, 380]]],
        expected: 5,
      },
      { args: [[[1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [5, 5], [5, 6], [6, 7], [7, 8]]], expected: 7 },
      { args: [Array.from({ length: 100000 }, (_, i) => [i + 1, i + 1])], expected: 100000 },
    ],
    hint: 'Sort by width ascending, and for equal widths by height DESCENDING (so two equal widths can never chain). Then find the longest strictly increasing subsequence of heights with the patience-sorting binary search.',
    solution: `function maxEnvelopes(envelopes) {
  const env = [...envelopes].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const tails = [];
  for (const [, h] of env) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < h) lo = mid + 1; else hi = mid;
    }
    tails[lo] = h;
  }
  return tails.length;
}`,
  },
  {
    id: 'word-search-ii',
    leetcode: { number: 212, title: 'Word Search II', slug: 'word-search-ii' },
    creature: 'Triedragon',
    type: 'backtracking',
    secondaryType: 'graphs',
    role: 'champion',
    difficulty: 'Hard',
    level: 70,
    statement: `You're given a grid of letters \`board\` and a list of \`words\`. Return every word that can be spelled by a path of **horizontally or vertically adjacent** cells, where a single cell can't be used twice in the same word.

Return the found words in any order.

**Constraints**
- 1 ≤ rows, cols ≤ 12
- 1 ≤ words.length ≤ 3 · 10⁴, 1 ≤ words[i].length ≤ 10
- Lowercase letters only; words are unique.

Searching for each word separately is too slow at the real limits. The champion expects a **prefix tree (trie)** so one DFS checks all words at once.`,
    signature: {
      kind: 'function',
      name: 'findWords',
      params: [
        { name: 'board', type: 'string[][]' },
        { name: 'words', type: 'string[]' },
      ],
      returns: 'string[]',
    },
    compare: 'unordered',
    examples: [
      {
        args: [
          [
            ['o', 'a', 'a', 'n'],
            ['e', 't', 'a', 'e'],
            ['i', 'h', 'k', 'r'],
            ['i', 'f', 'l', 'v'],
          ],
          ['oath', 'pea', 'eat', 'rain'],
        ],
        expected: ['eat', 'oath'],
      },
      { args: [[['a', 'b'], ['c', 'd']], ['abcb']], expected: [] },
    ],
    hiddenTests: [
      { args: [[['a']], ['a']], expected: ['a'] },
      { args: [[['a', 'a']], ['aaa']], expected: [] },
      {
        args: [
          [['a', 'b'], ['c', 'd']],
          ['ab', 'cb', 'ad', 'bd', 'ac', 'ca', 'da', 'bc', 'db', 'adcb', 'dabc', 'abb', 'acb'],
        ],
        expected: ['ab', 'ac', 'bd', 'ca', 'db'],
      },
      {
        args: [
          [
            ['o', 'a', 'b', 'n'],
            ['o', 't', 'a', 'e'],
            ['a', 'h', 'k', 'r'],
            ['a', 'f', 'l', 'v'],
          ],
          ['oa', 'oaa'],
        ],
        expected: ['oa', 'oaa'],
      },
      {
        args: [
          [
            ['a', 'b', 'c'],
            ['a', 'e', 'd'],
            ['a', 'f', 'g'],
          ],
          ['abcdefg', 'gfedcbaaa', 'eaabcdgfa', 'befa', 'dgc', 'ade'],
        ],
        expected: ['abcdefg', 'befa', 'eaabcdgfa', 'gfedcbaaa'],
      },
    ],
    hint: 'Insert all words into a trie. DFS from every cell, walking the trie alongside the board; stop as soon as the prefix is not in the trie. When you reach a word end, record it and clear it so it is not added twice.',
    solution: `function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const c of w) node = node[c] || (node[c] = {});
    node.word = w;
  }
  const R = board.length, C = board[0].length, res = [];
  const dfs = (r, c, parent) => {
    const ch = board[r][c];
    const node = parent[ch];
    if (!node) return;
    if (node.word) { res.push(node.word); node.word = null; }
    board[r][c] = '#';
    if (r > 0) dfs(r - 1, c, node);
    if (r < R - 1) dfs(r + 1, c, node);
    if (c > 0) dfs(r, c - 1, node);
    if (c < C - 1) dfs(r, c + 1, node);
    board[r][c] = ch;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) dfs(r, c, root);
  return res;
}`,
  },
]
