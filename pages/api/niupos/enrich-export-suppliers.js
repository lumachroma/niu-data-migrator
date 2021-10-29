import nextConnect from 'next-connect'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN} = process.env

const handler = nextConnect()

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
      totalSuppliers: suppliers.length,
      message: "Start conversion of suppliers...",
    }, success
  })
})

let ENRICHED_SUPPLIER_LIST = []

async function startConversionOfSuppliers(suppliers, position) {
  if (position > 10) {
    console.log("<<< Enriched suppliers >>>", JSON.stringify(ENRICHED_SUPPLIER_LIST))
    return
  }
  if (position >= suppliers.length) {
    return
  }
  let item = suppliers[position];

  console.log("Enriching supplier...", item.name, item.id)
  let enrichedItem = await fetcher(`http://localhost:3000/api/niupos/suppliers/${item.id}/enrich`)
  ENRICHED_SUPPLIER_LIST.push(enrichedItem.result)
  console.log("Done.", enrichedItem.result.name)

  setTimeout(() => {
    position = position + 1
    startConversionOfSuppliers(suppliers, position)
  }, 5000);
}

export default handler