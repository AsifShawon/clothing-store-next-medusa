import React from "react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="content-container py-16 space-y-16 max-w-4xl mx-auto">
      {/* Brand Header */}
      <div className="text-center space-y-4">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Our Heritage</span>
        <h1 className="font-display text-4xl sm:text-5xl text-brand-primary">The London Boy Story</h1>
        <p className="text-sm text-grey-60 max-w-2xl mx-auto leading-relaxed">
          Bridging classic British tailoring aesthetics with world-class Bangladesh textile engineering.
        </p>
      </div>

      {/* Featured Banner */}
      <div className="relative aspect-[16/9] w-full bg-brand-secondary border border-brand-border overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80"
          alt="London Boy tailoring craft"
          fill
          className="object-cover"
        />
      </div>

      {/* Philosophy Paragraphs */}
      <div className="prose prose-sm text-grey-70 space-y-6 text-sm leading-relaxed">
        <h2 className="font-display text-2xl text-brand-primary font-normal">
          High-Density Longevity over Fast Fashion
        </h2>
        <p>
          Founded on the principle that everyday wardrobe essentials should outlast trend cycles, London Boy crafts
          elevated smart-casual pieces tailored specifically for the humid climate and versatile lifestyle of Bangladesh.
        </p>
        <p>
          Each garment begins with fiber selection: 240 GSM combed compact cottons that refuse to twist at the seams,
          two-ply Oxford weaves woven with durable yarns, and French flax linens that grow softer and more characterful
          with every wash.
        </p>

        <h2 className="font-display text-2xl text-brand-primary font-normal pt-6">
          Architectural Minimalism
        </h2>
        <p>
          We reject oversized exterior branding and fleeting novelty graphics. Our garments speak through collar structure,
          reinforced plackets, and tone-on-tone embroidery designed for boardrooms, weekend travels, and everything in between.
        </p>
      </div>

      {/* Workshop Location Banner */}
      <div className="p-8 bg-brand-card border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-heading font-bold text-base text-brand-primary">Operations & Warehouse</h3>
          <p className="text-xs text-grey-60">Tejgaon Industrial Area, Dhaka, Bangladesh</p>
        </div>
        <Link href="/shop" className="contrast-btn text-xs">
          Explore Current Collection
        </Link>
      </div>
    </div>
  )
}
