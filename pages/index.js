import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pt-5">
        <div className="container">

          <figure className="text-center">
            <h1 className="display-3">
              Welcome to <a href="https://nextjs.org" className="text-decoration-none">Next.js!</a>
            </h1>
          </figure>

          <figure className="text-center">
            <p className="lead">
                Get started by editing{' '}
                <code className="p-2 bg-light">pages/index.js</code>
            </p>
          </figure>

          <div className="row g-4 align-items-stretch">

            <div className="col-md-6">
              <div className="h-100 p-4 border rounded">
                <a href="https://nextjs.org/docs" className="icon-link text-decoration-none">
                  <h4 className="text-body">Documentation</h4>{' '}
                  <i className="bi bi-chevron-double-right"></i>
                </a>
                <p>Find in-depth information about Next.js features and API.</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="h-100 p-4 border rounded">
                <a href="https://nextjs.org/learn" className="icon-link text-decoration-none">
                  <h4 className="text-body">Learn</h4>{' '}
                  <i className="bi bi-chevron-double-right"></i>
                </a>
                <p>Learn about Next.js in an interactive course with quizzes!</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="h-100 p-4 border rounded">
                <a
                  href="https://github.com/vercel/next.js/tree/master/examples"
                  className="icon-link text-decoration-none"
                >
                  <h4 className="text-body">Examples</h4>{' '}
                  <i className="bi bi-chevron-double-right"></i>
                </a>
                <p>Discover and deploy boilerplate example Next.js projects.</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="h-100 p-4 border rounded">
                <a
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                  className="icon-link text-decoration-none"
                >
                  <h4 className="text-body">Deploy</h4>{' '}
                  <i className="bi bi-chevron-double-right"></i>
                </a>
                <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <footer className="pt-5">
        <div className="container">
          <div className="pt-3 text-muted border-top">
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              Powered by{' '}
              <span>
                <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
              </span>
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .container {
          width: auto;
          max-width: 800px;
        }
        .icon-link {
          display: inline-flex;
          align-items: center;
        }
        .icon-link > .bi {
          margin-top: .125rem;
          margin-left: .125rem;
          transition: transform .25s ease-in-out;
          fill: currentColor;
        }
        .icon-link:hover > .bi {
          transform: translate(.25rem);
        }
      `}</style>
    </>
  )
}
