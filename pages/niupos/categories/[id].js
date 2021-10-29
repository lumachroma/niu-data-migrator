import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import PageShell from '../../../components/PageShell'
import fetcher from '../../../utils/fetcher'

const Category = ({ category }) => {
  const [enrichedCategory, setEnrichedCategory] = useState(undefined)

  const handleEnrich = async () => {
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

      {
        enrichedCategory &&
        <dl className="row">
          {
            Object.keys(enrichedCategory).map((key) => {
              return (
                <React.Fragment key={key}>
                  <dt className="col-3">{key}</dt>
                  {
                    (typeof (enrichedCategory[key]) !== "object") &&
                    <dd className="col-9">
                      {(enrichedCategory[key] !== null) ? (enrichedCategory[key]).toString() : ''}
                    </dd>
                  }
                  {
                    (typeof (enrichedCategory[key]) === "object" && Array.isArray(enrichedCategory[key])) &&
                    <dd className="col-9">
                      {enrichedCategory[key].length > 0 && typeof (enrichedCategory[key][0]) !== "object" &&
                        <>
                          {(enrichedCategory[key] !== null) ? (enrichedCategory[key]).toString() : ''}
                        </>
                      }
                      {enrichedCategory[key].length > 0 && typeof (enrichedCategory[key][0]) === "object" &&
                        <dl className="row">
                          {
                            Object.keys(enrichedCategory[key]).map((i) => {
                              return (
                                <React.Fragment key={`${i}`}>
                                  {Object.keys(enrichedCategory[key][i]).map((j, k) => {
                                    return (
                                      <React.Fragment key={`${i}-${k}-${j}`}>
                                        <dt className="col-3">{`${i}-${k}-${j}`}</dt>
                                        <dd className="col-9">
                                          {(enrichedCategory[key][i][j] !== null) ? (enrichedCategory[key][i][j]).toString() : ''}
                                        </dd>
                                      </React.Fragment>
                                    )
                                  })}
                                </React.Fragment>
                              )
                            })}
                        </dl>
                      }
                    </dd>
                  }
                  {
                    (typeof (enrichedCategory[key]) === "object" && !Array.isArray(enrichedCategory[key])) &&
                    <dd className="col-9">
                      <dl className="row">
                        {
                          Object.keys(enrichedCategory[key]).map((innerKey) => {
                            return (
                              <React.Fragment key={innerKey}>
                                <dt className="col-3">{innerKey}</dt>
                                <dd className="col-9">
                                  {(enrichedCategory[key][innerKey] !== null) ? (enrichedCategory[key][innerKey]).toString() : ''}
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