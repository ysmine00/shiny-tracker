import { useMemo } from 'react'
import { cumulativeProb, getBaseRate } from '../utils/odds'

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white border border-poke-border rounded-2xl p-4 flex flex-col gap-1 animate-fade-in shadow-card">
      <span className="text-poke-gray text-xs font-mono uppercase tracking-widest">{label}</span>
      <span className={`text-2xl font-display font-bold ${accent ? 'text-poke-red' : 'text-poke-black'}`}>
        {value}
      </span>
      {sub && <span className="text-poke-gray text-xs">{sub}</span>}
    </div>
  )
}

export default function StatsBar({ hunts }) {
  const stats = useMemo(() => {
    const caught = hunts.filter((h) => h.status === 'caught')
    const hunting = hunts.filter((h) => h.status === 'hunting')
    const totalAttempts = hunts.reduce((s, h) => s + (h.attempts || 0), 0)

    let luckiest = null
    let lowestProb = Infinity
    caught.forEach((h) => {
      const rate = getBaseRate(h.method, h.game, h.shiny_charm)
      const prob = cumulativeProb(h.attempts || 1, rate)
      if (prob < lowestProb) {
        lowestProb = prob
        luckiest = h
      }
    })

    return { caught, hunting, totalAttempts, luckiest, lowestProb }
  }, [hunts])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatCard
        label="Shinies caught"
        value={stats.caught.length}
        accent
      />
      <StatCard
        label="Active hunts"
        value={stats.hunting.length}
        sub={stats.hunting.length > 0 ? `${stats.hunting.reduce((s,h)=>s+(h.attempts||0),0).toLocaleString()} total encounters` : undefined}
      />
      <StatCard
        label="All-time encounters"
        value={stats.totalAttempts.toLocaleString()}
      />
      <StatCard
        label="Luckiest catch"
        value={stats.luckiest ? stats.luckiest.display_name : '—'}
        sub={stats.luckiest ? `${(stats.lowestProb * 100).toFixed(2)}% probability` : undefined}
        accent={!!stats.luckiest}
      />
    </div>
  )
}
