import { CodeBall, ProblemSprite } from '../components/bits'
import { PROBLEMS } from '../data/problems'
import { TYPES } from '../data/types'
import { useProgress } from '../game/progress'

export function HallScreen({ onBack }: { onBack: () => void }) {
  const p = useProgress()
  const caught = PROBLEMS.filter((x) => p.caught[x.id])
  const throws = Object.values(p.attempts).reduce((a, b) => a + b, 0)
  const hints = Object.keys(p.hints).length
  return (
    <div className="hall panel">
      <CodeBall size={64} className="ball-sparkle" />
      <h2>Hall of Fame</h2>
      <p>
        {p.championAt
          ? `Champion since ${new Date(p.championAt).toLocaleDateString()}.`
          : 'Not champion yet. Keep training!'}
      </p>
      <div className="hall-stats">
        <div>
          <b>{caught.length}</b>/{PROBLEMS.length} caught
        </div>
        <div>
          <b>{p.badges.length}</b>/{TYPES.length} badges
        </div>
        <div>
          <b>{throws}</b> total throws
        </div>
        <div>
          <b>{hints}</b> {hints === 1 ? 'hint' : 'hints'} used
        </div>
      </div>
      <div className="hall-team">
        {caught.map((x) => (
          <div key={x.id} title={`${x.creature} (${x.leetcode.title})`}>
            <ProblemSprite problem={x} size={48} />
          </div>
        ))}
      </div>
      <button className="btn" onClick={onBack}>
        Back to map
      </button>
    </div>
  )
}
