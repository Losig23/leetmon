import type { Problem } from '../schema'

export const stackProblems: Problem[] = [
  {
    id: 'valid-parentheses',
    leetcode: { number: 20, title: 'Valid Parentheses', slug: 'valid-parentheses' },
    creature: 'Bracketoad',
    type: 'stack',
    role: 'wild',
    difficulty: 'Easy',
    level: 5,
    statement: `The string \`s\` contains only the characters \`( ) [ ] { }\`. Return \`true\` if every bracket is closed by the **same kind** of bracket, in the **correct nesting order**.

**Constraints**
- 1 ≤ s.length ≤ 10⁴
- \`s\` only contains bracket characters.`,
    signature: { kind: 'function', name: 'isValid', params: [{ name: 's', type: 'string' }], returns: 'boolean' },
    examples: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
    ],
    hiddenTests: [
      { args: ['([])'], expected: true },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: ['('], expected: false },
      { args: [')'], expected: false },
      { args: ['(('], expected: false },
      { args: ['){'], expected: false },
    ],
    hint: 'Push openers. On a closer, the top of the stack must be its matching opener. At the end, the stack must be empty.',
    solution: `function isValid(s) {
  const pair = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const c of s) {
    if (c in pair) {
      if (st.pop() !== pair[c]) return false;
    } else st.push(c);
  }
  return st.length === 0;
}`,
  },
  {
    id: 'min-stack',
    leetcode: { number: 155, title: 'Min Stack', slug: 'min-stack' },
    creature: 'Minimoth',
    type: 'stack',
    role: 'wild',
    difficulty: 'Medium',
    level: 19,
    statement: `Design a stack that also reports its smallest element in **O(1)** time. Implement \`MinStack\`:

- \`constructor()\`: start with an empty stack.
- \`push(val)\`: put \`val\` on top.
- \`pop()\`: remove the top element.
- \`top()\`: return the top element.
- \`getMin()\`: return the smallest element currently in the stack.

\`pop\`, \`top\`, and \`getMin\` are only called on a non-empty stack. Every method must run in constant time.

**How tests work:** each test is a list of operations, and the expected output lists what each call returns (\`null\` for the constructor and for \`push\`/\`pop\`).`,
    signature: {
      kind: 'class',
      className: 'MinStack',
      constructorParams: [],
      methods: [
        { name: 'push', params: [{ name: 'val', type: 'number' }], returns: 'void' },
        { name: 'pop', params: [], returns: 'void' },
        { name: 'top', params: [], returns: 'number' },
        { name: 'getMin', params: [], returns: 'number' },
      ],
    },
    examples: [
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
          [[], [-2], [0], [-3], [], [], [], []],
        ],
        expected: [null, null, null, null, -3, null, 0, -2],
      },
    ],
    hiddenTests: [
      { args: [['MinStack', 'push', 'getMin', 'top'], [[], [5], [], []]], expected: [null, null, 5, 5] },
      {
        args: [['MinStack', 'push', 'push', 'getMin', 'pop', 'getMin'], [[], [2], [2], [], [], []]],
        expected: [null, null, null, 2, null, 2],
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin'],
          [[], [3], [1], [1], [], [], [], [], []],
        ],
        expected: [null, null, null, null, 1, null, 1, null, 3],
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'top', 'pop', 'getMin', 'push', 'getMin'],
          [[], [0], [1], [0], [], [], [], [-1], []],
        ],
        expected: [null, null, null, null, 0, null, 0, null, -1],
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'getMin', 'pop', 'top', 'push', 'getMin'],
          [[], [2147483646], [-2147483648], [], [], [], [7], []],
        ],
        expected: [null, null, null, -2147483648, null, 2147483646, null, 7],
      },
      {
        args: [
          ['MinStack', 'push', 'push', 'push', 'push', 'getMin', 'pop', 'getMin', 'pop', 'getMin', 'pop', 'getMin'],
          [[], [5], [4], [3], [6], [], [], [], [], [], [], []],
        ],
        expected: [null, null, null, null, null, 3, null, 3, null, 4, null, 5],
      },
    ],
    hint: 'Store, next to every value, the minimum of the stack at the moment it was pushed (or keep a second stack of minimums).',
    solution: `class MinStack {
  constructor() { this.st = []; }
  push(val) {
    const m = this.st.length ? Math.min(val, this.st[this.st.length - 1][1]) : val;
    this.st.push([val, m]);
  }
  pop() { this.st.pop(); }
  top() { return this.st[this.st.length - 1][0]; }
  getMin() { return this.st[this.st.length - 1][1]; }
}`,
  },
  {
    id: 'daily-temperatures',
    leetcode: { number: 739, title: 'Daily Temperatures', slug: 'daily-temperatures' },
    creature: 'Thermowl',
    type: 'stack',
    role: 'wild',
    difficulty: 'Medium',
    level: 25,
    statement: `\`temperatures[i]\` is the temperature on day i. For each day, find how many days you'd wait until a **strictly warmer** day. If no warmer day ever comes, use \`0\`.

Return the array of waits.

**Constraints**
- 1 ≤ temperatures.length ≤ 2 · 10⁵
- 30 ≤ temperatures[i] ≤ 100

O(n²) will time out on a hidden test.`,
    signature: {
      kind: 'function',
      name: 'dailyTemperatures',
      params: [{ name: 'temperatures', type: 'number[]' }],
      returns: 'number[]',
    },
    examples: [
      { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
      { args: [[30, 60, 90]], expected: [1, 1, 0] },
    ],
    hiddenTests: [
      { args: [[50]], expected: [0] },
      { args: [[90, 80, 70]], expected: [0, 0, 0] },
      { args: [[70, 70, 71]], expected: [2, 1, 0] },
      { args: [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78]], expected: [3, 1, 1, 2, 1, 1, 0, 1, 1, 0] },
      {
        args: [Array.from({ length: 200000 }, (_, i) => (i < 199999 ? 50 : 51))],
        expected: Array.from({ length: 200000 }, (_, i) => (i < 199999 ? 199999 - i : 0)),
      },
    ],
    hint: 'Monotonic stack of indices still waiting for a warmer day. Each new day pops (and answers) every colder day on top.',
    solution: `function dailyTemperatures(temperatures) {
  const res = new Array(temperatures.length).fill(0);
  const st = [];
  for (let i = 0; i < temperatures.length; i++) {
    while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) {
      const j = st.pop();
      res[j] = i - j;
    }
    st.push(i);
  }
  return res;
}`,
  },
  {
    id: 'largest-rectangle-in-histogram',
    leetcode: { number: 84, title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram' },
    creature: 'Skylinox',
    type: 'stack',
    role: 'gym',
    difficulty: 'Hard',
    level: 47,
    statement: `\`heights\` describes a histogram whose bars are all 1 unit wide. Return the area of the largest axis-aligned rectangle that fits entirely inside the histogram.

**Constraints**
- 1 ≤ heights.length ≤ 10⁵
- 0 ≤ heights[i] ≤ 10⁴ (one hidden test uses taller bars; the answer still fits in a JS number)

O(n²) will time out on the hidden tests.`,
    signature: {
      kind: 'function',
      name: 'largestRectangleArea',
      params: [{ name: 'heights', type: 'number[]' }],
      returns: 'number',
    },
    examples: [
      { args: [[2, 1, 5, 6, 2, 3]], expected: 10, explain: 'Bars 5 and 6 form a 2 × 5 rectangle.' },
      { args: [[2, 4]], expected: 4 },
    ],
    hiddenTests: [
      { args: [[1]], expected: 1 },
      { args: [[0]], expected: 0 },
      { args: [[2, 2, 2, 2]], expected: 8 },
      { args: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 },
      { args: [[1, 2, 3, 4, 5]], expected: 9 },
      { args: [[5, 4, 3, 2, 1]], expected: 9 },
      { args: [[2, 1, 2]], expected: 3 },
      { args: [Array.from({ length: 100000 }, (_, i) => i + 1)], expected: 2500050000 },
    ],
    hint: 'For each bar, find how far it can stretch left and right before hitting a shorter bar. A stack of increasing heights tells you exactly that when a bar gets popped.',
    solution: `function largestRectangleArea(heights) {
  const st = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (st.length && heights[st[st.length - 1]] >= h) {
      const height = heights[st.pop()];
      const left = st.length ? st[st.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }
    st.push(i);
  }
  return best;
}`,
  },
]
