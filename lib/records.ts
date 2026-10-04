import type { AccountRecord, RecordType } from '@/types/record'

export interface RecordInput {
  type: RecordType
  amount: string
  description: string
}

export type CreateResult = { ok: true; record: AccountRecord } | { ok: false; error: string }

/** createId 預設用瀏覽器內建的 UUID；測試時可以傳固定值，讓結果完全可預測 */
export function createRecord(
  input: RecordInput,
  createId: () => string = () => crypto.randomUUID()
): CreateResult {
  const amount = Number(input.amount)
  const description = input.description.trim()

  if (!Number.isInteger(amount) || amount <= 0) {
    return { ok: false, error: '金額請輸入大於 0 的整數' }
  }
  if (description === '') {
    return { ok: false, error: '請輸入說明' }
  }

  return {
    ok: true,
    record: {
      id: createId(),
      amount: input.type === 'income' ? amount : -amount,
      description,
    },
  }
}

export function removeRecord(records: AccountRecord[], id: string): AccountRecord[] {
  return records.filter((record) => record.id !== id)
}

export function calcSubtotal(records: AccountRecord[]): number {
  return records.reduce((sum, record) => sum + record.amount, 0)
}
