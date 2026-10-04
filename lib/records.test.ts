import { describe, expect, it } from 'vitest'
import { calcSubtotal, createRecord, removeRecord } from './records'
import type { AccountRecord } from '@/types/record'

const sample: AccountRecord[] = [
  { id: '1', amount: -1200, description: '吃大餐' },
  { id: '2', amount: -500, description: '咖啡十杯' },
  { id: '3', amount: -200, description: '生活用品' },
  { id: '4', amount: 50000, description: '十月份薪資' },
]

describe('createRecord', () => {
  it('收入存成正數', () => {
    const result = createRecord({ type: 'income', amount: '500', description: '統一發票中獎' })
    expect(result.ok && result.record.amount).toBe(500)
  })

  it('支出存成負數', () => {
    const result = createRecord({ type: 'expense', amount: '500', description: '咖啡' })
    expect(result.ok && result.record.amount).toBe(-500)
  })

  it('去掉說明前後空白', () => {
    const result = createRecord({ type: 'income', amount: '1', description: '  薪水  ' })
    expect(result.ok && result.record.description).toBe('薪水')
  })

  it.each(['', '0', '-5', '1.5', 'abc'])('金額 "%s" 不合法', (amount) => {
    const result = createRecord({ type: 'income', amount, description: '測試' })
    expect(result.ok).toBe(false)
  })

  it('說明空白不合法', () => {
    const result = createRecord({ type: 'income', amount: '100', description: '   ' })
    expect(result.ok).toBe(false)
  })
})

describe('calcSubtotal', () => {
  it('簡報範例小計是 48100', () => {
    expect(calcSubtotal(sample)).toBe(48100)
  })

  it('沒有紀錄時是 0', () => {
    expect(calcSubtotal([])).toBe(0)
  })
})

describe('removeRecord', () => {
  it('只刪掉指定的那筆', () => {
    const result = removeRecord(sample, '1')
    expect(result.map((record) => record.id)).toEqual(['2', '3', '4'])
  })
})
