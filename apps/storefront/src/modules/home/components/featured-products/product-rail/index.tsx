import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: [collection.id],
      fields: "*variants.calculated_price,*variants.options,*tags,+material",
      limit: 4,
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="content-container py-8 sm:py-12 border-b border-brand-border/40 last:border-b-0">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-[10px] font-heading font-semibold uppercase tracking-widest text-brand-accent block mb-0.5">
            Curated Edit
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-brand-primary">
            {collection.title}
          </h2>
        </div>
        <LocalizedClientLink
          href={`/collections/${collection.handle}`}
          className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-primary hover:text-brand-accent underline underline-offset-4"
        >
          View Collection ({pricedProducts.length}) →
        </LocalizedClientLink>
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
    </div>
  )
}
