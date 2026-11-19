import type { Problem } from '../schema'

export const backtrackingProblems: Problem[] = [
  {
    id: 'subsets',
    leetcode: { number: 78, title: 'Subsets', slug: 'subsets' },
    creature: 'Powersetter',
    type: 'backtracking',
    role: 'wild',
    difficulty: 'Medium',
    level: 17,
    statement: `\`nums\` holds **distinct** integers. Return every possible subset (the power set), including the empty set and \`nums\` itself, with no duplicate subsets.

Order doesn't matter, either between subsets or inside one.

**Constraints**
- 1 ≤ nums.length ≤ 10
- -10 ≤ nums[i] ≤ 10, all distinct`,
    signature: { kind: 'function', name: 'subsets', params: [{ name: 'nums', type: 'number[]' }], returns: 'number[][]' },
    compare: 'unorderedDeep',
    examples: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
      { args: [[0]], expected: [[], [0]] },
    ],
    hiddenTests: [
      { args: [[5, 9]], expected: [[], [5], [9], [5, 9]] },
      { args: [[-1, 1]], expected: [[], [-1], [1], [-1, 1]] },
      { args: [[3, 1]], expected: [[], [3], [1], [1, 3]] },
      { args: [[9, 0, 3]], expected: [[], [9], [0], [3], [9, 0], [9, 3], [0, 3], [9, 0, 3]] },
      {
        args: [[1, 2, 3, 4]],
        expected: [
          [], [1], [2], [3], [4], [1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4],
          [1, 2, 3], [1, 2, 4], [1, 3, 4], [2, 3, 4], [1, 2, 3, 4],
        ],
      },
    ],
    hint: 'For each element, branch twice: include it or skip it. When you run out of elements, record a copy of the current path.',
    solution: `function subsets(nums) {
  const res = [], path = [];
  const go = (i) => {
    if (i === nums.length) { res.push([...path]); return; }
    path.push(nums[i]); go(i + 1); path.pop();
    go(i + 1);
  };
  go(0);
  return res;
}`,
  },
  {
    id: 'permutations',
    leetcode: { number: 46, title: 'Permutations', slug: 'permutations' },
    creature: 'Shufflefox',
    type: 'backtracking',
    role: 'wild',
    difficulty: 'Medium',
    level: 19,
    statement: `\`nums\` holds **distinct** integers. Return every possible ordering (permutation) of them.

The permutations can come in any order, but the order **inside** each permutation obviously matters.

**Constraints**
- 1 ≤ nums.length ≤ 6
- -10 ≤ nums[i] ≤ 10, all distinct`,
    signature: { kind: 'function', name: 'permute', params: [{ name: 'nums', type: 'number[]' }], returns: 'number[][]' },
    compare: 'unordered',
    examples: [
      { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { args: [[0, 1]], expected: [[0, 1], [1, 0]] },
      { args: [[1]], expected: [[1]] },
    ],
    hiddenTests: [
      { args: [[5, 4]], expected: [[5, 4], [4, 5]] },
      { args: [[-1, 0, 1]], expected: [[-1, 0, 1], [-1, 1, 0], [0, -1, 1], [0, 1, -1], [1, -1, 0], [1, 0, -1]] },
      { args: [[2, 9, 4]], expected: [[2, 9, 4], [2, 4, 9], [9, 2, 4], [9, 4, 2], [4, 2, 9], [4, 9, 2]] },
      {
        args: [[1, 2, 3, 4]],
        expected: [
          [1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2],
          [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1],
          [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1],
          [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1],
        ],
      },
    ],
    hint: 'Build the permutation one slot at a time. Try every unused number in the next slot, recurse, then un-use it (backtrack).',
    solution: `function permute(nums) {
  const res = [], path = [], used = new Array(nums.length).fill(false);
  const go = () => {
    if (path.length === nums.length) { res.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      go();
      path.pop(); used[i] = false;
    }
  };
  go();
  return res;
}`,
  },
  {
    id: 'combination-sum',
    leetcode: { number: 39, title: 'Combination Sum', slug: 'combination-sum' },
    creature: 'Summonkey',
    type: 'backtracking',
    role: 'wild',
    difficulty: 'Medium',
    level: 26,
    statement: `\`candidates\` holds **distinct** positive integers. Return every unique combination of candidates that adds up to \`target\`. **Each candidate may be used any number of times.**

Two combinations are the same if they use each number the same number of times, so \`[2,2,3]\` and \`[3,2,2]\` count once. Any order is fine.

**Constraints**
- 1 ≤ candidates.length ≤ 30
- 2 ≤ candidates[i] ≤ 40 (hidden tests also use 1)
- 1 ≤ target ≤ 40`,
    signature: {
      kind: 'function',
      name: 'combinationSum',
      params: [
        { name: 'candidates', type: 'number[]' },
        { name: 'target', type: 'number' },
      ],
      returns: 'number[][]',
    },
    compare: 'unorderedDeep',
    examples: [
      { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
      { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
      { args: [[2], 1], expected: [] },
    ],
    hiddenTests: [
      { args: [[1], 1], expected: [[1]] },
      { args: [[1], 2], expected: [[1, 1]] },
      { args: [[3, 4, 5], 8], expected: [[3, 5], [4, 4]] },
      { args: [[8, 7, 4, 3], 11], expected: [[3, 4, 4], [3, 8], [4, 7]] },
      { args: [[5, 10], 3], expected: [] },
    ],
    hint: 'Recurse with a start index: at index i you may take candidates[i] again (stay at i) or move on to i + 1. Never going back to earlier indices prevents duplicate orderings.',
    solution: `function combinationSum(candidates, target) {
  const res = [], path = [];
  const go = (start, remaining) => {
    if (remaining === 0) { res.push([...path]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i] > remaining) continue;
      path.push(candidates[i]);
      go(i, remaining - candidates[i]);
      path.pop();
    }
  };
  go(0, target);
  return res;
}`,
  },
  {
    id: 'n-queens',
    leetcode: { number: 51, title: 'N-Queens', slug: 'n-queens' },
    creature: 'Regalmite',
    type: 'backtracking',
    role: 'gym',
    difficulty: 'Hard',
    level: 44,
    statement: `Place \`n\` chess queens on an \`n × n\` board so that no two attack each other (no shared row, column, or diagonal).

Return **every** distinct arrangement. Each arrangement is a list of \`n\` strings, one per row, using \`"Q"\` for a queen and \`"."\` for an empty square. Arrangements may be returned in any order.

**Constraints**
- 1 ≤ n ≤ 9`,
    signature: { kind: 'function', name: 'solveNQueens', params: [{ name: 'n', type: 'number' }], returns: 'string[][]' },
    compare: 'unordered',
    examples: [
      {
        args: [4],
        expected: [
          ['.Q..', '...Q', 'Q...', '..Q.'],
          ['..Q.', 'Q...', '...Q', '.Q..'],
        ],
      },
      { args: [1], expected: [['Q']] },
    ],
    hiddenTests: [
      { args: [2], expected: [] },
      { args: [3], expected: [] },
      {
        args: [5],
        expected: [
          ['Q....', '..Q..', '....Q', '.Q...', '...Q.'],
          ['Q....', '...Q.', '.Q...', '....Q', '..Q..'],
          ['.Q...', '...Q.', 'Q....', '..Q..', '....Q'],
          ['.Q...', '....Q', '..Q..', 'Q....', '...Q.'],
          ['..Q..', 'Q....', '...Q.', '.Q...', '....Q'],
          ['..Q..', '....Q', '.Q...', '...Q.', 'Q....'],
          ['...Q.', 'Q....', '..Q..', '....Q', '.Q...'],
          ['...Q.', '.Q...', '....Q', '..Q..', 'Q....'],
          ['....Q', '.Q...', '...Q.', 'Q....', '..Q..'],
          ['....Q', '..Q..', 'Q....', '...Q.', '.Q...'],
        ],
      },
      {
        args: [6],
        expected: [
          ['.Q....', '...Q..', '.....Q', 'Q.....', '..Q...', '....Q.'],
          ['..Q...', '.....Q', '.Q....', '....Q.', 'Q.....', '...Q..'],
          ['...Q..', 'Q.....', '....Q.', '.Q....', '.....Q', '..Q...'],
          ['....Q.', '..Q...', 'Q.....', '.....Q', '...Q..', '.Q....'],
        ],
      },
    ],
    hint: 'Place one queen per row. Track used columns and both diagonal directions (row - col and row + col) in Sets so each safety check is O(1).',
    solution: `function solveNQueens(n) {
  const res = [], cols = new Set(), d1 = new Set(), d2 = new Set(), place = [];
  const go = (r) => {
    if (r === n) {
      res.push(place.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c); d1.add(r - c); d2.add(r + c); place.push(c);
      go(r + 1);
      cols.delete(c); d1.delete(r - c); d2.delete(r + c); place.pop();
    }
  };
  go(0);
  return res;
}`,
  },
]
