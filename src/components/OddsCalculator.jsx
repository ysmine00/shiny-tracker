import { useState } from 'react'
import { METHODS, GAMES, getBaseRate, cumulativeProb, formatProb, expectedEncounters } from '../utils/odds'

export default function OddsCalculator() {
  const [method, setMethod] = useState('random')
  const [game, setGame] = useState('sv')
  const [charm, setCharm] = useState(false)
  const [encounters, setEncounters] = useState(1000)

  const rate = getBaseRate(method, game, charm)
  const prob = cumulativeProb(encounters, rate)
  const expected = expectedEncounters(rate)

  const milestones = [0.25, 0.5, 0.75, 0.90, 0.99].map(p => ({
    label: `${(p * 100).toFixed(0)}%`,
    encounters: Math.ceil(Math.log(1 - p) / Math.log(1 - 1 / rate)),
  }))

  return (
    <div className="bg-white border border-poke-border rounded-2xl p-5 animate-fade-in shadow-card">
      <h3 className="font-display font-bold text-poke-black mb-4">Odds Calculator</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Method</label>
          <div className="relative">
            <select className="select-field" value={method} onChange={e => setMethod(e.target.value)}>
              {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Game</label>
          <div className="relative">
            <select className="select-field" value={game} onChange={e => setGame(e.target.value)}>
              {GAMES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
          </div>
        </div>
        <div>
          <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Encounters</label>
          <input
            className="input-field"
            type="number"
            min="0"
            value={encounters}
            onChange={e => setEncounters(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer mb-5">
        <div
          className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${charm ? 'bg-poke-red' : 'bg-poke-lightgray'}`}
          onClick={() => setCharm(v => !v)}
        >
          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${charm ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <span className="text-sm text-poke-black">Shiny Charm</span>
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-poke-offwhite rounded-xl p-3">
          <div className="text-xs text-poke-gray font-mono mb-1">Base rate</div>
          <div className="text-poke-red font-display font-bold text-lg">1/{rate.toLocaleString()}</div>
        </div>
        <div className="bg-poke-offwhite rounded-xl p-3">
          <div className="text-xs text-poke-gray font-mono mb-1">Probability</div>
          <div className="text-poke-black font-display font-bold text-lg">{formatProb(prob)}</div>
        </div>
        <div className="bg-poke-offwhite rounded-xl p-3">
          <div className="text-xs text-poke-gray font-mono mb-1">Expected (50%)</div>
          <div className="text-poke-black font-display font-bold text-lg">{expected.toLocaleString()}</div>
        </div>
        <div className="bg-poke-offwhite rounded-xl p-3">
          <div className="text-xs text-poke-gray font-mono mb-1">You are at</div>
          <div className={`font-display font-bold text-lg ${prob >= 0.5 ? 'text-orange-500' : 'text-green-600'}`}>
            {prob >= 0.5 ? `+${(encounters - expected).toLocaleString()}` : `-${(expected - encounters).toLocaleString()}`}
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs text-poke-gray font-mono uppercase tracking-wider mb-2">Milestone encounters</div>
        <div className="space-y-2">
          {milestones.map(({ label, encounters: enc }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 text-xs font-mono text-poke-red">{label}</div>
              <div className="flex-1 h-1.5 bg-poke-lightgray rounded-full overflow-hidden">
                <div
                  className="h-full bg-poke-red/50 rounded-full"
                  style={{ width: `${Math.min((encounters / enc) * 100, 100)}%` }}
                />
              </div>
              <div className="w-20 text-right text-xs font-mono text-poke-black">{enc.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
