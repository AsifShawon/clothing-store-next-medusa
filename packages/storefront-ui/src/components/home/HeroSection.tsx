import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ProductView, StoreRoutes } from "@dtc/commerce-contracts"

export interface HeroSectionProps {
  routes: StoreRoutes
  featuredProduct?: ProductView
  secondaryCtaSlot?: React.ReactNode
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

export function HeroSection({
  routes,
  featuredProduct,
  secondaryCtaSlot,
  linkComponent: LinkComp = Link,
}: HeroSectionProps) {
  const showcaseImage = featuredProduct?.thumbnail?.url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"

  return (
    <section className="relative bg-brand-surface border-b border-brand-border overflow-hidden">
      <div className="content-container py-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Narrative */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <span className="badge-tag">
                🇬🇧 British Heritage • Dhaka Tailoring
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-primary leading-[1.08] tracking-tight">
              Structured Minimalism <br className="hidden sm:inline" />
              For Modern Living.
            </h1>

            <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Crafted in Bangladesh from 240 GSM combed compact cotton and pure French linen.
              Designed for confident smart-casual elegance across Dhaka, London, and beyond.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <LinkComp
                href={routes.catalog()}
                className="contrast-btn w-full sm:w-auto text-center"
              >
                Explore Collection
              </LinkComp>

              {secondaryCtaSlot || (
                <LinkComp
                  href={routes.collection("new-arrivals")}
                  className="px-6 py-3 border border-brand-border hover:border-brand-primary bg-white text-brand-primary text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto text-center"
                >
                  New Arrivals
                </LinkComp>
              )}
            </div>

            {/* Micro Feature Indicators */}
            <div className="pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="block font-heading font-bold text-xs text-brand-primary uppercase tracking-wider">
                  240 GSM
                </span>
                <span className="text-[11px] text-brand-muted">Combed Cotton</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-brand-primary uppercase tracking-wider">
                  24–48h
                </span>
                <span className="text-[11px] text-brand-muted">Dhaka Delivery</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-xs text-brand-primary uppercase tracking-wider">
                  100% Cotton
                </span>
                <span className="text-[11px] text-brand-muted">Pre-Shrunk Weave</span>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full bg-brand-secondary border border-brand-border shadow-lg overflow-hidden group">
              <Image
                src={showcaseImage}
                alt="London Boy Signature Editorial Menswear"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-[10px] font-heading font-semibold tracking-widest uppercase text-brand-secondary">
                  Signature Essential
                </span>
                <h3 className="font-heading font-bold text-base sm:text-lg">
                  {featuredProduct?.title || "240 GSM Heavyweight T-Shirt"}
                </h3>
                <p className="text-xs text-brand-secondary/90">
                  {featuredProduct?.minPrice ? featuredProduct.minPrice.formatted : "From ৳1,250"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
