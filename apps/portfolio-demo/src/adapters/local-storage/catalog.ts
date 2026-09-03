import {
  CategoryView,
  CollectionView,
  createMoneyView,
  ImageView,
  ProductOptionView,
  ProductVariantView,
  ProductView,
} from "@dtc/commerce-contracts"
import { DemoCategory, DemoCollection, DemoProduct } from "../../lib/types"

export function toProductView(demoProduct: DemoProduct): ProductView {
  const images: ImageView[] = (demoProduct.images || []).map((url, idx) => ({
    id: `${demoProduct.id}-img-${idx}`,
    url,
    altText: demoProduct.title,
  }))

  const thumbnail: ImageView | undefined = demoProduct.thumbnail
    ? {
        id: `${demoProduct.id}-thumb`,
        url: demoProduct.thumbnail,
        altText: demoProduct.title,
      }
    : images[0]

  const options: ProductOptionView[] = (demoProduct.options || []).map((opt) => ({
    id: opt.id,
    title: opt.title,
    values: opt.values,
  }))

  let minAmount = Infinity
  let maxAmount = 0
  let totalStock = 0

  const variants: ProductVariantView[] = (demoProduct.variants || []).map((v) => {
    const priceAmount = v.price
    if (priceAmount < minAmount) minAmount = priceAmount
    if (priceAmount > maxAmount) maxAmount = priceAmount

    totalStock += v.inventoryQuantity || 0

    const inStock = Boolean(!v.manageInventory || (v.inventoryQuantity !== undefined && v.inventoryQuantity > 0))

    return {
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: createMoneyView(v.price, "bdt"),
      originalPrice: undefined,
      options: v.options,
      inventoryQuantity: v.inventoryQuantity,
      manageInventory: v.manageInventory,
      inStock,
    }
  })

  if (minAmount === Infinity) minAmount = demoProduct.variants[0]?.price ?? 0
  if (maxAmount === 0) maxAmount = minAmount

  const isNewArrival = Boolean(
    demoProduct.collectionHandle === "new-arrivals" ||
    demoProduct.tags?.includes("new-arrivals")
  )
  const isBestSeller = Boolean(
    demoProduct.collectionHandle === "best-sellers" ||
    demoProduct.tags?.includes("bestseller") ||
    demoProduct.tags?.includes("signature")
  )

  const inStock = demoProduct.status === "published" && (totalStock > 0 || variants.some((v) => v.inStock))

  return {
    id: demoProduct.id,
    title: demoProduct.title,
    handle: demoProduct.handle,
    subtitle: demoProduct.subtitle,
    description: demoProduct.description,
    material: demoProduct.material,
    thumbnail,
    images,
    options,
    variants,
    collectionTitle: demoProduct.collectionHandle,
    collectionHandle: demoProduct.collectionHandle,
    categoryNames: demoProduct.categoryNames || [],
    tags: demoProduct.tags || [],
    minPrice: createMoneyView(minAmount, "bdt"),
    maxPrice: createMoneyView(maxAmount, "bdt"),
    isNewArrival,
    isBestSeller,
    totalStock,
    inStock,
    metadata: demoProduct.metadata,
  }
}

export function toCategoryView(category: DemoCategory): CategoryView {
  return {
    id: category.id,
    name: category.name,
    handle: category.handle,
    description: category.description,
    image: category.image,
  }
}

export function toCollectionView(collection: DemoCollection): CollectionView {
  return {
    id: collection.id,
    title: collection.title,
    handle: collection.handle,
    description: collection.description,
    image: collection.image,
  }
}
