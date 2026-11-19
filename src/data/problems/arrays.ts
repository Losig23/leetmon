import type { Problem } from '../schema'

export const arraysProblems: Problem[] = [
  {
    id: 'two-sum',
    leetcode: { number: 1, title: 'Two Sum', slug: 'two-sum' },
    creature: 'Twosumpup',
    type: 'arrays',
    role: 'wild',
    difficulty: 'Easy',
    level: 5,
    statement: `You get an array of integers \`nums\` and an integer \`target\`. Find the **two different positions** whose values add up to \`target\` and return their indices.

Exactly one valid pair exists, and you can't use the same element twice. Return the two indices in any order.

**Constraints**
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i], target ≤ 10⁹
- Exactly one answer exists.

**Follow-up:** can you beat O(n²)?`,
    signature: {
      kind: 'function',
      name: 'twoSum',
      params: [
        { name: 'nums', type: 'number[]' },
        { name: 'target', type: 'number' },
      ],
      returns: 'number[]',
    },
    compare: 'unordered',
    examples: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], explain: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
    hiddenTests: [
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3] },
      { args: [[1, 5, 1, 5], 10], expected: [1, 3] },
      { args: [[1000000000, -999999999, 5], 1], expected: [0, 1] },
      { args: [Array.from({ length: 10000 }, (_, i) => i * 2), 39994], expected: [9998, 9999] },
    ],
    hint: 'While scanning, remember every value you have seen and where. For each number, ask: have I already seen target - num?',
    solution: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    id: 'valid-anagram',
    leetcode: { number: 242, title: 'Valid Anagram', slug: 'valid-anagram' },
    creature: 'Anagrammit',
    type: 'arrays',
    role: 'wild',
    difficulty: 'Easy',
    level: 8,
    statement: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is a rearrangement of exactly the same letters as \`s\` (same letters, same counts), otherwise \`false\`.

**Constraints**
- 1 ≤ s.length, t.length ≤ 5 · 10⁴
- Both strings contain only lowercase English letters.

**Follow-up:** what would change if the input could contain any Unicode characters?`,
    signature: {
      kind: 'function',
      name: 'isAnagram',
      params: [
        { name: 's', type: 'string' },
        { name: 't', type: 'string' },
      ],
      returns: 'boolean',
    },
    examples: [
      { args: ['anagram', 'nagaram'], expected: true },
      { args: ['rat', 'car'], expected: false },
    ],
    hiddenTests: [
      { args: ['a', 'a'], expected: true },
      { args: ['ab', 'a'], expected: false },
      { args: ['aacc', 'ccac'], expected: false },
      { args: ['listen', 'silent'], expected: true },
      { args: ['aabbcc', 'abcabc'], expected: true },
      { args: ['x', 'y'], expected: false },
    ],
    hint: 'Count how many times each letter appears in s, then "spend" those counts while walking t.',
    solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every((c) => c === 0);
}`,
  },
  {
    id: 'group-anagrams',
    leetcode: { number: 49, title: 'Group Anagrams', slug: 'group-anagrams' },
    creature: 'Clusterkat',
    type: 'arrays',
    role: 'wild',
    difficulty: 'Medium',
    level: 22,
    statement: `You're given a list of strings \`strs\`. Put words that are anagrams of each other into the same group and return the list of groups.

The groups can be in any order, and so can the words inside each group.

**Constraints**
- 1 ≤ strs.length ≤ 10⁴
- 0 ≤ strs[i].length ≤ 100
- Words contain only lowercase English letters.`,
    signature: {
      kind: 'function',
      name: 'groupAnagrams',
      params: [{ name: 'strs', type: 'string[]' }],
      returns: 'string[][]',
    },
    compare: 'unorderedDeep',
    examples: [
      {
        args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']],
      },
      { args: [['']], expected: [['']] },
      { args: [['a']], expected: [['a']] },
    ],
    hiddenTests: [
      { args: [['abc', 'bca', 'cab', 'xyz', 'zyx', 'q']], expected: [['abc', 'bca', 'cab'], ['xyz', 'zyx'], ['q']] },
      { args: [['', '', 'a']], expected: [['', ''], ['a']] },
      { args: [['ab', 'ba', 'abc', 'cba', 'bac', 'a']], expected: [['ab', 'ba'], ['abc', 'cba', 'bac'], ['a']] },
      { args: [['aab', 'aba', 'baa', 'abb']], expected: [['aab', 'aba', 'baa'], ['abb']] },
      { args: [['dog', 'god', 'odg', 'cat']], expected: [['dog', 'god', 'odg'], ['cat']] },
    ],
    hint: 'Anagrams share a "signature": the sorted letters, or a 26-letter count. Use it as a hash map key.',
    solution: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const w of strs) {
    const key = w.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`,
  },
  {
    id: 'longest-consecutive-sequence',
    leetcode: { number: 128, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence' },
    creature: 'Streakwyrm',
    type: 'arrays',
    role: 'gym',
    difficulty: 'Medium',
    level: 32,
    statement: `Given an **unsorted** array of integers \`nums\`, return the length of the longest run of consecutive integers (like 4, 5, 6, 7) that can be formed from its values. The values don't need to be next to each other in the array, and duplicates count once.

Aim for **O(n)** time. The hidden tests include a 100,000-element case that punishes quadratic scanning.

**Constraints**
- 0 ≤ nums.length ≤ 10⁵
- -10⁹ ≤ nums[i] ≤ 10⁹`,
    signature: {
      kind: 'function',
      name: 'longestConsecutive',
      params: [{ name: 'nums', type: 'number[]' }],
      returns: 'number',
    },
    examples: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4, explain: 'The run is 1, 2, 3, 4.' },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    ],
    hiddenTests: [
      { args: [[]], expected: 0 },
      { args: [[1]], expected: 1 },
      { args: [[1, 2, 0, 1]], expected: 3 },
      { args: [[9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]], expected: 7 },
      { args: [[5, 5, 5]], expected: 1 },
      { args: [[-3, -2, -1, 10, 11]], expected: 3 },
      { args: [Array.from({ length: 100000 }, (_, i) => i + 1)], expected: 100000 },
    ],
    hint: 'Put everything in a Set. Only start counting from numbers that begin a run, meaning num - 1 is NOT in the set.',
    solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const n of set) {
    if (set.has(n - 1)) continue;
    let len = 1;
    while (set.has(n + len)) len++;
    if (len > best) best = len;
  }
  return best;
}`,
  },
]
