import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import SwapPage from './pages/SwapPage'
import LeavePage from './pages/LeavePage'
import PayrollPage from './pages/PayrollPage'
import SettingsPage from './pages/SettingsPage'
import './lib/bootstrap'
export default function App() {
  return <Layout>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/swap" element={<SwapPage />} />
      <Route path="/leave" element={<LeavePage />} />
      <Route path="/payroll" element={<PayrollPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  </Layout>
}
