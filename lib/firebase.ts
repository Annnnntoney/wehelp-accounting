import { getApp, getApps, initializeApp } from 'firebase/app'
import { type Auth, connectAuthEmulator, getAuth } from 'firebase/auth'
import { type Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore'

interface FirebaseServices {
  auth: Auth
  db: Firestore
}

let services: FirebaseServices | null = null

/**
 * 第一次呼叫時才初始化。只在瀏覽器裡（useEffect、事件處理）呼叫，
 * 這樣 next build 預先產生頁面時不會因為沒有環境變數而失敗。
 */
export function getFirebase(): FirebaseServices {
  if (services) return services

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      })
  const auth = getAuth(app)
  const db = getFirestore(app)

  // 本機開發可以接 Firebase Emulator，不碰正式資料
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8080)
  }

  services = { auth, db }
  return services
}
