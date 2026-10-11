import { readFileSync } from 'node:fs'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

let env: RulesTestEnvironment

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-accounting',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  })
})

afterAll(() => env.cleanup())
beforeEach(() => env.clearFirestore())

const alice = () => env.authenticatedContext('alice').firestore()
const bob = () => env.authenticatedContext('bob').firestore()
const guest = () => env.unauthenticatedContext().firestore()

const valid = () => ({ amount: -50, description: '咖啡', createdAt: serverTimestamp() })

/** 用管理員身分（不受規則限制）先放一筆 alice 的資料 */
async function seedAliceRecord() {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'users/alice/records/r1'), {
      amount: 50000,
      description: '十月份薪資',
      createdAt: new Date(),
    })
  })
}

describe('讀取', () => {
  it('自己可以讀自己的紀錄', async () => {
    await seedAliceRecord()
    await assertSucceeds(getDocs(collection(alice(), 'users/alice/records')))
  })

  it('別人讀不到', async () => {
    await seedAliceRecord()
    await assertFails(getDocs(collection(bob(), 'users/alice/records')))
  })

  it('沒登入讀不到', async () => {
    await seedAliceRecord()
    await assertFails(getDocs(collection(guest(), 'users/alice/records')))
  })
})

describe('新增', () => {
  it('自己可以新增合法紀錄', async () => {
    await assertSucceeds(addDoc(collection(alice(), 'users/alice/records'), valid()))
  })

  it('不能幫別人新增', async () => {
    await assertFails(addDoc(collection(bob(), 'users/alice/records'), valid()))
  })

  it('沒登入不能新增', async () => {
    await assertFails(addDoc(collection(guest(), 'users/alice/records'), valid()))
  })

  it.each([
    ['金額是 0', { amount: 0 }],
    ['金額是小數', { amount: 1.5 }],
    ['金額是字串', { amount: '100' }],
    ['說明是空字串', { description: '' }],
    ['說明超過 100 字', { description: '字'.repeat(101) }],
    ['時間不是伺服器時間', { createdAt: new Date('2000-01-01') }],
    ['多了其他欄位', { isAdmin: true }],
  ])('%s → 拒絕', async (_, override) => {
    await assertFails(
      addDoc(collection(alice(), 'users/alice/records'), { ...valid(), ...override })
    )
  })
})

describe('刪除與修改', () => {
  it('自己可以刪除', async () => {
    await seedAliceRecord()
    await assertSucceeds(deleteDoc(doc(alice(), 'users/alice/records/r1')))
  })

  it('別人不能刪', async () => {
    await seedAliceRecord()
    await assertFails(deleteDoc(doc(bob(), 'users/alice/records/r1')))
  })

  it('沒有修改功能，連自己也不能改', async () => {
    await seedAliceRecord()
    await assertFails(updateDoc(doc(alice(), 'users/alice/records/r1'), { amount: 1 }))
  })
})
