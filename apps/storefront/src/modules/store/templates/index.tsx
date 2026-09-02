import { OptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listProductsWithSort } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { toCategoryView, toProductView } from "../../../adapters/medusa/catalog"
import MedusaCatalogClient from "../components/catalog-client"

const PRODUCT_LIMIT = 24

const StoreTemplate = async ({
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

  const queryParams: Record<string, any> = {
    limit: PRODUCT_LIMIT,
  }

  if (q) {
    queryParams["q"] = q
  }

  if (sort === "created_at") {
    queryParams["order"] = "created_at"
  }

  const [{ response }, categoriesData] = await Promise.all([
    listProductsWithSort({
      page: pageNumber,
      queryParams,
      sortBy: sort,
      countryCode,
      optionValueIds,
    }),
    listCategories().catch(() => []),
  ])

  const productViews = (response.products || []).map((p) => toProductView(p, "bdt"))
  const categoryViews = (categoriesData || []).map(toCategoryView)

  return (
    <MedusaCatalogClient
      products={productViews}
      totalCount={response.count}
      categories={categoryViews}
      countryCode={countryCode}
      currentSortBy={sort}
      currentQuery={q}
    />
  )
}

export default StoreTemplate
