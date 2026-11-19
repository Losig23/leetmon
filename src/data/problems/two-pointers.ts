import type { Problem } from '../schema'

export const twoPointersProblems: Problem[] = [
  {
    id: 'valid-palindrome',
    leetcode: { number: 125, title: 'Valid Palindrome', slug: 'valid-palindrome' },
    creature: 'Racecaroo',
    type: 'two-pointers',
    role: 'wild',
    difficulty: 'Easy',
    level: 6,
    statement: `A phrase counts as a palindrome if, after **lowercasing** it and **dropping everything that isn't a letter or digit**, it reads the same forwards and backwards.

Given a string \`s\`, return \`true\` if it's a palindrome by that rule.

**Constraints**
- 1 ≤ s.length ≤ 2 · 10⁵
- \`s\` is printable ASCII.

**Follow-up:** do it in O(1) extra space, without building a cleaned copy.`,
    signature: { kind: 'function', name: 'isPalindrome', params: [{ name: 's', type: 'string' }], returns: 'boolean' },
    examples: [
      { args: ['A man, a plan, a canal: Panama'], expected: true, explain: 'Cleaned: "amanaplanacanalpanama".' },
      { args: ['race a car'], expected: false },
      { args: [' '], expected: true, explain: 'Cleaned string is empty, and empty reads the same both ways.' },
    ],
    hiddenTests: [
      { args: ['a.'], expected: true },
      { args: ['0P'], expected: false },
      { args: ['ab_a'], expected: true },
      { args: ['Was it a car or a cat I saw?'], expected: true },
      { args: ["No 'x' in Nixon"], expected: true },
      { args: ['abc'], expected: false },
    ],
    hint: 'One pointer at each end. Skip anything that is not alphanumeric, compare lowercase characters, move inward.',
    solution: `function isPalindrome(s) {
  const ok = (c) => /[a-z0-9]/i.test(c);
  let i = 0, j = s.length - 1;
  while (i < j) {
    if (!ok(s[i])) { i++; continue; }
    if (!ok(s[j])) { j--; continue; }
    if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
    i++; j--;
  }
  return true;
}`,
  },
  {
    id: '3sum',
    leetcode: { number: 15, title: '3Sum', slug: '3sum' },
    creature: 'Trioctopus',
    type: 'two-pointers',
    role: 'wild',
    difficulty: 'Medium',
    level: 24,
    statement: `Given an integer array \`nums\`, return every **distinct** triplet of values \`[a, b, c]\` taken from three different positions such that \`a + b + c = 0\`.

The same triplet of values must not appear twice in your answer. Triplets and the numbers inside them can be in any order.

**Constraints**
- 3 ≤ nums.length ≤ 3000
- -10⁵ ≤ nums[i] ≤ 10⁵`,
    signature: { kind: 'function', name: 'threeSum', params: [{ name: 'nums', type: 'number[]' }], returns: 'number[][]' },
    compare: 'unorderedDeep',
    examples: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    ],
    hiddenTests: [
      { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]] },
      { args: [[1, 2, -2, -1]], expected: [] },
      {
        args: [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]],
        expected: [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]],
      },
      { args: [[3, 0, -2, -1, 1, 2]], expected: [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]] },
    ],
    hint: 'Sort first. Fix one number, then run Two Sum II (two pointers) on the rest. Skip equal neighbours to avoid duplicates.',
    solution: `function threeSum(nums) {
  nums = [...nums].sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum < 0) lo++;
      else if (sum > 0) hi--;
      else {
        res.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      }
    }
  }
  return res;
}`,
  },
  {
    id: 'container-with-most-water',
    leetcode: { number: 11, title: 'Container With Most Water', slug: 'container-with-most-water' },
    creature: 'Splashtank',
    type: 'two-pointers',
    role: 'wild',
    difficulty: 'Medium',
    level: 21,
    statement: `\`height[i]\` is the height of a vertical wall standing at x = i. Pick **two** walls; together with the x-axis they form a container whose water level is limited by the shorter wall.

Return the largest amount of water (width × shorter height) any pair of walls can hold.

**Constraints**
- 2 ≤ height.length ≤ 10⁵
- 0 ≤ height[i] ≤ 10⁴

The hidden tests include a 100,000-wall case, so O(n²) will time out.`,
    signature: { kind: 'function', name: 'maxArea', params: [{ name: 'height', type: 'number[]' }], returns: 'number' },
    examples: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, explain: 'Walls at x=1 (8) and x=8 (7): width 7 × height 7.' },
      { args: [[1, 1]], expected: 1 },
    ],
    hiddenTests: [
      { args: [[4, 3, 2, 1, 4]], expected: 16 },
      { args: [[1, 2, 1]], expected: 2 },
      { args: [[2, 3, 4, 5, 18, 17, 6]], expected: 17 },
      { args: [[0, 0]], expected: 0 },
      { args: [[1, 3, 2, 5, 25, 24, 5]], expected: 24 },
      { args: [new Array(100000).fill(10000)], expected: 999990000 },
    ],
    hint: 'Start with the widest container. The shorter wall is the bottleneck, so moving the taller one inward can never help: move the shorter one.',
    solution: `function maxArea(height) {
  let i = 0, j = height.length - 1, best = 0;
  while (i < j) {
    best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
    if (height[i] < height[j]) i++; else j--;
  }
  return best;
}`,
  },
  {
    id: 'trapping-rain-water',
    leetcode: { number: 42, title: 'Trapping Rain Water', slug: 'trapping-rain-water' },
    creature: 'Puddlemonarch',
    type: 'two-pointers',
    role: 'gym',
    difficulty: 'Hard',
    level: 45,
    statement: `\`height\` describes a 1-wide bar chart of terrain. After it rains, water pools in the dips between taller bars.

Return the total units of water trapped.

**Constraints**
- 1 ≤ height.length ≤ 2 · 10⁴ (hidden tests go up to 10⁵)
- 0 ≤ height[i] ≤ 10⁵

Aim for O(n) time, ideally O(1) extra space.`,
    signature: { kind: 'function', name: 'trap', params: [{ name: 'height', type: 'number[]' }], returns: 'number' },
    examples: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    hiddenTests: [
      { args: [[5]], expected: 0 },
      { args: [[1, 2, 3, 4]], expected: 0 },
      { args: [[4, 3, 2, 1]], expected: 0 },
      { args: [[2, 0, 2]], expected: 2 },
      { args: [[3, 0, 0, 2, 0, 4]], expected: 10 },
      { args: [[5, 4, 1, 2]], expected: 1 },
      { args: [[1, ...new Array(99998).fill(0), 1]], expected: 99998 },
    ],
    hint: 'Water above bar i = min(tallest on the left, tallest on the right) - height[i]. Two pointers: always advance the side with the smaller running max.',
    solution: `function trap(height) {
  let i = 0, j = height.length - 1, leftMax = 0, rightMax = 0, water = 0;
  while (i < j) {
    if (height[i] < height[j]) {
      leftMax = Math.max(leftMax, height[i]);
      water += leftMax - height[i];
      i++;
    } else {
      rightMax = Math.max(rightMax, height[j]);
      water += rightMax - height[j];
      j--;
    }
  }
  return water;
}`,
  },
]
