"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useDemoProducts } from "@lib/demo-store-context"
import { ProductGrid } from "@components/store/product-grid"

function CollectionContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "new-arrivals"

  const { allProducts, collections } = useDemoProducts()

  const currentCollection = useMemo(() => {
    return (
      collections.find((c) => c.handle === handle) || {
        id: "col_default",
        title: "Curated Collection",
        handle,
        description: "Explore our premium British clothing essentials crafted for Bangladesh.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      }
    )
  }, [collections, handle])

  const productsInCollection = useMemo(() => {
    return allProducts.filter(
      (p) => p.collectionHandle === handle || p.tags.includes(handle)
    )
  }, [allProducts, handle])

  return (
    <div className="content-container py-8 sm:py-12 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-grey-50 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-primary transition-colors">
          Collections
        </Link>
        <span>/</span>
        <span className="text-brand-primary font-medium">{currentCollection.title}</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-brand-primary text-white overflow-hidden border border-brand-border">
        <Image
          src={currentCollection.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80"}
          alt={currentCollection.title}
          fill
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 max-w-xl space-y-2 z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">
            Capsule Collection
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white">
            {currentCollection.title}
          </h1>
          <p className="text-xs sm:text-sm text-grey-30 leading-relaxed">
            {currentCollection.description}
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-3 text-xs text-grey-50">
          <span>
            Showing <strong>{productsInCollection.length}</strong> items in {currentCollection.title}
          </span>
          <Link
            href="/shop"
            className="text-brand-primary hover:text-brand-accent font-semibold uppercase tracking-wider"
          >
            Browse All Clothing →
          </Link>
        </div>

        <ProductGrid
          products={productsInCollection}
          emptyMessage={`No garments currently categorized under "${currentCollection.title}".`}
        />
      </div>
    </div>
  )
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Collection...</div>}>
      <CollectionContent />
    </Suspense>
  )
}
