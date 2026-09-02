"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoProducts } from "@lib/demo-store-context"
import { ProductGrid } from "@components/store/product-grid"
import {
  ArrowRight,
  Sparkles,
  BadgeCheck,
  ShieldCheck,
  TruckFast,
  BuildingStorefront,
  Envelope,
  Check,
} from "@medusajs/icons"

export default function HomePage() {
  const { products, categories, collections } = useDemoProducts()
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Curated subsets
  const newArrivals = products.filter(
    (p) => p.collectionHandle === "new-arrivals" || p.tags.includes("new-arrivals")
  ).slice(0, 4)

  const bestSellers = products.filter(
    (p) => p.collectionHandle === "best-sellers" || p.tags.includes("signature") || p.tags.includes("bestseller")
  ).slice(0, 4)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes("@")) return
    setIsSubscribed(true)
  }

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Editorial Hero Section */}
      <section className="relative bg-brand-primary text-white overflow-hidden">
        <div className="content-container py-16 sm:py-28 lg:py-36 relative z-10">
          <div className="max-w-2xl space-y-6 animate-enter">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-widest text-brand-secondary rounded">
              <Sparkles className="w-3.5 h-3.5 text-brand-sand" />
              <span>Autumn / Winter Capsule • Dhaka Hub</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-tight">
              Tailored for the Modern Standard.
            </h1>

            <p className="text-sm sm:text-base text-grey-30 font-sans leading-relaxed max-w-lg">
              Structured British silhouettes crafted with heavyweight 240 GSM combed cottons and natural French flax linens. Calibrated specifically for Bangladesh.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="px-6 py-3.5 bg-brand-secondary text-brand-primary text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-brand-accent transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                <span>Shop All Garments</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/demo-admin"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
              >
                <BuildingStorefront className="w-4 h-4 text-emerald-400" />
                <span>Simulated Admin Demo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Background Texture */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-25 lg:opacity-40 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1400&q=80"
            alt="London Boy tailoring"
            fill
            priority
            className="object-cover object-center mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent" />
        </div>
      </section>

      {/* Featured Department Banners */}
      <section className="content-container">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10 sm:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent block">
            Crafted Departments
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-brand-primary">
            Curated British Essentials
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(1, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/category?handle=${cat.handle}`}
              className="group relative h-80 sm:h-96 bg-brand-secondary overflow-hidden border border-brand-border block"
            >
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"}
                alt={cat.name}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300" />
              <div className="absolute inset-x-6 bottom-6 text-white space-y-1">
                <h3 className="font-display text-2xl font-normal">{cat.name}</h3>
                <p className="text-xs text-grey-30 line-clamp-2">{cat.description}</p>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-brand-sand uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  <span>Explore Department</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Rail */}
      <section className="content-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-brand-border pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent block">
              Just Dropped
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-primary mt-1">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/collection?handle=new-arrivals"
            className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-accent flex items-center gap-1.5 transition-colors"
          >
            <span>View All New Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={newArrivals.length > 0 ? newArrivals : products.slice(0, 4)} />
      </section>

      {/* Brand Craftsmanship & Fabric Story */}
      <section className="bg-brand-secondary border-y border-brand-border py-16 sm:py-24">
        <div className="content-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] bg-white border border-brand-border overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80"
              alt="London Boy fabric texture"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent block">
              Fabric Engineering
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-brand-primary leading-tight">
              High-Density Cottons, French Linens & Tailored Precision.
            </h2>
            <p className="text-xs sm:text-sm text-grey-70 leading-relaxed">
              Every London Boy garment begins with material integrity. Our signature heavyweight t-shirts are spun from 240 GSM combed compact cotton for a crisp architectural silhouette that never slumps. Our shirts incorporate durable French flax linen and two-ply Oxford weaves designed to breathe seamlessly in the humid subcontinental climate.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-2 border-t border-brand-border/80">
              <div className="space-y-1">
                <span className="font-mono text-xl sm:text-2xl font-bold text-brand-primary">240 GSM</span>
                <p className="text-xs text-grey-60">High-Density Combed Cotton</p>
              </div>
              <div className="space-y-1">
                <span className="font-mono text-xl sm:text-2xl font-bold text-brand-primary">100%</span>
                <p className="text-xs text-grey-60">Natural Plant Fibers</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-accent border-b-2 border-brand-primary pb-1 hover:border-brand-accent transition-colors"
              >
                <span>Read Full Brand Origin Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="content-container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-brand-border pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-accent block">
              Most Coveted
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-brand-primary mt-1">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/collection?handle=best-sellers"
            className="text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-accent flex items-center gap-1.5 transition-colors"
          >
            <span>View All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={bestSellers.length > 0 ? bestSellers : products.slice(0, 4)} />
      </section>

      {/* Delivery & Service Guarantees */}
      <section className="content-container">
        <div className="bg-brand-surface border border-brand-border p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary text-white flex-shrink-0">
                <TruckFast className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                  24-48h Dhaka Delivery
                </h4>
                <p className="text-xs text-grey-60 leading-relaxed">
                  Fast dispatched directly from our Tejgaon fulfillment center. Nationwide delivery in 3-5 days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary text-white flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                  24-Hour Size Exchange
                </h4>
                <p className="text-xs text-grey-60 leading-relaxed">
                  Try it on at home. Need a different size? We arrange door-to-door swaps hassle-free.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-primary text-white flex-shrink-0">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                  Cash on Delivery & Cards
                </h4>
                <p className="text-xs text-grey-60 leading-relaxed">
                  Pay securely with Cash on Delivery anywhere in Bangladesh or test card simulation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Simulation Section */}
      <section className="bg-brand-primary text-white py-14 sm:py-20 border-t border-brand-border">
        <div className="content-container text-center max-w-xl mx-auto space-y-5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-sand block">
            Private Access
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-white">
            Join the London Boy Society
          </h2>
          <p className="text-xs sm:text-sm text-grey-30 leading-relaxed">
            Subscribe for early notifications on limited capsule releases and receive 10% off your first order with code <strong>LONDON10</strong>.
          </p>

          {isSubscribed ? (
            <div className="p-4 bg-brand-accent/30 border border-brand-accent text-emerald-300 text-xs flex items-center justify-center gap-2 animate-fade-in max-w-md mx-auto">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Thank you for joining! Use promo code <strong>LONDON10</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <div className="relative flex-1">
                <Envelope className="w-4 h-4 text-grey-40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 text-xs text-white placeholder:text-grey-40 focus:outline-none focus:border-brand-accent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
