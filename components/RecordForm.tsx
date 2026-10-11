'use client'

import { useState, type FormEvent } from 'react'
import { parseRecordInput } from '@/lib/records'
import type { NewRecord, RecordType } from '@/types/record'

interface RecordFormProps {
  onAdd: (record: NewRecord) => Promise<void>
  /** 外面還沒準備好（例如紀錄還在讀取）時停用 */
  disabled?: boolean
}

export default function RecordForm({ onAdd, disabled = false }: RecordFormProps) {
  const [type, setType] = useState<RecordType>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = parseRecordInput({ type, amount, description })
    if (!result.ok) {
      setError(result.error)
      return
    }

    // 先等資料庫寫入成功，才清空表單；失敗就保留使用者輸入的內容
    setSubmitting(true)
    try {
      await onAdd(result.record)
      setAmount('')
      setDescription('')
      setError('')
    } catch {
      setError('新增失敗，請稍後再試')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      {/* 送出中整組停用：避免使用者趁等待時改了欄位，成功後又被清空 */}
      <fieldset className="record-form__row" disabled={disabled || submitting}>
        <select
          aria-label="類型"
          value={type}
          onChange={(e) => setType(e.target.value as RecordType)}
        >
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
        <input
          aria-label="金額"
          type="number"
          min="1"
          step="1"
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          aria-label="說明"
          placeholder="說明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? '新增中…' : '新增紀錄'}
        </button>
      </fieldset>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
