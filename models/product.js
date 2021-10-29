import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const ProductSchema = new mongoose.Schema({
  level: { type: String, default: "system", uppercase: true, trim: true },
  siteID: { type: String, uppercase: true, trim: true },
  barcodes: [],
  overrideAllowed: { type: Boolean, default: true },
  active: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  name: String,
  printName: String,
  category: {},
  sku: String,
  description: String,
  price: Number,
  productType: String,
  isReturnable: { type: Boolean, default: true },
  tax: {},
  brand: String,
}, { strict: false, timestamps: true })

ProductSchema.plugin(mongoosePaginate)
ProductSchema.index({ sku: 1 }, { unique: true })

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)