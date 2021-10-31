import Head from 'next/head'

const PageShell = ({ name, description, children }) => {
  const title = `BaruPOS Data Migrator - ${name}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description ? description : name} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="py-5">
        <div className="container">
          <div>
            {children}
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

export default PageShell