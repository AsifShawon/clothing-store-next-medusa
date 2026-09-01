import { notFound } from "next/navigation"
import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  optionValueIds,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  return (
    <div className="bg-white min-h-screen">
      {/* Category Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-10 sm:py-14">
        <div className="content-container">
          <div className="flex items-center gap-2 text-xs text-brand-primary/60 mb-3">
            <LocalizedClientLink href="/" className="hover:text-brand-primary">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-brand-primary">
              Categories
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-brand-primary font-medium">{category.name}</span>
          </div>

          <div className="inline-block px-2.5 py-0.5 bg-brand-primary text-white text-[10px] font-heading font-semibold uppercase tracking-widest mb-2">
            Category
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 mt-2 max-w-xl">
            {category.description || `Explore our curated selection of ${category.name} crafted for British smart-casual elegance.`}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-10"
        data-testid="category-container"
      >
        <RefinementList
          sortBy={sort}
          data-testid="sort-by-container"
          hideOptionsPicker
        />
        <div className="w-full flex-1">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
