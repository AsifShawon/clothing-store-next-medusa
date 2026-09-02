import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ProductCard as SharedProductCard } from "@dtc/storefront-ui"
import { toProductView } from "@adapters/medusa/catalog"
import { DEFAULT_MEDUSA_CAPABILITIES } from "@dtc/commerce-contracts"

export default function ProductPreview({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const productView = toProductView(product, region.currency_code)

  return (
    <SharedProductCard
      product={productView}
      href={`/products/${product.handle}`}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    />
  )
}
