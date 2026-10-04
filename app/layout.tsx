import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'React 練習專案',
  description: 'WeHelp 記帳小工具',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  )
}
