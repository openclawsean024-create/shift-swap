import { listShifts, listSwaps } from '../lib/db'

export default function DashboardPage() {
  const shifts = listShifts()
  const swaps = listSwaps()
  const today = shifts[0]
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">早安,林小柔</h1>
      <div className="text-xs text-slate-500 mb-4">📍 台北信義店</div>

      {today && (
        <div className="border border-slate-200 rounded p-4 mb-4" data-testid="today-shift">
          <div className="text-xs text-slate-500">今日班表</div>
          <div className="font-medium mt-1">{today.date} · {today.type}</div>
          <div className="text-sm text-slate-600 mt-1">{today.startTime} - {today.endTime}</div>
        </div>
      )}

      <h2 className="text-lg font-medium mb-2">近期提醒</h2>
      <div className="space-y-2 mb-6" data-testid="reminders">
        <div className="border border-slate-200 rounded p-3 text-sm">
          <div className="font-medium">5/19 換班申請待審</div>
          <div className="text-xs text-slate-500">下午 18:30</div>
        </div>
        <div className="border border-slate-200 rounded p-3 text-sm">
          <div className="font-medium">5/19 待排班已發布</div>
          <div className="text-xs text-slate-500">17:00</div>
        </div>
        <div className="border border-slate-200 rounded p-3 text-sm">
          <div className="font-medium">5/20 14:00 主管簽核中</div>
          <div className="text-xs text-slate-500">14:00</div>
        </div>
      </div>

      <h2 className="text-lg font-medium mb-2">本週班表</h2>
      <div className="border border-slate-200 rounded overflow-hidden" data-testid="week-shifts">
        <div className="grid grid-cols-7 text-xs text-center border-b bg-slate-50">
          {['一', '二', '三', '四', '五', '六', '日'].map(d => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 text-xs text-center">
          {shifts.slice(0, 7).map(s => (
            <div key={s.id} className={`py-2 border-r last:border-r-0 ${s.type === '休息' ? 'bg-slate-50 text-slate-400' : ''}`} data-testid={`week-${s.id}`}>
              <div>{s.date.slice(-2)}</div>
              <div className="font-medium">{s.type}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-600">
        換班申請進行中:<span className="font-bold" data-testid="swap-count">{swaps.length}</span>
      </div>
    </div>
  )
}
