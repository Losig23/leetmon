import type { Problem } from '../schema'

export const TREE_NOTE = `**Test format:** trees are written in level order with \`null\` for missing children, e.g. \`[3,9,20,null,null,15,7]\`, and \`[]\` is an empty tree. The harness builds real \`TreeNode\` objects for you, and returned trees are read back the same way.`

export const treesProblems: Problem[] = [
  {
    id: 'invert-binary-tree',
    leetcode: { number: 226, title: 'Invert Binary Tree', slug: 'invert-binary-tree' },
    creature: 'Mirrorbark',
    type: 'trees',
    role: 'wild',
    difficulty: 'Easy',
    level: 7,
    statement: `Mirror a binary tree: swap the left and right child of **every** node. Return the root.

${TREE_NOTE}

**Constraints**
- 0 ≤ number of nodes ≤ 100
- -100 ≤ Node.val ≤ 100`,
    signature: { kind: 'function', name: 'invertTree', params: [{ name: 'root', type: 'TreeNode' }], returns: 'TreeNode' },
    examples: [
      { args: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
      { args: [[2, 1, 3]], expected: [2, 3, 1] },
      { args: [[]], expected: [] },
    ],
    hiddenTests: [
      { args: [[1]], expected: [1] },
      { args: [[1, 2]], expected: [1, null, 2] },
      { args: [[1, null, 2]], expected: [1, 2] },
      { args: [[3, 1, 5, null, 2, 4]], expected: [3, 5, 1, null, 4, 2] },
    ],
    hint: 'Recursion: invert the left subtree, invert the right subtree, then swap them. Base case: null.',
    solution: `function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;
  return root;
}`,
  },
  {
    id: 'binary-tree-level-order-traversal',
    leetcode: { number: 102, title: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
    creature: 'Layerlark',
    type: 'trees',
    role: 'wild',
    difficulty: 'Medium',
    level: 18,
    statement: `Return the values of a binary tree **level by level**: one inner array per depth, each read left to right.

${TREE_NOTE}

**Constraints**
- 0 ≤ number of nodes ≤ 2000
- -1000 ≤ Node.val ≤ 1000`,
    signature: {
      kind: 'function',
      name: 'levelOrder',
      params: [{ name: 'root', type: 'TreeNode' }],
      returns: 'number[][]',
    },
    examples: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { args: [[1]], expected: [[1]] },
      { args: [[]], expected: [] },
    ],
    hiddenTests: [
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1], [2, 3], [4, 5, 6, 7]] },
      { args: [[1, 2, null, 3, null, 4]], expected: [[1], [2], [3], [4]] },
      { args: [[1, null, 2, null, 3]], expected: [[1], [2], [3]] },
      { args: [[0, -1, 1, -2, null, null, 2]], expected: [[0], [-1, 1], [-2, 2]] },
    ],
    hint: 'BFS with a queue. Before processing a level, note the queue length: exactly that many nodes belong to the current level.',
    solution: `function levelOrder(root) {
  const res = [];
  let level = root ? [root] : [];
  while (level.length) {
    res.push(level.map((n) => n.val));
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return res;
}`,
  },
  {
    id: 'validate-binary-search-tree',
    leetcode: { number: 98, title: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree' },
    creature: 'Orderoak',
    type: 'trees',
    role: 'wild',
    difficulty: 'Medium',
    level: 24,
    statement: `Return \`true\` if the tree is a valid **binary search tree**:

- every value in a node's **left subtree** is strictly less than the node's value,
- every value in its **right subtree** is strictly greater,
- and both subtrees are themselves valid BSTs.

Careful: checking only a node against its direct children isn't enough.

${TREE_NOTE}

**Constraints**
- 1 ≤ number of nodes ≤ 10⁴
- -2³¹ ≤ Node.val ≤ 2³¹ - 1`,
    signature: {
      kind: 'function',
      name: 'isValidBST',
      params: [{ name: 'root', type: 'TreeNode' }],
      returns: 'boolean',
    },
    examples: [
      { args: [[2, 1, 3]], expected: true },
      { args: [[5, 1, 4, null, null, 3, 6]], expected: false, explain: 'The right child 4 is smaller than the root 5.' },
    ],
    hiddenTests: [
      { args: [[1]], expected: true },
      { args: [[1, 1]], expected: false },
      { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
      { args: [[10, 5, 15, null, null, 12, 20]], expected: true },
      { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true },
      { args: [[-2147483648]], expected: true },
      { args: [[2147483647, 2147483647]], expected: false },
      { args: [[32, 26, 47, 19, null, null, 56, null, 27]], expected: false },
    ],
    hint: 'Pass down an allowed (low, high) range. Going left tightens high to the node value; going right tightens low. (An in-order walk must also be strictly increasing.)',
    solution: `function isValidBST(root) {
  const ok = (node, lo, hi) => {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  };
  return ok(root, -Infinity, Infinity);
}`,
  },
  {
    id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    leetcode: {
      number: 105,
      title: 'Construct Binary Tree from Preorder and Inorder Traversal',
      slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    },
    creature: 'Sproutsmith',
    type: 'trees',
    role: 'gym',
    difficulty: 'Medium',
    level: 38,
    statement: `You're given two traversals of the same binary tree, which has **unique** values:

- \`preorder\`: node, then left subtree, then right subtree
- \`inorder\`: left subtree, then node, then right subtree

Rebuild the tree and return its root.

${TREE_NOTE}

**Constraints**
- 1 ≤ preorder.length ≤ 3000, inorder.length = preorder.length
- All values are unique and -3000 ≤ value ≤ 3000.`,
    signature: {
      kind: 'function',
      name: 'buildTree',
      params: [
        { name: 'preorder', type: 'number[]' },
        { name: 'inorder', type: 'number[]' },
      ],
      returns: 'TreeNode',
    },
    examples: [
      { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
      { args: [[-1], [-1]], expected: [-1] },
    ],
    hiddenTests: [
      { args: [[1, 2], [2, 1]], expected: [1, 2] },
      { args: [[1, 2], [1, 2]], expected: [1, null, 2] },
      { args: [[1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7]], expected: [1, 2, 3, 4, 5, 6, 7] },
      { args: [[3, 1, 2, 4], [1, 2, 3, 4]], expected: [3, 1, 4, null, 2] },
      { args: [[1, 2, 3, 4], [4, 3, 2, 1]], expected: [1, 2, null, 3, null, 4] },
    ],
    hint: 'preorder[0] is the root. Its position in inorder splits the remaining values into left and right subtrees (and tells you their sizes). Use a value→index map so the split is O(1).',
    solution: `function buildTree(preorder, inorder) {
  const idx = new Map(inorder.map((v, i) => [v, i]));
  let p = 0;
  const build = (lo, hi) => {
    if (lo > hi) return null;
    const val = preorder[p++];
    const node = new TreeNode(val);
    const mid = idx.get(val);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  };
  return build(0, inorder.length - 1);
}`,
  },
]
