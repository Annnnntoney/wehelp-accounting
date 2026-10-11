import type { AccountRecord, NewRecord, RecordType } from '@/types/record'

export const MAX_DESCRIPTION_LENGTH = 100
/** 單筆金額上限（10 億），安全規則也用同一個數字 */
export const MAX_AMOUNT = 1_000_000_000

export interface RecordInput {
  type: RecordType
  amount: string
  description: string
}

export type ParseResult = { ok: true; record: NewRecord } | { ok: false; error: string }

/** 把表單輸入轉成要存的資料；id 和時間交給資料庫產生 */
export function parseRecordInput(input: RecordInput): ParseResult {
  const amount = Number(input.amount)
  const description = input.description.trim()

  if (!Number.isInteger(amount) || amount <= 0) {
    return { ok: false, error: '金額請輸入大於 0 的整數' }
  }
  if (amount > MAX_AMOUNT) {
    return { ok: false, error: '單筆金額最多 10 億' }
  }
  if (description === '') {
    return { ok: false, error: '請輸入說明' }
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { ok: false, error: `說明最多 ${MAX_DESCRIPTION_LENGTH} 個字` }
  }

  return {
    ok: true,
    record: { amount: input.type === 'income' ? amount : -amount, description },
  }
}

export function removeRecord(records: AccountRecord[], id: string): AccountRecord[] {
  return records.filter((record) => record.id !== id)
}

export function calcSubtotal(records: AccountRecord[]): number {
  return records.reduce((sum, record) => sum + record.amount, 0)
}
