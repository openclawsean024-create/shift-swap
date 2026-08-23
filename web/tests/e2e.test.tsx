import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { listShifts, listSwaps, getPayroll, advanceSwap, addSwap, seedDemoData, getDB } from '../src/lib/db'

function renderAt(p: string) { return render(<MemoryRouter initialEntries={[p]}><App /></MemoryRouter>) }

beforeEach(async () => {
  localStorage.clear()
  seedDemoData()
})

describe('Sprint 1 E2E - 排班換班助手', () => {
  it('班表預載 7 天', () => {
    expect(listShifts().length).toBe(7)
  })

  it('換班申請預載 3 個', () => {
    expect(listSwaps().length).toBe(3)
  })

  it('薪資明細 5 月 NT$ 28560', () => {
    expect(getPayroll().total).toBe(28560)
  })

  it('首頁招呼語', () => {
    renderAt('/')
    expect(screen.getByText(/早安,林小柔/)).toBeInTheDocument()
  })

  it('今日班表區塊存在', () => {
    renderAt('/')
    expect(screen.getByTestId('today-shift')).toBeInTheDocument()
  })

  it('本週班表 7 欄', () => {
    renderAt('/')
    const grid = screen.getByTestId('week-shifts').querySelector('.grid-cols-7:last-child')
    expect(grid?.children.length).toBe(7)
  })

  it('換班推進可改狀態', () => {
    const s = listSwaps().find(x => x.status === '已達審核中')!
    advanceSwap(s.id)
    expect(getDB().swaps.find(x => x.id === s.id)!.status).toBe('主管簽核中')
  })

  it('新增換班申請', () => {
    const before = listSwaps().length
    addSwap('測試申請')
    expect(listSwaps().length).toBe(before + 1)
  })

  it('換班頁有送出表單', () => {
    renderAt('/swap')
    expect(screen.getByTestId('swap-note')).toBeInTheDocument()
  })

  it('請假頁有原因輸入', () => {
    renderAt('/leave')
    expect(screen.getByTestId('leave-reason')).toBeInTheDocument()
  })

  it('薪資頁顯示總額', () => {
    renderAt('/payroll')
    expect(screen.getByTestId('payroll-total').textContent).toContain('28,560')
  })
})
