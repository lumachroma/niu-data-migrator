import nextConnect from 'next-connect'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

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

async function startConversionOfProducts(products, position) {
  if (position > 20) {
    console.log("<<< Enriched products >>>", JSON.stringify(ENRICHED_PRODUCT_LIST))
    return
  }
  if (position >= products.length) {
    return
  }
  let item = products[position];

  console.log("Enriching product...", item.name, item.id)
  let enrichedItem = await fetcher(`http://localhost:3000/api/niupos/products/${item.id}/enrich`)
  ENRICHED_PRODUCT_LIST.push(enrichedItem.result)
  console.log("Done.", enrichedItem.result.name)

  setTimeout(() => {
    position = position + 1
    startConversionOfProducts(products, position)
  }, 5000);
}


export default handler


