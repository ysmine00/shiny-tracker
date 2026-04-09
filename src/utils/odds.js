/**
 * All shiny probability math in one place.
 */

export const GO_ENCOUNTER_TYPES = [
  { value: 'standard',   label: 'Standard Wild',   rate: 500  },
  { value: 'community',  label: 'Community Day',   rate: 25   },
  { value: 'spotlight',  label: 'Spotlight Hour',  rate: 150  },
  { value: 'raid_day',   label: 'Raid Day',        rate: 75   },
  { value: 'research',   label: 'Field Research',  rate: 500  },
  { value: 'boosted',    label: 'Boosted Event',   rate: 150  },
]

export function getGoRate(encounterType) {
  return GO_ENCOUNTER_TYPES.find(t => t.value === encounterType)?.rate ?? 500
}

export const METHODS = [
  { value: 'random',    label: 'Random Encounter' },
  { value: 'masuda',    label: 'Masuda Method' },
  { value: 'sr',        label: 'Soft Reset' },
  { value: 'fishing',   label: 'Chain Fishing' },
  { value: 'radar',     label: 'Poké Radar' },
  { value: 'sos',       label: 'SOS Battle' },
  { value: 'outbreak',  label: 'Outbreak / Mass Outbreak' },
  { value: 'sandwich',  label: 'Sandwich Method (SV)' },
  { value: 'other',     label: 'Other' },
]

export const GAMES = [
  { value: 'gen2',   label: 'Gold / Silver / Crystal',          gen: 2 },
  { value: 'gen3',   label: 'Ruby / Sapphire / Emerald',        gen: 3 },
  { value: 'frlg',   label: 'FireRed / LeafGreen',              gen: 3 },
  { value: 'gen4',   label: 'Diamond / Pearl / Platinum',       gen: 4 },
  { value: 'hgss',   label: 'HeartGold / SoulSilver',           gen: 4 },
  { value: 'gen5',   label: 'Black / White / B2W2',             gen: 5 },
  { value: 'gen6',   label: 'X / Y / ORAS',                     gen: 6 },
  { value: 'gen7',   label: 'Sun / Moon / USUM',                gen: 7 },
  { value: 'swsh',   label: 'Sword / Shield',                   gen: 8 },
  { value: 'bdsp',   label: 'Brilliant Diamond / Shining Pearl', gen: 8 },
  { value: 'pla',    label: 'Legends: Arceus',                  gen: 8 },
  { value: 'sv',     label: 'Scarlet / Violet',                 gen: 9 },
]

/**
 * Base shiny rate denominator for a given method + game combination.
 * Returns the 1/N denominator.
 */
export function getBaseRate(method, game, shinyCharm = false) {
  const isModern = ['gen6','gen7','swsh','bdsp','pla','sv'].includes(game)
  const isGen5Plus = !['gen2','gen3','frlg'].includes(game)

  let rate

  switch (method) {
    case 'masuda':
      rate = isModern ? (shinyCharm ? 512 : 683) : (isGen5Plus ? 1366 : 8192)
      break
    case 'radar':
      rate = 200
      break
    case 'sos':
      rate = shinyCharm ? 683 : 1024
      break
    case 'outbreak':
    case 'sandwich':
      rate = shinyCharm ? 512 : 1024
      break
    case 'fishing':
      rate = shinyCharm ? (isModern ? 1365 : 2048) : (isModern ? 2048 : 4096)
      break
    default:
      if (game === 'pla') {
        rate = shinyCharm ? 585 : 4096
      } else {
        rate = isModern
          ? (shinyCharm ? 1365 : 4096)
          : (shinyCharm ? 2731 : 8192)
      }
  }

  return rate
}

/**
 * Cumulative probability of at least one shiny in n attempts.
 * P = 1 - (1 - 1/rate)^n
 */
export function cumulativeProb(n, rate) {
  if (!n || n <= 0) return 0
  return 1 - Math.pow(1 - 1 / rate, n)
}

/**
 * Expected number of encounters to hit 50% probability.
 */
export function expectedEncounters(rate) {
  return Math.ceil(Math.log(0.5) / Math.log(1 - 1 / rate))
}

/**
 * Returns a luck label and color class based on probability.
 */
export function getLuckLabel(prob) {
  if (prob >= 0.999) return { label: 'Impossibly unlucky', color: 'text-red-400' }
  if (prob >= 0.99)  return { label: 'Very unlucky',       color: 'text-orange-400' }
  if (prob >= 0.9)   return { label: 'Unlucky',            color: 'text-yellow-500' }
  if (prob >= 0.5)   return { label: 'Average',            color: 'text-shiny-dim' }
  if (prob >= 0.25)  return { label: 'Lucky',              color: 'text-green-400' }
  if (prob >= 0.1)   return { label: 'Very lucky',         color: 'text-emerald-400' }
  return                    { label: 'Incredibly lucky',   color: 'text-shiny-gold' }
}

/**
 * Format probability as a percentage string.
 */
export function formatProb(prob, decimals = 2) {
  return (prob * 100).toFixed(decimals) + '%'
}
