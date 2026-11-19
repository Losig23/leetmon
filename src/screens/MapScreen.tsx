import { CHAMPION, ELITE_FOUR } from '../data/league'
import { gymOfType, PROBLEMS, wildOfType } from '../data/problems'
import type { TypeId } from '../data/schema'
import { GYM_UNLOCK_COUNT, TYPES } from '../data/types'
import { useProgress } from '../game/progress'

interface Props {
  onExplore: (type: TypeId) => void
  onGym: (type: TypeId) => void
  onLeague: () => void
  onHall: () => void
}

export function MapScreen({ onExplore, onGym, onLeague, onHall }: Props) {
  const p = useProgress()
  const allBadges = p.badges.length >= TYPES.length
  const leagueReady = ELITE_FOUR.every((m) => PROBLEMS.some((x) => x.id === m.problemId)) &&
    PROBLEMS.some((x) => x.id === CHAMPION.problemId)

  return (
    <div className="map-screen">
      <section className="badge-case panel">
        <h2>Badge Case</h2>
        <div className="badges">
          {TYPES.map((t) => {
            const has = p.badges.includes(t.id)
            return (
              <div
                key={t.id}
                className={`badge${has ? ' earned' : ''}`}
                style={has ? { background: t.color } : undefined}
                title={has ? `${t.gym.badge} (${t.name})` : `${t.gym.badge}: not earned yet`}
              >
                <span>{has ? t.emoji : '?'}</span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="routes">
        {TYPES.map((t) => {
          const wild = wildOfType(t.id)
          const gym = gymOfType(t.id)
          const caught = wild.filter((w) => p.caught[w.id]).length
          const unlockAt = Math.min(GYM_UNLOCK_COUNT, wild.length)
          const gymOpen = !!gym && caught >= unlockAt
          const hasBadge = p.badges.includes(t.id)
          const empty = wild.length === 0
          return (
            <article key={t.id} className={`route-card panel${empty ? ' empty' : ''}`} style={{ ['--type' as string]: t.color }}>
              <header>
                <span className="route-emoji">{t.emoji}</span>
                <div>
                  <h3>{t.route}</h3>
                  <div className="route-type">{t.name}</div>
                </div>
              </header>
              <div className="route-progress" aria-label={`${caught} of ${wild.length} caught`}>
                {wild.map((w) => (
                  <span key={w.id} className={`dot${p.caught[w.id] ? ' on' : ''}`} />
                ))}
                <span className="route-count">
                  {caught}/{wild.length} caught
                </span>
              </div>
              <div className="route-actions">
                <button className="btn" disabled={empty} onClick={() => onExplore(t.id)}>
                  {empty ? 'Coming soon' : caught === wild.length ? '🌿 Rematch' : '🌿 Explore'}
                </button>
                <button
                  className={`btn ${gymOpen ? 'btn-gym' : ''}`}
                  disabled={!gymOpen}
                  onClick={() => onGym(t.id)}
                  title={gymOpen ? `Challenge ${t.gym.name}` : `Catch ${unlockAt} ${t.name} problems to unlock`}
                >
                  {hasBadge ? '🏅 Gym rematch' : gymOpen ? `🏟️ Gym` : `🔒 Gym (${caught}/${unlockAt})`}
                </button>
              </div>
            </article>
          )
        })}
      </section>

      <section className="league panel">
        <h2>Victory Road</h2>
        {p.championAt ? (
          <div className="league-row">
            <p>👑 You are the Champion!</p>
            <button className="btn" onClick={onHall}>Hall of Fame</button>
            <button className="btn" onClick={onLeague}>Re-challenge the League</button>
          </div>
        ) : (
          <>
            <div className="elite-row">
              {ELITE_FOUR.map((m, i) => (
                <div key={m.name} className={`elite-card${p.eliteIndex > i ? ' beaten' : ''}`}>
                  <div className="elite-emoji">{allBadges ? m.emoji : '❔'}</div>
                  <div className="elite-name">{allBadges ? m.name : '???'}</div>
                  <div className="elite-theme">{m.theme}</div>
                </div>
              ))}
              <div className={`elite-card champion${p.eliteIndex >= ELITE_FOUR.length ? ' ready' : ''}`}>
                <div className="elite-emoji">{allBadges ? CHAMPION.emoji : '❔'}</div>
                <div className="elite-name">{allBadges ? CHAMPION.name : '???'}</div>
                <div className="elite-theme">{CHAMPION.theme}</div>
              </div>
            </div>
            <button className="btn btn-gym" disabled={!allBadges || !leagueReady} onClick={onLeague}>
              {allBadges
                ? p.eliteIndex >= ELITE_FOUR.length
                  ? '👑 Face the Champion'
                  : `⚔️ Enter the League (${p.eliteIndex}/${ELITE_FOUR.length} beaten)`
                : `🔒 Collect all ${TYPES.length} badges (${p.badges.length}/${TYPES.length})`}
            </button>
          </>
        )}
      </section>
    </div>
  )
}
