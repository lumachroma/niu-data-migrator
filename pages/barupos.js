import Head from 'next/head'
import Link from 'next/link'

export default function BaruPos() {
  return (
    <>
      <Head>
        <title>NIU v.2 (BaruPOS) | BaruPOS System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="py-5">
        <div className="container">
          <div className="py-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                <li className="breadcrumb-item active" aria-current="page">BaruPOS</li>
              </ol>
            </nav>
            <h1 className="display-3">NIU <small className="text-muted">v.2</small></h1>
            <p className="lead">BaruPOS System</p>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Products
                    {' '}
                    <Link href={`/barupos/products`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Suppliers
                    {' '}
                    <Link href={`/barupos/suppliers`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Categories
                    {' '}
                    <Link href={`/barupos/categories`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}