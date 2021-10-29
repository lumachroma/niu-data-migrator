import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Product = ({ product }) => {
  const [enrichedProduct, setEnrichedProduct] = useState(undefined)

  const handleEnrich = async () => {
    let fetched = await fetcher(`/api/niupos/products/${product.id}/enrich`)
    console.log("fetched", fetched)
    setEnrichedProduct(fetched.result)
  }

  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos"><a>NiuPOS</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos/products"><a>Products</a></Link></li>
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

      <hr />
      <div className="btn-group" role="group">
        <button className="btn btn-success" onClick={handleEnrich}>Enrich <i className="bi bi-stars" /></button>
        <Link href="/niupos/products"><a className="btn btn-primary">Back <i className="bi bi-chevron-double-left" /></a></Link>
      </div>
      <hr />

      {enrichedProduct &&
        <dl className="row">
          {
            Object.keys(enrichedProduct).map((key) => {
              return (
                <React.Fragment key={key}>
                  <dt className="col-3">{key}</dt>
                  {
                    (typeof (enrichedProduct[key]) !== "object") &&
                    <dd className="col-9">
                      {(enrichedProduct[key] !== null) ? (enrichedProduct[key]).toString() : ''}
                    </dd>
                  }
                  {
                    (typeof (enrichedProduct[key]) === "object" && Array.isArray(enrichedProduct[key])) &&
                    <dd className="col-9">
                      {enrichedProduct[key].length > 0 && typeof (enrichedProduct[key][0]) !== "object" &&
                        <>
                          {(enrichedProduct[key] !== null) ? (enrichedProduct[key]).toString() : ''}
                        </>
                      }
                    </dd>
                  }
                  {
                    (typeof (enrichedProduct[key]) === "object" && !Array.isArray(enrichedProduct[key])) &&
                    <dd className="col-9">
                      <dl className="row">
                        {
                          Object.keys(enrichedProduct[key]).map((innerKey) => {
                            return (
                              <React.Fragment key={innerKey}>
                                <dt className="col-3">{innerKey}</dt>
                                <dd className="col-9">
                                  {(enrichedProduct[key][innerKey] !== null) ? (enrichedProduct[key][innerKey]).toString() : ''}
                                </dd>
                              </React.Fragment>
                            )
                          })
                        }
                      </dl>
                    </dd>
                  }
                </React.Fragment>
              )
            })
          }
        </dl>
      }
    </>
  )
}

const ProductsPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`/api/niupos/products/${id}`, fetcher)

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


export default ProductsPage