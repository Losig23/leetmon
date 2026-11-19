import { useState } from 'react'
import { DifficultyTag, LABELS, ProblemSprite, TypeChip } from '../components/bits'
import { PROBLEMS } from '../data/problems'
import type { Problem, Role, TypeId } from '../data/schema'
import { TYPES } from '../data/types'
import { useProgress } from '../game/progress'

const ROLE_LABEL: Record<Role, string> = { wild: 'Wild', gym: 'Gym', elite: 'Elite', champion: 'Champion' }

export function DexScreen({ onOpen }: { onOpen: (p: Problem) => void }) {
  const prog = useProgress()
  const [type, setType] = useState<TypeId | 'all'>('all')
  const [status, setStatus] = useState<'all' | 'caught' | 'uncaught'>('all')
  const [role, setRole] = useState<'all' | 'wild' | 'boss'>('all')

  const rows = PROBLEMS.map((p, i) => ({ p, num: i + 1 })).filter(({ p }) => {
    if (type !== 'all' && p.type !== type && p.secondaryType !== type) return false
    if (status === 'caught' && !prog.caught[p.id]) return false
    if (status === 'uncaught' && prog.caught[p.id]) return false
    if (role === 'wild' && p.role !== 'wild') return false
    if (role === 'boss' && p.role === 'wild') return false
    return true
  })
  const caughtCount = PROBLEMS.filter((p) => prog.caught[p.id]).length
  const seenCount = PROBLEMS.filter((p) => prog.seen[p.id] || prog.caught[p.id]).length

  return (
    <div className="dex panel">
      <div className="dex-head">
        <h2>{LABELS.dex}</h2>
        <div className="dex-stats">
          Seen <b>{seenCount}</b> · Caught <b>{caughtCount}</b> / {PROBLEMS.length}
        </div>
      </div>
      <div className="dex-filters">
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value as TypeId | 'all')}>
            <option value="all">All types</option>
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            <option value="all">All</option>
            <option value="caught">Caught</option>
            <option value="uncaught">Not caught</option>
          </select>
        </label>
        <label>
          Kind
          <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="all">All</option>
            <option value="wild">Wild only</option>
            <option value="boss">Gym / League only</option>
          </select>
        </label>
      </div>
      <table className="dex-table">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Creature</th>
            <th>Problem</th>
            <th>Type</th>
            <th>Diff.</th>
            <th>Lv</th>
            <th>Throws</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ p, num }) => {
            const caught = !!prog.caught[p.id]
            const seen = caught || !!prog.seen[p.id]
            const openable = p.role === 'wild' || caught
            return (
              <tr
                key={p.id}
                className={`${caught ? 'caught' : ''} ${openable ? 'openable' : 'locked'}`}
                onClick={() => openable && onOpen(p)}
                title={openable ? 'Practice this problem' : 'Beat it in battle first'}
              >
                <td className="num">{String(num).padStart(3, '0')}</td>
                <td>
                  <ProblemSprite problem={p} size={40} silhouette={!caught} />
                </td>
                <td>
                  {seen ? p.creature : '???'}
                  {p.role !== 'wild' && <span className="role-tag">{ROLE_LABEL[p.role]}</span>}
                </td>
                <td>
                  {p.leetcode.title} <span className="muted">#{p.leetcode.number}</span>
                </td>
                <td>
                  <TypeChip type={p.type} small />
                  {p.secondaryType && <TypeChip type={p.secondaryType} small />}
                </td>
                <td>
                  <DifficultyTag d={p.difficulty} />
                </td>
                <td>{p.level}</td>
                <td>{prog.attempts[p.id] ?? 0}</td>
                <td>{caught ? '✔ Caught' : seen ? 'Seen' : '—'}{prog.hints[p.id] ? ' 💡' : ''}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {rows.length === 0 && <p className="muted">Nothing matches those filters.</p>}
    </div>
  )
}
