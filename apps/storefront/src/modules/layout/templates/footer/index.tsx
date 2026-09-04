import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Footer as SharedFooter } from "@dtc/storefront-ui"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  const productCategories = await listCategories()

  const defaultCategories = [
    { label: "All Clothing", href: "/store" },
    { label: "Men's Collection", href: "/categories/men" },
    { label: "Women's Edit", href: "/categories/women" },
    { label: "Caps & Accessories", href: "/categories/accessories" },
  ]

  const categoriesMap = new Map<string, { label: string; href: string }>()
  for (const item of defaultCategories) {
    categoriesMap.set(item.href, item)
  }
  for (const cat of productCategories || []) {
    const href = `/categories/${cat.handle}`
    if (!categoriesMap.has(href)) {
      categoriesMap.set(href, { label: cat.name, href })
    }
  }
  const categories = Array.from(categoriesMap.values()).slice(0, 6)

  const defaultCollections = [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "The Essentials Edit", href: "/collections/essentials" },
  ]

  const collectionsMap = new Map<string, { label: string; href: string }>()
  for (const item of defaultCollections) {
    collectionsMap.set(item.href, item)
  }
  for (const col of collections || []) {
    const href = `/collections/${col.handle}`
    if (!collectionsMap.has(href)) {
      collectionsMap.set(href, { label: col.title, href })
    }
  }
  const collectionsList = Array.from(collectionsMap.values())

  return (
    <SharedFooter
      homeHref="/"
      categories={categories}
      collections={collectionsList}
      linkComponent={LocalizedClientLink}
    />
  )
}
