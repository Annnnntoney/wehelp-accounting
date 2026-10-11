'use client'

import { useId, useState, type FormEvent } from 'react'
import { authErrorMessage } from '@/lib/auth'

interface AuthFormProps {
  title: string
  submitLabel: string
  onSubmit: (email: string, password: string) => Promise<void>
}

/** 登入和註冊共用：欄位一樣，只有標題、按鈕文字和送出後做的事不同 */
export default function AuthForm({ title, submitLabel, onSubmit }: AuthFormProps) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(email.trim(), password)
    } catch (err) {
      setError(authErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <div className="auth-form__field">
        <label htmlFor={`${id}-email`}>電郵</label>
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="auth-form__field">
        <label htmlFor={`${id}-password`}>密碼</label>
        <input
          id={`${id}-password`}
          type="password"
          autoComplete={submitLabel === '註冊' ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="button" disabled={submitting}>
        {submitting ? '處理中…' : submitLabel}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}
