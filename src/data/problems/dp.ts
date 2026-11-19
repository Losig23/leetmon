import type { Problem } from '../schema'

export const dpProblems: Problem[] = [
  {
    id: 'climbing-stairs',
    leetcode: { number: 70, title: 'Climbing Stairs', slug: 'climbing-stairs' },
    creature: 'Stairy',
    type: 'dp',
    role: 'wild',
    difficulty: 'Easy',
    level: 4,
    statement: `A staircase has \`n\` steps. Each move you climb either **1 or 2** steps. How many different sequences of moves get you exactly to the top?

**Constraints**
- 1 ≤ n ≤ 45

The hidden tests include n = 45. Plain recursion without memoization will time out.`,
    signature: { kind: 'function', name: 'climbStairs', params: [{ name: 'n', type: 'number' }], returns: 'number' },
    examples: [
      { args: [2], expected: 2, explain: '1+1 or 2' },
      { args: [3], expected: 3, explain: '1+1+1, 1+2, 2+1' },
    ],
    hiddenTests: [
      { args: [1], expected: 1 },
      { args: [4], expected: 5 },
      { args: [5], expected: 8 },
      { args: [10], expected: 89 },
      { args: [45], expected: 1836311903 },
    ],
    hint: 'To stand on step i, your last move came from step i-1 or i-2. So ways(i) = ways(i-1) + ways(i-2). Keep just the last two values.',
    solution: `function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}`,
  },
  {
    id: 'house-robber',
    leetcode: { number: 198, title: 'House Robber', slug: 'house-robber' },
    creature: 'Burglarbat',
    type: 'dp',
    role: 'wild',
    difficulty: 'Medium',
    level: 18,
    statement: `Houses along a street hold \`nums[i]\` coins each. A sneaky critter wants to take as many coins as possible, but robbing **two adjacent houses** sets off the alarm.

Return the most coins it can take without triggering the alarm.

**Constraints**
- 1 ≤ nums.length ≤ 100
- 0 ≤ nums[i] ≤ 400

Brute-forcing every subset will time out on the 100-house test.`,
    signature: { kind: 'function', name: 'rob', params: [{ name: 'nums', type: 'number[]' }], returns: 'number' },
    examples: [
      { args: [[1, 2, 3, 1]], expected: 4, explain: 'Rob houses 0 and 2: 1 + 3.' },
      { args: [[2, 7, 9, 3, 1]], expected: 12, explain: 'Houses 0, 2, 4: 2 + 9 + 1.' },
    ],
    hiddenTests: [
      { args: [[5]], expected: 5 },
      { args: [[2, 1]], expected: 2 },
      { args: [[1, 2]], expected: 2 },
      { args: [[2, 1, 1, 2]], expected: 4 },
      { args: [[0, 0, 0]], expected: 0 },
      { args: [[10, 1, 1, 10, 1]], expected: 20 },
      { args: [new Array(100).fill(1)], expected: 50 },
    ],
    hint: 'best(i) = max(best(i-1), best(i-2) + nums[i]): either skip house i or rob it and skip its neighbour.',
    solution: `function rob(nums) {
  let prev = 0, cur = 0;
  for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
  return cur;
}`,
  },
  {
    id: 'coin-change',
    leetcode: { number: 322, title: 'Coin Change', slug: 'coin-change' },
    creature: 'Changeling',
    type: 'dp',
    role: 'wild',
    difficulty: 'Medium',
    level: 28,
    statement: `You have unlimited coins of each value in \`coins\`. Return the **fewest coins** that add up to exactly \`amount\`, or \`-1\` if it can't be made.

**Constraints**
- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2³¹ - 1
- 0 ≤ amount ≤ 10⁴

Greedy (always take the biggest coin) gives wrong answers, and plain recursion is too slow.`,
    signature: {
      kind: 'function',
      name: 'coinChange',
      params: [
        { name: 'coins', type: 'number[]' },
        { name: 'amount', type: 'number' },
      ],
      returns: 'number',
    },
    examples: [
      { args: [[1, 2, 5], 11], expected: 3, explain: '5 + 5 + 1' },
      { args: [[2], 3], expected: -1 },
      { args: [[1], 0], expected: 0 },
    ],
    hiddenTests: [
      { args: [[1], 1], expected: 1 },
      { args: [[1], 2], expected: 2 },
      { args: [[2, 5, 10, 1], 27], expected: 4 },
      { args: [[186, 419, 83, 408], 6249], expected: 20 },
      { args: [[3, 7, 405, 436], 8839], expected: 25 },
      { args: [[7, 3], 12], expected: 4 },
    ],
    hint: 'Bottom-up: dp[a] = fewest coins for amount a. dp[0] = 0, and dp[a] = 1 + min(dp[a - c]) over coins c ≤ a.',
    solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
  },
  {
    id: 'edit-distance',
    leetcode: { number: 72, title: 'Edit Distance', slug: 'edit-distance' },
    creature: 'Levenshrew',
    type: 'dp',
    role: 'gym',
    difficulty: 'Medium',
    level: 42,
    statement: `Return the minimum number of single-character edits needed to turn \`word1\` into \`word2\`. An edit is one of:

- **insert** a character,
- **delete** a character,
- **replace** a character.

**Constraints**
- 0 ≤ word1.length, word2.length ≤ 500
- Lowercase English letters only.`,
    signature: {
      kind: 'function',
      name: 'minDistance',
      params: [
        { name: 'word1', type: 'string' },
        { name: 'word2', type: 'string' },
      ],
      returns: 'number',
    },
    examples: [
      { args: ['horse', 'ros'], expected: 3, explain: 'horse → rorse (replace h) → rose (delete r) → ros (delete e)' },
      { args: ['intention', 'execution'], expected: 5 },
    ],
    hiddenTests: [
      { args: ['', ''], expected: 0 },
      { args: ['', 'abc'], expected: 3 },
      { args: ['abc', ''], expected: 3 },
      { args: ['abc', 'abc'], expected: 0 },
      { args: ['kitten', 'sitting'], expected: 3 },
      { args: ['sunday', 'saturday'], expected: 3 },
      { args: ['dinitrophenylhydrazine', 'benzalphenylhydrazone'], expected: 7 },
    ],
    hint: 'dp[i][j] = edits to turn the first i chars of word1 into the first j chars of word2. If the last chars match, dp[i-1][j-1]; else 1 + min(insert, delete, replace).',
    solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = word1[i - 1] === word2[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
  },
]
