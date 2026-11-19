/// <reference lib="webworker" />
import { transform } from 'sucrase'
import { compileUserCode, createConsoleCapture, describeError, entryName, executeTest } from './harness'
import type { WorkerRequest, WorkerMessage } from './protocol'

const post = (msg: WorkerMessage) => (self as unknown as DedicatedWorkerGlobalScope).postMessage(msg)

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { code, lang, signature, compare, tests } = e.data
  const cap = createConsoleCapture()

  let compiled: unknown
  try {
    const js =
      lang === 'ts'
        ? transform(code, { transforms: ['typescript'], disableESTransforms: true }).code
        : code
    compiled = compileUserCode(js, signature, cap.console)
  } catch (err) {
    post({ type: 'compileError', message: describeError(err), logs: cap.take() })
    return
  }
  if (compiled === undefined) {
    const kind = signature.kind === 'class' ? 'class' : 'function'
    post({
      type: 'compileError',
      message: `Couldn't find a ${kind} named "${entryName(signature)}". Keep the name from the starter code.`,
      logs: cap.take(),
    })
    return
  }
  post({ type: 'compiled', logs: cap.take() })

  for (let i = 0; i < tests.length; i++) {
    post({ type: 'testStart', index: i })
    const t0 = performance.now()
    const res = executeTest(compiled, signature, tests[i], compare)
    post({
      type: 'testResult',
      index: i,
      passed: res.passed,
      actual: res.actual,
      error: res.error,
      logs: cap.take(),
      timeMs: performance.now() - t0,
    })
  }
  post({ type: 'done' })
}
