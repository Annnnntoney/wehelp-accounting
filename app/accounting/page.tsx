'use client'

import { useState } from 'react'
import Link from 'next/link'
import RecordForm from '@/components/RecordForm'
import RecordList from '@/components/RecordList'
import { calcSubtotal, removeRecord } from '@/lib/records'
import type { AccountRecord } from '@/types/record'

export default function AccountingPage() {
  const [records, setRecords] = useState<AccountRecord[]>([])

  function handleAdd(record: AccountRecord) {
    setRecords((prev) => [record, ...prev])
  }

  function handleDelete(id: string) {
    setRecords((prev) => removeRecord(prev, id))
  }

  return (
    <main className="accounting">
      <RecordForm onAdd={handleAdd} />
      <RecordList records={records} onDelete={handleDelete} />
      <p className="subtotal">
        <strong>小計：</strong>
        {calcSubtotal(records)}
      </p>
      <div className="center">
        <Link href="/" className="button">
          返回首頁
        </Link>
      </div>
    </main>
  )
}
