import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { cumulativeProb, getBaseRate } from '../utils/odds'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler
)

const CHART_COLORS = {
  red: '#E3350D',
  blue: '#3B7DDD',
  grid: '#E8E0DB',
  text: '#6B6B6B',
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#FFFFFF',
      borderColor: '#D9CFC9',
      borderWidth: 1,
      titleColor: '#1A1A1A',
      bodyColor: '#6B6B6B',
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.text, font: { family: 'DM Mono', size: 11 } },
    },
    y: {
      grid: { color: CHART_COLORS.grid },
      ticks: { color: CHART_COLORS.text, font: { family: 'DM Mono', size: 11 } },
    },
  },
}

/** Line chart: cumulative probability curve for a single hunt */
export function OddsLineChart({ hunt }) {
  const rate = getBaseRate(hunt.method, hunt.game, hunt.shiny_charm)
  const maxN = Math.max((hunt.attempts || 0) * 1.5, rate * 2, 100)
  const steps = 50
  const stepSize = Math.ceil(maxN / steps)

  const labels = []
  const data = []
  for (let n = 0; n <= steps; n++) {
    const encounters = n * stepSize
    labels.push(encounters.toLocaleString())
    data.push((cumulativeProb(encounters, rate) * 100).toFixed(2))
  }

  const currentProb = (cumulativeProb(hunt.attempts || 0, rate) * 100).toFixed(2)

  return (
    <div className="bg-white border border-poke-border rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-mono text-poke-gray uppercase tracking-widest">
          Probability curve · {hunt.display_name}
        </div>
        <div className="text-xs font-mono text-poke-red">{currentProb}% at {(hunt.attempts||0).toLocaleString()} enc.</div>
      </div>
      <div className="h-40">
        <Line
          data={{
            labels,
            datasets: [{
              data,
              borderColor: CHART_COLORS.red,
              backgroundColor: 'rgba(227,53,13,0.06)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
            }],
          }}
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: {
                ...baseOptions.scales.y,
                min: 0,
                max: 100,
                ticks: {
                  ...baseOptions.scales.y.ticks,
                  callback: v => v + '%',
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

/** Bar chart: attempts per Pokémon */
export function AttemptsBarChart({ hunts }) {
  const sorted = [...hunts].sort((a, b) => (b.attempts || 0) - (a.attempts || 0)).slice(0, 12)

  return (
    <div className="bg-white border border-poke-border rounded-2xl p-4 shadow-card">
      <div className="text-xs font-mono text-poke-gray uppercase tracking-widest mb-3">
        Encounters per hunt
      </div>
      <div className="h-48">
        <Bar
          data={{
            labels: sorted.map(h => h.display_name),
            datasets: [{
              data: sorted.map(h => h.attempts || 0),
              backgroundColor: sorted.map(h =>
                h.status === 'caught' ? 'rgba(227,53,13,0.25)' : 'rgba(59,125,221,0.25)'
              ),
              borderColor: sorted.map(h =>
                h.status === 'caught' ? CHART_COLORS.red : CHART_COLORS.blue
              ),
              borderWidth: 1,
              borderRadius: 6,
            }],
          }}
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              x: {
                ...baseOptions.scales.x,
                ticks: {
                  ...baseOptions.scales.x.ticks,
                  maxRotation: 30,
                },
              },
            },
          }}
        />
      </div>
      <div className="flex gap-4 mt-2 text-xs font-mono text-poke-gray">
        <span><span className="text-poke-red">■</span> Caught</span>
        <span><span className="text-poke-blue">■</span> Hunting</span>
      </div>
    </div>
  )
}

/** Monthly catches timeline */
export function TimelineChart({ hunts }) {
  const chartData = useMemo(() => {
    const caught = hunts.filter(h => h.status === 'caught' && h.caught_date)
    const byMonth = {}
    caught.forEach(h => {
      const month = h.caught_date.slice(0, 7)
      byMonth[month] = (byMonth[month] || 0) + 1
    })
    const sorted = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
    return {
      labels: sorted.map(([m]) => m),
      data: sorted.map(([, v]) => v),
    }
  }, [hunts])

  if (chartData.labels.length < 2) return null

  return (
    <div className="bg-white border border-poke-border rounded-2xl p-4 shadow-card">
      <div className="text-xs font-mono text-poke-gray uppercase tracking-widest mb-3">
        Shinies caught per month
      </div>
      <div className="h-40">
        <Line
          data={{
            labels: chartData.labels,
            datasets: [{
              data: chartData.data,
              borderColor: CHART_COLORS.red,
              backgroundColor: 'rgba(227,53,13,0.08)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: CHART_COLORS.red,
            }],
          }}
          options={{
            ...baseOptions,
            scales: {
              ...baseOptions.scales,
              y: {
                ...baseOptions.scales.y,
                ticks: {
                  ...baseOptions.scales.y.ticks,
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}
