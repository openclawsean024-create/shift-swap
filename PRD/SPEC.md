# 服務業排班換班助手（shift）— 產品需求規格 v4.0

> 版本：v4.0（評估＋PRD 重建）｜更新日期：2026-11-16｜狀態：**建議暫緩**，文件重建，尚未依本版開發
> 主 repo：`openclawsean024-create/shift-swap`（預設分支 `main`，重建基準 commit `2bd74a9`）
> 候選併入（只讀）：`openclawsean024-create/shift-swapper`（`main` @ `586c905`）、`openclawsean024-create/shift-swap-helper`（`main` @ `cf11a48`）
> 產品名稱為暫定。
> 取代：v3.0.2（2026-09-06）。舊版宣稱「CI 4 jobs 全綠」「FR-001～FR-008 shipped」與程式不符（見 §13），本版不再沿用；舊版可由 git 歷史查閱，`PRD/CHANGELOG.md` 保留不動。

本文件的「已實作／部分／未實作」皆以 2026-11-16 實際閱讀三個 repo 的程式碼、GitHub Actions 最近一次執行紀錄與線上頁面為準，不以 README 推論。**本機無法執行 node，所有 `npm` 指令皆「未在本機執行」**；測試與建置結果引用 GitHub Actions run `34027228705`（2026-09-06）。

---

## 0. 評估結論

| 項目 | 結論 |
|---|---|
| 現況完成度 | **15／100**（主 repo 單獨）；把 `shift-swapper` 的資料模型併入後估計約 25。依據見下方。 |
| 獲利潛力 | **低**（單獨成產品）；若作為既有 WFM 系統的「員工自助換班前台」則為**中**。 |
| 目標客群 | 台灣 5–30 人的餐飲、零售、連鎖門市，目前用 LINE 群組＋Excel 排班換班；主管每天要處理換班與請假。 |
| 獲利模式 | **SaaS 訂閱**（按店計價；舊 PRD 假設 NT$990／月／店，未經驗證，待確認）。次選：免費增值（1 店免費，多店與報表付費）。 |
| 主要風險 | 勞基法工時與排班規則（錯誤會讓雇主受罰）；基本工資與加班費計算責任；員工個資與請假事由（可能含健康資訊）；競品眾多（HR／WFM 套裝、人力銀行附帶工具、國外排班 App，價格待確認）；與 Sean 自有系統重疊。 |
| 建議 | **暫緩** |
| 重疊 | **與 `sean0407/wfm-phase5-internal` 重疊，後者完成度較高，是否擇一由 Sean 決定。**（該 repo 為私人 repo，本次未讀取，只依 brief 描述：FastAPI WFM 排班請假系統，含 2026 法定薪資規則。）第一批產品中：`long-term-care` FR-002「照服員排班（衝突偵測）」與 `smart-dining` FR-067／FR-068「員工帳號、打卡」有部分功能重疊，但領域不同，不建議合併。 |

**完成度 15 的依據（主 repo `shift-swap`）**

- 有 5 個 React 頁面與 localStorage 資料層，36 個 vitest 測試在 CI 通過（2026-09-06）。
- 但 `web/index.html` 只有一行 meta refresh 導向 `dashboard.html`，**沒有載入 `src/main.tsx`**；CI 建置產物 `dist/index.html` 只有 0.11 kB，React 應用根本沒有被打包。正式產物只剩 `public/dashboard.html`，而它是通用後台範本（「活躍客戶」「客戶管理」「客戶會議」），與排班無關。
- 線上 GitHub Pages 是 2026-08-23 從 `gh-pages` 分支發布的舊版；`BrowserRouter` 沒設 `basename`，在 `/shift-swap/` 路徑下路由全部不匹配，畫面只剩導覽列（2026-11-16 以瀏覽器開啟確認）。
- 換班只有「備註文字」，沒有指定班次、對象；任何人都能把狀態往下推，沒有駁回；核准後班表不會變。請假不存檔；薪資 `NT$28,560`、個人資料、提醒全為寫死。
- 狀態文字有亂碼式用詞（`待努力確認`、`已達審核中`、職稱 `鬥香師傅`），測試把這些字串寫死。
- CI deploy job 因 `github-pages` environment 保護規則失敗。

