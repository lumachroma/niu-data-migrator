import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Supplier from '../../../models/supplier'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const data = await fetcher("https://buraq-api-v1.niulabs.co/api/services/app/Supplier/GetAllSuppliers", NIUPOS_USER_TOKEN)
  const exportedDataFromBuraq = await fetcher("http://localhost:3000/data/data.json")

  let suppliers = data.result
  let success = data.success

  if (!data.result) {
    suppliers = { items: exportedDataFromBuraq.suppliers }
    success = true
  }

  startConversionOfSuppliers(suppliers.items, 0)

  res.status(200).json({
    result: {
      totalSuppliers: suppliers.items.length,
      message: "Start conversion of suppliers...",
    }, success
  })
})

let ENRICHED_SUPPLIER_LIST = []
let ENRICHED_SUPPLIER_ERROR_LIST = []
let enrichedSuccess = 0
let enrichedFail = 0

async function startConversionOfSuppliers(suppliers, position) {
  // if (position >= 10) {
  //   console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${suppliers.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
  //   console.log("<<< Enriched suppliers >>>", JSON.stringify(ENRICHED_SUPPLIER_LIST))
  //   console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_SUPPLIER_ERROR_LIST))
  //   console.log("\n\n")
  //   return
  // }

  if (position >= suppliers.length) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${suppliers.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched suppliers >>>", JSON.stringify(ENRICHED_SUPPLIER_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_SUPPLIER_ERROR_LIST))
    console.log("\n\n")
    return
  }

  let item = suppliers[position];

  try {
    console.log(`${position + 1}. Enriching supplier...`, item.name, item.id)
    let enrichedItem = await fetcher(`http://localhost:3000/api/niupos/suppliers/${item.id}/enrich`)
    ENRICHED_SUPPLIER_LIST.push(enrichedItem.result)

    try {
      const addedSupplier = await Supplier.create(enrichedItem.result)
      if (addedSupplier) {
        enrichedSuccess = enrichedSuccess + 1
        console.log("Stored.", enrichedItem.result.name)
      } else {
        enrichedFail = enrichedFail + 1
        ENRICHED_SUPPLIER_ERROR_LIST.push({
          name: item.name,
          id: item.id,
        })
        console.log("Fail.", item.name, item.id)
      }
    } catch (error) {
      enrichedFail = enrichedFail + 1
      ENRICHED_SUPPLIER_ERROR_LIST.push({
        name: item.name,
        id: item.id,
      })
      console.log("startConversionOfSuppliers exception 2: ", error)
    }
  } catch (error) {
    enrichedFail = enrichedFail + 1
    ENRICHED_SUPPLIER_ERROR_LIST.push({
      name: item.name,
      id: item.id,
    })
    console.log("startConversionOfSuppliers exception 1: ", error)
  }

  if ((position + 1) % 5 === 0) {
    console.log(`<<< Enriching status >>> [[[ pos: ${position + 1}/${suppliers.length} success: ${enrichedSuccess} fail: ${enrichedFail} ]]]`)
    console.log("<<< Enriched suppliers >>>", JSON.stringify(ENRICHED_SUPPLIER_LIST))
    console.log("<<< Fail to enrich >>>", JSON.stringify(ENRICHED_SUPPLIER_ERROR_LIST))
    console.log("\n\n")
    ENRICHED_SUPPLIER_LIST = []
  }

  setTimeout(() => {
    position = position + 1
    startConversionOfSuppliers(suppliers, position)
  }, 5000);
}

export default handler