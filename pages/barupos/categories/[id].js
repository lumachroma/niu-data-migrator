import React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Category = ({ category }) => {
  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/barupos"><a>BaruPOS</a></Link></li>
            <li className="breadcrumb-item"><Link href="/barupos/categories"><a>Categories</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Category</li>
          </ol>
        </nav>

        <h1 className="display-4">Category</h1>
        <p className="lead">{category.name} <small>[Address: {category.address}]</small></p>
      </div>

      <dl className="row">
        {
          Object.keys(category).map((key) => {
            return (
              <React.Fragment key={key}>
                <dt className="col-3">{key}</dt>
                <dd className="col-9">
                  {(category[key] !== null) ? (category[key]).toString() : ''}
                </dd>
              </React.Fragment>
            )
          })
        }
      </dl>

      <div className="card">
        <div className="card-body">
          <textarea className="form-control" rows="10" defaultValue={JSON.stringify(category, null, 4)} style={{ width: "100%" }} />
        </div>
      </div>

      <hr />
      <div className="btn-group" role="group">
        <Link href="/barupos/categories"><a className="btn btn-primary">Back <i className="bi bi-chevron-double-left" /></a></Link>
      </div>

    </>
  )
}

const CategoryPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(id ? `/api/barupos/categories/${id}` : null, fetcher)

  if (error) return (<p className="lead">Failed to load</p>)
  if (!data) return (<p className="lead"><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</p>)
  if (!data.result || !data.success) return (<p className="lead">No data to show</p>)

  const category = data.result

  return (
    <PageShell name={`Category: ${category.name}`} description={`The details of ${category.name}`}>
      <Category category={category} />
    </PageShell>
  )
}

export default CategoryPage