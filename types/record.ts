export type RecordType = 'income' | 'expense'

export interface AccountRecord {
  id: string
  /** 收入為正數、支出為負數，加總就是小計 */
  amount: number
  description: string
}
