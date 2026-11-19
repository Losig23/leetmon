import type { Problem } from '../schema'

export const slidingWindowProblems: Problem[] = [
  {
    id: 'best-time-to-buy-and-sell-stock',
    leetcode: { number: 121, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock' },
    creature: 'Stonkling',
    type: 'sliding-window',
    role: 'wild',
    difficulty: 'Easy',
    level: 7,
    statement: `\`prices[i]\` is a stock's price on day i. You may buy **once** and sell **once**, and the sale must happen on a later day than the purchase.

Return the biggest profit possible, or \`0\` if every trade would lose money.

**Constraints**
- 1 ≤ prices.length ≤ 10⁵
- 0 ≤ prices[i] ≤ 10⁴`,
    signature: { kind: 'function', name: 'maxProfit', params: [{ name: 'prices', type: 'number[]' }], returns: 'number' },
    examples: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5, explain: 'Buy at 1 (day 1), sell at 6 (day 4).' },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
    ],
    hiddenTests: [
      { args: [[1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
      { args: [[3, 2, 6, 5, 0, 3]], expected: 4 },
      { args: [[1, 2]], expected: 1 },
      { args: [[2, 1, 2, 1, 0, 1, 2]], expected: 2 },
      { args: [Array.from({ length: 100000 }, (_, i) => i)], expected: 99999 },
    ],
    hint: 'Walk forward once, tracking the cheapest price seen so far. Each day, the best sale ends today: price - cheapest.',
    solution: `function maxProfit(prices) {
  let lo = Infinity, best = 0;
  for (const p of prices) {
    lo = Math.min(lo, p);
    best = Math.max(best, p - lo);
  }
  return best;
}`,
  },
  {
    id: 'longest-substring-without-repeating-characters',
    leetcode: {
      number: 3,
      title: 'Longest Substring Without Repeating Characters',
      slug: 'longest-substring-without-repeating-characters',
    },
    creature: 'Uniquill',
    type: 'sliding-window',
    role: 'wild',
    difficulty: 'Medium',
    level: 20,
    statement: `Given a string \`s\`, return the length of its longest **contiguous** substring in which no character appears twice.

**Constraints**
- 0 ≤ s.length ≤ 5 · 10⁴
- \`s\` may contain letters, digits, symbols, and spaces.`,
    signature: {
      kind: 'function',
      name: 'lengthOfLongestSubstring',
      params: [{ name: 's', type: 'string' }],
      returns: 'number',
    },
    examples: [
      { args: ['abcabcbb'], expected: 3, explain: '"abc"' },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3, explain: '"wke". Note "pwke" is not contiguous.' },
    ],
    hiddenTests: [
      { args: [''], expected: 0 },
      { args: [' '], expected: 1 },
      { args: ['dvdf'], expected: 3 },
      { args: ['abba'], expected: 2 },
      { args: ['tmmzuxt'], expected: 5 },
      { args: ['au'], expected: 2 },
      { args: ['aab'], expected: 2 },
    ],
    hint: 'Grow a window to the right. When the new character is already inside the window, move the left edge just past its previous position (never backwards!).',
    solution: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (last.has(c) && last.get(c) >= left) left = last.get(c) + 1;
    last.set(c, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  },
  {
    id: 'longest-repeating-character-replacement',
    leetcode: {
      number: 424,
      title: 'Longest Repeating Character Replacement',
      slug: 'longest-repeating-character-replacement',
    },
    creature: 'Swapfinch',
    type: 'sliding-window',
    role: 'wild',
    difficulty: 'Medium',
    level: 26,
    statement: `You have an uppercase string \`s\` and may overwrite **at most \`k\`** of its characters with any other uppercase letter.

Return the length of the longest substring you can make that consists of a single repeated letter.

**Constraints**
- 1 ≤ s.length ≤ 10⁵
- \`s\` has only uppercase English letters.
- 0 ≤ k ≤ s.length`,
    signature: {
      kind: 'function',
      name: 'characterReplacement',
      params: [
        { name: 's', type: 'string' },
        { name: 'k', type: 'number' },
      ],
      returns: 'number',
    },
    examples: [
      { args: ['ABAB', 2], expected: 4, explain: 'Replace both A\'s (or both B\'s).' },
      { args: ['AABABBA', 1], expected: 4, explain: 'Turn the middle A into B: "AABBBBA" has "BBBB".' },
    ],
    hiddenTests: [
      { args: ['A', 0], expected: 1 },
      { args: ['AAAA', 0], expected: 4 },
      { args: ['ABCDE', 1], expected: 2 },
      { args: ['ABBB', 2], expected: 4 },
      { args: ['ABAA', 0], expected: 2 },
      { args: ['AAAB', 0], expected: 3 },
      { args: ['ABCABCABC', 2], expected: 4 },
    ],
    hint: 'A window is fixable when (window length - count of its most frequent letter) ≤ k. Grow right; shrink from the left while it is not fixable.',
    solution: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0, maxFreq = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s.charCodeAt(right) - 65;
    maxFreq = Math.max(maxFreq, ++count[c]);
    while (right - left + 1 - maxFreq > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
  },
  {
    id: 'sliding-window-maximum',
    leetcode: { number: 239, title: 'Sliding Window Maximum', slug: 'sliding-window-maximum' },
    creature: 'Peakpane',
    type: 'sliding-window',
    role: 'gym',
    difficulty: 'Hard',
    level: 46,
    statement: `A window of width \`k\` slides across \`nums\` one step at a time, from the far left to the far right.

Return an array with the **maximum** of each window position.

**Constraints**
- 1 ≤ nums.length ≤ 2 · 10⁵
- -10⁵ ≤ nums[i] ≤ 10⁵
- 1 ≤ k ≤ nums.length

O(n·k) will time out on the hidden tests. Aim for O(n).`,
    signature: {
      kind: 'function',
      name: 'maxSlidingWindow',
      params: [
        { name: 'nums', type: 'number[]' },
        { name: 'k', type: 'number' },
      ],
      returns: 'number[]',
    },
    examples: [
      { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { args: [[1], 1], expected: [1] },
    ],
    hiddenTests: [
      { args: [[1, -1], 1], expected: [1, -1] },
      { args: [[9, 11], 2], expected: [11] },
      { args: [[4, -2], 2], expected: [4] },
      { args: [[7, 2, 4], 2], expected: [7, 4] },
      { args: [[1, 3, 1, 2, 0, 5], 3], expected: [3, 3, 2, 5] },
      {
        args: [Array.from({ length: 200000 }, (_, i) => 100000 - (i >> 1)), 100000],
        expected: Array.from({ length: 100001 }, (_, i) => 100000 - (i >> 1)),
      },
    ],
    hint: 'Keep a deque of indices whose values are decreasing. Pop smaller values off the back before pushing; drop the front once it leaves the window. The front is always the max.',
    solution: `function maxSlidingWindow(nums, k) {
  const dq = new Array(nums.length);
  let head = 0, tail = 0;
  const out = [];
  for (let i = 0; i < nums.length; i++) {
    while (tail > head && nums[dq[tail - 1]] <= nums[i]) tail--;
    dq[tail++] = i;
    if (dq[head] <= i - k) head++;
    if (i >= k - 1) out.push(nums[dq[head]]);
  }
  return out;
}`,
  },
]
