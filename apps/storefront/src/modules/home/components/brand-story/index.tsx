import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function BrandStory() {
  return (
    <section className="py-20 bg-brand-secondary border-b border-brand-border">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-3 py-1 bg-brand-accent text-white text-[10px] font-heading font-semibold uppercase tracking-widest">
              Brand Philosophy
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary leading-tight">
              Born in London. <br />
              <span className="italic font-normal">Tailored for Bangladesh.</span>
            </h2>

            <p className="text-sm text-brand-primary/80 leading-relaxed">
              London Boy was founded on a simple conviction: men in Bangladesh deserve clothing with the density, structure, and understated elegance of classic British tailoring, crafted for tropical wear.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="border-l-2 border-brand-accent pl-4 space-y-1">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
                  240 GSM Compact Cotton
                </h4>
                <p className="text-xs text-brand-primary/70">
                  Dense weave that holds its shape wash after wash without cling or opacity loss.
                </p>
              </div>

              <div className="border-l-2 border-brand-accent pl-4 space-y-1">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
                  Atelier Craftsmanship
                </h4>
                <p className="text-xs text-brand-primary/70">
                  Reinforced collars, mother-of-pearl buttons, and double-needle stitching throughout.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <LocalizedClientLink
                href="/about"
                className="inline-block px-6 py-3 bg-brand-primary text-white hover:bg-black text-xs font-heading font-semibold uppercase tracking-widest transition-colors"
              >
                Read Our Full Story →
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right Visual Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-white border border-brand-border overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
                  alt="Oxford Weave Details"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-white border border-brand-border text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary block">
                  100% Combed Cotton
                </span>
                <span className="text-[11px] text-brand-primary/60">No synthetic polyester fillers</span>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 bg-brand-primary text-brand-secondary border border-brand-primary text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-white block">
                  Dhaka Warehouse
                </span>
                <span className="text-[11px] text-brand-muted">Direct dispatch inside 24 hours</span>
              </div>
              <div className="relative aspect-[3/4] bg-white border border-brand-border overflow-hidden shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80"
                  alt="Regent Knit Pique Polo"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
