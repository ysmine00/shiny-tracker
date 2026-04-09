import { useState } from 'react'
import { TYPE_COLORS } from '../lib/pokeapi'
import {
  getBaseRate,
  getGoRate,
  cumulativeProb,
  formatProb,
  getLuckLabel,
  expectedEncounters,
} from '../utils/odds'

export default function HuntCard({ hunt, onDelete, onIncrement, onMarkCaught }) {
  const [showDetail, setShowDetail] = useState(false)

  const isGo = hunt.game === 'go'
  const rate = isGo ? getGoRate(hunt.method) : getBaseRate(hunt.method, hunt.game, hunt.shiny_charm)
  const prob = cumulativeProb(hunt.attempts || 0, rate)
  const luckInfo = getLuckLabel(prob)
  const expected = expectedEncounters(rate)
  const overUnder = (hunt.attempts || 0) - expected

  const sprite = hunt.shiny_sprite || hunt.sprite
  const isCaught = hunt.status === 'caught'

  return (
    <div
      className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 card-glow shadow-card
        ${isCaught ? 'border-poke-red/30' : 'border-poke-border'}`}
    >
      {/* Shimmer overlay for caught */}
      {isCaught && (
        <div className="absolute inset-0 shimmer-gold pointer-events-none rounded-2xl" />
      )}

      <div className="relative p-4 flex gap-4 items-start">
        {/* Sprite */}
        <div className={`relative flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center
          ${isCaught ? 'bg-poke-red/10' : 'bg-poke-offwhite'}`}>
          {sprite ? (
            <img
              src={sprite}
              alt={hunt.display_name}
              className={`w-14 h-14 object-contain ${isCaught ? 'animate-float' : ''}`}
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <span className="text-3xl text-poke-gray">?</span>
          )}
          {isCaught && (
            <span className="absolute -top-1 -right-1 text-poke-red text-xs animate-sparkle">✦</span>
          )}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-semibold text-poke-black text-base leading-tight">
              {hunt.display_name}
            </h3>
            {hunt.pokemon_id && (
              <span className="text-poke-gray font-mono text-xs">#{String(hunt.pokemon_id).padStart(4, '0')}</span>
            )}
            {isCaught ? (
              <span className="text-xs bg-poke-red/10 text-poke-red border border-poke-red/20 px-2 py-0.5 rounded-full font-mono">
                ✦ caught
              </span>
            ) : (
              <span className="text-xs bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                hunting
              </span>
            )}
          </div>

          {/* Types */}
          {hunt.types?.length > 0 && (
            <div className="flex gap-1 mt-1">
              {hunt.types.map((t) => (
                <span
                  key={t}
                  className="type-badge"
                  style={{
                    backgroundColor: TYPE_COLORS[t]?.bg + '33',
                    color: TYPE_COLORS[t]?.bg || '#888',
                    border: `1px solid ${TYPE_COLORS[t]?.bg}44`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs text-poke-gray font-mono">
            {isGo
              ? <span className="text-poke-red font-medium">Pokémon GO</span>
              : hunt.game && <span>{hunt.game_label || hunt.game}</span>
            }
            {hunt.method_label && <span>{hunt.method_label}</span>}
            {!isGo && hunt.shiny_charm && <span className="text-poke-red">✦ charm</span>}
          </div>
        </div>

        {/* Odds column */}
        <div className="flex-shrink-0 text-right">
          <div className="text-xl font-display font-bold text-poke-black">
            {(hunt.attempts || 0).toLocaleString()}
          </div>
          <div className="text-xs text-poke-gray">encounters</div>
          <div className={`text-xs font-medium mt-1 ${luckInfo.color}`}>
            {luckInfo.label}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="flex justify-between text-xs text-poke-gray mb-1">
          <span>Probability after {(hunt.attempts || 0).toLocaleString()} encounters</span>
          <span className="font-mono text-poke-black">{formatProb(prob)}</span>
        </div>
        <div className="h-1.5 bg-poke-lightgray rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(prob * 100, 100)}%`,
              background: prob > 0.9
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : prob > 0.5
                  ? 'linear-gradient(90deg, #E3350D, #FF5B3A)'
                  : 'linear-gradient(90deg, #E3350D, #FF8A6A)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-poke-gray/60 mt-1">
          <span>0</span>
          <span>1/{rate.toLocaleString()} base rate</span>
          <span>Expected: {expected.toLocaleString()}</span>
        </div>
      </div>

      {/* Expandable detail */}
      {showDetail && (
        <div className="px-4 pb-3 border-t border-poke-border pt-3 animate-fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-poke-offwhite rounded-xl p-2.5">
              <div className="text-poke-gray mb-0.5">Base rate</div>
              <div className="font-mono text-poke-black">1 / {rate.toLocaleString()}</div>
            </div>
            <div className="bg-poke-offwhite rounded-xl p-2.5">
              <div className="text-poke-gray mb-0.5">Expected encounters</div>
              <div className="font-mono text-poke-black">{expected.toLocaleString()}</div>
            </div>
            <div className="bg-poke-offwhite rounded-xl p-2.5">
              <div className="text-poke-gray mb-0.5">Over/under average</div>
              <div className={`font-mono ${overUnder > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {overUnder > 0 ? '+' : ''}{overUnder.toLocaleString()}
              </div>
            </div>
            <div className="bg-poke-offwhite rounded-xl p-2.5">
              <div className="text-poke-gray mb-0.5">Catch date</div>
              <div className="font-mono text-poke-black">
                {hunt.caught_date ? new Date(hunt.caught_date).toLocaleDateString() : '—'}
              </div>
            </div>
          </div>
          {hunt.notes && (
            <p className="mt-2 text-xs text-poke-gray italic bg-poke-offwhite rounded-xl p-2.5">
              "{hunt.notes}"
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pb-3 flex gap-2">
        <button
          onClick={() => setShowDetail((v) => !v)}
          className="text-xs text-poke-gray hover:text-poke-black transition-colors"
        >
          {showDetail ? '▲ less' : '▼ details'}
        </button>
        <div className="flex-1" />
        {!isCaught && (
          <>
            <button
              onClick={() => onIncrement(hunt.id, hunt.attempts || 0)}
              className="text-xs bg-poke-offwhite border border-poke-border hover:border-poke-gray
                         text-poke-black px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              +1 encounter
            </button>
            <button
              onClick={() => onMarkCaught(hunt.id)}
              className="text-xs bg-poke-red/10 border border-poke-red/30 hover:bg-poke-red/20
                         text-poke-red px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              ✦ caught!
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(hunt.id, hunt.display_name)}
          className="text-xs text-poke-gray hover:text-red-500 transition-colors px-2 py-1.5"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
