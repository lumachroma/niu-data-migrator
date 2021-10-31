import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Category from '../../../models/category'

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
    const { query: { includeId } } = req
    let projection = {
        _id: 0,
        name: 1,
        code: 1,
        subcategories: 1,
    }
    if (includeId && includeId === "true") {
        projection._id = 1
    }
    try {
        let allCategories = await Category.find({}, projection).lean()
        res.status(200).json({ result: allCategories, success: true })
    } catch (error) {
        res.status(500).json({ result: {}, success: false, error })
    }
})

export default handler