import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const Hero = () => {
  return (
    <div className="relative bg-brand-secondary border-b border-brand-border overflow-hidden">
      {/* Background Decorative Pattern / Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-secondary via-brand-secondary/95 to-brand-muted/20 z-0 pointer-events-none" />

      <div className="content-container relative z-10 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary text-white text-[11px] font-heading font-semibold uppercase tracking-widest">
              <span>British Smart-Casual</span>
              <span className="text-brand-muted">•</span>
              <span>240 GSM Combed Cotton</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-primary leading-[1.12] tracking-tight">
              Refined British Style. <br />
              <span className="italic font-normal">Crafted for Dhaka.</span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-brand-primary/80 max-w-xl leading-relaxed">
              Timeless silhouettes tailored for modern living in Bangladesh. Engineered with high-density 240 GSM combed compact cotton, French linen blends, and sharp Oxford weaves.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <LocalizedClientLink
                href="/collections/new-arrivals"
                className="px-8 py-3.5 bg-brand-primary text-white hover:bg-black text-xs font-heading font-semibold uppercase tracking-widest text-center transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Shop New Arrivals
              </LocalizedClientLink>
              <LocalizedClientLink
                href="/collections/essentials"
                className="px-8 py-3.5 bg-white text-brand-primary border border-brand-primary/30 hover:border-brand-primary hover:bg-white text-xs font-heading font-semibold uppercase tracking-widest text-center transition-all duration-200"
              >
                The Essentials Edit
              </LocalizedClientLink>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-brand-border/60 flex flex-wrap items-center gap-6 text-xs text-brand-primary/70">
              <div className="flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Inside Dhaka ৳60 (24–48h)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>24-Hour Return Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Sizes S to XL / 30 to 36</span>
              </div>
            </div>
          </div>

          {/* Right: Curated Hero Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-brand-border p-5 sm:p-6 shadow-xl relative overflow-hidden group">
              <div className="relative aspect-[4/5] w-full bg-brand-secondary overflow-hidden mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                  alt="London Boy Signature Heavyweight T-Shirt"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-accent text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 z-10">
                  Signature Drop
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-heading font-bold text-sm text-brand-primary">
                    Signature Heavyweight T-Shirt
                  </h3>
                  <span className="font-bold text-sm text-brand-primary">BDT 1,250</span>
                </div>
                <p className="text-xs text-brand-primary/60">
                  240 GSM Combed Compact Cotton • 8 Sizing &amp; Color Variants
                </p>
                <div className="pt-2">
                  <LocalizedClientLink
                    href="/products/heavyweight-t-shirt"
                    className="block w-full py-2.5 bg-brand-secondary hover:bg-brand-primary hover:text-white border border-brand-border text-center text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    View Product Details →
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
