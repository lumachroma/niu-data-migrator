import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import PageShell from '../../components/PageShell'
import fetcher from '../../utils/fetcher'

const Categories = ({ entities, name, description, router }) => {
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

        <p>
          <a className="btn btn-primary btn-sm" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            How to migrate <i className="bi bi-arrow-left-right" />
          </a>
        </p>
        <div className="collapse" id="collapseExample">
          <div className="card card-body text-dark bg-light">
            <ul className='fw-lighter'>
              <li>Use API enpoint: <code className="p-2 bg-light">http://localhost:3000/api/niupos/enrich-export-categories?isActive=true</code></li>
              <li>All items will be transformed in one go</li>
              <li>Each item will be queried from source (NiuPOS), necessary relationships will be queried too, depending on the enrichment requirements</li>
              <li>There will be 0.5 seconds pause between each transformation</li>
              <li>Server logs will show each item transformation status, progress, errors as well as summary upon completion</li>
              <li>Final transformation will be available here: <Link href="/barupos/categories">BaruPOS Categories</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <ul className="list-group list-group-flush">
        {
          entities.map((entity) => {
            return (
              <li className="list-group-item d-flex justify-content-between align-items-start" key={entity.id}>
                <div className="ms-2 me-auto">
                  {entity.name}
                </div>
                <Link href={`/niupos/categories/${entity.id}`}>
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