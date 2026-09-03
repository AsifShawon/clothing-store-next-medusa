import { StoreRoutes } from "@dtc/commerce-contracts"

export function createMedusaRoutes(countryCode: string = "bd"): StoreRoutes {
  const prefix = `/${countryCode}`
  return {
    home: () => prefix,
    catalog: (params) => {
      const searchParams = new URLSearchParams()
      if (params?.q) searchParams.set("q", params.q)
      if (params?.category) searchParams.set("category", params.category)
      if (params?.collection) searchParams.set("collection", params.collection)
      if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
      const qs = searchParams.toString()
      return qs ? `${prefix}/store?${qs}` : `${prefix}/store`
    },
    product: (handle) => `${prefix}/products/${handle}`,
    category: (handle) => `${prefix}/categories/${handle}`,
    collection: (handle) => `${prefix}/collections/${handle}`,
    cart: () => `${prefix}/cart`,
    checkout: () => `${prefix}/checkout`,
    order: (id) => `${prefix}/order/${id}/confirmed`,
    account: () => `${prefix}/account`,
    accountOrders: () => `${prefix}/account/orders`,
    accountOrderDetail: (id) => `${prefix}/account/orders/details/${id}`,
    accountProfile: () => `${prefix}/account/profile`,
    accountAddresses: () => `${prefix}/account/addresses`,
    about: () => `${prefix}/about`,
    contact: () => `${prefix}/contact`,
    faq: () => `${prefix}/faq`,
    privacyPolicy: () => `${prefix}/privacy-policy`,
    returnPolicy: () => `${prefix}/return-policy`,
    shippingPolicy: () => `${prefix}/shipping-policy`,
    sizeGuide: () => `${prefix}/size-guide`,
    terms: () => `${prefix}/terms-and-conditions`,
  }
}
