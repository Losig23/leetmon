import type { Problem } from '../data/schema'
import { formatArgs, formatValue } from './harness'
import type { WorkerMessage, WorkerRequest } from './protocol'
import type { Lang } from './starter'

export const TEST_TIMEOUT_MS = 2500
const STARTUP_TIMEOUT_MS = 5000

export type TestStatus = 'passed' | 'failed' | 'error' | 'timeout' | 'skipped'

export interface TestOutcome {
  index: number
  hidden: boolean
  status: TestStatus
  input: string
  expected: string
  actual?: string
  error?: string
  logs: string[]
  timeMs?: number
}

export interface RunResult {
  mode: 'run' | 'submit'
  compileError?: string
  setupLogs: string[]
  tests: TestOutcome[]
  passedCount: number
  allPassed: boolean
}

export function runCode(problem: Problem, code: string, lang: Lang, mode: 'run' | 'submit'): Promise<RunResult> {
  const cases = mode === 'run' ? problem.examples : [...problem.examples, ...problem.hiddenTests]
  const outcomes: TestOutcome[] = cases.map((t, i) => ({
    index: i,
    hidden: i >= problem.examples.length,
    status: 'skipped',
    input: formatArgs(problem.signature, t.args),
    expected: formatValue(t.expected),
    logs: [],
  }))

  return new Promise((resolve) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    let current = -1
    let setupLogs: string[] = []
    let timer: ReturnType<typeof setTimeout> | undefined

    const finish = (compileError?: string) => {
      clearTimeout(timer)
      worker.terminate()
      const passedCount = outcomes.filter((o) => o.status === 'passed').length
      resolve({
        mode,
        compileError,
        setupLogs,
        tests: outcomes,
        passedCount,
        allPassed: !compileError && passedCount === outcomes.length,
      })
    }

    const arm = (ms: number) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (current >= 0) {
          outcomes[current].status = 'timeout'
          outcomes[current].error = `Time Limit Exceeded: took longer than ${ms / 1000}s (infinite loop or too slow?)`
          finish()
        } else {
          finish('Time Limit Exceeded while loading your code (infinite loop at the top level?)')
        }
      }, ms)
    }

    worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      const msg = e.data
      switch (msg.type) {
        case 'compileError':
          setupLogs = msg.logs
          finish(msg.message)
          break
        case 'compiled':
          setupLogs = msg.logs
          break
        case 'testStart':
          current = msg.index
          arm(TEST_TIMEOUT_MS)
          break
        case 'testResult': {
          const o = outcomes[msg.index]
          o.status = msg.error ? 'error' : msg.passed ? 'passed' : 'failed'
          o.actual = msg.actual
          o.error = msg.error
          o.logs = msg.logs
          o.timeMs = msg.timeMs
          break
        }
        case 'done':
          finish()
          break
      }
    }
    worker.onerror = (e) => {
      e.preventDefault()
      finish(`Worker crashed: ${e.message || 'unknown error'}`)
    }

    arm(STARTUP_TIMEOUT_MS)
    const req: WorkerRequest = {
      code,
      lang,
      signature: problem.signature,
      compare: problem.compare,
      tests: cases,
    }
    worker.postMessage(req)
  })
}
