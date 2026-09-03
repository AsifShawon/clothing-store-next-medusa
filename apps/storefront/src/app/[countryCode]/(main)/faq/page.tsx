import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema, getFAQPageSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { DEFAULT_FAQ_DATA, FaqView } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "Frequently Asked Questions (FAQ) | London Boy",
    description:
      "Answers regarding London Boy delivery, 24h returns, 240 GSM heavyweight cotton fabrics, size guide, and Cash on Delivery in Bangladesh.",
    canonical: `/${countryCode}/faq`,
  })
}

export default async function FAQPage(props: Props) {
  const { countryCode } = await props.params
  const routes = createMedusaRoutes(countryCode)

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "FAQ", url: `/${countryCode}/faq` },
  ])

  const allFaqItems = DEFAULT_FAQ_DATA.flatMap((cat) => cat.questions)
  const faqSchema = getFAQPageSchema(allFaqItems)

  return (
    <>
      <JsonLd data={[breadcrumbs, faqSchema]} />
      <FaqView routes={routes} linkComponent={LocalizedClientLink} />
    </>
  )
}