**建議「暫緩」的理由**

1. Sean 已有完成度較高、含 2026 法定薪資規則的 `wfm-phase5-internal`；本產品的排班、請假、薪資三塊與其直接重疊，再獨立開發一套等於重做，且薪資與工時合規正是最難、責任最重的部分。
2. 本產品獨有的價值只剩「員工自助換班（雙方確認＋主管核准）」，單獨收費的說服力低；小店的替代方案是免費的 LINE 群組。
3. 三個 repo 都只是純前端假資料原型，沒有任何後端、登入、通知；繼續投入前應先決定產品線。

**若 Sean 決定繼續**：建議定位為「員工自助換班與請假前台」，M2 起改接 `wfm-phase5-internal` 的 API（由該系統負責排班規則與薪資），本 repo 不自行實作正式薪資計算。**若 Sean 決定以 `wfm-phase5-internal` 為唯一產品線**：建議封存 `shift-swap`、`shift-swapper`、`shift-swap-helper`（封存動作由 Sean 執行）。

**主 repo 是否為最佳基礎**：`shift-swapper` 的領域模型較完整（多員工、行業班別模板、指定對象換班、主管排班總覽、依時薪算工時），但它是 Next.js 單檔 900 行、沒有任何測試，CI 的「Unit Tests」只檢查檔案是否存在。`shift-swap` 已有 Vite＋ESLint＋vitest＋CI 骨架。**維持以 `shift-swap` 為主 repo**，把 `shift-swapper` 的型別與純函式搬入（約 300 行，見 §12）。

---

## 1. 問題

台灣服務業小店的排班與換班主要靠 LINE 群組與 Excel：

1. **換班沒有紀錄**：員工私下在群組找人換班，主管事後才知道；出了狀況無法追查誰同意過。
2. **主管花時間協調**：每個換班都要主管確認雙方、改班表、通知其他人。
3. **工時容易違規而不自知**：換班後可能出現「輪班間隔不足 11 小時」「連續上班超過 6 天」「單週正常工時超過 40 小時」，小店多半沒有檢查機制。
4. **員工不清楚自己的工時與預估薪資**：換班、加班後只能等月底薪資單。

以上痛點來自既有 PRD 與 repo 敘述，**尚未經店家訪談驗證**（待確認）。

## 2. 目標客群

| 類型 | 描述 | 備註 |
|---|---|---|
| Primary 付費者 | 5–30 人的餐飲、零售、門市店長或老闆 | 規模與付費意願待訪談 |
| Primary 使用者 | 該店正職、兼職、工讀生 | 主要用手機 |
| Secondary | 2–10 間分店的小型連鎖（需多店與權限） | M2 以後 |
| 暫不服務 | 醫院護理排班、24 小時物流、客服中心 | 規則複雜（變形工時、醫療人力規範），`shift-swapper` 雖有預設，但不在 M1 範圍 |

## 3. 獲利模式

- **SaaS 訂閱（按店計價）**。舊 PRD 寫 NT$990／月／店（`shift-swap`），`shift-swapper` SPEC 寫 Free／Pro NT$499／Enterprise NT$2,999，兩者都是內部假設，**未經市場驗證，價格待確認**。
- 次選：免費增值（1 店、10 名員工以下免費；多店、報表匯出、通知付費）。
- 不採模板販售、專案建置：排班換班需持續使用，不適合一次性交付。
- 若定位改為 `wfm-phase5-internal` 的前台，獲利併入該產品的方案，不單獨計價（待 Sean 決定）。

## 4. 競品與差異

| 類別 | 例子 | 價格 | 差異 |
|---|---|---|---|
| 免費現況 | LINE 群組＋Excel／Google Sheets | 免費 | 本產品提供可追溯的換班紀錄與工時檢查；但轉換成本是讓全店員工改用新工具 |
| 台灣 HR／薪資套裝 | 人力銀行附帶的人資系統、本地 HR SaaS（實際產品名稱與功能待確認） | 待確認 | 套裝多以薪資、打卡為主；本產品只做換班與請假，較輕 |
| 國外排班 App | Deputy、When I Work、Homebase、7shifts 等（台灣勞基法支援程度待確認） | 待確認 | 本產品以繁中、台灣勞基法排班規則為差異 |
| Sean 自有系統 | `sean0407/wfm-phase5-internal` | 內部 | 該系統完成度較高、含 2026 法定薪資規則；本產品最多只應作為其前台 |

