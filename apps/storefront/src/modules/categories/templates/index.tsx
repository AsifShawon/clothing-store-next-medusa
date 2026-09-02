import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { OptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listProductsWithSort } from "@lib/data/products"
import { toCategoryView, toProductView } from "../../../adapters/medusa/catalog"
import MedusaCategoryClient from "../components/category-client"

const PRODUCT_LIMIT = 24

export default async function CategoryTemplate({
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

  const queryParams: HttpTypes.FindParams & Record<string, unknown> = {
    limit: PRODUCT_LIMIT,
    category_id: [category.id],
  }

  if (sort === "created_at") {
    queryParams["order"] = "created_at"
  }

  const { response } = await listProductsWithSort({
    page: pageNumber,
    queryParams,
    sortBy: sort,
    countryCode,
    optionValueIds,
  })


  const productViews = (response.products || []).map((p) => toProductView(p, "bdt"))

  return (

    <MedusaCategoryClient
      category={toCategoryView(category)}
      products={productViews}
      totalCount={response.count}
      countryCode={countryCode}
      currentSortBy={sort}
    />
  )
}
