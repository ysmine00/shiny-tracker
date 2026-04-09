const BASE = 'https://pokeapi.co/api/v2'

const cache = new Map()

async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`)
  const data = await res.json()
  cache.set(url, data)
  return data
}

/**
 * Fetch full Pokémon data by name or Pokédex number.
 * Returns { id, name, types, sprite, shinySprite, genus, baseOdds }
 */
export async function fetchPokemon(nameOrId) {
  const key = String(nameOrId).toLowerCase().trim()
  const data = await fetchWithCache(`${BASE}/pokemon/${key}`)

  const speciesData = await fetchWithCache(data.species.url)

  const genus =
    speciesData.genera?.find((g) => g.language.name === 'en')?.genus ?? ''

  return {
    id: data.id,
    name: data.name,
    displayName:
      data.name.charAt(0).toUpperCase() + data.name.slice(1).replace(/-/g, ' '),
    types: data.types.map((t) => t.type.name),
    sprite: data.sprites.front_default,
    shinySprite: data.sprites.front_shiny,
    officialArt:
      data.sprites.other?.['official-artwork']?.front_default ?? null,
    shinyOfficialArt:
      data.sprites.other?.['official-artwork']?.front_shiny ?? null,
    genus,
  }
}

/**
 * Search Pokémon names for autocomplete (returns first 20 matches)
 */
let allPokemonNames = null

export async function searchPokemon(query) {
  if (!query || query.length < 2) return []

  if (!allPokemonNames) {
    const data = await fetchWithCache(`${BASE}/pokemon?limit=1025`)
    allPokemonNames = data.results.map((p) => p.name)
  }

  const q = query.toLowerCase()
  return allPokemonNames
    .filter((n) => n.startsWith(q))
    .slice(0, 10)
    .map((n) => ({ name: n, displayName: n.charAt(0).toUpperCase() + n.slice(1).replace(/-/g, ' ') }))
}

export const TYPE_COLORS = {
  normal:   { bg: '#A8A878', text: '#fff' },
  fire:     { bg: '#F08030', text: '#fff' },
  water:    { bg: '#6890F0', text: '#fff' },
  electric: { bg: '#F8D030', text: '#333' },
  grass:    { bg: '#78C850', text: '#fff' },
  ice:      { bg: '#98D8D8', text: '#333' },
  fighting: { bg: '#C03028', text: '#fff' },
  poison:   { bg: '#A040A0', text: '#fff' },
  ground:   { bg: '#E0C068', text: '#333' },
  flying:   { bg: '#A890F0', text: '#fff' },
  psychic:  { bg: '#F85888', text: '#fff' },
  bug:      { bg: '#A8B820', text: '#fff' },
  rock:     { bg: '#B8A038', text: '#fff' },
  ghost:    { bg: '#705898', text: '#fff' },
  dragon:   { bg: '#7038F8', text: '#fff' },
  dark:     { bg: '#705848', text: '#fff' },
  steel:    { bg: '#B8B8D0', text: '#333' },
  fairy:    { bg: '#EE99AC', text: '#333' },
}
