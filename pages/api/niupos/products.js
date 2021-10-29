import nextConnect from 'next-connect'
import { all } from '../../../middleware'
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

  res.status(200).json({ result: products, success })
})

export default handler
