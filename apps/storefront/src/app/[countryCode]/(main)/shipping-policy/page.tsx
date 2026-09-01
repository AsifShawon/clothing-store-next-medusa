import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return constructMetadata({
    title: "Shipping & Delivery Policy | London Boy",
    description:
      "Information on delivery timelines, tiered shipping rates (60/100/130 BDT), and Cash on Delivery across Bangladesh.",
    canonical: `/${countryCode}/shipping-policy`,
  })
}

export default async function ShippingPolicyPage(props: Props) {
  const { countryCode } = await props.params

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Shipping Policy", url: `/${countryCode}/shipping-policy` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <div className="bg-white min-h-screen">
        {/* Header Banner */}
        <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
          <div className="content-container max-w-4xl text-center space-y-3">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
              Fulfillment &amp; Logistics
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
              Direct dispatch from our Dhaka Central Warehouse with transparent tiered pricing across all 64 districts of Bangladesh.
            </p>
          </div>
        </div>

        {/* Review Notice Banner */}
        <div className="content-container max-w-3xl pt-8">
          <div className="p-4 bg-brand-secondary/70 border border-brand-border text-[11px] text-brand-primary/80 space-y-1">
            <span className="font-bold text-brand-primary uppercase block">
              ⚠️ Operational Parameters Notice
            </span>
            <p>
              [REVIEW REQUIRED: Business-owner verification required for final shipping rate matrix (৳60 / ৳100 / ৳130), free shipping threshold (৳2,000), and courier delivery SLAs before launch.]
            </p>
          </div>
        </div>

        {/* Main Policy Content */}
        <div className="content-container max-w-3xl py-10 sm:py-16 space-y-12 text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
        {/* Tiered Rates Table */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl text-brand-primary">
            1. Bangladesh Delivery Zones &amp; Rates
          </h2>
          <p>
            We partner with reliable express logistics networks to ensure your garments arrive in pristine, uncreased condition. Shipping fees are calculated automatically during checkout based on your delivery district:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-brand-border">
              <thead className="bg-brand-secondary text-brand-primary font-heading uppercase text-[11px] border-b border-brand-border">
                <tr>
                  <th className="p-3">Zone / Area</th>
                  <th className="p-3">Estimated Time</th>
                  <th className="p-3">Standard Fee</th>
                  <th className="p-3">Perks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                <tr>
                  <td className="p-3 font-bold text-brand-primary">Inside Dhaka City</td>
                  <td className="p-3">24 – 48 Hours</td>
                  <td className="p-3 font-bold text-brand-accent">BDT 60</td>
                  <td className="p-3">Free on orders &gt; ৳2,000</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-primary">Dhaka Suburban (Savar, Gazipur, Keraniganj)</td>
                  <td className="p-3">2 – 3 Business Days</td>
                  <td className="p-3 font-bold text-brand-accent">BDT 100</td>
                  <td className="p-3">Doorstep Delivery</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-primary">Outside Dhaka (All 64 Districts)</td>
                  <td className="p-3">3 – 5 Business Days</td>
                  <td className="p-3 font-bold text-brand-accent">BDT 130</td>
                  <td className="p-3">Nationwide Express</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Order Processing */}
        <div className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            2. Order Processing &amp; Dispatch Timeline
          </h2>
          <p>
            Orders placed before <strong>2:00 PM (Saturday – Thursday)</strong> are inspected, packaged, and handed over to our courier partner on the same business day. Orders placed on Friday or national holidays will be processed on the next working day.
          </p>
          <p>
            Each garment is packaged in a protective biodegradable garment sleeve within our signature London Boy rigid delivery box.
          </p>
        </div>

        {/* Section 3: Payment Upon Delivery */}
        <div className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            3. Payment Methods: Cash on Delivery &amp; Digital Pay
          </h2>
          <p>
            We offer <strong>Cash on Delivery (COD)</strong> across all serviceable areas in Bangladesh. You may inspect the sealed package and pay the delivery agent in cash upon handover.
          </p>
          <p>
            Alternatively, you may pay securely online using credit/debit cards or mobile financial services (bKash/Nagad via SSLCOMMERZ / Stripe).
          </p>
        </div>

        {/* Section 4: Tracking & Inquiries */}
        <div className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            4. Order Tracking &amp; Questions
          </h2>
          <p>
            Once your package leaves our Dhaka Central Warehouse, you will receive an SMS and email with your live courier tracking link.
          </p>
          <p>
            If you have questions about an existing delivery, please email us at{" "}
            <a href="mailto:londonboy@mack.com.bd" className="text-brand-accent font-semibold hover:underline">
              londonboy@mack.com.bd
            </a>{" "}
            or visit our{" "}
            <LocalizedClientLink href="/contact" className="text-brand-accent font-semibold hover:underline">
              Contact Page
            </LocalizedClientLink>
            .
          </p>
        </div>
      </div>
    </div>
  </>
)
}
