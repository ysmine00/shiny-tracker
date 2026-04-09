import { useState, useEffect, useRef } from 'react'
import { fetchPokemon, searchPokemon, TYPE_COLORS } from '../lib/pokeapi'
import { METHODS, GAMES, getBaseRate, GO_ENCOUNTER_TYPES, getGoRate } from '../utils/odds'
import { IconWild, IconCommunityDay, IconSpotlightHour, IconRaidDay, IconResearch, IconBoosted, IconMainline, IconPokemonGo } from './GoIcons'

const GO_ICONS = {
  standard:  <IconWild />,
  community: <IconCommunityDay />,
  spotlight: <IconSpotlightHour />,
  raid_day:  <IconRaidDay />,
  research:  <IconResearch />,
  boosted:   <IconBoosted />,
}

export default function AddHuntModal({ onAdd, onClose }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selected, setSelected] = useState(null)
  const [loadingPoke, setLoadingPoke] = useState(false)
  const [isGoMode, setIsGoMode] = useState(false)
  const [form, setForm] = useState({
    method: 'random',
    game: 'sv',
    go_encounter: 'standard',
    attempts: '',
    status: 'hunting',
    shiny_charm: false,
    caught_date: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return }
    const timer = setTimeout(async () => {
      const results = await searchPokemon(query)
      setSuggestions(results)
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  async function selectPokemon(name) {
    setSuggestions([])
    setQuery(name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '))
    setLoadingPoke(true)
    try {
      const data = await fetchPokemon(name)
      setSelected(data)
    } catch {
      setSelected(null)
    }
    setLoadingPoke(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)

    const rate = isGoMode
      ? getGoRate(form.go_encounter)
      : getBaseRate(form.method, form.game, form.shiny_charm)

    const methodLabel = isGoMode
      ? GO_ENCOUNTER_TYPES.find(t => t.value === form.go_encounter)?.label
      : METHODS.find(m => m.value === form.method)?.label

    const gameLabel = isGoMode ? 'Pokémon GO' : GAMES.find(g => g.value === form.game)?.label

    await onAdd({
      pokemon_name: selected.name,
      display_name: selected.displayName,
      pokemon_id: selected.id,
      types: selected.types,
      sprite: selected.sprite,
      shiny_sprite: selected.shinySprite,
      official_art: selected.officialArt,
      shiny_official_art: selected.shinyOfficialArt,
      genus: selected.genus,
      method: isGoMode ? form.go_encounter : form.method,
      method_label: methodLabel,
      game: isGoMode ? 'go' : form.game,
      game_label: gameLabel,
      attempts: parseInt(form.attempts) || 0,
      status: form.status,
      shiny_charm: isGoMode ? false : form.shiny_charm,
      caught_date: form.status === 'caught' ? form.caught_date : null,
      notes: form.notes || null,
      base_rate: rate,
    })
    setSubmitting(false)
    onClose()
  }

  const rate = selected
    ? isGoMode ? getGoRate(form.go_encounter) : getBaseRate(form.method, form.game, form.shiny_charm)
    : null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white border border-poke-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up shadow-poke-lg">
        <div className="flex items-center justify-between p-5 border-b border-poke-border">
          <h2 className="font-display font-bold text-lg text-poke-black">Log a hunt</h2>
          <button onClick={onClose} className="text-poke-gray hover:text-poke-black transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Game mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsGoMode(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-display font-medium border transition-all flex items-center justify-center gap-2
                ${!isGoMode ? 'bg-poke-red/10 border-poke-red/40 text-poke-red' : 'border-poke-border text-poke-gray hover:border-poke-gray'}`}
            >
              <IconMainline /> Mainline
            </button>
            <button
              type="button"
              onClick={() => setIsGoMode(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-display font-medium border transition-all flex items-center justify-center gap-2
                ${isGoMode ? 'bg-poke-red/10 border-poke-red/40 text-poke-red' : 'border-poke-border text-poke-gray hover:border-poke-gray'}`}
            >
              <IconPokemonGo /> Pokémon GO
            </button>
          </div>
          {/* Pokémon search */}
          <div className="relative">
            <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">
              Pokémon
            </label>
            <input
              ref={inputRef}
              className="input-field"
              placeholder="Search by name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-poke-border rounded-xl overflow-hidden shadow-card-hover">
                {suggestions.map(s => (
                  <button
                    key={s.name}
                    type="button"
                    className="w-full text-left px-4 py-2.5 text-sm text-poke-black hover:bg-poke-offwhite transition-colors"
                    onClick={() => selectPokemon(s.name)}
                  >
                    {s.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Pokémon preview */}
          {loadingPoke && (
            <div className="flex items-center gap-3 bg-poke-offwhite rounded-xl p-3 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-poke-lightgray" />
              <div className="text-sm text-poke-gray">Loading...</div>
            </div>
          )}
          {selected && !loadingPoke && (
            <div className="flex items-center gap-3 bg-poke-offwhite rounded-xl p-3 border border-poke-border animate-fade-in">
              <img src={selected.shinySprite || selected.sprite} alt={selected.displayName}
                className="w-12 h-12 object-contain" style={{ imageRendering: 'pixelated' }} />
              <div>
                <div className="font-display font-semibold text-poke-black">{selected.displayName}</div>
                <div className="text-xs text-poke-gray">{selected.genus} · #{selected.id}</div>
                <div className="flex gap-1 mt-0.5">
                  {selected.types.map(t => (
                    <span key={t} className="text-xs px-1.5 py-0 rounded font-mono" style={{
                      background: TYPE_COLORS[t]?.bg + '33',
                      color: TYPE_COLORS[t]?.bg,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Method + Game (mainline) or Encounter type (GO) */}
          {isGoMode ? (
            <div>
              <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Encounter Type</label>
              <div className="grid grid-cols-2 gap-2">
                {GO_ENCOUNTER_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, go_encounter: t.value }))}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
                      ${form.go_encounter === t.value
                        ? 'bg-poke-red/10 border-poke-red/40 text-poke-red'
                        : 'border-poke-border text-poke-gray hover:border-poke-gray'}`}
                  >
                    {GO_ICONS[t.value]}
                    <span className="font-display font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Method</label>
                <div className="relative">
                  <select className="select-field" value={form.method}
                    onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                    {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Game</label>
                <div className="relative">
                  <select className="select-field" value={form.game}
                    onChange={e => setForm(f => ({ ...f, game: e.target.value }))}>
                    {GAMES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
                </div>
              </div>
            </div>
          )}

          {/* Attempts + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Attempts so far</label>
              <input className="input-field" type="number" min="0" placeholder="0"
                value={form.attempts} onChange={e => setForm(f => ({ ...f, attempts: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Status</label>
              <div className="relative">
                <select className="select-field" value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="hunting">Still hunting…</option>
                  <option value="caught">Caught ✦</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
              </div>
            </div>
          </div>

          {/* Shiny Charm — mainline only */}
          {!isGoMode && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-10 h-5 rounded-full transition-colors duration-200 relative
                ${form.shiny_charm ? 'bg-poke-red' : 'bg-poke-lightgray'}`}
                onClick={() => setForm(f => ({ ...f, shiny_charm: !f.shiny_charm }))}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200
                  ${form.shiny_charm ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-poke-black">Shiny Charm active</span>
            </label>
          )}

          {/* Catch date */}
          {form.status === 'caught' && (
            <div>
              <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Catch date</label>
              <input className="input-field" type="date" value={form.caught_date}
                onChange={e => setForm(f => ({ ...f, caught_date: e.target.value }))} />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs text-poke-gray font-mono mb-1.5 uppercase tracking-wider">Notes (optional)</label>
            <textarea className="input-field resize-none h-16" placeholder="Any notes about this hunt…"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          {/* Odds preview */}
          {rate && (
            <div className="bg-poke-offwhite rounded-xl p-3 text-xs font-mono border border-poke-border">
              <div className="text-poke-gray">Base rate for this setup</div>
              <div className="text-poke-red text-base font-bold">1 / {rate.toLocaleString()}</div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button
              type="submit"
              disabled={!selected || submitting}
              className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding…' : 'Add hunt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
