import { getPayroll } from '../lib/db'
export default function PayrollPage() {
  const p = getPayroll()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">💰 薪資明細</h1>
      <div className="text-xs text-slate-500 mb-4">{p.month} 月</div>
      <div className="border border-slate-200 rounded p-6 mb-4" data-testid="payroll-total">
        <div className="text-3xl font-bold text-orange-600">NT$ {p.total.toLocaleString()}</div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <div className="text-xs text-slate-500">總班次</div>
            <div className="font-medium">{p.shifts}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">加班時數</div>
            <div className="font-medium">{p.overtime}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
