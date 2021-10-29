import nextConnect from 'next-connect'
import fetcher from '../../../../utils/fetcher'

const handler = nextConnect()

handler.get(async (req, res) => {
  const { query: { id } } = req
  const data = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/Supplier/GetSupplier?supplierId=${id}`)
  res.status(200).json(data)
})

export default handler