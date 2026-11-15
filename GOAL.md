# Goal — 服務業排班換班助手 M1

> ⚠️ **建議暫緩，需 Sean 決定後才開發。** 本產品與 `sean0407/wfm-phase5-internal` 重疊，後者完成度較高；是否擇一由 Sean 決定（見 `PRD/SPEC.md` §0、§14）。在 Sean 明確同意前，不得依本檔開始實作。

## Objective

在只使用明顯假資料、只存在瀏覽器本機、不發任何通知、不收費的前提下，讓 `shift-swap` 成為一個真的能建置並發布出 React 應用的原型，並完成「員工選自己的班 → 指定同事 → 同事同意 → 店長核准 → 雙方班表互換」與「請假申請 → 店長核准」兩個本機閉環；同時在核准前顯示勞基法排班提示，所有工時與薪資只標示為「預估」。

規格依據：`PRD/SPEC.md` v4.0（§6 FR、§10 M1、§12 合併清單）。所有指令在 `web/` 目錄執行。

## Acceptance criteria

每條 AC 的「驗證」指令必須 exit 0。測試檔名為 M1 預計新增的名稱，實作時可調整，但須同步更新本檔與 `SOP.md`。

- **AC-001：品質閘門真的擋得住失敗，且建置產物包含 React 應用**
  - `web/index.html` 改為掛載 `#root` 並載入 `/src/main.tsx`；`BrowserRouter` 設 `basename={import.meta.env.BASE_URL}`（或改用 HashRouter），讓 `/shift-swap/` 路徑下的路由可匹配。
  - 新增 `test:dist` script：建置後檢查 `dist/index.html` 引用至少一個 `assets/*.js`，且不含 `http-equiv="refresh"`。
  - 新增 `e2e` script（Playwright，時區固定 `Asia/Taipei`，每個測試清空 localStorage），對 `vite preview` 的建置產物跑冒煙測試：首頁顯示今日班表。
  - `lint` 改為 `eslint . --max-warnings 0`。
  - CI：install 只用 `npm ci`（移除 `|| npm install` 後備）；新增 typecheck、`test:dist`、e2e 步驟；deploy job 在 Sean 決定 Pages 設定前先移除或改為只在 `workflow_dispatch` 執行，不得讓 main push 出現必然失敗的 job。
  - 驗證：`npm ci && npm run lint && npm run typecheck && npm test && npm run build && npm run test:dist && npm run e2e` 全部 exit 0；PR 上 GitHub Actions 全綠；`grep -n "|| npm install" ../.github/workflows/ci.yml` 無結果。

- **AC-002：併入 `shift-swapper` 資料模型（FR-004、FR-009、FR-010、FR-011）**
  - 依 `PRD/SPEC.md` §12.1 新增 `web/src/domain/`：`Employee`（含 `role`：employee／manager）、`Shift`（含 `employeeId`）、`SwapRequest`、`LeaveRequest`、餐飲與零售兩個班別模板、`calcShiftHours`（含跨夜）、以 `Asia/Taipei` 計算的日期函式。
  - `SwapRequest.status` 改為 `pending_peer`／`pending_manager`／`approved`／`rejected`／`cancelled`，UI 顯示「待同事確認／待店長核准／已核准／已駁回／已取消」；移除 `待努力確認`、`已達審核中`、`鬥香師傅` 等字串。
  - `src/domain/` 不 import React、react-router 或 `localStorage`。
  - 不引入 Next.js、Tailwind 3 或任何遠端圖片網域。
  - 驗證：`npm test -- tests/domain-types.test.ts tests/shift-hours.test.ts tests/date-tz.test.ts`（含跨夜 22:00–02:00 = 4 小時、台灣時間 2026-05-18 07:30 取日期為 `2026-05-18`）；`grep -rnE "待努力確認|已達審核中|鬥香師傅" src tests` 無結果；`grep -rnE "from 'react|localStorage" src/domain` 無結果。

- **AC-003：換班閉環與班表互換（FR-004、FR-005、FR-006、FR-013）**
  - 員工只能選自己未來、狀態為已排定的班，並指定同店另一位員工；原因選填。
  - 狀態轉換為純函式 `transitionSwap(request, action, actor)`：只有被指定同事能 accept／decline；只有店長能 approve／reject；申請人在核准前可 cancel；其他轉換回傳錯誤碼（例如 `NOT_ALLOWED`、`INVALID_TRANSITION`），不改資料。
  - 店長核准時雙方班次的 `employeeId` 互換（或單向代班時只改一方），並寫入稽核紀錄（actor、action、時間）。
  - 介面可用假帳號切換「員工／店長」，各自看到待處理清單。
  - 驗證：`npm test -- tests/swap-machine.test.ts`（逐格測試角色 × 狀態 × 動作矩陣，與核准後班表互換）；`npm run e2e -- tests/e2e/swap-flow.spec.ts`（員工A 申請 → 切換員工B 同意 → 切換店長核准 → 兩人班表互換 → reload 後仍在）。

