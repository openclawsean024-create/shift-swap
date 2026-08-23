export type ShiftType = '早班' | '中班' | '晚班' | '休息'
export const SHIFT_TYPES: ShiftType[] = ['早班', '中班', '晚班', '休息']

export interface Shift {
  id: string
  date: string           // YYYY-MM-DD
  type: ShiftType
  startTime: string      // e.g. '09:00'
  endTime: string
  location: string
}

export interface SwapRequest {
  id: string
  fromEmployee: string
  date: string
  status: '待努力確認' | '已達審核中' | '主管簽核中' | '完成'
  submittedAt: string
  note: string
}

export interface PayrollSummary {
  month: string
  total: number
  shifts: number
  overtime: number
}
