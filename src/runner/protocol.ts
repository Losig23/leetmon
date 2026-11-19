import type { CompareMode, Signature, TestCase } from '../data/schema'
import type { Lang } from './starter'

export interface WorkerRequest {
  code: string
  lang: Lang
  signature: Signature
  compare?: CompareMode
  tests: TestCase[]
}

export type WorkerMessage =
  | { type: 'compileError'; message: string; logs: string[] }
  | { type: 'compiled'; logs: string[] }
  | { type: 'testStart'; index: number }
  | {
      type: 'testResult'
      index: number
      passed: boolean
      actual: string
      error?: string
      logs: string[]
      timeMs: number
    }
  | { type: 'done' }
