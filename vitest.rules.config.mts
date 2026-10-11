import { defineConfig } from 'vitest/config'

// 安全規則測試要連 Firestore Emulator，用 pnpm test:rules 執行
export default defineConfig({
  test: { include: ['rules-tests/**/*.test.ts'], testTimeout: 15000 },
})
