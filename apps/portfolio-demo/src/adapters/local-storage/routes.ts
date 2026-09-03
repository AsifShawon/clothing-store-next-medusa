import { StoreRoutes } from "@dtc/commerce-contracts"

export const demoRoutes: StoreRoutes = {
  home: () => "/",
  catalog: (params) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.set("q", params.q)
    if (params?.category) searchParams.set("category", params.category)
    if (params?.collection) searchParams.set("collection", params.collection)
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
    const qs = searchParams.toString()
    return qs ? `/shop?${qs}` : "/shop"
  },
  product: (handle) => `/product?handle=${handle}`,
  category: (handle) => `/category?handle=${handle}`,
  collection: (handle) => `/collection?handle=${handle}`,
  cart: () => "/cart",
  checkout: () => "/checkout",
  order: (id) => `/order?id=${id}`,
  account: () => "/account",
  accountOrders: () => "/account/orders",
  accountOrderDetail: (id) => `/account/order?id=${id}`,
  about: () => "/about",
  contact: () => "/contact",
  faq: () => "/faq",
  privacyPolicy: () => "/privacy-policy",
  returnPolicy: () => "/return-policy",
  shippingPolicy: () => "/shipping-policy",
  sizeGuide: () => "/size-guide",
  terms: () => "/terms-and-conditions",
  demoAdmin: () => "/demo-admin",
  demoAdminOrder: (id) => `/demo-admin/order?id=${id}`,
  demoAdminProduct: (id) => `/demo-admin/product?id=${id}`,
}