競品清單與價格沒有可靠出處，全部**待確認**；不得在對外文件中引用為事實。

## 5. 現況盤點（以程式為準）

### 5.1 主 repo `shift-swap`（`main` @ `2bd74a9`）

- 技術棧：Vite 6、React 19、TypeScript 5.6 strict（`verbatimModuleSyntax`、`noUnused*`）、Tailwind v4（`@tailwindcss/vite`）、react-router-dom 7、vitest 2.1＋jsdom＋Testing Library、ESLint 9 flat config。程式碼在 `web/`。
- 頁面：`/` 首頁、`/swap` 換班、`/leave` 請假、`/payroll` 薪資、`/settings` 個人資料（`web/src/pages/`）。
- 資料：`web/src/lib/db.ts`，localStorage key `shift-swap:db`，seed 7 天班表（2026-05-18～24，固定 `台北信義店`）、3 筆換班、1 筆薪資摘要。
- 換班狀態機：`待努力確認 → 已達審核中 → 主管簽核中 → 完成`，`advanceSwap()` 只會往下一步，無駁回、無角色限制。`addSwap()` 申請人固定 `林小柔`、日期為今天（UTC）。
- 請假：`LeavePage` 只用元件 state，送出後顯示「申請已送出」，不寫入任何儲存；日期是自由文字輸入。
- 薪資、個人資料、首頁提醒：寫死。
- 測試（`web/tests/`）：`db.test.ts` 19、`types.test.ts` 6、`e2e.test.tsx` 11，共 36；e2e 實為 jsdom 元件測試，不是瀏覽器 E2E。CI 2026-09-06：36 passed。
- 建置：`npm run build` = `tsc --noEmit && vite build`。因 `index.html` 未載入 `src/main.tsx`，產物只有 redirect `index.html` 與 `dashboard.html`（CI log：`dist/index.html 0.11 kB`）。
- `public/dashboard.html`：Tailwind CDN 通用後台範本，側欄為「儀表板、任務清單、報表分析、客戶管理」，內容與排班無關。
- CI（`.github/workflows/ci.yml`）：lint、test、build 成功；deploy 失敗（`Branch "main" is not allowed to deploy to github-pages due to environment protection rules.`）。Pages 設定為 legacy、來源 `gh-pages` 分支（2026-08-23 版本）。
- `package.json` 有 `deploy: gh-pages -d dist`，會從本機直接推送 `gh-pages` 分支（等同發布，需經 Sean 同意才能執行）。

### 5.2 候選 `shift-swapper`（`main` @ `586c905`，只讀）

- 技術棧：Next.js（`package.json` 為 `^16.2.10`，SPEC 寫 Next 15／16 不一）、React 19 RC、Tailwind 3.4、`@types/react` 18（與 React 19 版本不一致）。單一 `app/page.tsx` 901 行，`'use client'`。
- 資料模型（`app/lib/types.ts`）：`Employee`（時薪、週配額、技能）、`Industry`／`ShiftType`（6 種行業模板，含時薪與顏色）、`Shift`（employeeId、status）、`SwapRequest`（申請人、對象、shiftId、desiredShiftId、reviewedAt／reviewedBy）、`LeaveRequest`（起訖日、類型、狀態）、`PayrollMonth`。
- 功能：7 個分頁（首頁、我的班表、換班、請假、薪資、排班總覽、設定）、切換目前員工、切換行業、週切換、依班別時薪算工時與預估薪資（`calcShiftHours` 處理跨夜）、主管 7×N 週表格、重置資料。
- 問題：
  - 對象按「同意換班」直接變 `approved`，跳過 `manager-pending`；沒有主管核准 UI；核准後班表不會互換。
  - 設定頁「切換行業」按鈕寫死切到 `restaurant`。
  - 日期用 `toISOString()`（UTC），台灣時間 00:00–08:00 會差一天。
  - 預設時薪 183、190、195 元，可能低於 2026 年基本工資（時薪 NT$196，依勞動部公告，待確認）；`weeklyHoursRule` 48／44 小時與勞基法每週正常工時 40 小時的規定不符（見 §9）。
  - 大量 `any`；沒有任何測試；CI 的 lint 是 `tsc --noEmit`，test 只檢查檔案存在；deploy 失敗（Pages 未啟用）。
  - 線上 `shift-swapper.vercel.app` 可開啟（HTTP 200），頁面日期停在 07/10（推論為預先渲染時凍結，未在本機執行驗證）。

