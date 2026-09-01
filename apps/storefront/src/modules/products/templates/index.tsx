import React, { Suspense } from "react"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      {/* Breadcrumbs */}
      <div className="content-container mb-6">
        <div className="flex items-center gap-2 text-xs text-brand-primary/60">
          <LocalizedClientLink href="/" className="hover:text-brand-primary">
            Home
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink href="/store" className="hover:text-brand-primary">
            Clothing
          </LocalizedClientLink>
          <span>/</span>
          <span className="text-brand-primary font-medium truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main 2-Column Product Grid */}
      <div
        className="content-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
        data-testid="product-container"
      >
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-7">
          <ImageGallery images={images} />
        </div>

        {/* Right Column: Sticky Product Info & Actions (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
          <ProductInfo product={product} />

          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related Products Section */}
      <div
        className="content-container mt-20 pt-16 border-t border-brand-border"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
