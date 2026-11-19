export interface LeagueMember {
  name: string
  title: string
  emoji: string
  /** e.g. "Graphs + DP" */
  theme: string
  problemId: string
  dialogue: string
  winLine: string
}

/** Fought in order, 4 in a row. Fleeing resets the streak. */
export const ELITE_FOUR: LeagueMember[] = [
  {
    name: 'Countessa Windowmere',
    title: 'Elite Four',
    emoji: '🦚',
    theme: 'Sliding Window + Hashing',
    problemId: 'minimum-window-substring',
    dialogue:
      'Darling, any window will do... as long as it is the smallest one that contains everything. Count carefully.',
    winLine: 'Minimal and complete. How very elegant of you. Go on.',
  },
  {
    name: 'Sir Memoize-a-Lot',
    title: 'Elite Four',
    emoji: '🛡️',
    theme: 'Graphs + DP',
    problemId: 'longest-increasing-path-in-a-matrix',
    dialogue:
      'I have climbed every hill in this grid. Twice, before I learned to write things down. Climb with me!',
    winLine: 'You cached your way to the summit. I yield!',
  },
  {
    name: 'Baron von Recursion',
    title: 'Elite Four',
    emoji: '🦇',
    theme: 'Trees + DP',
    problemId: 'binary-tree-maximum-path-sum',
    dialogue:
      'To understand my challenge, you must first understand my challenge. Mwahaha! Mind the negative nodes.',
    winLine: 'Your recursion returned... victorious. Proceed.',
  },
  {
    name: 'The Great Bisecto',
    title: 'Elite Four',
    emoji: '🎩',
    theme: 'Binary Search + DP',
    problemId: 'russian-doll-envelopes',
    dialogue:
      'For my final trick, I will fit envelopes inside envelopes inside envelopes... in O(n log n)! Can you?',
    winLine: 'Ta-da! You saw through the trick. The Champion awaits.',
  },
]

export const CHAMPION: LeagueMember = {
  name: 'Champion Ollie Logan',
  title: 'Champion',
  emoji: '👑',
  theme: 'Trie + Backtracking + Grids',
  problemId: 'word-search-ii',
  dialogue:
    "So you beat the Elite Four. Cute. My final problem uses everything: prefix trees, grid DFS, and pruning. Let's go!",
  winLine: 'You are the new LeetMon Champion! Your name goes in the Hall of Fame.',
}
