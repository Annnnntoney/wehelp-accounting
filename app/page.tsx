import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <h1>React 練習專案</h1>
      </header>
      <section className="banner">
        <p>歡迎光臨我的頁面</p>
      </section>
      <main className="center">
        <Link href="/accounting" className="button">
          點此開始
        </Link>
      </main>
    </>
  )
}
