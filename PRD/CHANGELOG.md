# shift-swap · 變更日誌

> 自動維護：Sean 10-repo-fleet Batch 4D
> 對齊 PRD v3.0.2 等級

---

## v3.0.2 — 2026-09-06（Sean 10-repo-fleet Batch 4D）

v3.0.2 完成於 2026-09-06 by Sean 10-repo-fleet

**升級內容**：
- 📄 撰寫 `PRD/SPEC.md`（9 章 v3.0.2 等級規格書）
- 📄 撰寫本 `PRD/CHANGELOG.md`
- ⚙️ 建立 `.github/workflows/ci.yml`（4 jobs: lint / test / build / deploy-pages）
- ⚙️ 建立 `web/eslint.config.js`（ESLint v9 flat config + typescript-eslint + react-hooks + react-refresh）
- ⚙️ 新增 `web/tests/db.test.ts`（19 個 db.ts 單元測試：seedDemoData / advanceSwap 狀態機 / addSwap / localStorage 持久化 / getDB 結構）
- ⚙️ 新增 `web/tests/types.test.ts`（6 個 types.ts 型別編譯 smoke test）
- 🐛 修 `web/index.html` redirect bug：`./public/dashboard.html`（在 dev/prod 皆 404）→ `./dashboard.html`
- 🐛 修 `web/src/lib/db.ts:51` ESLint warning `s.status as any` → `s.status as Flow`（型別強化）
- ⚙️ `web/package.json` 新增 `lint` script + ESLint v9 dev deps

**驗證結果**：
- `npm run lint` — **0 errors, 0 warnings**（ESLint v9 + typescript-eslint v8）
- `npm test` — **36/36 passed**（db 19 + types 6 + e2e 11）
- `npm run build` — `tsc --noEmit` strict 綠 + `vite build` 產出 `dist/{index.html, dashboard.html}`

**Deploy 目標**：GitHub Pages（base: `/shift-swap/`）

**GHA 4 jobs**：
1. **lint** — ESLint v9
2. **test** — vitest run
3. **build** — tsc --noEmit + vite build（需 lint + test 全綠）
4. **deploy** — actions/deploy-pages@v4（需 build 綠 + push to main）

**已知限制**：
- E2E 11 個測試使用 vitest + jsdom（非 Playwright，但已涵蓋 5 路由 + 換班狀態機）
- v1 鎖 mock 員工（林小柔 / 台北信義店）— 多員工 / 多店 / 真實簽核流程 v2+
- localStorage 損壞會自動 reset（`read()` catch 後回傳預設）
- 公開 `dashboard.html` 仍用 CDN tailwindcss（standalone，無 React）

---

## v0.1.0 — 2026-09-06（Sprint 1 初始）

**內容**：
- Vite 6 + React 19 + TypeScript 5.6 strict + Tailwind v4 + Vitest 2.1
- 5 個 P0 頁面：Dashboard / Swap / Leave / Payroll / Settings
- React Router 7 五路由 + Layout 共用 nav
- localStorage 持久化（key: `shift-swap:db`）
- 4 階換班狀態機：待努力確認 → 已達審核中 → 主管簽核中 → 完成
- 11 個 e2e.test.tsx
- 公開 `public/dashboard.html` 靜態行銷頁（CDN tailwindcss）

**目標**：M1 SaaS MVP — 排班換班助手 Sprint 1（服務業 B2B2E2C），NT$990/月/店
