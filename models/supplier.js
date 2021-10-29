import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const SupplierSchema = new mongoose.Schema({
  name: String,
  address: String,
  phoneNumber: String,
  companyNumber: String,
  contact: {},
  contracts: [],
}, { strict: false, timestamps: true })

SupplierSchema.plugin(mongoosePaginate)
SupplierSchema.index({ name: 1 }, { unique: true })

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema)