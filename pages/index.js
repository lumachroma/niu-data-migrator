import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>NIU | BaruPOS Data Migrator</title>
        <meta name="description" content="NIU to BaruPOS Data Migrator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-5">
        <div className="container">

          <figure className="text-center">
            <h1 className="display-3">
              <a href="https://www.niulabs.co/" className="text-decoration-none">NIU</a> <small>Data Migrator</small>
            </h1>
          </figure>

          <figure className="text-center">
            <p className="lead">
              Intergrate (map &amp; transform) NiuPOS
              {' '}
              <code className="p-2 bg-light">NIU v.1</code>
              {' '}
              to BaruPOS
              {' '}
              <code className="p-2 bg-light">NIU v.2</code>
              {' '}
              data
            </p>
          </figure>

          <div className="row g-4 align-items-stretch">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    NIU v.1 (NiuPOS)
                    {' '}
                    <Link href={`/niupos`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">BuraqOil System</h6>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    NIU v.2 (BaruPOS)
                    {' '}
                    <Link href={`/barupos`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                  <h6 className="card-subtitle mb-2 text-muted">BaruPOS System</h6>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="pt-5">
        <div className="container">
          <div className="pt-3 text-muted border-top">
            Powered by{' '}
            <a href="https://vercel.com/" target="_blank" className="text-decoration-none">Vercel</a>{' '}
            and{' '}
            <a href="https://nextjs.org/" target="_blank" className="text-decoration-none">Next.js</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .container {
          width: auto;
          max-width: 800px;
        }
      `}</style>
    </>
  )
}
