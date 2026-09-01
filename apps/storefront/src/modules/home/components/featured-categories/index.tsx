import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const CATEGORIES = [
  {
    title: "Heavyweight T-Shirts",
    handle: "heavyweight-t-shirt",
    link: "/store?q=t-shirt",
    tagline: "240 GSM Compact Cotton",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    badge: "Bestseller",
  },
  {
    title: "Oxford Smart Shirts",
    handle: "oxford-smart-shirt",
    link: "/store?q=shirt",
    tagline: "100% Oxford Weave Cotton",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    badge: "Classic Fit",
  },
  {
    title: "Regent Knit Polos",
    handle: "regent-knit-polo",
    link: "/store?q=polo",
    tagline: "220 GSM Mercerized Pique",
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80",
    badge: "Smart Casual",
  },
  {
    title: "Mayfair Tailored Chinos",
    handle: "mayfair-tailored-chinos",
    link: "/store?q=chinos",
    tagline: "Stretch Cotton Twill",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
    badge: "Tailored Cut",
  },
]

export default function FeaturedCategories() {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
      <div className="content-container space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-accent block mb-1">
              Curated Wardrobe
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-primary">
              Core Categories &amp; Essentials
            </h2>
          </div>
          <LocalizedClientLink
            href="/store"
            className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-primary hover:text-brand-accent underline underline-offset-4"
          >
            Explore All Clothing →
          </LocalizedClientLink>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <LocalizedClientLink
              key={cat.title}
              href={cat.link}
              className="group relative bg-brand-card border border-brand-border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-brand-primary"
            >
              <div className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-primary/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 z-10">
                  {cat.badge}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2 bg-white">
                <div>
                  <h3 className="font-heading font-bold text-sm text-brand-primary group-hover:text-brand-accent transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-brand-primary/60 mt-0.5">{cat.tagline}</p>
                </div>
                <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-wider group-hover:underline">
                  Shop Category →
                </span>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
