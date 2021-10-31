import Head from 'next/head'
import Link from 'next/link'

export default function NiuPos() {
  return (
    <>
      <Head>
        <title>NIU v.1 (NiuPOS) | BuraqOil System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="py-5">
        <div className="container">
          <div className="py-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
                <li className="breadcrumb-item active" aria-current="page">NiuPOS</li>
              </ol>
            </nav>
            <h1 className="display-3">NIU <small className="text-muted">v.1</small></h1>
            <p className="lead">BuraqOil System</p>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            <div className="col">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Products
                    {' '}
                    <Link href={`/niupos/products`}>
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
                    <Link href={`/niupos/suppliers`}>
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
                    <Link href={`/niupos/categories`}>
                      <a className="stretched-link"><i className="bi bi-chevron-double-right" /></a>
                    </Link>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .container {
          width: auto;
          max-width: 800px;
        }
      `}</style>
    </>
  )
}