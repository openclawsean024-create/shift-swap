import { describe, it, expect, beforeEach } from 'vitest'
import {
  seedDemoData,
  getDB,
  listShifts,
  listSwaps,
  getPayroll,
  advanceSwap,
  addSwap,
} from '../src/lib/db'
import { SHIFT_TYPES } from '../src/lib/types'

beforeEach(() => {
  localStorage.clear()
})

describe('seedDemoData', () => {
  it('預設建立 7 個班次（週一到週日）', () => {
    seedDemoData()
    expect(listShifts().length).toBe(7)
  })

  it('預設建立 3 筆換班申請', () => {
    seedDemoData()
    expect(listSwaps().length).toBe(3)
  })

  it('預設薪資 month=2026-05 total=28560', () => {
    seedDemoData()
    const p = getPayroll()
    expect(p.month).toBe('2026-05')
    expect(p.total).toBe(28560)
    expect(p.shifts).toBe(18)
  })

  it('每個班次都有 type / startTime / endTime / location', () => {
    seedDemoData()
    listShifts().forEach((s) => {
      expect(SHIFT_TYPES).toContain(s.type)
      expect(typeof s.startTime).toBe('string')
      expect(typeof s.endTime).toBe('string')
      expect(s.location).toBeTruthy()
    })
  })

  it('id 唯一', () => {
    seedDemoData()
    const ids = listShifts().map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('呼叫第二次 seed 為 no-op（已有資料不覆寫）', () => {
    seedDemoData()
    const before = listSwaps().length
    addSwap('覆寫測試')
    seedDemoData() // 不應被重置
    expect(listSwaps().length).toBe(before + 1)
  })
})

describe('advanceSwap 狀態機', () => {
  beforeEach(() => {
    localStorage.clear()
    seedDemoData()
  })

  it('待努力確認 → 已達審核中', () => {
    const s = listSwaps().find((x) => x.status === '待努力確認')!
    advanceSwap(s.id)
    expect(getDB().swaps.find((x) => x.id === s.id)!.status).toBe('已達審核中')
  })

  it('已達審核中 → 主管簽核中', () => {
    const s = listSwaps().find((x) => x.status === '已達審核中')!
    advanceSwap(s.id)
    expect(getDB().swaps.find((x) => x.id === s.id)!.status).toBe('主管簽核中')
  })

  it('主管簽核中 → 完成', () => {
    const s = listSwaps().find((x) => x.status === '主管簽核中')!
    advanceSwap(s.id)
    expect(getDB().swaps.find((x) => x.id === s.id)!.status).toBe('完成')
  })

  it('已完成狀態呼叫 advanceSwap 保持不變（不繞回）', () => {
    const s = listSwaps().find((x) => x.status === '主管簽核中')!
    advanceSwap(s.id) // 主管簽核中 → 完成
    advanceSwap(s.id) // 再呼叫一次
    expect(getDB().swaps.find((x) => x.id === s.id)!.status).toBe('完成')
  })

  it('不存在的 id 呼叫 advanceSwap 不會 throw', () => {
    expect(() => advanceSwap('nonexistent')).not.toThrow()
  })
})

describe('addSwap', () => {
  beforeEach(() => {
    localStorage.clear()
    seedDemoData()
  })

  it('新增後 listSwaps 長度 +1', () => {
    const before = listSwaps().length
    addSwap('測試申請')
    expect(listSwaps().length).toBe(before + 1)
  })

  it('新增的 swap 預設 status=待努力確認', () => {
    addSwap('測試申請')
    const first = listSwaps()[0]
    expect(first.status).toBe('待努力確認')
  })

  it('新增的 swap note 正確', () => {
    addSwap('特殊原因：家裡水管漏水')
    const first = listSwaps()[0]
    expect(first.note).toBe('特殊原因：家裡水管漏水')
  })

  it('新增的 swap fromEmployee=林小柔（單一員工 mock）', () => {
    addSwap('X')
    expect(listSwaps()[0].fromEmployee).toBe('林小柔')
  })
})

describe('localStorage 持久化', () => {
  it('資料寫入後重新讀取仍存在', () => {
    seedDemoData()
    const raw = localStorage.getItem('shift-swap:db')
    expect(raw).toBeTruthy()
    const parsed = JSON.parse(raw!)
    expect(Array.isArray(parsed.shifts)).toBe(true)
    expect(parsed.shifts.length).toBe(7)
  })

  it('localStorage 被破壞時 read() 回傳預設空 db', () => {
    localStorage.setItem('shift-swap:db', '{not-valid-json')
    // 不 throw, 也不會壞掉
    expect(() => listShifts()).not.toThrow()
    expect(listShifts().length).toBe(0)
  })

  it('localStorage 沒有 shifts 陣列時回傳預設', () => {
    localStorage.setItem('shift-swap:db', JSON.stringify({ swaps: [], payroll: {} }))
    expect(listShifts().length).toBe(0)
  })
})

describe('getDB', () => {
  it('回傳 DBSchema 結構（shifts / swaps / payroll）', () => {
    seedDemoData()
    const db = getDB()
    expect(db).toHaveProperty('shifts')
    expect(db).toHaveProperty('swaps')
    expect(db).toHaveProperty('payroll')
  })
})
