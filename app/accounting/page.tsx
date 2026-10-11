'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import RecordsPanel from '@/components/RecordsPanel'

export default function AccountingPage() {
  const { user } = useAuth()
  const router = useRouter()

  // 確定沒登入（null）才導回首頁；undefined 代表 Firebase 還在讀登入狀態，先等
  useEffect(() => {
    if (user === null) router.replace('/')
  }, [user, router])

  if (!user) {
    return <p className="status">載入中…</p>
  }

  return (
    <main className="accounting">
      <p className="signed-in-as">
        您已經使用 <strong>{user.email}</strong> 登入
      </p>
      <RecordsPanel key={user.uid} uid={user.uid} />
      <div className="center">
        <Link href="/" className="button">
          返回首頁
        </Link>
      </div>
    </main>
  )
}
