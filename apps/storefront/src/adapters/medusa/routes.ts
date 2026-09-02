import { StoreRoutes } from "@dtc/commerce-contracts"

export function createMedusaRoutes(countryCode: string = "bd"): StoreRoutes {
  const prefix = `/${countryCode}`
  return {
    home: () => prefix,
    catalog: (params) => {
      const q = params?.q ? `?q=${encodeURIComponent(params.q)}` : ""
      return `${prefix}/store${q}`
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
