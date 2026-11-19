import type { Problem } from '../schema'

const LIST_NOTE = `**Test format:** lists are written as arrays, e.g. \`[1,2,3]\` is 1 → 2 → 3, and \`[]\` is \`null\`. The harness builds real \`ListNode\` objects for you and reads your returned list back into an array.`

export const linkedListProblems: Problem[] = [
  {
    id: 'reverse-linked-list',
    leetcode: { number: 206, title: 'Reverse Linked List', slug: 'reverse-linked-list' },
    creature: 'Flipnake',
    type: 'linked-list',
    role: 'wild',
    difficulty: 'Easy',
    level: 6,
    statement: `Given the \`head\` of a singly linked list, reverse it and return the new head.

${LIST_NOTE}

**Constraints**
- 0 ≤ number of nodes ≤ 5000
- -5000 ≤ Node.val ≤ 5000

**Follow-up:** can you do it both iteratively and recursively?`,
    signature: { kind: 'function', name: 'reverseList', params: [{ name: 'head', type: 'ListNode' }], returns: 'ListNode' },
    examples: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { args: [[1, 2]], expected: [2, 1] },
      { args: [[]], expected: [] },
    ],
    hiddenTests: [
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[-1, 0, 1]], expected: [1, 0, -1] },
      { args: [Array.from({ length: 5000 }, (_, i) => i)], expected: Array.from({ length: 5000 }, (_, i) => 4999 - i) },
    ],
    hint: 'Walk the list with prev = null and cur = head. At each node: save next, point cur.next at prev, then step both forward.',
    solution: `function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
  },
  {
    id: 'merge-two-sorted-lists',
    leetcode: { number: 21, title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists' },
    creature: 'Zipperoo',
    type: 'linked-list',
    role: 'wild',
    difficulty: 'Easy',
    level: 9,
    statement: `\`list1\` and \`list2\` are each sorted ascending. Splice their nodes together into one sorted list and return its head. Reuse the existing nodes rather than copying values into new ones.

${LIST_NOTE}

**Constraints**
- 0 ≤ nodes in each list ≤ 50
- -100 ≤ Node.val ≤ 100`,
    signature: {
      kind: 'function',
      name: 'mergeTwoLists',
      params: [
        { name: 'list1', type: 'ListNode' },
        { name: 'list2', type: 'ListNode' },
      ],
      returns: 'ListNode',
    },
    examples: [
      { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
      { args: [[], []], expected: [] },
      { args: [[], [0]], expected: [0] },
    ],
    hiddenTests: [
      { args: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
      { args: [[1, 2, 3], []], expected: [1, 2, 3] },
      { args: [[-3, 0, 7], [-2, 0, 8, 9]], expected: [-3, -2, 0, 0, 7, 8, 9] },
      { args: [[2], [1]], expected: [1, 2] },
    ],
    hint: 'Use a dummy node as the head of the result and a tail pointer. Repeatedly attach the smaller front node, then attach whatever is left over.',
    solution: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
    else { tail.next = list2; list2 = list2.next; }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
  },
  {
    id: 'remove-nth-node-from-end-of-list',
    leetcode: { number: 19, title: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list' },
    creature: 'Snipsnail',
    type: 'linked-list',
    role: 'wild',
    difficulty: 'Medium',
    level: 21,
    statement: `Remove the \`n\`-th node **counting from the end** of the list (n = 1 is the last node) and return the head of the resulting list.

${LIST_NOTE}

**Constraints**
- 1 ≤ number of nodes ≤ 30
- 1 ≤ n ≤ number of nodes

**Follow-up:** can you do it in a single pass?`,
    signature: {
      kind: 'function',
      name: 'removeNthFromEnd',
      params: [
        { name: 'head', type: 'ListNode' },
        { name: 'n', type: 'number' },
      ],
      returns: 'ListNode',
    },
    examples: [
      { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { args: [[1], 1], expected: [] },
      { args: [[1, 2], 1], expected: [1] },
    ],
    hiddenTests: [
      { args: [[1, 2], 2], expected: [2] },
      { args: [[1, 2, 3], 3], expected: [2, 3] },
      { args: [[1, 2, 3], 2], expected: [1, 3] },
      { args: [[10, 20, 30, 40], 4], expected: [20, 30, 40] },
      { args: [[7, 8, 9, 10, 11], 1], expected: [7, 8, 9, 10] },
    ],
    hint: 'Start a fast pointer n steps ahead of a slow one (both from a dummy node before head). Move both until fast hits the end; slow.next is the node to delete.',
    solution: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
  },
  {
    id: 'lru-cache',
    leetcode: { number: 146, title: 'LRU Cache', slug: 'lru-cache' },
    creature: 'Cachedra',
    type: 'linked-list',
    role: 'gym',
    difficulty: 'Medium',
    level: 40,
    statement: `Build a **Least Recently Used** cache with a fixed capacity:

- \`constructor(capacity)\`: create an empty cache that holds at most \`capacity\` keys.
- \`get(key)\`: return the key's value, or \`-1\` if it's absent. A successful \`get\` counts as a use.
- \`put(key, value)\`: insert or update the key (this also counts as a use). If inserting pushes the size over capacity, first **evict the least recently used** key.

Both operations must run in **O(1)** average time. That's the challenge: a hash map alone can't track recency, and a list alone can't find keys fast.

**How tests work:** each test is a list of operations; expected output lists each return value (\`null\` for the constructor and \`put\`).

**Constraints**
- 1 ≤ capacity ≤ 3000
- 0 ≤ key ≤ 10⁴, 0 ≤ value ≤ 10⁵`,
    signature: {
      kind: 'class',
      className: 'LRUCache',
      constructorParams: [{ name: 'capacity', type: 'number' }],
      methods: [
        { name: 'get', params: [{ name: 'key', type: 'number' }], returns: 'number' },
        {
          name: 'put',
          params: [
            { name: 'key', type: 'number' },
            { name: 'value', type: 'number' },
          ],
          returns: 'void',
        },
      ],
    },
    examples: [
      {
        args: [
          ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
        ],
        expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
        explain: 'get(1) makes key 1 recent, so put(3) evicts key 2; put(4) then evicts key 1.',
      },
    ],
    hiddenTests: [
      { args: [['LRUCache', 'put', 'get'], [[1], [2, 1], [2]]], expected: [null, null, 1] },
      {
        args: [['LRUCache', 'put', 'put', 'get', 'get'], [[1], [1, 1], [2, 2], [1], [2]]],
        expected: [null, null, null, -1, 2],
      },
      {
        args: [['LRUCache', 'put', 'put', 'put', 'get'], [[2], [1, 1], [1, 10], [2, 2], [1]]],
        expected: [null, null, null, null, 10],
      },
      {
        args: [
          ['LRUCache', 'get', 'put', 'get', 'put', 'put', 'get', 'get'],
          [[2], [2], [2, 6], [1], [1, 5], [1, 2], [1], [2]],
        ],
        expected: [null, -1, null, -1, null, null, 2, 6],
      },
      {
        args: [
          ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'get'],
          [[2], [2, 1], [1, 1], [2], [4, 1], [1], [2]],
        ],
        expected: [null, null, null, 1, null, -1, 1],
      },
      {
        args: [
          ['LRUCache', 'put', 'put', 'put', 'put', 'get', 'get'],
          [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]],
        ],
        expected: [null, null, null, null, null, -1, 3],
      },
      {
        args: [
          ['LRUCache', 'put', 'put', 'put', 'get', 'get', 'get'],
          [[3], [1, 1], [2, 2], [3, 3], [1], [2], [3]],
        ],
        expected: [null, null, null, null, 1, 2, 3],
      },
    ],
    hint: 'Hash map from key to node + doubly linked list ordered by recency (sentinel head and tail make it painless). In JS, a Map also remembers insertion order: delete and re-set a key to mark it recent.',
    solution: `class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
    this.head = { prev: null, next: null };
    this.tail = { prev: this.head, next: null };
    this.head.next = this.tail;
  }
  _remove(node) { node.prev.next = node.next; node.next.prev = node.prev; }
  _addFront(node) {
    node.next = this.head.next; node.prev = this.head;
    this.head.next.prev = node; this.head.next = node;
  }
  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this._remove(node); this._addFront(node);
    return node.val;
  }
  put(key, value) {
    let node = this.map.get(key);
    if (node) { node.val = value; this._remove(node); this._addFront(node); return; }
    node = { key, val: value, prev: null, next: null };
    this.map.set(key, node); this._addFront(node);
    if (this.map.size > this.cap) {
      const lru = this.tail.prev;
      this._remove(lru); this.map.delete(lru.key);
    }
  }
}`,
  },
]
