import nextConnect from 'next-connect'
import { all } from '../../../../middleware'
import mongoose from 'mongoose'
import category from '../../../../models/category'

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { id } } = req
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const result = await category.findOne({ _id: id }, {
        _id: 0,
        name: 1,
        code: 1,
        subcategories: 1,
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