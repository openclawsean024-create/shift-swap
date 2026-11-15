# Status — shift-swap（服務業排班換班助手）

- 產品：服務業排班換班助手（暫定名稱，代號 shift）
- 主 repo：`openclawsean024-create/shift-swap`（`main` @ `2bd74a9`）
- 候選併入（只讀）：`openclawsean024-create/shift-swapper`（`main` @ `586c905`）、`openclawsean024-create/shift-swap-helper`（`main` @ `cf11a48`）
- 規格：`PRD/SPEC.md` v4.0；目標：`GOAL.md`（M1）
- 狀態：🟠 **建議暫緩；本次為文件重建，尚未開發**（2026-11-16）

## 評估摘要（詳見 SPEC §0）

| 項目 | 結論 |
|---|---|
| 現況完成度 | 15／100（主 repo）；併入 `shift-swapper` 後約 25 |
| 獲利潛力 | 低（獨立產品）；作為 WFM 員工自助前台為中 |
| 獲利模式 | SaaS 訂閱（按店計價，價格待確認） |
| 建議 | 暫緩 |
| 重疊 | 與 `sean0407/wfm-phase5-internal` 重疊，後者完成度較高，是否擇一由 Sean 決定 |

## 目前狀態摘要

- 純前端 Vite＋React 原型，5 個頁面、localStorage 假資料、36 個 vitest 測試。
- **建置產物不含 React 應用**：`web/index.html` 只有 meta refresh 導向與產品無關的 `dashboard.html` 範本。
- 線上 GitHub Pages 是 2026-08-23 舊版，路由因缺 `basename` 不匹配，只顯示導覽列（2026-11-16 以瀏覽器確認）。
- 換班只有備註文字與一條任何人可推進的狀態鏈；請假不存檔；薪資、個人資料、提醒寫死。
- 無後端、登入、角色權限、通知、計費、勞基法檢查。

## FR 對照（以 `main` 程式為準；SS＝shift-swap、SW＝shift-swapper）

| FR | 需求 | 優先 | 狀態 | 所在 repo |
|---|---|---|---|---|
| FR-001 | 員工個人班表 | P0 | 部分 | SS、SW |
| FR-002 | 主管排班總覽 | P0 | 部分 | SW |
| FR-003 | 建立、編輯、發布班表 | P0 | 未實作 | — |
| FR-004 | 換班申請（班次、對象、原因） | P0 | 部分 | SW |
| FR-005 | 換班狀態機（同事確認、主管核准／駁回、取消） | P0 | 部分 | SS、SW |
| FR-006 | 核准後班表互換 | P0 | 未實作 | — |
| FR-007 | 勞基法排班檢查 | P0 | 未實作 | — |
| FR-008 | 請假申請與核准 | P0 | 部分 | SW |
| FR-009 | 工時與預估薪資 | P1 | 部分 | SW |
| FR-010 | 行業班別模板 | P1 | 部分 | SW |
| FR-011 | 角色與權限 | P0 | 未實作 | — |
| FR-012 | 站內通知 | P1 | 部分（寫死） | SS、SW |
| FR-013 | 稽核紀錄 | P1 | 部分 | SW |
| FR-014 | 匯出紀錄 | P1 | 未實作 | — |
| FR-015 | 清除本機資料 | P1 | 部分 | SW |
| FR-016 | 個人資料頁 | P2 | 部分（寫死） | SS |
| FR-017 | 登入、多店、多租戶 | P1 | 未實作 | — |
| FR-018 | LINE／推播／Email 通知 | P1 | 未實作 | — |
| FR-019 | 計費 | P2 | 未實作 | — |
| FR-020 | 串接 `wfm-phase5-internal` | P1 | 未實作 | — |
| FR-021 | 自動排班建議 | P2 | 未實作（不做） | — |

小計：已實作 0、部分 11、未實作 10。

## Deterministic checks

本機無法執行 node，以下全部**未在本機執行**；結果引用 GitHub Actions run `34027228705`（2026-09-06，commit `2bd74a9`）。

| 檢查 | 結果 |
|---|---|
| `npm run lint`（CI lint job） | 成功 |
| `npm test`（CI test job） | 3 檔、36 tests 通過 |
| `npm run build`（CI build job，含 `tsc --noEmit`） | 成功；但 `dist/index.html` 只有 0.11 kB，不含 React 應用 |
| CI deploy job | 失敗：`github-pages` environment 保護規則不允許 `main` 部署 |
| `shift-swapper` CI（run `34066744678`） | lint（tsc）、test（只檢查檔案存在）、build 成功；deploy 失敗（Pages 未啟用） |
| `shift-swap-helper` CI（run `35452585137`） | 失敗；workflow 在根目錄跑 `npm ci`（`package.json` 在 `web/`）且呼叫不存在的 `lint` script |
| 憑證掃描（下載原始碼後以檔案搜尋） | 三個 repo 皆無 token、金鑰或私鑰 |
| 個資掃描 | 無電話、Email；seed 有完整中文姓名與員工編號（見下） |

## 已知風險與問題

- 建置與部署：React 應用未被打包；CI deploy 必然失敗；`npm run deploy` 會直接發布 `gh-pages`。
- 勞基法：`shift-swapper` 預設週工時上限 48／44 小時、時薪 183～195 元，可能與勞基法每週正常工時 40 小時與 2026 年基本工資（時薪 NT$196，待確認）不符；搬入時不得沿用。
- 個資：seed 使用完整中文姓名（`林小柔`、`王大明`、`陳小芳` 等，另 `shift-swapper/app/lib/mockData.ts` 有 7 個）與員工編號 `E-2024-018`；看似虛構，但不符合「明顯假資料」規範。`shift-swap/web/src/lib/db.ts` 的 seed 換班備註含「生理期不適」（健康資訊）。M1 AC-007 改正。
- 文案：`待努力確認`、`已達審核中`、`鬥香師傅` 等無意義字串被測試寫死。
- 文件不符：舊 SPEC 宣稱 CI 全綠、FR 全部 shipped、WCAG、vercel.json 等，皆與程式不符（SPEC §13）。
- 產品線重疊：與 `wfm-phase5-internal` 重疊（未讀取該 repo）。

## 本次變更

- 重寫 `PRD/SPEC.md`（v4.0）與 `GOAL.md`；新增 `AGENTS.md`、`SOP.md`、`STATUS.md`。未修改任何程式碼、設定、測試，`PRD/CHANGELOG.md` 保留不動。

## 待決事項（Sean）

1. 產品線：繼續本產品，或以 `wfm-phase5-internal` 為唯一產品線（後者則三個 repo 列為封存候選）。
2. 若繼續：定位為 WFM 的員工自助換班前台（建議），或獨立 SaaS。
3. GitHub Pages：是否保留；若保留需改 Pages 來源為 GitHub Actions 並調整 environment 保護規則（repo 設定，需 Sean 操作）。
4. `web/public/dashboard.html` 刪除或改寫。
5. 計價假設（NT$990／月／店或 NT$499／月）保留與否。
6. 勞基法提示在 M1 只提示或要阻擋核准。

## 下一步

1. Sean 決定上列第 1、2 點。
2. 若繼續：依 `GOAL.md` 先做 AC-001（品質閘門與建置），再做 AC-002～AC-007。
3. 若不繼續：由 Sean 決定是否封存 `shift-swap`、`shift-swapper`、`shift-swap-helper`。
