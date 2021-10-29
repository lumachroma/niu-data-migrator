import nextConnect from 'next-connect'
import { all } from '../../../../../middleware'
import fetcher from '../../../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { id } } = req
  let isEnrichingSucceed = true

  const originalCategory = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductCategory/GetCategory?categoryId=${id}`, NIUPOS_USER_TOKEN)

  let enrichedCategory = {
    name: "",
    code: "",
    subcategories: [
      {
        name: "DEFAULT",
        code: "DEFAULT"
      }
    ]
  }

  if (originalCategory && originalCategory.result && originalCategory.result.name) {
    enrichedCategory.name = originalCategory.result.name.toUpperCase()
    enrichedCategory.code = (originalCategory.result.name.toUpperCase().split(" ").join("_")).split("/").join("_")
  } else {
    isEnrichingSucceed = false
  }

  res.status(200).json({ result: enrichedCategory, success: isEnrichingSucceed })
})

export default handler