import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Supplier = ({ supplier }) => {
  const [enrichedSupplier, setEnrichedSupplier] = useState(undefined)

  const handleEnrich = async () => {
    setEnrichedSupplier(undefined)
    let fetched = await fetcher(`/api/niupos/suppliers/${supplier.id}/enrich`)
    console.log("fetched", fetched)
    setEnrichedSupplier(fetched.result)
  }

  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos"><a>NiuPOS</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos/suppliers"><a>Suppliers</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Supplier</li>
          </ol>
        </nav>

        <h1 className="display-4">Supplier</h1>
        <p className="lead">{supplier.name} <small>[REGNO: {supplier.registrationNumber}]</small></p>
      </div>

      <dl className="row">
        {
          Object.keys(supplier).map((key) => {
            return (
              <React.Fragment key={key}>
                <dt className="col-3">{key}</dt>
                <dd className="col-9">
                  {(supplier[key] !== null) ? (supplier[key]).toString() : ''}
                </dd>
              </React.Fragment>
            )
          })
        }
      </dl>

      <hr />
      <div className="btn-group" role="group">
        <button className="btn btn-success" onClick={handleEnrich}>Enrich <i className="bi bi-stars" /></button>
        <Link href="/niupos/suppliers"><a className="btn btn-primary">Back <i className="bi bi-chevron-double-left" /></a></Link>
      </div>
      <hr />

      {enrichedSupplier &&
        <div className="card">
          <div className="card-body">
            <textarea className="form-control" rows="10" defaultValue={JSON.stringify(enrichedSupplier, null, 4)} style={{ width: "100%" }} />
          </div>
        </div>
      }
    </>
  )
}

const SupplierPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`/api/niupos/suppliers/${id}`, fetcher)

  if (error) return (<p className="lead">Failed to load</p>)
  if (!data) return (<p className="lead"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</p>)
  if (!data.result || !data.success) return (<p className="lead">No data to show</p>)

  const supplier = data.result

  return (
    <PageShell name={`Supplier: ${supplier.name}`} description={`The details of ${supplier.name}`}>
      <Supplier supplier={supplier} />
    </PageShell>
  )
}

export default SupplierPage