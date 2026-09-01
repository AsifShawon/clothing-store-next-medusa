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
    title: "Return & Refund Policy | London Boy",
    description:
      "Information on our 24-hour return and exchange policy and refund process for London Boy clothing in Bangladesh.",
    canonical: `/${countryCode}/return-policy`,
  })
}

export default async function ReturnPolicyPage(props: Props) {
  const { countryCode } = await props.params

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "Return & Refund Policy", url: `/${countryCode}/return-policy` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <div className="bg-white min-h-screen">
        {/* Header Banner */}
        <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
          <div className="content-container max-w-4xl text-center space-y-3">
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
              Peace of Mind Guarantee
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
              24-Hour Return &amp; Refund Policy
            </h1>
            <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto">
              We want you to feel confident in every stitch. If the size or fit isn&apos;t perfect, we make returns and exchanges straightforward.
            </p>
          </div>
        </div>

        {/* Review Notice Banner */}
        <div className="content-container max-w-3xl pt-8">
          <div className="p-4 bg-brand-secondary/70 border border-brand-border text-[11px] text-brand-primary/80 space-y-1">
            <span className="font-bold text-brand-primary uppercase block">
              ⚠️ Policy Parameters Notice
            </span>
            <p>
              [REVIEW REQUIRED: Business-owner / Legal Counsel confirmation required for 24h return window policy, return courier fee allocation, and refund disbursement SLAs (3–5 business days).]
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="content-container max-w-3xl py-10 sm:py-16 space-y-10 text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
        {/* Core Policy Highlight */}
        <div className="p-6 bg-brand-secondary/60 border border-brand-accent/40 space-y-2">
          <span className="font-heading font-bold text-xs uppercase tracking-wider text-brand-accent block">
            🛡️ Official Policy Window
          </span>
          <p className="font-bold text-base text-brand-primary">
            Return or exchange requests must be initiated within 24 hours of package delivery.
          </p>
          <p className="text-xs text-brand-primary/70">
            Due to the limited-run, high-density nature of our clothing drops, initiating requests promptly allows us to reserve your replacement size before it sells out.
          </p>
        </div>

        {/* Section 1: Conditions */}
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-brand-primary">
            1. Eligibility Conditions
          </h2>
          <p>To qualify for a return or size exchange, garments must meet the following criteria:</p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brand-primary/80">
            <li>The item must be completely <strong>unworn, unwashed, and unaltered</strong>.</li>
            <li>All original <strong>London Boy tags, woven labels, and barcode stickers</strong> must remain firmly attached.</li>
            <li>The garment must be free of cologne, smoke, deodorant marks, or pet hair.</li>
            <li>Must be returned in its original protective packaging.</li>
          </ul>
        </div>

        {/* Section 2: Step-by-Step Procedure */}
        <div className="space-y-4 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            2. How to Request an Exchange or Return
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <span className="font-display text-xl text-brand-accent">Step 1</span>
              <h4 className="font-bold uppercase tracking-wider text-brand-primary">Notify Care</h4>
              <p className="text-brand-primary/70">
                Email us at <a href="mailto:londonboy@mack.com.bd" className="underline">londonboy@mack.com.bd</a> within 24 hours with your Order ID and photo of the tag.
              </p>
            </div>

            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <span className="font-display text-xl text-brand-accent">Step 2</span>
              <h4 className="font-bold uppercase tracking-wider text-brand-primary">Courier Pickup</h4>
              <p className="text-brand-primary/70">
                Our logistics partner will collect the return package directly from your address (Inside Dhaka) or nearest drop point.
              </p>
            </div>

            <div className="p-4 bg-brand-card border border-brand-border space-y-2">
              <span className="font-display text-xl text-brand-accent">Step 3</span>
              <h4 className="font-bold uppercase tracking-wider text-brand-primary">Dispatch / Refund</h4>
              <p className="text-brand-primary/70">
                Upon quality inspection at our Dhaka Warehouse, replacement size is dispatched or payment is refunded within 3–5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Non-Returnable Items */}
        <div className="space-y-3 pt-4 border-t border-brand-border/60">
          <h2 className="font-display text-2xl text-brand-primary">
            3. Non-Returnable Items
          </h2>
          <p>For hygienic and quality control reasons, the following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-brand-primary/70">
            <li>Socks and intimate accessories once the seal has been opened.</li>
            <li>Items marked &quot;Final Sale&quot; or customized garments.</li>
          </ul>
        </div>

        {/* Section 4: Contact */}
        <div className="pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-brand-primary">Need assistance with a return?</h4>
            <p className="text-xs text-brand-primary/70">Our Dhaka team is available Saturday to Thursday.</p>
          </div>
          <LocalizedClientLink
            href="/contact"
            className="px-6 py-2.5 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black"
          >
            Contact Customer Care →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  </>
)
}
