import toast from 'react-hot-toast'

export default function ExportImport({ hunts, username, onImport }) {
  function exportJSON() {
    const blob = new Blob([JSON.stringify({ username, hunts }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shiny-tracker-${username}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as JSON')
  }

  function exportCSV() {
    const headers = [
      'display_name', 'pokemon_id', 'types', 'method_label', 'game_label',
      'attempts', 'status', 'shiny_charm', 'base_rate', 'caught_date', 'notes',
    ]
    const rows = hunts.map(h =>
      headers.map(k => {
        const v = k === 'types' ? (h.types || []).join('+') : h[k]
        return JSON.stringify(v ?? '')
      }).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shiny-tracker-${username}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Exported as CSV')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.hunts && Array.isArray(data.hunts)) {
          onImport(data.hunts)
          toast.success(`Imported ${data.hunts.length} hunts`)
        } else {
          toast.error('Invalid file format')
        }
      } catch {
        toast.error('Could not parse JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="flex gap-2">
      <button onClick={exportJSON} className="btn-ghost text-xs">
        ↓ JSON
      </button>
      <button onClick={exportCSV} className="btn-ghost text-xs">
        ↓ CSV
      </button>
      <label className="btn-ghost text-xs cursor-pointer">
        ↑ Import
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
    </div>
  )
}
