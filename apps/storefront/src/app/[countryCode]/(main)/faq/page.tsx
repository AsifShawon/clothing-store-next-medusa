import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema, getFAQPageSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import FAQTemplate, { FAQ_DATA } from "@modules/faq/templates/faq-template"

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

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "FAQ", url: `/${countryCode}/faq` },
  ])

  const allFaqItems = FAQ_DATA.flatMap((cat) => cat.questions)
  const faqSchema = getFAQPageSchema(allFaqItems)

  return (
    <>
      <JsonLd data={[breadcrumbs, faqSchema]} />
      <FAQTemplate />
    </>
  )
}
