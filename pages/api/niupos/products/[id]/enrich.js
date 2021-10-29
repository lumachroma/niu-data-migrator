import nextConnect from 'next-connect'
import { all } from '../../../../../middleware'
import fetcher from '../../../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.use(all)

handler.get(async (req, res) => {
  const { query: { id } } = req
  let isEnrichingSucceed = true

  const originalProduct = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/Product/GetProduct?productId=${id}`, NIUPOS_USER_TOKEN)
  const originalProductPrices = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductPrice/GetActivePrices?productId=${id}&getOnlyCurrentAndFuturePrice=true`, NIUPOS_USER_TOKEN)
  const originalProductBarcodes = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductBarcode/GetAllFiltered?productId=${id}`, NIUPOS_USER_TOKEN)
  const allCategory = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductCategory/GetAllCategoryName?activeOnly=false`, NIUPOS_USER_TOKEN)
  const allBrand = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductBrand/GetAllBrandName?activeOnly=false`, NIUPOS_USER_TOKEN)

  const exportedDataFromBuraq = await fetcher("http://localhost:3000/data/data.json")

  let enrichedProduct = {
    level: "SYSTEM",
    barcodes: [],//d
    overrideAllowed: true,
    active: true,
    isDeleted: false,
    name: "",//d
    printName: "",//d
    category: {
      categoryId: "",
      categoryName: "",//d
      categoryCode: "",
      subcategoryName: "DEFAULT",
      subcategoryCode: ""
    },
    sku: "",//d
    description: "",//d
    price: 0,//d
    productType: "CSTORE",
    isReturnable: true,
    tax: {
      name: "Zero Tax",
      code: "ZERO",
    },
    brand: ""
  }

  if (originalProduct && originalProduct.result) {

    enrichedProduct.name = originalProduct.result.name ? originalProduct.result.name : ""
    enrichedProduct.printName = originalProduct.result.printName ? originalProduct.result.printName : ""
    enrichedProduct.sku = originalProduct.result.sku ? originalProduct.result.sku : ""
    enrichedProduct.description = originalProduct.result.description ? originalProduct.result.description : ""

    if (originalProductPrices
      && originalProductPrices.result
      && originalProductPrices.result.items
      && originalProductPrices.result.items.length > 0
      && originalProductPrices.result.items[0].price) {
      enrichedProduct.price = originalProductPrices.result.items[0].price
    }

    if (originalProductBarcodes
      && originalProductBarcodes.result
      && originalProductBarcodes.result.items
      && originalProductBarcodes.result.items.length > 0) {
      originalProductBarcodes.result.items.forEach((barcodeObj) => {
        enrichedProduct.barcodes.push(barcodeObj.barcode)
      })
    }

    let allCategories = exportedDataFromBuraq.categories
    if (allCategory
      && allCategory.result
      && allCategory.result.items
      && allCategory.result.items.length > 0) {
      allCategories = allCategory.result.items
    }
    let foundCategory = allCategories.find((categoryObj) => {
      return categoryObj.id === originalProduct.result.productCategoryId
    })
    if (foundCategory && foundCategory.name) {
      enrichedProduct.category.categoryName = foundCategory.name
    }

    let allBrands = exportedDataFromBuraq.brands
    if (allBrand
      && allBrand.result
      && allBrand.result.items
      && allBrand.result.items.length > 0) {
      allBrands = allBrand.result.items
    }
    let foundBrand = allBrands.find((brandObj) => {
      return brandObj.id === originalProduct.result.productBrandId
    })
    if (foundBrand && foundBrand.brandName) {
      enrichedProduct.brand = foundBrand.brandName
    }

  } else {
    isEnrichingSucceed = false
  }

  res.status(200).json({ result: enrichedProduct, success: isEnrichingSucceed })
})

export default handler