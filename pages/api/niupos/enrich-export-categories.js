import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Category from '../../../models/category'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { isActive } } = req
  const data = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductCategory/GetAllCategoryName?activeOnly=${isActive ? isActive : false}`, NIUPOS_USER_TOKEN)
  const exportedDataFromBuraq = await fetcher("http://localhost:3000/data/data.json")

  let categories = data.result
  let success = data.success

  if (!data.result) {
    categories = { items: exportedDataFromBuraq.categories }
    success = true
  }

  startConversionOfCategories(categories.items, 0)

  res.status(200).json({
    result: {
      totalCategories: categories.items.length,
      message: "Start conversion of categories...",
    }, success
  })
})

let ENRICHED_CATEGORIES_LIST = []
let ENRICHED_CATEGORIES_ERROR_LIST = []
let enrichedSuccess = 0
let enrichedFail = 0

async function startConversionOfCategories(categories, position) {
  // if (position >= 10) {
  //   console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${categories.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
  //   console.log("<<< Enriched categories >>>", JSON.stringify(ENRICHED_CATEGORIES_LIST))
  //   console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_CATEGORIES_ERROR_LIST))
  //   console.log("\n\n")
  //   return
  // }

  if (position >= categories.length) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${categories.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched categories >>>", JSON.stringify(ENRICHED_CATEGORIES_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_CATEGORIES_ERROR_LIST))
    console.log("\n\n")
    return
  }

  let item = categories[position];

  try {
    console.log(`${position + 1}. Enriching category...`, item.name, item.id)
    let enrichedItem = await fetcher(`http://localhost:3000/api/niupos/categories/${item.id}/enrich`)
    ENRICHED_CATEGORIES_LIST.push(enrichedItem.result)

    try {
      const addedCategory = await Category.create(enrichedItem.result)
      if (addedCategory) {
        enrichedSuccess = enrichedSuccess + 1
        console.log("Stored.", enrichedItem.result.name)
      } else {
        enrichedFail = enrichedFail + 1
        ENRICHED_CATEGORIES_ERROR_LIST.push({
          name: item.name,
          id: item.id,
        })
        console.log("Fail.", item.name, item.id)
      }
    } catch (error) {
      enrichedFail = enrichedFail + 1
      ENRICHED_CATEGORIES_ERROR_LIST.push({
        name: item.name,
        id: item.id,
      })
      console.log("startConversionOfCategories exception 2: ", error)
    }
  } catch (error) {
    enrichedFail = enrichedFail + 1
    ENRICHED_CATEGORIES_ERROR_LIST.push({
      name: item.name,
      id: item.id,
    })
    console.log("startConversionOfCategories exception 1: ", error)
  }

  if ((position + 1) % 10 === 0) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${categories.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched categories >>>", JSON.stringify(ENRICHED_CATEGORIES_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_CATEGORIES_ERROR_LIST))
    console.log("\n\n")
    ENRICHED_CATEGORIES_LIST = []
  }

  setTimeout(() => {
    position = position + 1
    startConversionOfCategories(categories, position)
  }, 500);
}

export default handler