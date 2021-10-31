import nextConnect from 'next-connect'
import { all } from '../../../middleware'
import Supplier from '../../../models/supplier'

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
    const { query: { includeId } } = req
    let projection = {
        _id: 0,
        name: 1,
        address: 1,
        phoneNumber: 1,
        companyNumber: 1,
        contact: 1,
        contracts: 1,
    }
    if (includeId && includeId === "true") {
        projection._id = 1
    }
    try {
        let allSuppliers = await Supplier.find({}, projection).lean()
        res.status(200).json({ result: allSuppliers, success: true })
    } catch (error) {
        res.status(500).json({ result: {}, success: false, error })
    }
})

export default handler