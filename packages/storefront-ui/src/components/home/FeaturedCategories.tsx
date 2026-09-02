import React from "react"
import Link from "next/link"
import Image from "next/image"
import { CategoryView, StoreRoutes } from "@dtc/commerce-contracts"

export interface FeaturedCategoriesProps {
  categories: CategoryView[]
  routes: StoreRoutes
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  men: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  women: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  accessories: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
  shirts: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
  pants: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
}

export function FeaturedCategories({
  categories,
  routes,
  linkComponent: LinkComp = Link,
}: FeaturedCategoriesProps) {
  const displayCategories = categories.length > 0
    ? categories.slice(0, 3)
    : [
        { id: "1", name: "Men's Collection", handle: "men", description: "Structured Oxford shirts, heavyweight tees & chinos" },
        { id: "2", name: "Women's Edit", handle: "women", description: "Breathable French linen relaxed shirts & silhouettes" },
        { id: "3", name: "Caps & Essentials", handle: "accessories", description: "Six-panel cotton twill caps and smart accessories" },
      ]

  return (
    <section className="py-16 sm:py-20 bg-brand-secondary/30 border-b border-brand-border">
      <div className="content-container space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="badge-tag">Curated Edits</span>
          <h2 className="font-display text-2xl sm:text-3xl text-brand-primary font-normal">
            Shop By Wardrobe Category
          </h2>
          <p className="text-xs text-brand-muted">
            Engineered silhouettes designed to mix and match effortlessly for work, travel, and leisure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCategories.map((category) => {
            const image = category.image || FALLBACK_CATEGORY_IMAGES[category.handle.toLowerCase()] ||
              "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
            const href = routes.category(category.handle)

            return (
              <LinkComp
                key={category.id}
                href={href}
                className="group relative aspect-[4/5] bg-brand-secondary border border-brand-border overflow-hidden block"
              >
                <Image
                  src={image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <h3 className="font-heading font-bold text-lg sm:text-xl uppercase tracking-wider">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-xs text-brand-secondary/80 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider uppercase text-brand-sand underline underline-offset-4 group-hover:text-white transition-colors pt-1">
                    Explore Edit →
                  </span>
                </div>
              </LinkComp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
