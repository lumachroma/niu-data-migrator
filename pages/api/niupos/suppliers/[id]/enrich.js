import nextConnect from 'next-connect'
import fetcher from '../../../../../utils/fetcher'

const { NIUPOS_USER_TOKEN } = process.env

const handler = nextConnect()

handler.get(async (req, res) => {
  const { query: { id } } = req
  let isEnrichingSucceed = true

  const originalSupplier = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/Supplier/GetSupplier?supplierId=${id}`, NIUPOS_USER_TOKEN)
  const originalSupplierProducts = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductSupplier/GetAllFiltered?supplierId=${id}`, NIUPOS_USER_TOKEN)

  const exportedDataFromBuraq = await fetcher("http://localhost:3000/data/data.json")

  let enrichedSupplier = {
    name: "",
    address: "",
    phoneNumber: "",
    companyNumber: "",
    contact: {
      name: "",
      email: ""
    },
    contracts: [
      // {
      //   leadTime: 0,
      //   minQuantity: 0,
      //   productName: "",
      //   reorderQuantity: 0,
      //   unitCost: 0
      // }
    ]
  }

  if (originalSupplier && originalSupplier.result) {
    enrichedSupplier.name = originalSupplier.result.name
    enrichedSupplier.companyNumber = originalSupplier.result.registrationNumber ? originalSupplier.result.registrationNumber : ""

    enrichedSupplier.address = originalSupplier.result.address1
    if (originalSupplier.result.address2 && originalSupplier.result.address2 !== "") {
      enrichedSupplier.address += ` ${originalSupplier.result.address2}`
    }
    if (originalSupplier.result.postcode && originalSupplier.result.postcode !== "") {
      if (!enrichedSupplier.address.includes(originalSupplier.result.postcode)) {
        enrichedSupplier.address += ` ${originalSupplier.result.postcode}`
      }
    }
    if (originalSupplier.result.city && originalSupplier.result.city !== "") {
      if (!enrichedSupplier.address.includes(originalSupplier.result.city)) {
        enrichedSupplier.address += ` ${originalSupplier.result.city}`
      }
    }
    if (originalSupplier.result.province && originalSupplier.result.province !== "") {
      if (!enrichedSupplier.address.includes(originalSupplier.result.province)) {
        enrichedSupplier.address += ` ${originalSupplier.result.province}`
      }
    }

    enrichedSupplier.phoneNumber = originalSupplier.result.phoneNumber ? originalSupplier.result.phoneNumber : ""
    enrichedSupplier.contact.name = originalSupplier.result.contactName ? originalSupplier.result.contactName : ""
    enrichedSupplier.contact.email = originalSupplier.result.email ? originalSupplier.result.email : ""

    // contracts

    if (originalSupplierProducts
      && originalSupplierProducts.result
      && originalSupplierProducts.result.items
      && originalSupplierProducts.result.items.length > 0) {

      for (const productSupplierObj of originalSupplierProducts.result.items) {
        let enrichedContract = {
          leadTime: 0,
          minQuantity: 0,
          productName: "",
          reorderQuantity: 0,
          unitCost: 0
        }

        let storeProduct = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/StoreProductConfig/GetStoresLinkedToProduct?productId=${productSupplierObj.productId}`, NIUPOS_USER_TOKEN)
        let supplierProduct = await fetcher(`https://buraq-api-v1.niulabs.co/api/services/app/ProductSupplier/GetSuppliersForNonFuelProduct?productId=${productSupplierObj.productId}`, NIUPOS_USER_TOKEN)

        if (productSupplierObj.product && productSupplierObj.product.name) {
          enrichedContract.productName = productSupplierObj.product.name
        }

        if (productSupplierObj.leadTimeInDay) {
          enrichedContract.leadTime = productSupplierObj.leadTimeInDay
        }

        if (storeProduct && storeProduct.result && storeProduct.result.items && storeProduct.result.items.length > 0) {
          enrichedContract.minQuantity = storeProduct.result.items[0].minQuantityOnHand ? storeProduct.result.items[0].minQuantityOnHand.toString() : 0
          enrichedContract.reorderQuantity = storeProduct.result.items[0].maxQuantityOnHand ? storeProduct.result.items[0].maxQuantityOnHand.toString() : 0
        }

        if (supplierProduct && supplierProduct.result && supplierProduct.result.items && supplierProduct.result.items.length > 0) {
          enrichedContract.unitCost = supplierProduct.result.items[0].supplierPrice ? supplierProduct.result.items[0].supplierPrice : 0
        }

        enrichedSupplier.contracts.push(enrichedContract)
      }
    }

  } else {
    isEnrichingSucceed = false
  }

  res.status(200).json({ result: enrichedSupplier, success: isEnrichingSucceed })
})

export default handler