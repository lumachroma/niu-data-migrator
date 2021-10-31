import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const CategorySchema = new mongoose.Schema({
  name: String,
  code: String,
  subcategories: [],
}, { strict: false, timestamps: true })

CategorySchema.plugin(mongoosePaginate)
CategorySchema.index({ name: 1 }, { unique: true })

export default mongoose.models.Category || mongoose.model('Category', CategorySchema)