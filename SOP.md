# 服務業排班換班助手 — 開發與驗證 SOP

## 規格對齊狀態（2026-11-16）

- ✅ `PRD/SPEC.md` v4.0 已依實際程式重建；`GOAL.md` 定義 M1。
- ⚠️ **建議暫緩**：與 `sean0407/wfm-phase5-internal` 重疊，需 Sean 決定後才開發。
- ⚠️ 本次只重建文件，尚未依 v4.0 開發；`shift-swapper` 尚未併入。
- ⚠️ 目前 `npm run build` 的產物不含 React 應用（`web/index.html` 未載入 `src/main.tsx`），M1 AC-001 修正。

## 環境

```bash
cd web
npm ci           # 使用 web/package-lock.json
```

- Node 版本：**尚未配置**（無 `.nvmrc`、無 `engines`）；CI 使用 Node 20。
- 本次重建所在的機器無法執行 node，下表「本機結果」全部為**未在本機執行**；「CI 結果」引用 GitHub Actions run `34027228705`（2026-09-06，commit `2bd74a9`）。

## 驗證指令（依 `web/package.json` scripts 查證）

| 類型 | 指令 | 狀態 | 本機結果 | CI 結果（2026-09-06） |
|---|---|---|---|---|
| Install | `npm ci` | 可用 | 未在本機執行 | 成功（CI 實際指令為 `npm ci --legacy-peer-deps \|\| npm install`） |
| Lint | `npm run lint` | 可用（`eslint .`；未設 `--max-warnings 0`） | 未在本機執行 | 成功 |
| Typecheck | `npm run typecheck` | 可用（`tsc --noEmit`） | 未在本機執行 | CI 沒有獨立步驟；包含在 build 內，成功 |
| Unit + 元件測試 | `npm test` | 可用（`vitest run`） | 未在本機執行 | 3 檔、36 tests 通過 |
| 單一測試檔 | `npm test -- tests/<檔名>` | 可用 | 未在本機執行 | — |
| Build | `npm run build` | 可用（`tsc --noEmit && vite build`） | 未在本機執行 | 成功，但產物只有 `dist/index.html`（0.11 kB，meta refresh）與 `dashboard.html`，**不含 React 應用** |
| Dev server | `npm run dev` | 可用（`vite`，http://localhost:5188/shift-swap/） | 未在本機執行 | — |
| 建置產物檢查 | `npm run test:dist` | **尚未配置** | — | — （GOAL AC-001 新增） |
| 瀏覽器 E2E | `npm run e2e` | **尚未配置** | — | — （現有 `tests/e2e.test.tsx` 是 jsdom 元件測試，不是瀏覽器 E2E；GOAL AC-001 新增 Playwright） |
| Preview | `npm run preview` | **尚未配置** | — | — |
| Format | — | **尚未配置** | — | — |
| 發布 | `npm run deploy`（`predeploy` 先 build，再 `gh-pages -d dist`） | script 存在，**禁止執行** | — | 會直接推送 `gh-pages` 分支，屬 production 發布，需 Sean 同意 |
| Secret 掃描 | 在 repo 根目錄：`git grep -nIE "(sk-[A-Za-z0-9]{10,}\|AKIA[0-9A-Z]{12,}\|ghp_[A-Za-z0-9]{20,}\|-----BEGIN)" -- web .github` | 可用（git 指令） | 未在本機執行（本次以檔案搜尋檢查下載的原始碼：無結果） | — |

尚未配置的指令不得當成通過。M1 完成時，下列指令須全部 exit 0：

```bash
cd web
npm ci
npm run lint          # M1 改為 --max-warnings 0
npm run typecheck
npm test
npm run build
npm run test:dist     # M1 新增
npm run e2e           # M1 新增
```

## CI 現況（`.github/workflows/ci.yml`）

- 觸發：push 與 PR 到 `main`、手動。
- lint、test、build 三個 job 都用 `npm ci --legacy-peer-deps || npm install`；`npm ci` 失敗時會改用 `npm install`，可能掩蓋 lockfile 不一致。
- build 會上傳 `web/dist/`，但產物不含 React 應用，CI 無法發現。
- deploy job：main push 時執行，2026-09-06 失敗（`github-pages` environment 保護規則不允許 `main` 部署）。Pages 目前是 legacy 模式、來源為 `gh-pages` 分支（2026-08-23 舊版）。線上網址 `https://openclawsean024-create.github.io/shift-swap/` 只顯示導覽列，主內容空白（`BrowserRouter` 未設 `basename`）。
- 以上在 M1 AC-001 修正；本次文件 PR 不改 CI。

## M1 開發流程（Sean 決定繼續後）

1. 讀 `AGENTS.md`、`GOAL.md`、`PRD/SPEC.md` 對應章節。
2. 先做 AC-001（品質閘門），再依序做 AC-002～AC-007；每個 AC 一個分支與 PR，PR 標題含 AC 編號。
3. 先寫測試再實作；只用明顯假資料；時區固定 `Asia/Taipei`。
4. 跑上方 M1 指令，把 exit code 與摘要記到 `STATUS.md`。
5. 不 push `main`、不執行 `npm run deploy`、不改 Pages 或 repo 設定；合併由 Sean 決定。

## 故意不做（M1）

- ❌ 後端、資料庫、真實登入、多店。
- ❌ 串接 `wfm-phase5-internal` 或任何外部 API。
- ❌ LINE、推播、Email 等真實通知。
- ❌ 計費、金流金鑰。
- ❌ 正式薪資計算、打卡、自動排班。
- ❌ 真實員工或店家資料；production 發布。
