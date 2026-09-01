import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const variantCount = product.variants?.length || 0
  const fabricInfo = product.material || product.subtitle || "British Smart-Casual"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col bg-white border border-brand-border/70 hover:border-brand-primary transition-all duration-300 hover:shadow-lg"
    >
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          {product.tags?.some((t) => t.value === "new" || t.value === "new-arrivals") && (
            <div className="absolute top-2.5 left-2.5 bg-brand-accent text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 z-10">
              New In
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
          <div className="space-y-1">
            <h3
              className="font-heading font-bold text-sm text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1"
              data-testid="product-title"
            >
              {product.title}
            </h3>
            <p className="text-[11px] text-brand-primary/60 line-clamp-1">
              {fabricInfo}
            </p>
          </div>

          <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            {variantCount > 0 && (
              <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-primary/50">
                {variantCount} Variants
              </span>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
