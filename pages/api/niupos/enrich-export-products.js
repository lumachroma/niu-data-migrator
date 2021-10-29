import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Product from '../../../models/product'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const data = await fetcher("https://buraq-api-v1.niulabs.co/api/services/app/Product/GetAll", NIUPOS_USER_TOKEN)
  const exportedDataFromBuraq = await fetcher("http://localhost:3000/data/data.json")

  let products = data.result
  let success = data.success

  if (!data.result) {
    products = { items: exportedDataFromBuraq.products }
    success = true
  }

  startConversionOfProducts(products.items, 0)

  res.status(200).json({
    result: {
      totalProducts: products.length,
      message: "Start conversion of products...",
    }, success
  })
})

let ENRICHED_PRODUCT_LIST = []
let ENRICHED_PRODUCT_ERROR_LIST = []
let enrichedSuccess = 0
let enrichedFail = 0

async function startConversionOfProducts(products, position) {
  if (position >= 10) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${products.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched products >>>", JSON.stringify(ENRICHED_PRODUCT_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_PRODUCT_ERROR_LIST))
    console.log("\n\n")
    return
  }

  if (position >= products.length) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${products.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched products >>>", JSON.stringify(ENRICHED_PRODUCT_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_PRODUCT_ERROR_LIST))
    console.log("\n\n")
    return
  }

  let item = products[position];

  try {
    console.log(`${position + 1}. Enriching product...`, item.name, item.id)
    let enrichedItem = await fetcher(`http://localhost:3000/api/niupos/products/${item.id}/enrich`)
    ENRICHED_PRODUCT_LIST.push(enrichedItem.result)

    try {
      const addedProduct = await Product.create(enrichedItem.result)
      if (addedProduct) {
        enrichedSuccess = enrichedSuccess + 1
        console.log("Done.", enrichedItem.result.name)
      } else {
        enrichedFail = enrichedFail + 1
        ENRICHED_PRODUCT_ERROR_LIST.push({
          name: item.name,
          id: item.id,
        })
        console.log("Fail.", item.name, item.id)
      }
    } catch (error) {
      enrichedFail = enrichedFail + 1
      ENRICHED_PRODUCT_ERROR_LIST.push({
        name: item.name,
        id: item.id,
      })
      console.log("startConversionOfProducts exception 2: ", error)
    }
  } catch (error) {
    enrichedFail = enrichedFail + 1
    ENRICHED_PRODUCT_ERROR_LIST.push({
      name: item.name,
      id: item.id,
    })
    console.log("startConversionOfProducts exception 1: ", error)
  }

  if ((position + 1) % 5 === 0) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${products.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched products >>>", JSON.stringify(ENRICHED_PRODUCT_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_PRODUCT_ERROR_LIST))
    console.log("\n\n")
    ENRICHED_PRODUCT_LIST = []
  }

  setTimeout(() => {
    position = position + 1
    startConversionOfProducts(products, position)
  }, 5000);
}

export default handler