### 5.3 候選 `shift-swap-helper`（`main` @ `cf11a48`，只讀）

- 只有 Vite＋React 18 scaffold，`App.tsx` 9 行顯示標題文字；無功能、無測試。
- `PRD/SPEC.md` 列出 FR-001～FR-006（班表建檔、換班雙方確認、主管審核、工時計算／加班偵測、通知、報表）與「勞基法合規檢查」NFR，只有文字。
- CI 失敗：workflow 在 repo 根目錄跑 `npm ci`（但 `package.json` 在 `web/`），且呼叫不存在的 `lint` script；GitHub 以檔案路徑當 workflow 名稱顯示，推論 YAML 也無法正確解析。

---

## 6. 功能需求（FR）

狀態以 2026-11-16 程式為準。「所在 repo」：SS＝`shift-swap`、SW＝`shift-swapper`、SH＝`shift-swap-helper`。

| FR | 需求 | 優先 | 狀態 | 所在 repo | 備註 |
|---|---|---|---|---|---|
| FR-001 | 員工個人班表（今日、本週、週切換） | P0 | 部分 | SS、SW | SS 的「今日」取第一筆而非今天；SW 有週切換與表格 |
| FR-002 | 主管排班總覽（全員 × 7 天） | P0 | 部分 | SW | 唯讀；`updateShift` 未接 UI |
| FR-003 | 主管建立、編輯、發布班表 | P0 | 未實作 | — | M1 只做編輯單一班次 |
| FR-004 | 換班申請：選自己的班、指定同事、原因 | P0 | 部分 | SW（SS 只有備註） | |
| FR-005 | 換班狀態機：對方確認 → 主管核准／駁回 → 取消 | P0 | 部分 | SS、SW | SS 無角色與駁回；SW 跳過主管 |
| FR-006 | 核准後雙方班表自動互換並留紀錄 | P0 | 未實作 | — | |
| FR-007 | 勞基法排班檢查（每日／每週正常工時、輪班間隔 11 小時、七休一、延長工時上限） | P0 | 未實作 | 只有 SH SPEC 文字 | 只做提示，不構成法律意見 |
| FR-008 | 請假申請（假別、起訖、狀態）與主管核准 | P0 | 部分 | SW（SS 不存檔） | 原因欄不得強制填健康細節 |
| FR-009 | 工時統計與預估薪資（時薪、跨夜） | P1 | 部分 | SW（SS 寫死） | 標示「預估，非正式薪資」；正式薪資交給 WFM |
| FR-010 | 行業班別模板 | P1 | 部分 | SW | M1 只保留餐飲、零售 |
| FR-011 | 角色與權限（員工、店長） | P0 | 未實作 | — | SW 只能切換「目前員工」 |
| FR-012 | 站內通知（換班待確認、待核准、結果） | P1 | 部分 | SS、SW | 目前為寫死清單 |
| FR-013 | 稽核紀錄（誰、何時、做了什麼） | P1 | 部分 | SW | 只有 `reviewedAt`／`reviewedBy` 欄位 |
| FR-014 | 匯出班表、換班、請假紀錄（CSV） | P1 | 未實作 | — | 勞基法要求出勤紀錄保存 5 年，M2 由後端負責 |
| FR-015 | 清除本機資料 | P1 | 部分 | SW | |
| FR-016 | 個人資料頁 | P2 | 部分 | SS | 寫死 |
| FR-017 | 登入、多店、多租戶 | P1 | 未實作 | — | M2 |
| FR-018 | LINE／推播／Email 通知 | P1 | 未實作 | — | M2 只接測試頻道 |
| FR-019 | 計費與方案限制 | P2 | 未實作 | — | M3 |
| FR-020 | 串接 `wfm-phase5-internal`（班表、請假、薪資來源） | P1 | 未實作 | — | 需 Sean 決定定位 |
| FR-021 | 自動排班建議 | P2 | 未實作 | — | 不做；屬 WFM 範圍 |

