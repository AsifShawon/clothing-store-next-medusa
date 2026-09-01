import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "Terms & Conditions | London Boy",
    description:
      "Read the terms and conditions governing purchases and usage of the London Boy clothing store in Bangladesh.",
    canonical: `/${countryCode}/terms-and-conditions`,
  })
}

export default async function TermsPage(props: Props) {
  const { countryCode } = await props.params

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Terms & Conditions", url: `/${countryCode}/terms-and-conditions` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <div className="bg-white min-h-screen">
        {/* Header Banner */}
        <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
          <div className="content-container max-w-4xl text-center space-y-3">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
              Legal &amp; Store Terms
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
              Please read these terms carefully before placing an order on londonboy.uk.
            </p>
          </div>
        </div>

        {/* Review Notice Banner */}
        <div className="content-container max-w-3xl pt-8">
          <div className="p-4 bg-brand-secondary/70 border border-brand-border text-[11px] text-brand-primary/80 space-y-1">
            <span className="font-bold text-brand-primary uppercase block">
              ⚠️ Legal &amp; Statutory Notice
            </span>
            <p>
              [REVIEW REQUIRED: Business-owner / Legal Counsel review required before commercial operations. Verify registered business entity details, VAT/tax compliance under Bangladesh law, and merchant terms.]
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-container max-w-3xl py-10 sm:py-16 space-y-8 text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
        <section className="space-y-3">
          <h2 className="font-display text-2xl text-brand-primary">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing or purchasing from London Boy (&quot;the Website&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms and Conditions and our associated policies (Shipping Policy, Return Policy, and Privacy Policy).
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            2. Product Information &amp; Currency
          </h2>
          <p>
            All prices listed on the website are displayed in <strong>Bangladeshi Taka (BDT / ৳)</strong>. While we endeavor to display accurate fabric weights (e.g. 240 GSM) and colors, slight variations may occur across display screens.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            3. Orders &amp; Inventory Availability
          </h2>
          <p>
            All orders are subject to stock availability in our Dhaka Central Warehouse. We reserve the right to cancel or adjust orders in the event of inventory inaccuracies, technical errors, or unauthorized payment transactions.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            4. Cash on Delivery (COD) Obligations
          </h2>
          <p>
            When selecting Cash on Delivery, customers agree to pay the total invoice amount in cash to the delivery agent upon handover. In the event a customer refuses delivery without valid reason, London Boy reserves the right to restrict future COD orders.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            5. Intellectual Property
          </h2>
          <p>
            The &quot;London Boy&quot; name, logotype, brand assets, garment photographs, editorial copy, and visual designs are the exclusive property of London Boy. Unauthorized reproduction or commercial re-use is strictly prohibited.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            6. Governing Law &amp; Jurisdiction
          </h2>
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of Bangladesh. Any disputes arising in connection with website usage or purchases shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
          </p>
        </section>
      </div>
    </div>
  </>
)
}
