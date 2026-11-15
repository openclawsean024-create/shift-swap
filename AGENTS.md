# AGENTS.md — 服務業排班換班助手（shift-swap）

> ⚠️ 本產品目前**建議暫緩**（`PRD/SPEC.md` §0）。在 Sean 明確決定繼續前，只能修改文件，不得依 `GOAL.md` 開始實作。

## 1. 權威文件與範圍

- 規格：[`PRD/SPEC.md`](./PRD/SPEC.md) v4.0（評估結論、FR 狀態、合併清單、里程碑、待決事項）。
- 目前目標：[`GOAL.md`](./GOAL.md)（只含 M1）。
- 驗證指令：[`SOP.md`](./SOP.md)；目前狀態：[`STATUS.md`](./STATUS.md)。
- `PRD/CHANGELOG.md` 為 v3.0.2 以前的歷史紀錄，內容與程式不符之處以 SPEC v4.0 §13 為準。
- 候選併入 repo `openclawsean024-create/shift-swapper`、`openclawsean024-create/shift-swap-helper` **只讀**；搬什麼、不搬什麼以 SPEC §12 為準。
- 重疊系統 `sean0407/wfm-phase5-internal` 為私人 repo，不得切換帳號存取；與其相關的決定由 Sean 做。

## 2. 專案結構

```
.github/workflows/ci.yml   # lint → test → build → deploy（deploy 目前因 Pages environment 保護規則失敗）
GOAL.md、AGENTS.md、SOP.md、STATUS.md
PRD/SPEC.md、PRD/CHANGELOG.md
web/                       # 唯一的前端專案（所有 npm 指令在此執行）
├── index.html             # 目前只有 meta refresh 導向 dashboard.html，未載入 src/main.tsx（GOAL AC-001 修正）
├── public/dashboard.html  # Tailwind CDN 通用後台範本，與產品無關（去留待 Sean 決定）
├── src/
│   ├── main.tsx、App.tsx  # BrowserRouter（未設 basename）+ 5 條路由
│   ├── components/Layout.tsx
│   ├── pages/             # Dashboard、Swap、Leave、Payroll、Settings
│   └── lib/               # db.ts（localStorage `shift-swap:db`）、types.ts、bootstrap.ts（載入時 seed）
├── tests/                 # vitest：db.test.ts、types.test.ts、e2e.test.tsx（jsdom）、setup.ts
├── eslint.config.js、tsconfig.json、vite.config.ts（base `/shift-swap/`、port 5188）、vitest.config.ts
└── package.json、package-lock.json
```

M1 預計新增 `web/src/domain/`（純函式領域邏輯，不 import React 或 localStorage）。

## 3. 技術棧

| 項目 | 版本／說明 |
|---|---|
| 建置 | Vite 6（`^6.0.0`），`@vitejs/plugin-react` 4 |
| UI | React 19、react-router-dom 7、Tailwind CSS v4（`@tailwindcss/vite`） |
| 語言 | TypeScript 5.6 strict、`verbatimModuleSyntax`、`noUnusedLocals`／`noUnusedParameters` |
| 測試 | vitest 2.1、jsdom 25、@testing-library/react 16、jest-dom |
| Lint | ESLint 9 flat config、typescript-eslint 8、react-hooks、react-refresh |
| 資料 | 無後端；瀏覽器 localStorage |
| Node | 未固定（無 `.nvmrc`、無 `engines`）；CI 使用 Node 20 |
| 部署 | GitHub Pages：Pages 設定為 legacy、來源 `gh-pages` 分支（2026-08-23 舊版）；CI deploy job 失敗 |

## 4. 開發規則

1. **只用明顯假資料**：姓名加「示範」前綴、店名「示範門市」、電話 `0900-000-xxx`、Email `@example.com`。不得放入真實員工、店家資料。發現疑似真實個資時，不要複製或擴散，回報檔案路徑。
2. **不收集健康細節**：請假事由為選填，不得在 seed、測試或 UI 範例中寫入病情、生理期等健康資訊。
3. **不得提交憑證**：token、API key、LINE channel secret、金流金鑰、`.env*` 一律不進 repo；M1 程式不讀任何憑證環境變數、不發任何網路請求。
4. **測試不可為了通過而刪改斷言**：不得刪除、`.skip`／`.only`、放寬斷言或改期望值來讓測試通過；行為變更需在 PR 說明並對應 FR／AC。
5. **勞基法與薪資**：只做提示與「預估」，不得宣稱合規保證或產生正式薪資單；法條參數需註明條號，實作時查證最新條文。
6. **不擴大 scope**：後端、登入、多店、真實通知、計費、打卡、自動排班、WFM 串接都不在 M1；新增需求先改 SPEC 並經 Sean 同意。
7. **依賴**：不引入 Next.js、Tailwind 3 或第二套樣式系統；新增依賴需在 PR 說明理由。
8. **Git 與發布**：從 `main` 開分支、以 PR 合併；不直接 push `main`、不 force push、不改 repo 或 Pages 設定；不得執行 `npm run deploy`（會直接推送 `gh-pages` 分支發布）；不得封存、刪除、改名任何 repo。
9. **Commit 格式**：`<type>(scope): <說明或 FR／AC 編號>`，例如 `feat(swap): AC-003 transitionSwap 狀態機`。

## 5. 驗證

指令與目前可用狀態見 [`SOP.md`](./SOP.md)。標示「尚未配置」的指令（`test:dist`、`e2e`、format）不得宣稱已通過；本機未執行的檢查必須標「未在本機執行」。
