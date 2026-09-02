import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Footer as SharedFooter } from "@dtc/storefront-ui"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  const productCategories = await listCategories()

  const categories = [
    { label: "All Clothing", href: "/store" },
    { label: "Men's Collection", href: "/categories/men" },
    { label: "Women's Edit", href: "/categories/women" },
    { label: "Caps & Accessories", href: "/categories/accessories" },
    ...(productCategories?.slice(0, 3).map((cat) => ({
      label: cat.name,
      href: `/categories/${cat.handle}`,
    })) || []),
  ]

  const collectionsList = [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "The Essentials Edit", href: "/collections/essentials" },
    ...(collections?.map((col) => ({
      label: col.title,
      href: `/collections/${col.handle}`,
    })) || []),
  ]

  return (
    <SharedFooter
      homeHref="/"
      categories={categories}
      collections={collectionsList}
      linkComponent={LocalizedClientLink as any}
    />
  )
}
