'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/AuthProvider'
import RecordForm from '@/components/RecordForm'
import RecordList from '@/components/RecordList'
import { calcSubtotal, removeRecord } from '@/lib/records'
import { addRecord, deleteRecord, fetchRecords } from '@/lib/records-repo'
import type { AccountRecord, NewRecord } from '@/types/record'

export default function AccountingPage() {
  const { user } = useAuth()
  const router = useRouter()
  /** null：第一批資料還沒回來 */
  const [records, setRecords] = useState<AccountRecord[] | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // 確定沒登入（不是「還不知道」）才導回首頁
  useEffect(() => {
    if (user === null) router.replace('/')
  }, [user, router])

  // 登入後讀出這個人的紀錄。ignore 用來避免「已經離開頁面或換人了，舊的結果才回來」蓋掉畫面
  useEffect(() => {
    if (!user) return
    let ignore = false
    fetchRecords(user.uid)
      .then((list) => {
        if (!ignore) setRecords(list)
      })
      .catch(() => {
        if (!ignore) setError('讀取紀錄失敗，請重新整理')
      })
    return () => {
      ignore = true
    }
  }, [user])

  if (!user) {
    return <p className="status">載入中…</p>
  }
  const uid = user.uid

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
    <main className="accounting">
      <p className="signed-in-as">
        您已經使用 <strong>{user.email}</strong> 登入
      </p>
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
      <div className="center">
        <Link href="/" className="button">
          返回首頁
        </Link>
      </div>
    </main>
  )
}
