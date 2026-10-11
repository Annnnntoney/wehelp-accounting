'use client'

import { useEffect, useState } from 'react'
import RecordForm from '@/components/RecordForm'
import RecordList from '@/components/RecordList'
import { calcSubtotal, removeRecord } from '@/lib/records'
import { addRecord, deleteRecord, fetchRecords } from '@/lib/records-repo'
import type { AccountRecord, NewRecord } from '@/types/record'

interface RecordsPanelProps {
  uid: string
}

/** 某一個使用者的記帳區。外面用 key={uid} 掛載，換人時整個重來，不會殘留上一個人的資料 */
export default function RecordsPanel({ uid }: RecordsPanelProps) {
  /** null：第一批資料還沒回來 */
  const [records, setRecords] = useState<AccountRecord[] | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // ignore 用來避免「已經離開頁面了，舊的結果才回來」還去改畫面
  useEffect(() => {
    let ignore = false
    fetchRecords(uid)
      .then((list) => {
        if (!ignore) setRecords(list)
      })
      .catch(() => {
        if (!ignore) setError('讀取紀錄失敗，請重新整理')
      })
    return () => {
      ignore = true
    }
  }, [uid])

  // 先等資料庫新增成功，拿到 id 後才放進畫面；失敗的話錯誤會丟回 RecordForm 顯示
  async function handleAdd(record: NewRecord) {
    const saved = await addRecord(uid, record)
    setRecords((prev) => [saved, ...(prev ?? [])])
  }

  // 標準流程：使用者按刪除 → 命令資料庫刪除 → 資料庫刪除成功，才更新前端畫面
  async function handleDelete(id: string) {
    setDeletingId(id)
    setError('')
    try {
      await deleteRecord(uid, id)
      setRecords((prev) => (prev ? removeRecord(prev, id) : prev))
    } catch {
      setError('刪除失敗，請稍後再試')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <RecordForm onAdd={handleAdd} />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {records === null ? (
        <p className="status">載入中…</p>
      ) : (
        <>
          <RecordList records={records} deletingId={deletingId} onDelete={handleDelete} />
          <p className="subtotal">
            <strong>小計：</strong>
            {calcSubtotal(records)}
          </p>
        </>
      )}
    </>
  )
}
