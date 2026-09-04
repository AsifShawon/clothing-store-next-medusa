import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import { AboutView } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "About London Boy | Modern British Clothing",
    description:
      "The story of London Boy: British smart-casual tailoring crafted with 240 GSM combed cotton for Bangladesh.",
    canonical: `/${countryCode}/about`,
  })
}

export default async function AboutPage(props: Props) {
  const { countryCode } = await props.params
  const routes = createMedusaRoutes(countryCode)

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "About Us", url: `/${countryCode}/about` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <AboutView routes={routes} />
    </>
  )
}
