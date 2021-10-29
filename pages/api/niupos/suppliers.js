import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN} = process.env

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

  res.status(200).json({ result: suppliers, success })
})

export default handler