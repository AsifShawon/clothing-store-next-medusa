import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import { parseOptionValueIds } from "@lib/util/product-option-filters"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

type StorePageSearchParams = Record<string, string | string[] | undefined> & {
  sortBy?: SortOptions
  page?: string
  q?: string
  optionValueIds?: string | string[]
}

type Params = {
  searchParams: Promise<StorePageSearchParams>
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined

  const title = q
    ? `Search Results for "${q}" | London Boy`
    : "Shop All Clothing | London Boy British Smart-Casual"

  const description = q
    ? `Search results for "${q}" across London Boy heavyweight cotton t-shirts, Oxford shirts, polos, and chinos.`
    : "Explore the complete collection of British-inspired smart-casual clothing, heavyweight t-shirts, Oxford shirts, knit polos, and chinos."

  return constructMetadata({
    title,
    description,
    canonical: `/${params.countryCode}/store`,
  })
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, q } = searchParams
  const optionValueIds = parseOptionValueIds(searchParams)

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: `/${params.countryCode}` },
    { name: "All Clothing", url: `/${params.countryCode}/store` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        q={typeof q === "string" ? q : undefined}
        countryCode={params.countryCode}
        optionValueIds={optionValueIds}
      />
    </>
  )
}