小計：已實作 0、部分 11、未實作 10。

### Non-Goals（明確不做）

- 打卡、GPS 出勤（交給既有 POS／打卡系統或 WFM）。
- 正式薪資計算、薪資單、扣繳（交給 WFM 或會計系統）。
- 自動排班 AI。
- 醫療院所、變形工時、責任制等特殊工時制度。

## 7. 非功能需求

| 維度 | 需求 | 驗證 |
|---|---|---|
| 品質閘門 | lint（0 warning）、typecheck、unit、build、瀏覽器 E2E 任一失敗即 CI 失敗；build 產物必須包含 React 應用 | GOAL AC-001 |
| 正確性 | 工時與合規規則為純函式，有固定日期 fixture；時區固定 `Asia/Taipei` | unit test |
| 行動裝置 | 375 px 寬可完成換班與請假 | Playwright mobile viewport |
| 無障礙 | 表單有 label；按鈕可用鍵盤操作 | Playwright／Testing Library 查詢 by role |
| 隱私 | M1 只存在瀏覽器 localStorage；無任何網路請求 | 測試斷言 `fetch` 呼叫次數為 0 |
| 可移植 | 業務邏輯與儲存層分離，M2 可替換為 API（含 WFM） | `src/domain/` 不 import React 或 localStorage |

## 8. 資料與個資處理

### 8.1 資料分級

| 等級 | 欄位 | 處理 |
|---|---|---|
| 一般 | 班別、日期、時段、店別 | 正常顯示 |
| 個資 | 員工姓名、員工編號、職稱、時薪 | 只有本人與店長可見時薪；M2 起需登入 |
| 敏感 | 請假事由中可能出現的健康、家庭資訊；病假、生理假等假別 | 事由改為選填；UI 提示「不需填寫病情」；只有本人與店長可見 |

### 8.2 原則

- M1 不收集真實資料；seed、測試、文件範例只用明顯假資料：姓名加「示範」前綴（例如「示範員工A」），電話用 `0900-000-xxx`，Email 用 `@example.com`。
- 不在 URL query 放任何個資。
- M2 起：員工資料蒐集需告知（個資法第 8 條）；離職員工資料保存期限依勞基法出勤紀錄保存規定與公司政策（待法務確認）。

### 8.3 現況問題

- seed 使用完整中文姓名（`林小柔`、`王大明`、`陳小芳` 等）與員工編號 `E-2024-018`、到職日；無電話或 Email。看起來是虛構，但不符合「明顯假資料」規範，M1 改名。
- `shift-swap` seed 的換班備註含「生理期不適」：示範資料就把健康資訊寫進自由文字欄位，M1 移除並改為假別欄位。

## 9. 法規與風險

| 風險 | 說明 | 對策 |
|---|---|---|
| 勞基法工時 | 正常工時每日 8 小時、每週 40 小時（第 30 條）；輪班更換班次至少連續休息 11 小時（第 34 條，有例外）；每 7 日至少 1 日例假、1 日休息日（第 36 條）；延長工時每月上限（第 32 條，46 小時，經勞資會議同意可調整） | FR-007 以設定檔參數實作，標示條號與「待法務確認」；只提示不阻擋（M1），由店長決定 |
| 基本工資 | `shift-swapper` 預設時薪 183／190／195 元可能低於 2026 年基本工資（時薪 NT$196，待確認最新公告） | 搬入時改為設定值，低於基本工資設定時顯示警告 |
| 薪資計算責任 | 加班費、國定假日、夜班津貼算錯會造成糾紛 | 本產品只顯示「預估」；正式薪資交給 `wfm-phase5-internal` 或會計系統 |
| 出勤紀錄 | 雇主需保存出勤紀錄 5 年（第 30 條） | M1 不處理；M2 後端需支援匯出與保存 |
| 個資 | 員工資料、請假事由 | §8 |
| 平台條款 | M2 若用 LINE Messaging API 通知，受 LINE 條款與費率限制 | M1 不接；M2 只接測試頻道 |
| 競品 | HR 套裝與國外排班 App 已存在 | §4，差異需訪談驗證 |
| 產品線重疊 | 與 `wfm-phase5-internal` 重疊 | §0 建議暫緩；Sean 擇一 |
| 部署 | `npm run deploy`（`gh-pages -d dist`）會直接發布；CI deploy 目前失敗 | M1 不部署；AC-001 處理 CI |

