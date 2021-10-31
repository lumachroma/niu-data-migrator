import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Product = ({ product }) => {
  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/barupos"><a>BaruPOS</a></Link></li>
            <li className="breadcrumb-item"><Link href="/barupos/products"><a>Products</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Product</li>
          </ol>
        </nav>

        <h1 className="display-4">Product</h1>
        <p className="lead">{product.name} <small>[SKU: {product.sku}]</small></p>
      </div>

      <dl className="row">
        {
          Object.keys(product).map((key) => {
            return (
              <React.Fragment key={key}>
                <dt className="col-3">{key}</dt>
                <dd className="col-9">
                  {(product[key] !== null) ? (product[key]).toString() : ''}
                </dd>
              </React.Fragment>
            )
          })
        }
      </dl>

      <div className="card">
        <div className="card-body">
          <textarea className="form-control" rows="25" defaultValue={JSON.stringify(product, null, 4)} style={{ width: "100%" }} />
        </div>
      </div>

      <hr />
      <div className="btn-group" role="group">
        <Link href="/barupos/products"><a className="btn btn-primary">Back <i className="bi bi-chevron-double-left" /></a></Link>
      </div>

    </>
  )
}

const ProductPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(id ? `/api/barupos/products/${id}` : null, fetcher)

  if (error) return (<p className="lead">Failed to load</p>)
  if (!data) return (<p className="lead"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</p>)
  if (!data.result || !data.success) return (<p className="lead">No data to show</p>)

  const product = data.result

  return (
    <PageShell name={`Product: ${product.name}`} description={`The details of ${product.name}`}>
      <Product product={product} />
    </PageShell>
  )
}

export default ProductPage