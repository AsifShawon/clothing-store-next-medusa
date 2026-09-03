"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { StoreRoutes } from "@dtc/commerce-contracts"
import { ArrowRightIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface CraftsmanshipSectionProps {
  routes: StoreRoutes
  linkComponent?: LinkComponent
}

export function CraftsmanshipSection({
  routes,
  linkComponent: LinkComp = Link,
}: CraftsmanshipSectionProps) {
  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-brand-surface border-b border-brand-border/80">
      <div className="editorial-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full bg-brand-secondary rounded-2xl overflow-hidden border border-brand-border/80 shadow-subtle group">
              <Image
                src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80"
                alt="London Boy Craftsmanship & Garment Engineering"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Floating Metric Callout */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-brand-border shadow-md flex items-center justify-between">
                <div>
                  <span className="block font-heading font-bold text-xs text-brand-primary uppercase tracking-wider">
                    240 GSM Compact Cotton
                  </span>
                  <span className="text-[11px] text-brand-muted">
                    Pre-shrunk, zero seam-twisting
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-brand-accent bg-brand-accent/10 px-2.5 py-1 rounded-full">
                  100% Cotton
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-secondary border border-brand-border/70 text-[10px] sm:text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-accent">
                Artisanal Integrity
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-brand-primary font-normal leading-tight tracking-tight">
              British Restraint. <br />
              Dhaka Manufacturing Mastery.
            </h2>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-sans">
              Founded on the principle that everyday garments should transcend disposable fashion, London Boy unifies Savile Row aesthetic discipline with Dhaka’s world-renowned textile engineering.
            </p>

            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-sans">
              Every tee begins with dense 240 GSM combed compact yarns. Every shirt utilizes breathable French flax linen and high-density two-ply Oxford weaves engineered to withstand tropical humidity while retaining crisp, structured drape.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-brand-border/60">
              <div>
                <span className="font-heading font-bold text-sm text-brand-primary block">
                  180 GSM
                </span>
                <span className="text-[11px] text-brand-muted">2-Ply Oxford</span>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-brand-primary block">
                  100% Flax
                </span>
                <span className="text-[11px] text-brand-muted">French Linen</span>
              </div>
              <div>
                <span className="font-heading font-bold text-sm text-brand-primary block">
                  Mother of Pearl
                </span>
                <span className="text-[11px] text-brand-muted">Natural Buttons</span>
              </div>
            </div>

            <div className="pt-2">
              <LinkComp
                href={routes.about()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white hover:bg-black text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 shadow-subtle group"
              >
                <span>Read Our Craft Archive</span>
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </LinkComp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
