import { describe, it, expect } from 'vitest'
import { SHIFT_TYPES, type ShiftType, type Shift, type SwapRequest, type PayrollSummary } from '../src/lib/types'

describe('SHIFT_TYPES 常數', () => {
  it('包含 4 種班別', () => {
    expect(SHIFT_TYPES.length).toBe(4)
  })

  it('早班 / 中班 / 晚班 / 休息', () => {
    expect(SHIFT_TYPES).toEqual(['早班', '中班', '晚班', '休息'])
  })

  it('每個都是合法 ShiftType', () => {
    SHIFT_TYPES.forEach((t) => {
      const ok: ShiftType = t
      expect(ok).toBe(t)
    })
  })
})

describe('型別結構編譯（執行期 smoke）', () => {
  it('Shift 欄位齊全', () => {
    const s: Shift = {
      id: 's1',
      date: '2026-05-18',
      type: '早班',
      startTime: '09:00',
      endTime: '17:00',
      location: '台北信義店',
    }
    expect(s.id).toBe('s1')
    expect(s.startTime).toBe('09:00')
  })

  it('SwapRequest 4 種 status 都可建構', () => {
    const statuses: SwapRequest['status'][] = ['待努力確認', '已達審核中', '主管簽核中', '完成']
    statuses.forEach((status) => {
      const r: SwapRequest = {
        id: 'sw1',
        fromEmployee: 'X',
        date: '2026-05-18',
        status,
        submittedAt: '2026-05-18 09:00',
        note: '',
      }
      expect(r.status).toBe(status)
    })
  })

  it('PayrollSummary 欄位齊全', () => {
    const p: PayrollSummary = { month: '2026-05', total: 28560, shifts: 18, overtime: 0 }
    expect(p.month).toBe('2026-05')
    expect(p.total).toBeGreaterThan(0)
  })
})
