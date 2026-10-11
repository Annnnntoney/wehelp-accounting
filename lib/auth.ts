import { FirebaseError } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { getFirebase } from '@/lib/firebase'

export async function signUp(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(getFirebase().auth, email, password)
}

export async function signIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(getFirebase().auth, email, password)
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(getFirebase().auth)
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': '這個電郵已經註冊過了',
  'auth/invalid-email': '電郵格式不正確',
  'auth/missing-password': '請輸入密碼',
  'auth/weak-password': '密碼至少需要 6 個字元',
  // 正式環境開了「電子郵件列舉保護」只會回 invalid-credential；
  // Emulator 和舊專案會分成帳號不存在／密碼錯誤，一律用同一句話，不透露帳號是否存在
  'auth/invalid-credential': '電郵或密碼錯誤',
  'auth/user-not-found': '電郵或密碼錯誤',
  'auth/wrong-password': '電郵或密碼錯誤',
  'auth/too-many-requests': '嘗試次數太多，請稍後再試',
  'auth/network-request-failed': '網路連線失敗，請檢查網路',
}

/** 把 Firebase 的錯誤代碼翻成給使用者看的訊息 */
export function authErrorMessage(error: unknown): string {
  const code = error instanceof FirebaseError ? error.code : ''
  return AUTH_ERROR_MESSAGES[code] ?? '發生錯誤，請稍後再試'
}
