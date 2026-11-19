import type { Problem } from '../schema'

export const binarySearchProblems: Problem[] = [
  {
    id: 'binary-search',
    leetcode: { number: 704, title: 'Binary Search', slug: 'binary-search' },
    creature: 'Splitterbug',
    type: 'binary-search',
    role: 'wild',
    difficulty: 'Easy',
    level: 4,
    statement: `\`nums\` is sorted in ascending order with no duplicates. Return the index of \`target\`, or \`-1\` if it isn't there.

Your algorithm must run in **O(log n)** time. (The tests can't measure this, so be honest!)

**Constraints**
- 1 ≤ nums.length ≤ 10⁴
- -10⁴ < nums[i], target < 10⁴`,
    signature: {
      kind: 'function',
      name: 'search',
      params: [
        { name: 'nums', type: 'number[]' },
        { name: 'target', type: 'number' },
      ],
      returns: 'number',
    },
    examples: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    ],
    hiddenTests: [
      { args: [[5], 5], expected: 0 },
      { args: [[5], -5], expected: -1 },
      { args: [[1, 3], 3], expected: 1 },
      { args: [[1, 3, 5, 7, 9], 1], expected: 0 },
      { args: [[1, 3, 5, 7, 9], 10], expected: -1 },
      { args: [[2, 4, 6, 8, 10, 12], 12], expected: 5 },
    ],
    hint: 'Keep [lo, hi] as the range that could still hold the target. Compare the middle and throw away the half that cannot.',
    solution: `function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}`,
  },
  {
    id: 'koko-eating-bananas',
    leetcode: { number: 875, title: 'Koko Eating Bananas', slug: 'koko-eating-bananas' },
    creature: 'Bananape',
    type: 'binary-search',
    role: 'wild',
    difficulty: 'Medium',
    level: 23,
    statement: `There are \`piles[i]\` bananas in pile i. A hungry ape picks an eating speed \`k\` (bananas per hour). Each hour it chooses one pile and eats \`k\` bananas from it; if the pile has fewer than \`k\`, it finishes that pile and waits out the rest of the hour.

Return the **smallest integer \`k\`** that lets it finish every pile within \`h\` hours.

**Constraints**
- 1 ≤ piles.length ≤ 10⁴
- piles.length ≤ h ≤ 10⁹
- 1 ≤ piles[i] ≤ 10⁹

Trying every speed from 1 upward will time out.`,
    signature: {
      kind: 'function',
      name: 'minEatingSpeed',
      params: [
        { name: 'piles', type: 'number[]' },
        { name: 'h', type: 'number' },
      ],
      returns: 'number',
    },
    examples: [
      { args: [[3, 6, 7, 11], 8], expected: 4 },
      { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
      { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
    ],
    hiddenTests: [
      { args: [[1], 1], expected: 1 },
      { args: [[1000000000], 2], expected: 500000000 },
      { args: [[312884470], 312884469], expected: 2 },
      { args: [[2, 2], 2], expected: 2 },
      { args: [[1, 1, 1, 999999999], 10], expected: 142857143 },
      { args: [[805306368, 805306368, 805306368], 1000000000], expected: 3 },
      { args: [new Array(10).fill(1000000000), 10], expected: 1000000000 },
    ],
    hint: 'Binary search on the answer. Hours needed at speed k = Σ ceil(pile / k), which only goes down as k grows.',
    solution: `function minEatingSpeed(piles, h) {
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const k = Math.floor((lo + hi) / 2);
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    if (hours <= h) hi = k; else lo = k + 1;
  }
  return lo;
}`,
  },
  {
    id: 'find-minimum-in-rotated-sorted-array',
    leetcode: {
      number: 153,
      title: 'Find Minimum in Rotated Sorted Array',
      slug: 'find-minimum-in-rotated-sorted-array',
    },
    creature: 'Pivotortoise',
    type: 'binary-search',
    role: 'wild',
    difficulty: 'Medium',
    level: 22,
    statement: `An ascending array of **distinct** numbers was rotated some number of times (possibly zero). For example, \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`.

Return the smallest element in **O(log n)** time.

**Constraints**
- 1 ≤ nums.length ≤ 5000
- -5000 ≤ nums[i] ≤ 5000
- All values are distinct.`,
    signature: { kind: 'function', name: 'findMin', params: [{ name: 'nums', type: 'number[]' }], returns: 'number' },
    examples: [
      { args: [[3, 4, 5, 1, 2]], expected: 1 },
      { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
      { args: [[11, 13, 15, 17]], expected: 11 },
    ],
    hiddenTests: [
      { args: [[1]], expected: 1 },
      { args: [[2, 1]], expected: 1 },
      { args: [[1, 2]], expected: 1 },
      { args: [[5, 1, 2, 3, 4]], expected: 1 },
      { args: [[2, 3, 4, 5, 1]], expected: 1 },
      { args: [[-3, -1, 2, -10, -8]], expected: -10 },
    ],
    hint: 'Compare the middle with the RIGHT end. If nums[mid] > nums[hi], the drop (and the minimum) is to the right of mid; otherwise it is at mid or to its left.',
    solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1; else hi = mid;
  }
  return nums[lo];
}`,
  },
  {
    id: 'median-of-two-sorted-arrays',
    leetcode: { number: 4, title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays' },
    creature: 'Mediantaur',
    type: 'binary-search',
    role: 'gym',
    difficulty: 'Hard',
    level: 50,
    statement: `\`nums1\` and \`nums2\` are each sorted ascending. Return the **median** of all their values combined. With an even total count, the median is the average of the two middle values.

The intended solution runs in **O(log(min(m, n)))**. Merging works too, but try the partition idea: it's the whole point of this gym.

**Constraints**
- 0 ≤ m, n ≤ 1000, and 1 ≤ m + n ≤ 2000
- -10⁶ ≤ values ≤ 10⁶

Answers within 1e-5 are accepted.`,
    signature: {
      kind: 'function',
      name: 'findMedianSortedArrays',
      params: [
        { name: 'nums1', type: 'number[]' },
        { name: 'nums2', type: 'number[]' },
      ],
      returns: 'number',
    },
    compare: 'float',
    examples: [
      { args: [[1, 3], [2]], expected: 2 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
    ],
    hiddenTests: [
      { args: [[], [1]], expected: 1 },
      { args: [[2], []], expected: 2 },
      { args: [[0, 0], [0, 0]], expected: 0 },
      { args: [[1, 2, 3], [4, 5, 6]], expected: 3.5 },
      { args: [[1, 3, 5, 7], [2, 4, 6]], expected: 4 },
      { args: [[-5, -3, -1], [-2]], expected: -2.5 },
      { args: [[100000], [100001]], expected: 100000.5 },
    ],
    hint: 'Binary search a cut in the shorter array; the cut in the other array is forced so the left halves hold half the elements. The cut is right when maxLeft1 ≤ minRight2 and maxLeft2 ≤ minRight1.',
    solution: `function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];
  const m = nums1.length, n = nums2.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i;
    const l1 = i > 0 ? nums1[i - 1] : -Infinity, r1 = i < m ? nums1[i] : Infinity;
    const l2 = j > 0 ? nums2[j - 1] : -Infinity, r2 = j < n ? nums2[j] : Infinity;
    if (l1 <= r2 && l2 <= r1) {
      return (m + n) % 2 ? Math.max(l1, l2) : (Math.max(l1, l2) + Math.min(r1, r2)) / 2;
    }
    if (l1 > r2) hi = i - 1; else lo = i + 1;
  }
  return 0;
}`,
  },
]
