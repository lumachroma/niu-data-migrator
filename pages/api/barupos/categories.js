import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import fetcher from '../../../utils/fetcher'

const { BARUPOS_ADMIN_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  try {
    const fetched = await fetcher(`http://localhost:8700/v1/secure/categories-v2/`, BARUPOS_ADMIN_TOKEN)
    res.status(200).json({ result: fetched, success: true })
  } catch (error) {
    res.status(500).json({ result: {}, success: false, error })
  }
})



export default handler