export interface StoreRoutes {
  home(): string
  catalog(params?: { q?: string; category?: string; collection?: string; sortBy?: string }): string
  product(handle: string): string
  category(handle: string): string
  collection(handle: string): string
  cart(): string
  checkout(): string
  order(id: string): string
  account(): string
  accountOrders(): string
  accountOrderDetail(id: string): string
  about(): string
  contact(): string
  faq(): string
  privacyPolicy(): string
  returnPolicy(): string
  shippingPolicy(): string
  sizeGuide(): string
  terms(): string
  demoAdmin?(): string
  demoAdminOrder?(id: string): string
  demoAdminProduct?(id: string): string
}
