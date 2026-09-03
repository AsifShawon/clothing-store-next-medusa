"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ProductView, StoreRoutes } from "@dtc/commerce-contracts"
import { ArrowRightIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface HeroSectionProps {
  routes: StoreRoutes
  featuredProduct?: ProductView
  secondaryCtaSlot?: React.ReactNode
  linkComponent?: LinkComponent
}

export function HeroSection({
  routes,
  featuredProduct,
  secondaryCtaSlot,
  linkComponent: LinkComp = Link,
}: HeroSectionProps) {
  const showcaseImage =
    featuredProduct?.thumbnail?.url ||
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=85"

  return (
    <section className="relative bg-white pt-4 pb-12 sm:pt-6 sm:pb-16 lg:pb-20">
      <div className="editorial-container">
        {/* Large Photographic Campaign Canvas */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border/80 bg-brand-secondary shadow-editorial flex flex-col justify-end p-6 sm:p-12 lg:p-16">
          <Image
            src={showcaseImage}
            alt="London Boy Editorial Campaign"
            fill
            priority
            sizes="(max-width: 1600px) 100vw, 1600px"
            className="object-cover object-center scale-100 hover:scale-102 transition-transform duration-1000"
          />

          {/* Editorial Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 pointer-events-none" />

          {/* Narrative Content */}
          <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6 text-white">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-sand">
                The 2026 British-Dhaka Edition
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-white">
              Structured Minimalism. <br />
              <span className="font-normal italic">Honest Craft.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/85 max-w-lg leading-relaxed font-sans">
              High-density natural fibers, 240 GSM compact cotton, and pure French flax linen.
              Designed with quiet British poise, tailored in Dhaka.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <LinkComp
                href={routes.catalog()}
                className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-white text-brand-primary hover:bg-brand-secondary text-xs font-heading font-bold uppercase tracking-wider transition-all duration-200 shadow-md group"
              >
                <span>Shop Collection</span>
                <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </LinkComp>

              {secondaryCtaSlot || (
                <LinkComp
                  href={routes.about()}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs font-heading font-semibold uppercase tracking-wider text-white hover:text-brand-sand transition-colors"
                >
                  <span>Explore Craftsmanship</span>
                  <span aria-hidden="true">→</span>
                </LinkComp>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
