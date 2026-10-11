import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { getFirebase } from '@/lib/firebase'
import type { AccountRecord, NewRecord } from '@/types/record'

/** 每個使用者的紀錄放在 users/{uid}/records，安全規則只要比對路徑裡的 uid */
function recordsOf(uid: string) {
  return collection(getFirebase().db, 'users', uid, 'records')
}

/** 讀出某個使用者的所有紀錄，新的在前 */
export async function fetchRecords(uid: string): Promise<AccountRecord[]> {
  const snapshot = await getDocs(query(recordsOf(uid), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((d) => ({
    id: d.id,
    amount: d.get('amount') as number,
    description: d.get('description') as string,
  }))
}

/** 等資料庫寫入成功才回傳（含 Firestore 產生的 id），呼叫的人再更新畫面 */
export async function addRecord(uid: string, record: NewRecord): Promise<AccountRecord> {
  const ref = await addDoc(recordsOf(uid), { ...record, createdAt: serverTimestamp() })
  return { id: ref.id, ...record }
}

/** 等資料庫刪除成功才回傳；失敗會丟出錯誤 */
export async function deleteRecord(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(recordsOf(uid), id))
}
