import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import PageShell from '../../components/PageShell'
import enrichCategories from '../../utils/enricher'
import fetcher from '../../utils/fetcher'

const Categories = ({ entities, name, description, router }) => {
  const [enrichedCategories, setEnrichedCategories] = useState([])

  const handleEnrichAndExport = () => {
    setEnrichedCategories(enrichCategories(entities))
  }

  return (
    <>
      <div className="py-2">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/"><a>Home</a></Link></li>
            <li className="breadcrumb-item"><Link href="/niupos"><a>NiuPOS</a></Link></li>
            <li className="breadcrumb-item active" aria-current="page">Categories</li>
          </ol>
        </nav>

        <h1 className="display-4">{name}</h1>
        <p className="lead">{`${description}: ${entities.length} ${name.toLowerCase()}`}</p>

        <ul className="list-inline">
          <li className="list-inline-item"><Link href={`/niupos/categories`}><a className={"btn btn-success btn-sm" + (!router.query.isActive ? " disabled" : "")}>All</a></Link></li>
          <li className="list-inline-item"><Link href={`/niupos/categories?isActive=true`}><a className={"btn btn-success btn-sm" + (router.query.isActive ? " disabled" : "")}>Active Only</a></Link></li>
        </ul>
        <ul className="list-inline">
          <li className="list-inline-item"><button className="btn btn-success" onClick={handleEnrichAndExport}>Enrich &amp; Export<i className="bi bi-stars" /></button></li>
        </ul>
      </div>

      <ul className="list-group list-group-flush">
        {
          entities.map((entity) => {
            return (
              <li className="list-group-item d-flex justify-content-between align-items-start" key={entity.id}>
                <div className="ms-2 me-auto">
                  {entity.name}
                </div>
                <Link href={`#`}>
                  <a className="stretched-link"><i className="bi bi-chevron-right" /></a>
                </Link>
              </li>
            )
          })
        }
      </ul>


        {enrichedCategories && enrichedCategories.length > 0 &&
          <textarea rows="25" defaultValue={JSON.stringify(enrichedCategories, null, 4)} style={{width: "100%"}} />
        }

    </>
  )
}

const CategoriesPage = () => {
  const router = useRouter()
  const { data, error } = useSWR(`/api/niupos/categories${router.query.isActive ? "?isActive=true" : ""}`, fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  if (!data.result || !data.success || !data.result.items) return (<p className="lead m-3"><span className="text-muted">no data to show</span></p>)

  const categories = data.result.items
  const pageName = "Categories"
  const pageDescription = "List of all categories"

  return (
    <PageShell name={pageName} description={pageDescription}>
      <Categories entities={categories} name={pageName} description={pageDescription} router={router} />
    </PageShell>
  )
}


export default CategoriesPage