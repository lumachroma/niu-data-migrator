import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Product from '../../../models/product'

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
    try {
        let allProducts = await Product.find({}, {
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
        }).lean()
        res.status(200).json({ result: allProducts, success: true })
    } catch (error) {
        res.status(500).json({ result: {}, success: false, error })
    }
})

export default handler