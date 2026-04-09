import { useState, useMemo } from 'react'
import { useAuth } from './hooks/useAuth'
import { useHunts } from './hooks/useHunts'
import StatsBar from './components/StatsBar'
import HuntCard from './components/HuntCard'
import AddHuntModal from './components/AddHuntModal'
import OddsCalculator from './components/OddsCalculator'
import ExportImport from './components/ExportImport'
import { AttemptsBarChart, TimelineChart } from './components/HuntChart'

const TABS = ['collection', 'charts', 'calculator']

export default function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authSubmitting, setAuthSubmitting] = useState('')

  const [tab, setTab] = useState('collection')
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [search, setSearch] = useState('')

  const { hunts, loading, addHunt, updateHunt, deleteHunt, incrementAttempts } = useHunts(user?.id)

  async function handleAuth(e) {
    e.preventDefault()
    setAuthError('')
    setAuthSubmitting(true)
    const fn = isSignUp ? signUp : signIn
    const { error } = await fn(email, password)
    if (error) setAuthError(error.message)
    setAuthSubmitting(false)
  }

  async function handleMarkCaught(id) {
    await updateHunt(id, {
      status: 'caught',
      caught_date: new Date().toISOString().slice(0, 10),
    })
  }

  async function handleImport(importedHunts) {
    for (const h of importedHunts) {
      const { id, created_at, updated_at, username: _u, ...rest } = h
      await addHunt(rest)
    }
  }

  const filtered = useMemo(() => {
    let list = [...hunts]
    if (filterStatus !== 'all') list = list.filter(h => h.status === filterStatus)
    if (search) list = list.filter(h =>
      h.display_name?.toLowerCase().includes(search.toLowerCase())
    )
    if (sortBy === 'recent') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    else if (sortBy === 'attempts') list.sort((a, b) => (b.attempts || 0) - (a.attempts || 0))
    else if (sortBy === 'name') list.sort((a, b) => a.display_name?.localeCompare(b.display_name))
    else if (sortBy === 'dex') list.sort((a, b) => (a.pokemon_id || 0) - (b.pokemon_id || 0))
    return list
  }, [hunts, filterStatus, sortBy, search])

  // Loading auth session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-poke-offwhite flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-poke-red/30 border-t-poke-red rounded-full animate-spin" />
      </div>
    )
  }

  // Auth screen
  if (!user) {
    return (
      <div className="min-h-screen bg-poke-offwhite flex items-center justify-center p-4">
        <div className="w-full max-w-sm animate-slide-up">
          <div className="text-center mb-8">
            <img src="/pokeball.webp" alt="Pokéball" className="w-20 h-20 mx-auto mb-4 animate-sparkle" />
            <h1 className="font-display font-extrabold text-3xl text-poke-black tracking-tight">
              Shiny Tracker
            </h1>
            <p className="text-poke-gray text-sm mt-2">
              Track every shiny hunt. Calculate your luck.
            </p>
          </div>

          <div className="bg-white border border-poke-border rounded-2xl shadow-card overflow-hidden">
            {/* Tab toggle */}
            <div className="flex border-b border-poke-border">
              <button
                className={`flex-1 py-3 text-sm font-display font-medium transition-colors
                  ${!isSignUp ? 'text-poke-red border-b-2 border-poke-red' : 'text-poke-gray hover:text-poke-black'}`}
                onClick={() => { setIsSignUp(false); setAuthError('') }}
              >
                Sign in
              </button>
              <button
                className={`flex-1 py-3 text-sm font-display font-medium transition-colors
                  ${isSignUp ? 'text-poke-red border-b-2 border-poke-red' : 'text-poke-gray hover:text-poke-black'}`}
                onClick={() => { setIsSignUp(true); setAuthError('') }}
              >
                Create account
              </button>
            </div>

            <form onSubmit={handleAuth} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-poke-gray font-mono mb-2 uppercase tracking-widest">
                  Email
                </label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="trainer@pokemon.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-poke-gray font-mono mb-2 uppercase tracking-widest">
                  Password
                </label>
                <input
                  className="input-field"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              {authError && (
                <p className="text-xs text-poke-red bg-poke-red/5 border border-poke-red/20 rounded-xl px-3 py-2">
                  {authError}
                </p>
              )}

              {isSignUp && (
                <p className="text-xs text-poke-gray">
                  You'll get a confirmation email — check your inbox after signing up.
                </p>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={authSubmitting || !email || !password}
              >
                {authSubmitting
                  ? (isSignUp ? 'Creating account…' : 'Signing in…')
                  : (isSignUp ? 'Create account →' : 'Sign in →')}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-poke-offwhite">
      {/* Header */}
      <header className="border-b border-poke-border bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <span className="text-poke-red font-display font-bold text-lg animate-sparkle">✦</span>
          <span className="font-display font-bold text-poke-black hidden sm:block">Shiny Tracker</span>
          <div className="flex-1" />

          {/* Trainer pill */}
          <div className="flex items-center gap-2 text-xs bg-poke-offwhite border border-poke-border
                       rounded-full px-3 py-1.5 font-mono text-poke-gray">
            <span className="w-5 h-5 rounded-full bg-poke-red/10 text-poke-red flex items-center justify-center text-xs font-bold">
              {user.email[0].toUpperCase()}
            </span>
            {user.email.split('@')[0]}
          </div>
          <button
            onClick={signOut}
            className="text-xs text-poke-gray hover:text-poke-black transition-colors font-mono"
          >
            sign out
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            + Add hunt
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <StatsBar hunts={hunts} />

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-poke-border">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-display font-medium capitalize transition-colors
                border-b-2 -mb-px
                ${tab === t
                  ? 'text-poke-red border-poke-red'
                  : 'text-poke-gray border-transparent hover:text-poke-black'
                }`}
            >
              {t}
            </button>
          ))}
          <div className="flex-1" />
          {tab === 'collection' && (
            <div className="pb-1">
              <ExportImport hunts={hunts} username={user.id} onImport={handleImport} />
            </div>
          )}
        </div>

        {/* Collection tab */}
        {tab === 'collection' && (
          <div className="animate-fade-in">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <input
                className="input-field max-w-xs h-9 text-sm"
                placeholder="Search Pokémon…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="flex gap-2">
                {['all', 'hunting', 'caught'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all capitalize
                      ${filterStatus === s
                        ? 'bg-poke-red/10 border-poke-red/40 text-poke-red'
                        : 'border-poke-border text-poke-gray hover:border-poke-gray'
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="relative ml-auto">
                <select
                  className="select-field h-9 text-sm pr-8 pl-3"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option value="recent">Most recent</option>
                  <option value="attempts">Most attempts</option>
                  <option value="name">Name A–Z</option>
                  <option value="dex">Pokédex #</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-poke-gray text-xs">▼</div>
              </div>
            </div>

            {/* Hunt list */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-poke-border rounded-2xl h-28 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-poke-gray">
                <div className="text-4xl mb-3 opacity-30">✦</div>
                <div className="font-display text-lg text-poke-gray">No hunts yet</div>
                <p className="text-sm mt-1">Click "+ Add hunt" to log your first shiny encounter.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(hunt => (
                  <div key={hunt.id} className="relative">
                    <HuntCard
                      hunt={hunt}
                      onDelete={deleteHunt}
                      onIncrement={incrementAttempts}
                      onMarkCaught={handleMarkCaught}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Charts tab */}
        {tab === 'charts' && (
          <div className="animate-fade-in space-y-4">
            {hunts.length === 0 ? (
              <div className="text-center py-20 text-poke-gray">
                <div className="text-4xl mb-3 opacity-30">📊</div>
                <div className="font-display text-lg text-poke-gray">No data yet</div>
                <p className="text-sm mt-1">Add some hunts to see your charts.</p>
              </div>
            ) : (
              <>
                <AttemptsBarChart hunts={hunts} />
                <TimelineChart hunts={hunts} />
              </>
            )}
          </div>
        )}

        {/* Calculator tab */}
        {tab === 'calculator' && (
          <div className="animate-fade-in">
            <OddsCalculator />
          </div>
        )}
      </main>

      {showModal && (
        <AddHuntModal
          onAdd={addHunt}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
