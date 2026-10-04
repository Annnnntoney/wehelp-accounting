'use client'

import { useState, type FormEvent } from 'react'
import { createRecord } from '@/lib/records'
import type { AccountRecord, RecordType } from '@/types/record'

interface RecordFormProps {
  onAdd: (record: AccountRecord) => void
}

export default function RecordForm({ onAdd }: RecordFormProps) {
  const [type, setType] = useState<RecordType>('income')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = createRecord({ type, amount, description })
    if (!result.ok) {
      setError(result.error)
      return
    }

    onAdd(result.record)
    setAmount('')
    setDescription('')
    setError('')
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      <div className="record-form__row">
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
        <button type="submit" className="button">
          新增紀錄
        </button>
      </div>
      {error && (
        <p className="record-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
