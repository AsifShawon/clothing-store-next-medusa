import { Suspense } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  optionValueIds,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  optionValueIds?: OptionValueIds
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="bg-white min-h-screen">
      {/* Editorial Collection Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-10 sm:py-14">
        <div className="content-container">
          <div className="flex items-center gap-2 text-xs text-brand-primary/60 mb-3">
            <LocalizedClientLink href="/" className="hover:text-brand-primary">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-brand-primary">
              Collections
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-brand-primary font-medium">{collection.title}</span>
          </div>

          <div className="inline-block px-2.5 py-0.5 bg-brand-accent text-white text-[10px] font-heading font-semibold uppercase tracking-widest mb-2">
            Curated Collection
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
            {collection.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 mt-2 max-w-xl">
            Explore handcrafted essentials and seasonal wardrobe staples from the {collection.title} edit.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="content-container flex flex-col small:flex-row small:items-start py-10">
        <RefinementList sortBy={sort} hideOptionsPicker />
        <div className="w-full flex-1">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
              optionValueIds={optionValueIds}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
