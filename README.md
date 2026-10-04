# accounting

WeHelp 最後階段第一週前端任務：Accounting 記帳小工具。

## 網站

| 環境   | 連結                                             |
| ------ | ------------------------------------------------ |
| 線上   | https://wehelp-accounting-iota.vercel.app        |
| 本機   | http://localhost:3000                            |
| 原始碼 | https://github.com/Annnnntoney/wehelp-accounting |

## 技術

Next.js（App Router）、React、TypeScript、pnpm；部署 Vercel。

## 頁面

| 路由          | 內容                                                    |
| ------------- | ------------------------------------------------------- |
| `/`           | Header「React 練習專案」、Banner、「點此開始」按鈕      |
| `/accounting` | `Form`（收入／支出、金額、說明）＋ `List`（刪除、小計） |

完整畫面規格見 [docs/SPEC.md](./docs/SPEC.md)。

## 檔案規劃

| 路徑                        | 內容                                   |
| --------------------------- | -------------------------------------- |
| `app/page.tsx`              | 首頁                                   |
| `app/accounting/page.tsx`   | 記帳頁，持有 `records` state           |
| `components/RecordForm.tsx` | 新增紀錄表單（簡報的 Form）            |
| `components/RecordList.tsx` | 紀錄列表、刪除（簡報的 List）          |
| `lib/records.ts`            | 建立紀錄、算小計等純函式（給單元測試） |
| `types/record.ts`           | `AccountRecord` 型別                   |

## 本機

```bash
pnpm install
pnpm dev
```

| 指令                | 用途                            |
| ------------------- | ------------------------------- |
| `pnpm lint`         | ESLint                          |
| `pnpm typecheck`    | `next typegen` + `tsc --noEmit` |
| `pnpm format`       | Prettier 格式化                 |
| `pnpm format:check` | Prettier 檢查（CI 用）          |
| `pnpm test`         | Vitest 單元測試                 |
| `pnpm build`        | Production build                |

## 文件

- **零基礎教學（從頭到尾）**：[docs/TUTORIAL.md](./docs/TUTORIAL.md)
- 任務規格：[docs/SPEC.md](./docs/SPEC.md)
- CI/CD 計劃：[docs/CICD.md](./docs/CICD.md)
- 待辦與排程：[TODO.md](./TODO.md)

## 繳交

完成後私訊講師：**Vercel 線上網址** + **GitHub Repository 連結**。