以上法條為一般性整理，不構成法律意見；條號與數字在實作前需再查證最新條文與公告（待確認）。

## 10. 里程碑

> 前提：Sean 決定繼續（§0 建議暫緩）。

| 里程碑 | 範圍 | 退出條件 |
|---|---|---|
| **M1：本機可驗證的換班閉環** | 修好品質閘門與建置；併入 `shift-swapper` 資料模型；員工／店長兩角色（假帳號切換）；換班雙方確認＋店長核准＋班表互換；請假存檔與核准；工時與勞基法提示；明顯假資料 | `GOAL.md` AC-001～AC-007 全部通過 |
| M2：後端與試用 | 決定自建後端或接 `wfm-phase5-internal` API；登入與多店；LINE 測試頻道通知；CSV 匯出；找 2–3 家店試用 | 試用店連續使用 4 週（目標待確認） |
| M3：上市 | 計費（測試模式→正式）；正式通知；隱私權政策與服務條款；出勤紀錄保存 | 首批付費店家（數量待確認） |

## 11. 成功指標

| 階段 | 指標 | 目標 |
|---|---|---|
| M1 | AC 驗證指令全部 exit 0；CI 全綠 | 100% |
| M1 | 勞基法規則 fixture 覆蓋 4 類規則的通過／違反案例 | 每類至少 2 例 |
| M2 | 試用店換班從申請到核准的時間中位數 | 待訪談後設定 |
| M2 | 試用店每週換班經由系統處理的比例 | 待確認 |
| M3 | 付費轉換率、每店月費 | 待確認 |

## 12. 合併清單

### 12.1 要搬（`shift-swapper` → `shift-swap`，M1）

| 來源 | 搬到 | 調整 |
|---|---|---|
| `app/lib/types.ts` 的 `Employee`、`Shift`、`SwapRequest`、`LeaveRequest` | `web/src/domain/types.ts` | 新增 `role`（employee／manager）、`storeId`；`SwapRequest.status` 改為 `pending_peer`／`pending_manager`／`approved`／`rejected`／`cancelled`；移除 `any` |
| `app/lib/industries.ts` 的 `ShiftType`、`calcShiftHours`、`getShiftType` | `web/src/domain/shift-types.ts` | 只保留餐飲、零售兩個模板；時薪改為設定值並檢查基本工資 |
| `app/lib/format.ts` 的 `formatDate`、`getWeekRange`、`relativeTime` | `web/src/domain/date.ts` | 改用 `Asia/Taipei` 計算日期，不用 `toISOString()` 取日期 |
| `app/lib/mockData.ts` 的 `genShiftsForIndustry` 產生邏輯 | `web/src/lib/seed.ts` | 姓名改「示範」前綴；日期以固定基準日注入，便於測試 |
| `app/page.tsx` 的 ScheduleView（週切換＋工時表）、SwapsView（指定班次與對象的表單）、LeaveView（起訖日）、TeamView（主管週表）、PayrollView（依班別彙總） | `web/src/pages/` 各頁 | 拆成元件；改用 react-router 路由；不搬 Tailwind 3 的 class 設定（主 repo 為 Tailwind v4） |

### 12.2 不搬

| 項目 | 原因 |
|---|---|
| Next.js 框架、`vercel.json`、`next.config.mjs`（含 `images.pexels.com`） | 主 repo 為 Vite；不需要遠端圖片 |
| 醫療、物流、客服、健身房 4 個行業模板 | 規則差異大（夜班、變形工時、醫療人力），M1 不服務 |
| `weeklyHoursRule` 48／44 小時 | 與勞基法正常工時 40 小時不符，由 FR-007 規則取代 |
| `MOCK_NOTIFICATIONS` 寫死通知 | M1 由實際事件產生站內通知 |
| `shift-swapper/dashboard.html`、`shift-swap/web/public/dashboard.html` | 通用後台範本，與產品無關（後者在主 repo，M1 刪除或改為產品說明頁，見 §14） |
| `shift-swap-helper` 全部程式 | 只有 scaffold，無可用程式 |
| `shift-swap-helper` SPEC 的 FR 文字 | 只吸收概念：工時計算／加班偵測 → FR-007、FR-009；通知 → FR-012、FR-018；報表 → FR-014 |

