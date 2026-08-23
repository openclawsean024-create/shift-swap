import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">📅 排班換班助手</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/" className="hover:underline">我的班表</Link>
            <Link to="/swap" className="hover:underline">換班申請</Link>
            <Link to="/leave" className="hover:underline">請假</Link>
            <Link to="/payroll" className="hover:underline">薪資明細</Link>
            <Link to="/settings" className="hover:underline">設定</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">排班換班助手 · Sprint 1 · 員工自己就能搞定班表</footer>
    </div>
  )
}
