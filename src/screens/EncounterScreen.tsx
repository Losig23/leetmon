import { javascript } from '@codemirror/lang-javascript'
import { Prec } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { keymap } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CodeBall, DifficultyTag, LABELS, Markdown, ProblemSprite, TypeChip } from '../components/bits'
import type { Problem } from '../data/schema'
import { TYPE_BY_ID } from '../data/types'
import type { Battle } from '../game/battle'
import { progress, useProgress } from '../game/progress'
import { formatArgs, formatValue } from '../runner/harness'
import { runCode, type RunResult, type TestOutcome } from '../runner/runCode'
import { starterFor, type Lang } from '../runner/starter'
import { battleOpponent } from './IntroScreen'

interface Props {
  problem: Problem
  battle: Battle
  onFlee: () => void
  onCaughtContinue: () => void
}

type Phase = 'idle' | 'throwing' | 'caught' | 'escaped'

const MIN_THROW_MS = 1400
const REVEAL_AFTER_FAILS = 3

function loadCode(problem: Problem, lang: Lang): string {
  return progress.get().code[problem.id]?.[lang] ?? starterFor(problem, lang)
}

export function EncounterScreen({ problem, battle, onFlee, onCaughtContinue }: Props) {
  const p = useProgress()
  const lang = p.lang
  const [code, setCode] = useState(() => loadCode(problem, lang))
  const [running, setRunning] = useState<null | 'run' | 'submit'>(null)
  const [result, setResult] = useState<RunResult | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [tab, setTab] = useState<'results' | 'console'>('results')
  const [showSolution, setShowSolution] = useState(false)
  const opponent = battleOpponent(battle)
  const type = TYPE_BY_ID[problem.type]
  const caught = !!p.caught[problem.id]
  const attempts = p.attempts[problem.id] ?? 0
  const fails = p.fails[problem.id] ?? 0
  const hintShown = !!p.hints[problem.id]

  useEffect(() => progress.markSeen(problem.id), [problem.id])

  // Debounced autosave of the editor contents.
  useEffect(() => {
    const t = setTimeout(() => {
      const saved = progress.get().code[problem.id]?.[lang]
      if (code === starterFor(problem, lang)) {
        if (saved !== undefined) progress.clearCode(problem.id, lang)
      } else if (saved !== code) {
        progress.saveCode(problem.id, lang, code)
      }
    }, 400)
    return () => clearTimeout(t)
  }, [code, lang, problem])

  const switchLang = (next: Lang) => {
    if (next === lang) return
    progress.saveCode(problem.id, lang, code)
    progress.setLang(next)
    setCode(loadCode(problem, next))
  }

  const execute = async (mode: 'run' | 'submit') => {
    if (running) return
    setRunning(mode)
    setTab('results')
    if (mode === 'submit') setPhase('throwing')
    const started = Date.now()
    const res = await runCode(problem, code, lang, mode)
    if (mode === 'submit') {
      const wait = MIN_THROW_MS - (Date.now() - started)
      if (wait > 0) await new Promise((r) => setTimeout(r, wait))
      progress.recordSubmit(problem.id, res.allPassed)
      if (res.allPassed) {
        if (battle.kind === 'gym') progress.addBadge(battle.type)
        if (battle.kind === 'elite') progress.setEliteIndex(Math.max(progress.get().eliteIndex, battle.index + 1))
        if (battle.kind === 'champion') progress.becomeChampion()
      }
      setPhase(res.allPassed ? 'caught' : 'escaped')
    }
    setResult(res)
    setRunning(null)
  }

  const runRef = useRef(execute)
  runRef.current = execute
  const extensions = useMemo(
    () => [
      javascript({ typescript: lang === 'ts' }),
      Prec.highest(
        keymap.of([
          { key: 'Mod-Shift-Enter', run: () => (void runRef.current('submit'), true) },
          { key: 'Mod-Enter', run: () => (void runRef.current('run'), true) },
        ]),
      ),
    ],
    [lang],
  )

  const flee = () => {
    if (battle.kind === 'elite' && !confirm('Fleeing ends your Elite Four streak. You will restart from the first member. Flee anyway?'))
      return
    onFlee()
  }

  const resetCode = () => {
    if (confirm('Replace your code with the starter code?')) setCode(starterFor(problem, lang))
  }

  const revealSolution = () => {
    if (!caught && !confirm("Reveal the reference solution? Try a hint first if you haven't.")) return
    setShowSolution(true)
  }

  const headline =
    battle.kind === 'wild'
      ? `A wild ${problem.creature} appeared!`
      : battle.kind === 'practice'
        ? `Practice: ${problem.creature}`
        : `${opponent?.member.name ?? 'Your rival'} sent out ${problem.creature}!`

  const spriteClass = phase === 'throwing' ? 'hidden' : phase === 'escaped' ? 'shake' : 'bob'

  return (
    <div className="encounter" style={{ ['--type' as string]: type.color }}>
      <div className="battle-bar panel">
        <div className="battle-sprite">
          <ProblemSprite problem={problem} size={68} className={spriteClass} />
          {phase === 'throwing' && <CodeBall size={44} className="ball-wobble" />}
        </div>
        <div className="battle-info">
          <div className="headline">{headline}</div>
          <div className="chips">
            <span className="lv">Lv.{problem.level}</span>
            <TypeChip type={problem.type} small />
            {problem.secondaryType && <TypeChip type={problem.secondaryType} small />}
            <DifficultyTag d={problem.difficulty} />
            <span className="meta">Throws: {attempts}</span>
            {caught && <span className="meta caught-tag">✔ Caught</span>}
          </div>
        </div>
        <div className="battle-actions">
          <button className="btn small" onClick={flee}>
            🏃 Flee
          </button>
        </div>
      </div>

      <div className="encounter-main">
        <section className="statement panel">
          <h2>{problem.leetcode.title}</h2>
          <a
            className="lc-link"
            href={`https://leetcode.com/problems/${problem.leetcode.slug}/`}
            target="_blank"
            rel="noreferrer"
          >
            LeetCode #{problem.leetcode.number} ↗
          </a>
          <Markdown text={problem.statement} />
          <h3>Examples</h3>
          {problem.examples.map((ex, i) => (
            <div className="example" key={i}>
              <div className="example-title">Example {i + 1}</div>
              <pre>
                <b>Input:</b> {formatArgs(problem.signature, ex.args).replace(/\n/g, ', ')}
                {'\n'}
                <b>Output:</b> {formatValue(ex.expected)}
                {ex.explain ? (
                  <>
                    {'\n'}
                    <b>Why:</b> {ex.explain}
                  </>
                ) : null}
              </pre>
            </div>
          ))}
          {problem.compare && problem.compare !== 'exact' && (
            <p className="note">
              {problem.compare === 'float'
                ? 'Answers within 1e-5 are accepted.'
                : problem.compare === 'unordered'
                  ? 'Any order of the returned items is accepted.'
                  : 'Any order is accepted, both for the outer list and inside each inner list.'}
            </p>
          )}

          <div className="assist">
            {hintShown ? (
              <div className="hint-box">
                <div>
                  <b>Pattern:</b> {type.name}
                  {problem.secondaryType ? ` + ${TYPE_BY_ID[problem.secondaryType].name}` : ''}
                </div>
                <div>💡 {problem.hint}</div>
              </div>
            ) : (
              <button className="btn small" onClick={() => progress.useHint(problem.id)}>
                💡 Show hint
              </button>
            )}
            {(caught || fails >= REVEAL_AFTER_FAILS) &&
              (showSolution ? (
                <details open className="solution">
                  <summary>Reference solution</summary>
                  <pre>{problem.solution}</pre>
                </details>
              ) : (
                <button className="btn small" onClick={revealSolution}>
                  📖 Reference solution
                </button>
              ))}
          </div>
        </section>

        <section className="workbench">
          <div className="editor-toolbar">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button className={lang === 'js' ? 'on' : ''} onClick={() => switchLang('js')}>
                JavaScript
              </button>
              <button className={lang === 'ts' ? 'on' : ''} onClick={() => switchLang('ts')}>
                TypeScript
              </button>
            </div>
            <span className="shortcut">Ctrl/⌘+Enter run · +Shift throw</span>
            <button className="btn small" onClick={resetCode}>
              ↺ Reset code
            </button>
          </div>
          <div className="editor-wrap">
            <CodeMirror
              value={code}
              onChange={setCode}
              theme={oneDark}
              extensions={extensions}
              height="100%"
              basicSetup={{ tabSize: 2 }}
            />
          </div>
          <div className="action-bar">
            <button className="btn" disabled={!!running} onClick={() => execute('run')}>
              {running === 'run' ? 'Running…' : '▶ Run examples'}
            </button>
            <button className="btn btn-throw" disabled={!!running} onClick={() => execute('submit')}>
              <CodeBall size={20} /> {running === 'submit' ? 'Throwing…' : `Throw ${LABELS.ball}`}
            </button>
          </div>
          <ResultsPanel result={result} tab={tab} setTab={setTab} phase={phase} running={running} creature={problem.creature} />
        </section>
      </div>

      {phase === 'caught' && (
        <div className="overlay">
          <div className="overlay-card panel">
            <CodeBall size={72} className="ball-sparkle" />
            <h2>Gotcha!</h2>
            <p>
              <b>{problem.creature}</b> was caught! All {result?.tests.length} tests passed.
            </p>
            {battle.kind === 'gym' && opponent && (
              <p className="win-line">
                {opponent.member.emoji} {opponent.member.name}: "{opponent.member.winLine}"
                <br />
                <b>🏅 You earned the {type.gym.badge}!</b>
              </p>
            )}
            {(battle.kind === 'elite' || battle.kind === 'champion') && opponent && (
              <p className="win-line">
                {opponent.member.emoji} {opponent.member.name}: "{opponent.member.winLine}"
              </p>
            )}
            <div className="overlay-actions">
              <button className="btn btn-gym" onClick={onCaughtContinue}>
                Continue ▶
              </button>
              <button className="btn" onClick={() => setPhase('idle')}>
                Keep practicing here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function statusIcon(o: TestOutcome) {
  return { passed: '✔', failed: '✖', error: '💥', timeout: '⏱', skipped: '·' }[o.status]
}

function TestDetail({ o }: { o: TestOutcome }) {
  return (
    <div className={`test-detail status-${o.status}`}>
      <div className="kv">
        <span>Input</span>
        <pre>{o.input}</pre>
      </div>
      <div className="kv">
        <span>Expected</span>
        <pre>{o.expected}</pre>
      </div>
      {o.status !== 'skipped' && (
        <div className="kv">
          <span>{o.error ? 'Error' : 'Your output'}</span>
          <pre className={o.status === 'passed' ? 'ok' : 'bad'}>{o.error ?? o.actual}</pre>
        </div>
      )}
      {o.logs.length > 0 && (
        <div className="kv">
          <span>console</span>
          <pre className="logs">{o.logs.join('\n')}</pre>
        </div>
      )}
    </div>
  )
}

function ResultsPanel({
  result,
  tab,
  setTab,
  phase,
  running,
  creature,
}: {
  result: RunResult | null
  tab: 'results' | 'console'
  setTab: (t: 'results' | 'console') => void
  phase: Phase
  running: null | 'run' | 'submit'
  creature: string
}) {
  const firstFail = result?.tests.find((t) => t.status !== 'passed' && t.status !== 'skipped') ?? null
  const [open, setOpen] = useState<number | null>(null)
  useEffect(() => setOpen(firstFail ? firstFail.index : null), [result, firstFail])

  const allLogs = result
    ? [
        ...(result.setupLogs.length ? ['— top level —', ...result.setupLogs] : []),
        ...result.tests.flatMap((t) => (t.logs.length ? [`— test ${t.index + 1} —`, ...t.logs] : [])),
      ]
    : []

  return (
    <div className="results panel">
      <div className="tabs">
        <button className={tab === 'results' ? 'on' : ''} onClick={() => setTab('results')}>
          Results
        </button>
        <button className={tab === 'console' ? 'on' : ''} onClick={() => setTab('console')}>
          Console{allLogs.length ? ` (${allLogs.length})` : ''}
        </button>
      </div>
      <div className="results-body">
        {running && <p className="muted">{running === 'submit' ? 'The capsule wobbles…' : 'Running examples…'}</p>}
        {!running && !result && <p className="muted">Run the examples or throw a capsule to see results here.</p>}
        {!running && result && tab === 'console' && (
          <pre className="logs">{allLogs.length ? allLogs.join('\n') : '(no console output)'}</pre>
        )}
        {!running && result && tab === 'results' && (
          <>
            {result.compileError ? (
              <div className="banner bad">
                <b>Your code didn't load.</b>
                <pre>{result.compileError}</pre>
              </div>
            ) : (
              <div className={`banner ${result.allPassed ? 'good' : 'bad'}`}>
                {result.mode === 'submit'
                  ? result.allPassed
                    ? `Gotcha! ${creature} was caught.`
                    : phase === 'escaped'
                      ? `Argh! ${creature} broke free.`
                      : 'Not caught yet.'
                  : result.allPassed
                    ? 'All examples pass. Now throw a capsule!'
                    : 'Some examples fail.'}{' '}
                <b>
                  {result.passedCount}/{result.tests.length}
                </b>{' '}
                {result.mode === 'submit' ? 'tests' : 'examples'} passed.
              </div>
            )}
            {!result.compileError && (
              <ul className="test-list">
                {result.tests.map((t) => (
                  <li key={t.index} className={`status-${t.status}`}>
                    <button onClick={() => setOpen(open === t.index ? null : t.index)}>
                      <span className="ti">{statusIcon(t)}</span> Test {t.index + 1}
                      {t.hidden ? ' (hidden)' : ''}
                      {t.status === 'timeout' && ' · time limit'}
                      {t.status === 'skipped' && ' · not run'}
                      {t.timeMs !== undefined && <span className="ms">{t.timeMs.toFixed(1)} ms</span>}
                    </button>
                    {open === t.index && <TestDetail o={t} />}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  )
}
