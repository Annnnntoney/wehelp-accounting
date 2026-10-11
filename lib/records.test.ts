import { describe, expect, it } from 'vitest'
import {
  MAX_AMOUNT,
  MAX_DESCRIPTION_LENGTH,
  calcSubtotal,
  parseRecordInput,
  removeRecord,
} from './records'
import type { AccountRecord } from '@/types/record'

describe('parseRecordInput', () => {
  it('收入存成正數', () => {
    const result = parseRecordInput({ type: 'income', amount: '500', description: '統一發票中獎' })
    expect(result).toEqual({ ok: true, record: { amount: 500, description: '統一發票中獎' } })
  })

  it('支出存成負數', () => {
    const result = parseRecordInput({ type: 'expense', amount: '500', description: '咖啡' })
    expect(result.ok && result.record.amount).toBe(-500)
  })

  it('去掉說明前後空白', () => {
    const result = parseRecordInput({ type: 'income', amount: '1', description: '  薪水  ' })
    expect(result.ok && result.record.description).toBe('薪水')
  })

  it.each(['', '0', '-5', '1.5', 'abc', '1e30'])('金額 "%s" 不合法', (amount) => {
    const result = parseRecordInput({ type: 'income', amount, description: '測試' })
    expect(result.ok).toBe(false)
  })

  it('金額剛好 10 億可以，超過不行', () => {
    const ok = parseRecordInput({ type: 'income', amount: String(MAX_AMOUNT), description: '獎金' })
    const tooBig = parseRecordInput({
      type: 'income',
      amount: String(MAX_AMOUNT + 1),
      description: '獎金',
    })
    expect(ok.ok).toBe(true)
    expect(tooBig.ok).toBe(false)
  })

  it('說明空白不合法', () => {
    const result = parseRecordInput({ type: 'income', amount: '100', description: '   ' })
    expect(result.ok).toBe(false)
  })

  it(`說明超過 ${MAX_DESCRIPTION_LENGTH} 字不合法`, () => {
    const description = '字'.repeat(MAX_DESCRIPTION_LENGTH + 1)
    expect(parseRecordInput({ type: 'income', amount: '1', description }).ok).toBe(false)
  })
})

describe('removeRecord', () => {
  it('只刪掉指定的那筆', () => {
    const records: AccountRecord[] = [
      { id: '1', amount: -50, description: '咖啡' },
      { id: '2', amount: -1200, description: '大餐' },
    ]
    expect(removeRecord(records, '1')).toEqual([{ id: '2', amount: -1200, description: '大餐' }])
  })
})

describe('calcSubtotal', () => {
  it('簡報第二週範例小計是 48750', () => {
    const records: AccountRecord[] = [
      { id: '1', amount: -50, description: '咖啡' },
      { id: '2', amount: -1200, description: '大餐' },
      { id: '3', amount: 50000, description: '十月份薪資' },
    ]
    expect(calcSubtotal(records)).toBe(48750)
  })

  it('沒有紀錄時是 0', () => {
    expect(calcSubtotal([])).toBe(0)
  })
})
