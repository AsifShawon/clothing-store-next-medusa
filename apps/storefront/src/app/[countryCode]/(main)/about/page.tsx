import { Metadata } from "next"
import { constructMetadata, getBreadcrumbSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

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

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", url: `/${countryCode}` },
    { name: "About Us", url: `/${countryCode}/about` },
  ])

  return (
    <>
      <JsonLd data={breadcrumbsSchema} />
      <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-14 sm:py-20">
        <div className="content-container max-w-4xl text-center space-y-4">
          <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
            The London Boy Narrative
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-primary">
            Born in London. Tailored for Bangladesh.
          </h1>
          <p className="text-sm sm:text-base text-brand-primary/80 max-w-2xl mx-auto leading-relaxed">
            Uncompromising fabric density, clean British architectural lines, and everyday comfort tailored for Dhaka’s dynamic smart-casual wardrobe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container max-w-4xl py-16 sm:py-24 space-y-16">
        {/* Section 1: The Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
              01 / Our Genesis
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-primary">
              The Pursuit of Honest Quality
            </h2>
            <p className="text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
              London Boy was founded by designers inspired by the timeless streets of Mayfair, Soho, and Chelsea. We noticed that clothing available in South Asia often compromised on fabric weight, resulting in flimsy garments that lose shape after three washes.
            </p>
            <p className="text-xs sm:text-sm text-brand-primary/80 leading-relaxed">
              We set out to engineer clothing with substantial drape—using 240 GSM combed compact cotton and pure Oxford weaves—manufactured with surgical precision in Bangladesh.
            </p>
          </div>
          <div className="relative aspect-[4/3] bg-brand-secondary border border-brand-border overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
              alt="London Boy Heavyweight Cotton Drape"
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Section 2: Core Craftsmanship Pillars */}
        <div className="border-y border-brand-border py-12">
          <h3 className="font-display text-2xl text-center text-brand-primary mb-8">
            The Three Principles of London Boy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-2 p-4 bg-brand-secondary/40 border border-brand-border/60">
              <span className="font-display text-2xl text-brand-accent">I.</span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
                High-Density 240 GSM Fabrics
              </h4>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Zero transparency, robust structured drape, and combed compact fibers that prevent pilling and shrink.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-brand-secondary/40 border border-brand-border/60">
              <span className="font-display text-2xl text-brand-accent">II.</span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
                British Tailored Silhouettes
              </h4>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Refined armholes, crisp button-down collars, and modern trouser taper developed specifically for South Asian body proportions.
              </p>
            </div>

            <div className="space-y-2 p-4 bg-brand-secondary/40 border border-brand-border/60">
              <span className="font-display text-2xl text-brand-accent">III.</span>
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
                Direct Dhaka Dispatch
              </h4>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                All inventory is stocked in our Dhaka Central Warehouse, enabling 24–48 hour delivery and seamless 24-hour return guarantees.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Call to Action */}
        <div className="text-center space-y-6 pt-4">
          <h3 className="font-display text-3xl text-brand-primary">
            Experience the London Boy Difference
          </h3>
          <p className="text-xs sm:text-sm text-brand-primary/70 max-w-lg mx-auto">
            Explore our curated catalog of everyday smart-casual essentials.
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block px-8 py-3.5 bg-brand-primary text-white hover:bg-black text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-md"
          >
            Explore The Collection →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  </>
)
}
