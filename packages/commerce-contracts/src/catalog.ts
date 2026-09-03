import { MoneyView } from "./money"

export interface ImageView {
  id: string
  url: string
  altText?: string
  width?: number
  height?: number
  isThumbnail?: boolean
}

export interface ProductOptionValueView {
  id: string
  value: string
  label?: string
}

export interface ProductOptionView {
  id: string
  title: string
  values: string[]
}

export interface ProductVariantView {
  id: string
  title: string
  sku: string
  price: MoneyView
  originalPrice?: MoneyView
  options: Record<string, string>
  inventoryQuantity?: number
  manageInventory: boolean
  inStock: boolean
  images?: ImageView[]
}

export interface ProductView {
  id: string
  title: string
  handle: string
  subtitle?: string
  description?: string
  material?: string
  thumbnail?: ImageView
  images: ImageView[]
  options: ProductOptionView[]
  variants: ProductVariantView[]
  collectionTitle?: string
  collectionHandle?: string
  categoryNames: string[]
  tags: string[]
  minPrice: MoneyView
  maxPrice: MoneyView
  isNewArrival?: boolean
  isBestSeller?: boolean
  totalStock?: number
  inStock: boolean
  metadata?: Record<string, string | number | boolean | null>
}

export interface CategoryView {
  id: string
  name: string
  handle: string
  description?: string
  image?: string
  parentCategoryId?: string
  productCount?: number
}

export interface CollectionView {
  id: string
  title: string
  handle: string
  description?: string
  image?: string
  productCount?: number
}

export type CatalogSortOption =
  | "featured"
  | "newest"
  | "price_asc"
  | "price_desc"
  | "created_at"

export interface ProductFilterView {
  search?: string
  category?: string
  collection?: string
  size?: string
  color?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  sortBy?: CatalogSortOption
}
