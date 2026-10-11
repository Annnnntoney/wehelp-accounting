import { FirebaseError } from 'firebase/app'
import { describe, expect, it } from 'vitest'
import { authErrorMessage } from './auth'

describe('authErrorMessage', () => {
  it('已知代碼翻成中文', () => {
    const error = new FirebaseError('auth/email-already-in-use', 'Firebase: Error')
    expect(authErrorMessage(error)).toBe('這個電郵已經註冊過了')
  })

  it.each(['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'])(
    '帳號不存在和密碼錯誤用同一句話：%s',
    (code) => {
      expect(authErrorMessage(new FirebaseError(code, ''))).toBe('電郵或密碼錯誤')
    }
  )

  it('未知錯誤給通用訊息', () => {
    expect(authErrorMessage(new Error('boom'))).toBe('發生錯誤，請稍後再試')
  })
})
