'use client'

import Link from 'next/link'
import { useState } from 'react'
import AuthForm from '@/components/AuthForm'
import { useAuth } from '@/components/AuthProvider'
import { signIn, signOut, signUp } from '@/lib/auth'

export default function HomePage() {
  const { user } = useAuth()
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    setSignOutError('')
    try {
      await signOut()
    } catch {
      setSignOutError('登出失敗，請稍後再試')
    }
  }

  return (
    <>
      <header className="site-header">
        <h1>React 練習專案</h1>
      </header>
      <main className="home">
        {user === undefined && <p className="status">載入中…</p>}

        {user && (
          <section className="signed-in">
            <p>您已經使用 {user.email} 登入</p>
            <div className="button-group">
              <Link href="/accounting" className="button">
                立刻開始
              </Link>
              <button type="button" className="button" onClick={handleSignOut}>
                登出
              </button>
            </div>
            {signOutError && (
              <p className="form-error" role="alert">
                {signOutError}
              </p>
            )}
          </section>
        )}

        {user === null && (
          <>
            <AuthForm title="登入系統" submitLabel="登入" onSubmit={signIn} />
            <AuthForm title="註冊帳戶" submitLabel="註冊" onSubmit={signUp} />
          </>
        )}
      </main>
    </>
  )
}
