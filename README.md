# accounting

WeHelp 最後階段前端任務：Accounting 記帳小工具。第二週接上 Firebase：會員註冊登入，記帳資料存在 Cloud Firestore，每個人只看得到自己的紀錄。

## 網站

| 環境   | 連結                                             |
| ------ | ------------------------------------------------ |
| 線上   | https://wehelp-accounting-iota.vercel.app        |
| 本機   | http://localhost:3000                            |
| 原始碼 | https://github.com/Annnnntoney/wehelp-accounting |

## 技術

Next.js（App Router）、React、TypeScript、pnpm；Firebase Authentication、Cloud Firestore；部署 Vercel。

## 頁面

| 路由          | 內容                                                            |
| ------------- | --------------------------------------------------------------- |
| `/`           | 未登入：登入系統、註冊帳戶；已登入：顯示帳號、立刻開始、登出    |
| `/accounting` | 需登入。`Form`（收入／支出、金額、說明）＋ `List`（刪除、小計） |

第一週的基準規格見 [docs/SPEC.md](./docs/SPEC.md)；第二週的完整做法見 [docs/TUTORIAL-WEEK2.md](./docs/TUTORIAL-WEEK2.md)。

## 檔案規劃

| 路徑                          | 內容                                  |
| ----------------------------- | ------------------------------------- |
| `app/page.tsx`                | 首頁：登入／註冊，或顯示已登入        |
| `app/accounting/page.tsx`     | 記帳頁，未登入導回首頁                |
| `components/AuthProvider.tsx` | 登入狀態（`useAuth()`）               |
| `components/AuthForm.tsx`     | 登入、註冊共用表單                    |
| `components/RecordsPanel.tsx` | 某個人的記帳區：讀取、新增、刪除      |
| `components/RecordForm.tsx`   | 新增紀錄表單（簡報的 Form）           |
| `components/RecordList.tsx`   | 紀錄列表、刪除（簡報的 List）         |
| `lib/firebase.ts`             | 初始化 Firebase（瀏覽器端延遲初始化） |
| `lib/auth.ts`                 | 註冊、登入、登出、錯誤訊息            |
| `lib/records-repo.ts`         | Firestore 讀寫                        |
| `lib/records.ts`              | 驗證輸入、算小計等純函式              |
| `firestore.rules`             | Firestore 安全規則                    |
| `rules-tests/`                | 安全規則測試                          |

## 本機

```bash
pnpm install
cp .env.example .env.local   # 填入 Firebase 專案設定
pnpm dev
```

不想碰正式資料庫，可以改用 Firebase Emulator（需要 Java）：

```bash
pnpm emulators       # 終端機 A：Auth、Firestore 模擬器，管理介面 http://127.0.0.1:4000
pnpm dev:emulator    # 終端機 B：Next.js 連到模擬器
```

| 指令                | 用途                                        |
| ------------------- | ------------------------------------------- |
| `pnpm lint`         | ESLint                                      |
| `pnpm typecheck`    | `next typegen` + `tsc --noEmit`             |
| `pnpm format`       | Prettier 格式化                             |
| `pnpm format:check` | Prettier 檢查（CI 用）                      |
| `pnpm test`         | Vitest 單元測試                             |
| `pnpm test:rules`   | Firestore 安全規則測試（自動啟動 Emulator） |
| `pnpm build`        | Production build                            |

## 資料與安全

- 資料路徑：`users/{uid}/records/{recordId}`，欄位 `amount`、`description`、`createdAt`
- 安全規則：[firestore.rules](./firestore.rules)：只有本人能讀、新增、刪除自己的紀錄，並驗證欄位格式
- 新增、刪除都等資料庫成功才更新畫面

## AI Code Review

PR 由 [Sourcery](https://sourcery.ai)（GitHub App，public repo 免費）自動審查，設定在 [.sourcery.yaml](./.sourcery.yaml)。

| 在 PR 留言             | 作用                         |
| ---------------------- | ---------------------------- |
| `@sourcery-ai review`  | 重新審查                     |
| `@sourcery-ai summary` | 產生 PR 摘要                 |
| `@sourcery-ai guide`   | 產生審查者指南               |
| `@sourcery-ai resolve` | 標記所有 Sourcery 評論已處理 |

不想被審查的 PR 加上 `sourcery-ignore` label。

## 文件

- **第一週教學**：[docs/TUTORIAL.md](./docs/TUTORIAL.md)
- **第二週教學（Firebase）**：[docs/TUTORIAL-WEEK2.md](./docs/TUTORIAL-WEEK2.md)
- 第一週任務規格：[docs/SPEC.md](./docs/SPEC.md)
- CI/CD 計劃：[docs/CICD.md](./docs/CICD.md)
- 待辦與排程：[TODO.md](./TODO.md)

## 繳交

完成後私訊講師：**Vercel 線上網址** + **GitHub Repository 連結**。
