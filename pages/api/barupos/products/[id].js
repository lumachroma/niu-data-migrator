import nextConnect from 'next-connect'
import { all } from '../../../../middleware'
import mongoose from 'mongoose'
import Product from '../../../../models/product'

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { id } } = req
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const result = await Product.findOne({ _id: id }, {
        _id: 0,
        level: 1,
        siteID: 1,
        barcodes: 1,
        overrideAllowed: 1,
        active: 1,
        isDeleted: 1,
        name: 1,
        printName: 1,
        category: 1,
        sku: 1,
        description: 1,
        price: 1,
        productType: 1,
        isReturnable: 1,
        tax: 1,
        brand: 1,
      })
      if (result) {
        res.status(200).json({ result, success: true })
      } else {
        res.status(404).end("Not found")
      }
    } catch (error) {
      console.log(error)
      res.status(500).end(error.message ? error.message : "exception")
    }
  } else {
    res.status(400).end("Bad Request")
  }
})

export default handler