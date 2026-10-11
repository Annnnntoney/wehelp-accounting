export type RecordType = 'income' | 'expense'

/** 存進資料庫的內容：收入為正數、支出為負數，加總就是小計 */
export interface NewRecord {
  amount: number
  description: string
}

/** 從資料庫讀出來的紀錄，多了 Firestore 產生的 id */
export interface AccountRecord extends NewRecord {
  id: string
}
