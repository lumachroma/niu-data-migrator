import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Category = ({ category }) => {
  const [enrichedCategory, setEnrichedCategory] = useState(undefined)

  const handleEnrich = async () => {
    setEnrichedCategory(undefined)
    let fetched = await fetcher(`/api/niupos/categories/${category.id}/enrich`)
    console.log("fetched", fetched)
    setEnrichedCategory(fetched.result)
  }

  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos"><a>NiuPOS</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos/categories"><a>Categories</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Category</li>
          </ol>
        </nav>

        <h1 className="display-4">Category</h1>
        <p className="lead">{category.name}</p>
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

      <hr />
      <div className="btn-group" role="group">
        <button className="btn btn-success" onClick={handleEnrich}>Enrich <i className="bi bi-stars" /></button>
        <Link href="/niupos/categories"><a className="btn btn-primary">Back <i className="bi bi-chevron-double-left" /></a></Link>
      </div>
      <hr />

      {enrichedCategory &&
        <div className="card">
          <div className="card-body">
            <textarea className="form-control" rows="10" defaultValue={JSON.stringify(enrichedCategory, null, 4)} style={{ width: "100%" }} />
          </div>
        </div>
      }
    </>
  )

}

const CategoriesPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { data, error } = useSWR(`/api/niupos/categories/${id}`, fetcher)

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

export default CategoriesPage