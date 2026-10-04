# 前端待辦：accounting

**照著做：[docs/TUTORIAL.md](./docs/TUTORIAL.md)**（零基礎完整教學）。規格見 [docs/SPEC.md](./docs/SPEC.md)，CI/CD 見 [docs/CICD.md](./docs/CICD.md)。

> 簡報沒寫第一週的繳交期限。先抓 **10/9（五）交**，留週末準備 10/12 的個人專案期初報告；確認期限後再調。

## 10/4（日）專案初始化

- [x] create-next-app：TypeScript、App Router、ESLint、pnpm
- [x] 加 Prettier、Vitest、`typecheck` script；`.nvmrc` = 24
- [x] CI：`.github/workflows/ci.yml`（lint／type／format／test、build、gitleaks）
- [x] PR template、README、規格書、CI/CD 計劃
- [x] `git init` + 第一個 commit
- [x] GitHub 建 repo，push `main`
- [x] 確認 Actions 第一次跑綠燈
- [x] Vercel 匯入 repo，拿到 Production 網址，填回 README
- [ ] `main` 開 branch protection（見 CICD.md §4）

## 10/5（一）路由與資料

- [ ] `types/record.ts`：`AccountRecord`
- [ ] `lib/records.ts`：建立紀錄、刪除、小計、驗證（純函式）
- [ ] `lib/records.test.ts`：CICD.md §5.1 的案例
- [ ] 清掉 create-next-app 範例內容（`page.module.css`、`public/*.svg`）
- [ ] `app/page.tsx` 首頁：Header、Banner、「點此開始」→ `/accounting`

## 10/6（二）記帳頁

- [ ] `app/accounting/page.tsx`：`'use client'`，`useState<AccountRecord[]>`
- [ ] `components/RecordForm.tsx`：收入／支出、金額、說明、新增紀錄；送出後清空
- [ ] `components/RecordList.tsx`：金額＋說明＋刪除；支出紅、收入綠
- [ ] 小計、「返回首頁」
- [ ] 每塊一條 `feat/*` 分支、一個 PR，看 Preview 網址

## 10/7（三）樣式與 E2E

- [ ] 對照簡報截圖收斂樣式（Header 深藍灰、Banner 淺藍、置中）
- [ ] 手機寬度不破版
- [ ] （選）`localStorage` 保存紀錄
- [ ] Playwright smoke，打開 `ci.yml` 的 `e2e` job（CICD.md §5.2）

## 10/8（四）上線驗收

- [ ] Production 網址實測一遍：新增、刪除、小計、返回首頁
- [ ] 跑一次 CICD.md §6 的驗收
- [ ] README 補線上網址、截圖

## 10/9（五）繳交

- [ ] 私訊講師：Vercel 網址 + GitHub repo 連結
- [ ] repo 若是 private，記得把講師加成 collaborator

## 本週驗收

- `/` 與 `/accounting` 兩頁，`Form`、`List` 分成組件
- 新增、刪除、小計正確；收入綠、支出紅
- CI 綠燈、Vercel 線上可開
