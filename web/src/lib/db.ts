import type { Shift, SwapRequest, PayrollSummary, ShiftType } from './types'
const KEY = 'shift-swap:db'
interface DBSchema { shifts: Shift[]; swaps: SwapRequest[]; payroll: PayrollSummary }
function read(): DBSchema {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p.shifts)) return p }
  } catch {}
  return { shifts: [], swaps: [], payroll: { month: '2026-05', total: 28560, shifts: 18, overtime: 0 } }
}
function write(db: DBSchema) { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch {} }

export function seedDemoData() {
  const db = read()
  if (db.shifts.length > 0) return
  const days = ['2026-05-18', '2026-05-19', '2026-05-20', '2026-05-21', '2026-05-22', '2026-05-23', '2026-05-24']
  const types: ShiftType[] = ['早班', '中班', '晚班', '休息']
  const times: Record<ShiftType, [string, string]> = {
    '早班': ['09:00', '17:00'],
    '中班': ['12:00', '20:00'],
    '晚班': ['14:00', '22:00'],
    '休息': ['', ''],
  }
  days.forEach((d, i) => {
    const t = types[i % 4]
    db.shifts.push({
      id: `s${i}`,
      date: d,
      type: t,
      startTime: times[t][0],
      endTime: times[t][1],
      location: '台北信義店',
    })
  })
  db.swaps = [
    { id: 'sw1', fromEmployee: '林小柔', date: '2026-05-19', status: '已達審核中', submittedAt: '2026-05-19 10:30', note: '與同事交換班次' },
    { id: 'sw2', fromEmployee: '王大明', date: '2026-05-22', status: '待努力確認', submittedAt: '2026-05-20 18:00', note: '家中有事請換班' },
    { id: 'sw3', fromEmployee: '陳小芳', date: '2026-05-24', status: '主管簽核中', submittedAt: '2026-05-21 12:00', note: '生理期不適' },
  ]
  write(db)
}
export function getDB(): DBSchema { return read() }
export function listShifts(): Shift[] { return read().shifts }
export function listSwaps(): SwapRequest[] { return read().swaps }
export function getPayroll(): PayrollSummary { return read().payroll }
export function advanceSwap(id: string) {
  const db = read()
  const s = db.swaps.find(x => x.id === id)
  if (!s) return
  const flow = ['待努力確認', '已達審核中', '主管簽核中', '完成'] as const
  type Flow = typeof flow[number]
  const idx = (flow as readonly string[]).indexOf(s.status as Flow)
  if (idx >= 0 && idx < flow.length - 1) s.status = flow[idx + 1]
  write(db)
}
export function addSwap(note: string) {
  const db = read()
  db.swaps.unshift({
    id: 'sw' + Date.now(),
    fromEmployee: '林小柔',
    date: new Date().toISOString().slice(0, 10),
    status: '待努力確認',
    submittedAt: new Date().toLocaleString('zh-Hant'),
    note,
  })
  write(db)
}
