import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyView } from "@dtc/storefront-ui"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "Privacy Policy | London Boy",
    description:
      "Learn how London Boy collects, protects, and manages customer information and data security in Bangladesh.",
    canonical: `/${countryCode}/privacy-policy`,
  })
}

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: (
      <p>
        When you purchase or create an account on London Boy, we collect necessary contact information (name, delivery address, phone number, and email address) required for courier dispatch and delivery confirmations.
      </p>
    ),
  },
  {
    title: "2. Payment Data Security",
    content: (
      <p>
        We do not store your debit/credit card numbers or mobile banking PINs on our servers. All digital transactions are securely encrypted and processed directly by licensed payment gateways.
      </p>
    ),
  },
  {
    title: "3. Logistics & Delivery Sharing",
    content: (
      <p>
        Your name, phone number, and shipping address are securely shared with our vetted courier partners (Steadfast, Pathao, Paperfly) exclusively to fulfill your doorstep delivery and communicate tracking status.
      </p>
    ),
  },
  {
    title: "4. Your Rights",
    content: (
      <p>
        You have the right to request access to, correction of, or deletion of your personal data stored with London Boy. Contact us at <strong>londonboy@mack.com.bd</strong> for any data privacy requests.
      </p>
    ),
  },
]

export default async function PrivacyPolicyPage(props: Props) {
  const { countryCode } = await props.params
  const routes = createMedusaRoutes(countryCode)

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Privacy Policy", url: `/${countryCode}/privacy-policy` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <PolicyView
        badge="Data Protection & Security"
        title="Privacy Policy"
        subtitle="Your privacy and data security are fundamental to how we build our clothing brand."
        sections={PRIVACY_SECTIONS}
        routes={routes}
        linkComponent={LocalizedClientLink}
      />
    </>
  )
}
