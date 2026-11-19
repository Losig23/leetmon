import { useState } from 'react'
import { CodeBall, LABELS } from './components/bits'
import { ELITE_FOUR } from './data/league'
import { PROBLEM_BY_ID, PROBLEMS, wildOfType } from './data/problems'
import type { TypeId } from './data/schema'
import { TYPES } from './data/types'
import type { Battle, Screen } from './game/battle'
import { progress, useProgress } from './game/progress'
import { DexScreen } from './screens/DexScreen'
import { EncounterScreen } from './screens/EncounterScreen'
import { HallScreen } from './screens/HallScreen'
import { IntroScreen } from './screens/IntroScreen'
import { MapScreen } from './screens/MapScreen'

function pickWild(type: TypeId): string | null {
  const caught = progress.get().caught
  const wild = wildOfType(type)
  const pool = wild.filter((p) => !caught[p.id])
  const from = pool.length ? pool : wild
  return from.length ? from[Math.floor(Math.random() * from.length)].id : null
}

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'map' })
  const p = useProgress()
  const caughtCount = PROBLEMS.filter((x) => p.caught[x.id]).length

  const toMap = () => setScreen({ name: 'map' })

  const startLeague = () => {
    const i = progress.get().eliteIndex
    setScreen({ name: 'intro', battle: i >= ELITE_FOUR.length ? { kind: 'champion' } : { kind: 'elite', index: i } })
  }

  const afterCatch = (battle: Battle) => {
    if (battle.kind === 'elite') {
      const next = battle.index + 1
      setScreen({ name: 'intro', battle: next < ELITE_FOUR.length ? { kind: 'elite', index: next } : { kind: 'champion' } })
    } else if (battle.kind === 'champion') {
      setScreen({ name: 'hall' })
    } else if (battle.kind === 'practice') {
      setScreen({ name: 'dex' })
    } else {
      toMap()
    }
  }

  const leaveBattle = (battle: Battle) => {
    if (battle.kind === 'elite') progress.setEliteIndex(0)
    if (battle.kind === 'practice') setScreen({ name: 'dex' })
    else toMap()
  }

  const resetAll = () => {
    if (confirm('Erase ALL progress: caught problems, badges, and saved code? This cannot be undone.')) {
      progress.resetAll()
      toMap()
    }
  }

  const inBattle = screen.name === 'encounter'

  return (
    <div className={`app ${inBattle ? 'app-battle' : ''}`}>
      <header className="topbar">
        <button className="logo" onClick={toMap} title="Back to map">
          <CodeBall size={26} /> {LABELS.game}
        </button>
        <div className="trainer">
          <span>
            Caught <b>{caughtCount}</b>/{PROBLEMS.length}
          </span>
          <span>
            Badges <b>{p.badges.length}</b>/{TYPES.length}
          </span>
          {p.championAt && <span>👑 Champion</span>}
        </div>
        <nav>
          <button className={screen.name === 'map' ? 'on' : ''} onClick={toMap}>
            Map
          </button>
          <button className={screen.name === 'dex' ? 'on' : ''} onClick={() => setScreen({ name: 'dex' })}>
            {LABELS.dex}
          </button>
          <button className="danger" onClick={resetAll}>
            Reset
          </button>
        </nav>
      </header>

      <main>
        {screen.name === 'map' && (
          <MapScreen
            onExplore={(type) => {
              const id = pickWild(type)
              if (id) setScreen({ name: 'encounter', problemId: id, battle: { kind: 'wild' } })
            }}
            onGym={(type) => setScreen({ name: 'intro', battle: { kind: 'gym', type } })}
            onLeague={startLeague}
            onHall={() => setScreen({ name: 'hall' })}
          />
        )}
        {screen.name === 'dex' && (
          <DexScreen onOpen={(prob) => setScreen({ name: 'encounter', problemId: prob.id, battle: { kind: 'practice' } })} />
        )}
        {screen.name === 'intro' && (
          <IntroScreen
            battle={screen.battle}
            onFight={(id) => setScreen({ name: 'encounter', problemId: id, battle: screen.battle })}
            onLeave={() => leaveBattle(screen.battle)}
          />
        )}
        {screen.name === 'encounter' && PROBLEM_BY_ID[screen.problemId] && (
          <EncounterScreen
            key={`${screen.problemId}:${screen.battle.kind}`}
            problem={PROBLEM_BY_ID[screen.problemId]}
            battle={screen.battle}
            onFlee={() => leaveBattle(screen.battle)}
            onCaughtContinue={() => afterCatch(screen.battle)}
          />
        )}
        {screen.name === 'hall' && <HallScreen onBack={toMap} />}
      </main>
    </div>
  )
}
