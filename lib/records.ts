import type { AccountRecord, RecordType } from '@/types/record'

export interface RecordInput {
  type: RecordType
  amount: string
  description: string
}

export type CreateResult = { ok: true; record: AccountRecord } | { ok: false; error: string }

export function createRecord(input: RecordInput): CreateResult {
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
      id: crypto.randomUUID(),
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
