import React from "react"
import Link from "next/link"
import Image from "next/image"
import { StoreRoutes } from "@dtc/commerce-contracts"

export interface BrandStorySectionProps {
  routes: StoreRoutes
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

export function BrandStorySection({
  routes,
  linkComponent: LinkComp = Link,
}: BrandStorySectionProps) {
  return (
    <section className="py-16 sm:py-24 bg-brand-surface border-b border-brand-border">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-brand-secondary border border-brand-border overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"
                alt="London Boy Craftsmanship"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="badge-tag">The Architecture of Everyday Wear</span>

            <h2 className="font-display text-3xl sm:text-4xl text-brand-primary font-normal leading-tight">
              High-Density Longevity Over Fast Fashion Trends.
            </h2>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Founded on the belief that everyday clothing should outlast rapid trend cycles, London Boy bridges
              Savile Row aesthetic restraint with Bangladesh’s premier garment manufacturing engineering.
            </p>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Every tee starts with 240 GSM combed compact cotton fibers that resist seam-twisting. Every shirt utilizes
              breathable French flax linen and two-ply Oxford weaves designed for high temperatures and effortless layering.
            </p>

            <div className="pt-2">
              <LinkComp
                href={routes.about()}
                className="contrast-btn text-xs inline-block"
              >
                Read Our Story
              </LinkComp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
