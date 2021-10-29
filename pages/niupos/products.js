import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../components/PageShell'
import fetcher from '../../utils/fetcher'

const Products = ({ entities, name, description }) => {
  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos"><a>NiuPOS</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Products</li>
          </ol>
        </nav>

        <h1 className="display-4">{name}</h1>
        <p className="lead">{`${description}: ${entities.length} ${name.toLowerCase()}`}</p>
      </div>

      <ul className="list-group list-group-flush">
        {
          entities.map((entity) => {
            return (
              <li className="list-group-item d-flex justify-content-between align-items-start" key={entity.id}>
                <div className="ms-2 me-auto">
                  {entity.name}
                </div>
                <Link href={`/niupos/products/${entity.id}`}>
                  <a className="stretched-link"><i className="bi bi-chevron-right" /></a>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

const ProductsPage = () => {
  const { data, error } = useSWR(`/api/niupos/products`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.result || !data.success || !data.result.items) return (<p className="lead m-3"><span className="text-muted">no data to show</span></p>)

  const products = data.result.items
  const pageName = "Products"
  const pageDescription = "List of all products"

  return (
    <PageShell name={pageName} description={pageDescription}>
      <Products entities={products} name={pageName} description={pageDescription} />
    </PageShell>
  )
}


export default ProductsPage