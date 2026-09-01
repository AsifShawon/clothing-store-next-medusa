import { Suspense } from "react"
import { OptionValueIds } from "@lib/util/product-option-filters"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "./paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  optionValueIds,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
  q?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-10 sm:py-14">
        <div className="content-container">
          <div className="flex items-center gap-2 text-xs text-brand-primary/60 mb-3">
            <LocalizedClientLink href="/" className="hover:text-brand-primary">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-brand-primary font-medium">Clothing Catalog</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary"
            data-testid="store-page-title"
          >
            {q ? `Search Results for "${q}"` : "All Clothing & Essentials"}
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 mt-2 max-w-xl">
            {q
              ? "Showing clothing items matching your search query."
              : "Discover our full range of 240 GSM heavyweight tees, tailored Oxford shirts, pique knit polos, and tailored chinos."}
          </p>
        </div>
      </div>

      {/* Main Catalog Body */}
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-10"
        data-testid="category-container"
      >
        <RefinementList sortBy={sort} />
        <div className="w-full flex-1">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
              q={q}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
