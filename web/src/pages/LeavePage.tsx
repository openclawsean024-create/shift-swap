import { useState } from 'react'

export default function LeavePage() {
  const [type, setType] = useState('事假')
  const [date, setDate] = useState('2026-05-26')
  const [reason, setReason] = useState('')
  const [submitted, setSubmitted] = useState(false)
  function submit() {
    if (!reason.trim()) return
    setSubmitted(true)
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📝 請假申請</h1>
      <div className="border border-slate-200 rounded p-4 max-w-md">
        {submitted ? (
          <div className="text-green-600 font-medium" data-testid="leave-confirm">✓ 申請已送出,主管將審核</div>
        ) : (
          <>
            <label className="block mb-1 text-sm">假別</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm">
              <option>事假</option><option>病假</option><option>特休</option><option>喪假</option>
            </select>
            <label className="block mb-1 text-sm">日期</label>
            <input value={date} onChange={e => setDate(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm" />
            <label className="block mb-1 text-sm">原因</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full mb-3 px-3 py-2 border rounded text-sm" data-testid="leave-reason" />
            <button onClick={submit} className="w-full px-4 py-2 bg-orange-500 text-white rounded" data-testid="submit-leave">送出</button>
          </>
        )}
      </div>
    </div>
  )
}
