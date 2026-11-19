import type { TypeId } from '../data/schema'

/** Why we're fighting this problem. Decides intro text and what a catch unlocks. */
export type Battle =
  | { kind: 'wild' }
  | { kind: 'practice' }
  | { kind: 'gym'; type: TypeId }
  | { kind: 'elite'; index: number }
  | { kind: 'champion' }

export type Screen =
  | { name: 'map' }
  | { name: 'dex' }
  | { name: 'intro'; battle: Battle }
  | { name: 'encounter'; problemId: string; battle: Battle }
  | { name: 'hall' }
