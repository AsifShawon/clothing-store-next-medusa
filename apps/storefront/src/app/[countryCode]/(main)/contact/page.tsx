import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ContactView } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "Contact Customer Care & Atelier | London Boy",
    description:
      "Get in touch with London Boy Customer Care in Dhaka, Bangladesh. Assistance with orders, sizing, 240 GSM fabrics, and 24h returns.",
    canonical: `/${countryCode}/contact`,
  })
}

export default async function ContactPage(props: Props) {
  const { countryCode } = await props.params
  const routes = createMedusaRoutes(countryCode)

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Contact", url: `/${countryCode}/contact` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <ContactView routes={routes} linkComponent={LocalizedClientLink} />
    </>
  )
}
