import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="space-y-4">
      {/* Breadcrumb & Collection Tag */}
      <div className="flex items-center gap-2 text-xs">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="inline-block px-2.5 py-0.5 bg-brand-secondary border border-brand-border text-brand-accent text-[10px] font-heading font-semibold uppercase tracking-wider hover:border-brand-primary"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <span className="text-brand-primary/40">•</span>
        <span className="text-brand-primary/60 text-[11px]">British Smart-Casual</span>
      </div>

      {/* Product Title */}
      <h1
        className="font-display text-3xl sm:text-4xl text-brand-primary leading-tight"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* Product Subtitle / Material Callout */}
      {product.material && (
        <p className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-accent">
          {product.material}
        </p>
      )}

      {/* Description */}
      <div
        className="text-xs sm:text-sm text-brand-primary/80 leading-relaxed whitespace-pre-line"
        data-testid="product-description"
      >
        {product.description}
      </div>
    </div>
  )
}

export default ProductInfo
