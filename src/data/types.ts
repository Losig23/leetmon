import type { TypeId } from './schema'

export interface GymLeader {
  name: string
  title: string
  emoji: string
  badge: string
  /** Line shown before the battle. */
  dialogue: string
  /** Line shown after you win. */
  winLine: string
}

export interface PatternType {
  id: TypeId
  name: string
  color: string
  emoji: string
  route: string
  gym: GymLeader
}

/** Catch this many wild problems of a type to unlock its gym. */
export const GYM_UNLOCK_COUNT = 3

export const TYPES: PatternType[] = [
  {
    id: 'arrays',
    name: 'Arrays & Hashing',
    color: '#e0a030',
    emoji: '🔢',
    route: 'Hashbrown Meadow',
    gym: {
      name: 'Hashley Mapleton',
      title: 'the Collision Collector',
      emoji: '🗂️',
      badge: 'Bucket Badge',
      dialogue:
        "Every key has a place, and every place has a key! Let's see if your lookups are O(1)... or O(oh no).",
      winLine: 'Hash it out, champ. The Bucket Badge is yours, no collisions.',
    },
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    color: '#4fb0c6',
    emoji: '↔️',
    route: 'Converging Coast',
    gym: {
      name: 'Lefty & Righty',
      title: 'the Opposite-End Twins',
      emoji: '👯',
      badge: 'Pincer Badge',
      dialogue:
        'We start at opposite ends and we never look back! ...Unless the sum is too big. Then Righty looks back.',
      winLine: "You squeezed us right in the middle. Take the Pincer Badge!",
    },
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    color: '#7cc46a',
    emoji: '🪟',
    route: 'Pane Pass',
    gym: {
      name: 'Windy Framesworth',
      title: 'the Pane in the Neck',
      emoji: '🌬️',
      badge: 'Pane Badge',
      dialogue:
        "My window only grows when it's valid and only shrinks when it isn't. Just like my patience!",
      winLine: 'Smooth slide. The Pane Badge is yours. No refunds.',
    },
  },
  {
    id: 'stack',
    name: 'Stack',
    color: '#c46a9e',
    emoji: '🥞',
    route: 'Pancake Peaks',
    gym: {
      name: 'Stacy LIFO',
      title: 'the Last One In',
      emoji: '🍽️',
      badge: 'Plate Badge',
      dialogue:
        "Last in, first out. That's how I treat challengers too. You were the last one in. Guess who's out first?",
      winLine: "You popped me clean off the top. Here's the Plate Badge.",
    },
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    color: '#8a7be0',
    emoji: '🔍',
    route: 'Halving Hills',
    gym: {
      name: 'Midge Lohi',
      title: 'the Halfway Hermit',
      emoji: '🧭',
      badge: 'Halfway Badge',
      dialogue:
        'I can find anything in logarithmic time. Except my car keys. Those are unsorted.',
      winLine: 'You found the answer before I finished halving. Take the Halfway Badge!',
    },
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    color: '#e07b5a',
    emoji: '⛓️',
    route: 'Chainlink Canal',
    gym: {
      name: 'Nell Nextly',
      title: 'the Pointer Captain',
      emoji: '⚓',
      badge: 'Link Badge',
      dialogue:
        "Drop one pointer and the whole list floats away. Hold on tight, sailor. This one's a memory test!",
      winLine: "Not a single node lost overboard. The Link Badge is yours.",
    },
  },
  {
    id: 'trees',
    name: 'Trees',
    color: '#4caf7a',
    emoji: '🌳',
    route: 'Recursive Forest',
    gym: {
      name: 'Rooty Branchwell',
      title: 'the Base-Case Ranger',
      emoji: '🪵',
      badge: 'Leaf Badge',
      dialogue:
        "Every great tree starts with a base case. Let's find out if you can climb back up the call stack!",
      winLine: 'You grew that tree from scratch. Take the Leaf Badge and branch out!',
    },
  },
  {
    id: 'graphs',
    name: 'Graphs',
    color: '#5a8ee0',
    emoji: '🕸️',
    route: 'Adjacency Archipelago',
    gym: {
      name: 'Vertexia Edgeworth',
      title: 'the Island Cartographer',
      emoji: '🗺️',
      badge: 'Edge Badge',
      dialogue:
        "Islands, courses, oranges... squint and it's all nodes and edges. Don't forget your visited set!",
      winLine: 'Shortest path to victory: found. The Edge Badge is yours.',
    },
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    color: '#b0b04f',
    emoji: '↩️',
    route: 'Choose-Unchoose Caverns',
    gym: {
      name: 'Revert Randall',
      title: 'the Undo Spelunker',
      emoji: '🔦',
      badge: 'Branch Badge',
      dialogue:
        "Choose. Explore. Un-choose. I've tried every path in this cave and I'm still not sure I'm in the right one.",
      winLine: "You pruned your way out. Take the Branch Badge. I'll be in here a while longer.",
    },
  },
  {
    id: 'dp',
    name: 'Dynamic Programming',
    color: '#d05050',
    emoji: '🧮',
    route: 'Memo Marsh',
    gym: {
      name: 'Professor Tabulata',
      title: 'the Subproblem Sage',
      emoji: '📜',
      badge: 'Memo Badge',
      dialogue:
        'Those who cannot remember the past are condemned to recompute it. Show me your recurrence!',
      winLine: "Optimal substructure, optimal trainer. Here's the Memo Badge. I wrote it down so I won't forget.",
    },
  },
]

export const TYPE_BY_ID: Record<TypeId, PatternType> = Object.fromEntries(
  TYPES.map((t) => [t.id, t]),
) as Record<TypeId, PatternType>
