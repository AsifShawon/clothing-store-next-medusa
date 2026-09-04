import React from "react"

interface BrandValue {
  number: string
  title: string
  description: string
}

export function BrandValuesGrid() {
  const pillars: BrandValue[] = [
    {
      number: "01",
      title: "Ethical Production in Dhaka",
      description:
        "Partnered with specialized artisan ateliers in Dhaka ensuring living wages, clean environments, and generational tailoring expertise.",
    },
    {
      number: "02",
      title: "Single-Source Natural Fibers",
      description:
        "Heavyweight 240 GSM combed compact cotton and pure European flax linen. Zero microplastics, synthetic fillers, or fast-fashion compromises.",
    },
    {
      number: "03",
      title: "Tailored British Fits",
      description:
        "Savile Row-inspired architecture cut for clean drapery and effortless transitions from boardroom to evening dining.",
    },
    {
      number: "04",
      title: "Zero Clutter Direct-to-Consumer",
      description:
        "No wholesale markups, no artificial sales seasons. Fair and honest pricing direct from master workshops straight to your door.",
    },
  ]

  return (
    <section className="py-14 sm:py-20 bg-brand-secondary/40 border-b border-brand-border/80">
      <div className="editorial-container space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-accent block">
            Our Commitments
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-brand-primary font-normal tracking-tight">
            The London Boy Standard
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            Quiet confidence woven into every seam, stitch, and mother-of-pearl fastener.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-brand-border/70 shadow-subtle space-y-3 flex flex-col justify-between"
            >
              <span className="font-display text-2xl text-brand-sand font-normal block">
                {pillar.number}
              </span>
              <div className="space-y-2">
                <h3 className="font-heading font-bold text-sm sm:text-base text-brand-primary tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