- **AC-004：勞基法排班提示（FR-007）**
  - 新增純函式 `checkSchedule(shifts, employeeId, rules)`，回傳違規清單；規則參數放在 `src/domain/labor-rules.ts`，每條註明條號與「待法務確認」：每日正常工時 8 小時、每週 40 小時（第 30 條）、輪班間隔至少 11 小時（第 34 條）、每 7 日至少 1 日例假（第 36 條）、每月延長工時上限 46 小時（第 32 條）。
  - 店長核准換班前，對雙方套用換班後的班表執行檢查；有違規時顯示提示，M1 只提示不阻擋（是否阻擋待 Sean 決定）。
  - 畫面標示「僅供排班參考，不構成法律意見」。
  - 驗證：`npm test -- tests/labor-rules.test.ts`（每條規則至少 1 個通過、1 個違反的固定日期 fixture，含跨夜班的間隔計算）；`npm run e2e -- tests/e2e/swap-flow.spec.ts` 含一個會產生「間隔不足 11 小時」提示的案例。

- **AC-005：請假存檔與核准（FR-008）**
  - 請假寫入 localStorage：假別（事假、病假、特休、喪假等，清單放設定檔）、起訖日（`type="date"`，結束不得早於開始）、原因選填，欄位下方提示「不需填寫病情或私人細節」。
  - 店長可核准或駁回；核准後該期間在班表上標示請假。
  - 驗證：`npm test -- tests/leave.test.ts`（日期驗證、狀態轉換、核准後班表標示）；`npm run e2e -- tests/e2e/leave-flow.spec.ts`（送出 → reload 仍在 → 店長核准）。

- **AC-006：工時與預估薪資改由資料計算（FR-009）**
  - 薪資頁與班表頁的時數、班數、預估金額全部由班次與時薪計算，移除寫死的 `28560`、`18`；頁面標示「預估，非正式薪資」。
  - 時薪為設定值；低於 `MIN_HOURLY_WAGE` 常數（2026 年值依勞動部公告，實作時查證並註明出處）時顯示警告。
  - 不計算加班費、國定假日加倍、扣繳（交給 WFM 或會計系統）。
  - 驗證：`npm test -- tests/payroll-estimate.test.ts`（固定 fixture 的總時數與金額、跨夜、低於基本工資警告）；`grep -rn "28560" src` 無結果。

- **AC-007：只用明顯假資料、無網路請求**
  - seed、測試、fixture 姓名一律「示範」前綴（如「示範員工A」）、店名「示範門市」；如需電話用 `0900-000-xxx`、Email 用 `@example.com`；移除 seed 中「生理期不適」等健康相關文字。
  - 新增掃描測試：seed 與 fixture 中出現不在 `0900-000-` 範圍的 `09` 開頭號碼、非 `example.com` Email、或常見健康關鍵字（清單放測試內）即失敗。
  - 測試斷言應用操作過程中 `fetch` 與 `XMLHttpRequest` 呼叫次數為 0。
  - 驗證：`npm test -- tests/fixtures-safety.test.ts tests/no-network.test.ts`；在 repo 根目錄執行 `git grep -nIE "(sk-[A-Za-z0-9]{10,}|AKIA[0-9A-Z]{12,}|ghp_[A-Za-z0-9]{20,}|-----BEGIN)" -- web .github` 無結果。

## Out of scope

- 後端、資料庫、真實登入、多店與多租戶（M2）。
- 串接 `wfm-phase5-internal` 或任何外部 API（M2，需 Sean 決定定位）。
- LINE、推播、Email、SMS 等真實通知；M1 只有站內通知。
- 計費、金流、發票、方案限制；不建立任何金流帳號或金鑰。
- 正式薪資計算、加班費、薪資單；打卡；自動排班。
- 真實員工、店家資料。
- 執行 `npm run deploy`（`gh-pages -d dist`）或任何 production 發布；更改 GitHub Pages 或 environment 設定（需 Sean 操作）。
- 封存、刪除或改名 `shift-swapper`、`shift-swap-helper`。

## Exit gate

- Sean 已決定繼續本產品（§0 暫緩建議解除），並確認 `PRD/SPEC.md` §14 的待決事項。
- AC-001～AC-007 的驗證指令全部 exit 0，指令與結果記錄於 `STATUS.md`。
- 實作 PR 的 GitHub Actions 全綠（lint、typecheck、test、build、test:dist、e2e）。
- `PRD/SPEC.md` §12.1 每個「要搬」項目都有對應模組與測試；§12.2「不搬」原因仍成立。
- 通過後才可進入 M2（後端或 WFM 串接、登入、多店、LINE 測試頻道、試用店家）。
