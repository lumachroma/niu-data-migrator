import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import fetcher from '../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { isActive } } = req
  const data = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductCategory/GetAllCategoryName?activeOnly=${isActive ? isActive : false}`, NIUPOS_USER_TOKEN)
  res.status(200).json({ result: data.result, success: true })
})

export default handler