### 12.3 合併後處置

- 兩個候選 repo 本次只讀，不封存、不改名。M1 完成且 Sean 確認後，由 Sean 決定是否封存。
- 若 Sean 決定以 `wfm-phase5-internal` 為唯一產品線，三個 repo 都列為封存候選。

## 13. README／文件與程式不一致

| 文件說法 | 程式實況 |
|---|---|
| 舊 SPEC §6「GHA CI 跑 4 jobs 全綠」 | 2026-09-06 run 的 deploy job 失敗 |
| 舊 SPEC FR-001～FR-007「shipped」、FR-008「公開行銷頁」 | React 應用未被打包（`index.html` 沒有 script）；`dashboard.html` 是無關的通用範本 |
| 舊 SPEC §4「Security 沿用 vercel.json」 | 主 repo 沒有 `vercel.json` |
| 舊 SPEC §4「Tailwind v4 CDN」 | React 端用 `@tailwindcss/vite` 建置；只有 `dashboard.html` 用 Tailwind CDN（且是 v3 Play CDN） |
| 舊 SPEC §4「WCAG 2.1 AA、role／aria」 | 程式沒有任何 `aria-*` 或 `role` 屬性 |
| 舊 SPEC §2.2「送出請假新增 leave record、toast」 | 請假只改元件 state，沒有存檔，也沒有 toast |
| 舊 SPEC §7「Preview：Per-PR」 | CI 沒有 PR preview 部署 |
| 舊 SPEC §5.3「JS 關閉時 dashboard.html 仍可顯示」 | `dashboard.html` 依賴 Tailwind CDN script，JS 關閉時樣式失效 |
| 舊 `GOAL.md`「沿用 Vite+React+TS，NT$990/月/店」 | 無計費；價格未驗證 |
| commit 訊息「25 unit tests」 | 實際 36 個（db 19、types 6、e2e 11） |
| README 只有一行說明 | 無安裝、測試、部署說明 |
| `shift-swapper` README「規格書詳見 ./SPEC.md」 | 檔案在 `PRD/SPEC.md` |
| `shift-swapper` SPEC「Next.js 16 static export → out/」 | `next.config.mjs` 沒有 `output: 'export'`；CI 上傳的是 repo 根目錄 |
| `shift-swapper` README「換班：對方同意 → 主管核准」 | 對方同意後直接 `approved`，沒有主管核准步驟 |
| `shift-swap-helper` SPEC 技術棧「React 19、IndexedDB」 | `package.json` 為 React 18，無 IndexedDB |

## 14. 待 Sean 決定

1. **產品線**：繼續本產品，或以 `sean0407/wfm-phase5-internal` 為唯一產品線（後者則三個 repo 列為封存候選）。
2. 若繼續：定位為「WFM 的員工自助換班前台」（建議）或獨立 SaaS。
3. M1 是否保留 GitHub Pages 部署；若保留，Pages 來源要從 legacy `gh-pages` 分支改為 GitHub Actions，並調整 `github-pages` environment 保護規則（repo 設定變更，需 Sean 操作）。
4. `web/public/dashboard.html` 刪除或改寫為產品說明頁。
5. 計價假設（NT$990／月／店 vs. NT$499／月）是否保留，或待訪談後再訂。
6. 勞基法規則在 M1 只「提示」還是要「阻擋核准」。

## 15. 變更紀錄

- v4.0（2026-11-16）：依三個 repo 實際程式與 CI 紀錄重建；新增 §0 評估結論（建議暫緩）、合併清單、法規與風險、README 不符清單；FR 改為 21 條並標示實際狀態。未修改任何程式碼、設定或測試。
- v3.0.2（2026-09-06）：見 `PRD/CHANGELOG.md`。
