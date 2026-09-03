import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { HomeView } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "@adapters/medusa/routes"
import { toCategoryView, toProductView } from "@adapters/medusa/catalog"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DEFAULT_MEDUSA_CAPABILITIES } from "@dtc/commerce-contracts"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "London Boy | Modern British Clothing Tailored for Bangladesh",
    description:
      "Refined British smart-casual clothing crafted with 240 GSM combed cotton and tailored for Bangladesh. Fast Dhaka delivery and 24h returns.",
    canonical: `/${countryCode}`,
  })
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const routes = createMedusaRoutes(countryCode)
  const productCategories = await listCategories()
  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 12 },
  })

  const featuredProducts = (response.products || []).map((p) => toProductView(p, region.currency_code))
  const categories = (productCategories || []).map(toCategoryView)

  return (
    <HomeView
      featuredProducts={featuredProducts}
      categories={categories}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    />
  )
}
