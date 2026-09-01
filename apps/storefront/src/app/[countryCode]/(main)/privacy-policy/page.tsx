import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"

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

export default async function PrivacyPolicyPage(props: Props) {
  const { countryCode } = await props.params

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Privacy Policy", url: `/${countryCode}/privacy-policy` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <div className="bg-white min-h-screen">
        {/* Header Banner */}
        <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
          <div className="content-container max-w-4xl text-center space-y-3">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
              Data Protection &amp; Security
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
              Your privacy and data security are fundamental to how we build our clothing brand.
            </p>
          </div>
        </div>

        {/* Review Notice Banner */}
        <div className="content-container max-w-3xl pt-8">
          <div className="p-4 bg-brand-secondary/70 border border-brand-border text-[11px] text-brand-primary/80 space-y-1">
            <span className="font-bold text-brand-primary uppercase block">
              ⚠️ Legal Compliance Notice
            </span>
            <p>
              [REVIEW REQUIRED: Business-owner / Legal Counsel review required for compliance with applicable data protection laws, cookie consent policies, and third-party tracking disclosures before production deployment.]
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-container max-w-3xl py-10 sm:py-16 space-y-8 text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-brand-primary">
            1. Overview
          </h2>
          <p>
            This Privacy Policy describes how London Boy (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) collects, uses, and discloses your personal information when you visit or make a purchase from <strong>londonboy.uk</strong>.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            2. Information We Collect
          </h2>
          <p>
            When you purchase from London Boy, we collect only information strictly necessary to fulfill your order and deliver your garments:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-brand-primary/80">
            <li><strong>Customer Details:</strong> Name, delivery address, phone number, and email address.</li>
            <li><strong>Order History:</strong> Products purchased, size/color variant selections, and delivery preferences.</li>
            <li><strong>Device Data:</strong> IP address, browser type, and cookie identifiers for shopping bag persistence.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            3. Payment Data Security
          </h2>
          <p>
            London Boy does not store or process your credit card numbers directly on our servers. All digital transactions are securely routed through PCI-DSS compliant providers (Stripe, SSLCOMMERZ) utilizing end-to-end 256-bit SSL encryption.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            4. Courier Sharing &amp; Fulfillment
          </h2>
          <p>
            To deliver your package within our 24–48 hour timeline inside Dhaka, we share only your name, delivery address, and contact number with our trusted domestic logistics partners. We never sell, rent, or monetize customer records to third-party marketing companies.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            5. Contact Us Regarding Your Data
          </h2>
          <p>
            If you wish to review, update, or request the deletion of your customer information, please contact our data team at:
          </p>
          <p className="font-bold text-brand-primary">
            Email: <a href="mailto:londonboy@mack.com.bd" className="text-brand-accent underline">londonboy@mack.com.bd</a>
          </p>
        </section>
      </div>
    </div>
  </>
)
}
