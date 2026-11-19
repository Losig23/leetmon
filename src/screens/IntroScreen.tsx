import { Dialog, DifficultyTag, ProblemSprite, TypeChip } from '../components/bits'
import { CHAMPION, ELITE_FOUR, type LeagueMember } from '../data/league'
import { gymOfType, PROBLEM_BY_ID } from '../data/problems'
import type { Problem } from '../data/schema'
import { TYPE_BY_ID } from '../data/types'
import type { Battle } from '../game/battle'

export function battleOpponent(battle: Battle): { member: LeagueMember; problem: Problem } | null {
  if (battle.kind === 'gym') {
    const t = TYPE_BY_ID[battle.type]
    const problem = gymOfType(battle.type)
    if (!problem) return null
    return {
      problem,
      member: { ...t.gym, theme: t.name, problemId: problem.id, title: `Gym Leader, ${t.gym.title}` },
    }
  }
  if (battle.kind === 'elite') {
    const member = ELITE_FOUR[battle.index]
    const problem = PROBLEM_BY_ID[member.problemId]
    return problem ? { member: { ...member, title: `Elite Four ${battle.index + 1}/4` }, problem } : null
  }
  if (battle.kind === 'champion') {
    const problem = PROBLEM_BY_ID[CHAMPION.problemId]
    return problem ? { member: CHAMPION, problem } : null
  }
  return null
}

interface Props {
  battle: Battle
  onFight: (problemId: string) => void
  onLeave: () => void
}

export function IntroScreen({ battle, onFight, onLeave }: Props) {
  const opp = battleOpponent(battle)
  if (!opp) {
    return (
      <div className="panel intro">
        <p>This opponent isn't ready yet.</p>
        <button className="btn" onClick={onLeave}>Back</button>
      </div>
    )
  }
  const { member, problem } = opp
  return (
    <div className="intro panel" style={{ ['--type' as string]: TYPE_BY_ID[problem.type].color }}>
      <div className="intro-stage">
        <div className="intro-trainer">
          <div className="trainer-emoji">{member.emoji}</div>
          <div className="trainer-name">{member.name}</div>
          <div className="trainer-title">{member.title}</div>
        </div>
        <div className="intro-vs">VS</div>
        <div className="intro-mon">
          <ProblemSprite problem={problem} size={140} className="bob" />
          <div className="trainer-name">
            {problem.creature} <span className="lv">Lv.{problem.level}</span>
          </div>
          <div className="chips">
            <TypeChip type={problem.type} />
            {problem.secondaryType && <TypeChip type={problem.secondaryType} />}
            <DifficultyTag d={problem.difficulty} />
          </div>
        </div>
      </div>
      <Dialog speaker={member.name} text={member.dialogue} />
      <div className="intro-actions">
        <button className="btn btn-gym big" onClick={() => onFight(problem.id)}>
          ⚔️ Battle!
        </button>
        <button className="btn" onClick={onLeave}>
          {battle.kind === 'elite' && battle.index > 0 ? 'Retreat (resets streak)' : 'Not yet'}
        </button>
      </div>
    </div>
  )
}
