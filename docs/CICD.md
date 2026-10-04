# CI/CD 計劃：accounting（前端）

CI 用 GitHub Actions，CD 用 Vercel 的 GitHub 整合。一人開發也走 PR，這樣每個 PR 都有 CI 檢查和一個 Preview 網址。

```
feat/* 分支 ──push──▶ GitHub ──PR──▶ CI（Actions）+ Vercel Preview
                                     │ 全綠
                                     ▼
                              merge 進 main ──▶ CI + Vercel Production
```

## 1. 分支策略

| 分支     | 用途                                        | 部署              |
| -------- | ------------------------------------------- | ----------------- |
| `main`   | 隨時可上線；只能透過 PR 合併                | Vercel Production |
| `feat/*` | 一個功能一條，例如 `feat/form`、`feat/list` | Vercel Preview    |
| `fix/*`  | 修 bug                                      | Vercel Preview    |

- 合併方式：**Squash merge**，`main` 一個 PR 一個 commit。
- 合併後刪掉分支。

## 2. CI：`.github/workflows/ci.yml`

觸發：push 到 `main`、任何 PR。同一分支有新 push 時取消舊的 run。

| Job       | 步驟                                                               | 擋下什麼                             |
| --------- | ------------------------------------------------------------------ | ------------------------------------ |
| `quality` | `pnpm lint` → `pnpm typecheck` → `pnpm format:check` → `pnpm test` | 語法問題、型別錯、格式不一、邏輯回歸 |
| `build`   | `pnpm build`                                                       | Production build 會炸的問題          |
| `secrets` | gitleaks 掃全部歷史                                                | 不小心 commit 的 key／token          |

- Node 版本讀 `.nvmrc`（24），pnpm 版本讀 `package.json` 的 `packageManager`，本機和 CI 一致。
- `pnpm install --frozen-lockfile`：lockfile 跟 `package.json` 不一致就失敗，避免「我電腦可以」。
- `pnpm test` 目前用 `--passWithNoTests`，還沒寫測試也會過；寫了第一個測試之後就是真的在擋。

## 3. CD：Vercel

### 3.1 一次性設定

1. GitHub 建 repo，push `main`。
2. vercel.com → **Add New → Project** → 匯入 repo。
3. Framework 自動偵測 Next.js；Install Command 會自動用 pnpm（有 `pnpm-lock.yaml`）。
4. **Deploy**，拿到 Production 網址，填回 README。
5. Settings → Git：確認 **Production Branch = `main`**。

### 3.2 之後的行為

| 事件                    | Vercel 做什麼                     |
| ----------------------- | --------------------------------- |
| push 到 `feat/*`／開 PR | 建 Preview 部署，網址留言在 PR 上 |
| merge 進 `main`         | 建 Production 部署，更新正式網址  |

### 3.3 回滾

Vercel Dashboard → Deployments → 選上一個正常的部署 → **Instant Rollback**（或 **Promote to Production**）。不用 revert commit 也能先救線上，再慢慢修。

### 3.4 環境變數

第一週沒有（資料只在前端 state）。第二週接 Firebase 時：

- 本機放 `.env.local`（已被 `.gitignore` 的 `.env*` 排除）。
- 線上在 Vercel → Settings → Environment Variables 設，Production／Preview 分開。
- 前端要讀的變數必須是 `NEXT_PUBLIC_` 開頭。
- 加一份 `.env.example` 只列變數名，並在 `.gitignore` 加 `!.env.example`。

## 4. Branch protection（GitHub → Settings → Branches → `main`）

- [ ] Require a pull request before merging
- [ ] Require status checks to pass：`Lint / Type / Format / Test`、`Build`、`Secret scan`
- [ ] （選）Require deployments to succeed：Vercel Preview
- [ ] Do not allow force pushes

一人開發不需要 required reviewers，PR 是為了 CI 和 Preview。

## 5. 測試計劃

### 5.1 第一階段：單元測試（Vitest）

把邏輯抽成 `lib/records.ts` 的純函式，元件只負責畫面。至少測：

| 測什麼   | 案例                                                          |
| -------- | ------------------------------------------------------------- |
| 建立紀錄 | 收入 500 → `amount = 500`；支出 500 → `amount = -500`         |
| 小計     | 簡報範例 `[-1200, -500, -200, 50000]` → `48100`；空陣列 → `0` |
| 刪除     | 刪掉指定 `id`，其他不動                                       |
| 輸入驗證 | 金額 0、負數、空白、非數字、說明空白 → 拒絕                   |

### 5.2 第二階段：E2E

頁面完成後打開 `ci.yml` 裡註解掉的 `e2e` job：

- 工具：Playwright（`pnpm add -D @playwright/test`），`webServer` 跑 `next start`。
- Smoke 劇本：
  1. 開 `/`，看到「React 練習專案」，按「點此開始」到 `/accounting`
  2. 新增一筆支出 1200「吃大餐」、一筆收入 50000「十月份薪資」
  3. 小計顯示 48800；支出是紅色、收入是綠色
  4. 刪除「吃大餐」，小計變 50000
  5. 按「返回首頁」回到 `/`
- 失敗時上傳 `playwright-report` 當 artifact。
- 進階：改成對 Vercel Preview 網址跑（`deployment_status` 事件），測的就是真正要上線的那份。

## 6. 驗收

- [ ] 開一個 PR：CI 三個 job 全綠，PR 上有 Vercel Preview 網址
- [ ] 故意 push 一個 lint 錯誤，確認 CI 變紅、不能 merge
- [ ] merge 後 Production 網址更新
- [ ] 試一次 Instant Rollback 再 promote 回來
