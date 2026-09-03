import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { toProductView } from "../../../adapters/medusa/catalog"
import MedusaProductDetailClient from "../components/product-detail-client"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const productView = toProductView(product, region.currency_code)

  return (
    <MedusaProductDetailClient product={productView} countryCode={countryCode}>
      {/* Related Products Section */}
      <div
        className="content-container mt-20 pt-16 border-t border-brand-border"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </MedusaProductDetailClient>
  )
}

export default ProductTemplate
