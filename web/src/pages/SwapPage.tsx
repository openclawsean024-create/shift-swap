import { useState } from 'react'
import { listSwaps, advanceSwap, addSwap } from '../lib/db'

export default function SwapPage() {
  const [, setTick] = useState(0)
  const [note, setNote] = useState('')
  const swaps = listSwaps()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔄 換班申請</h1>
      <div className="border border-slate-200 rounded p-4 mb-4">
        <h2 className="font-medium mb-2">＋ 新申請</h2>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="說明原因..." className="w-full mb-2 px-3 py-2 border rounded text-sm" data-testid="swap-note" />
        <button onClick={() => { addSwap(note); setNote(''); setTick(t => t + 1) }} className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm" data-testid="submit-swap">送出</button>
      </div>

      <div className="space-y-2" data-testid="swaps-list">
        {swaps.map(s => (
          <div key={s.id} className="border border-slate-200 rounded p-3" data-testid={`swap-${s.id}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{s.fromEmployee} · {s.date}</div>
                <div className="text-xs text-slate-500">{s.submittedAt} · {s.note}</div>
              </div>
              <button onClick={() => { advanceSwap(s.id); setTick(t => t + 1) }}
                className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded" data-testid={`advance-${s.id}`}>
                {s.status} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
