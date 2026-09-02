"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useDemoProducts } from "@lib/demo-store-context"
import { ProductGrid } from "@components/store/product-grid"

function CategoryContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "men"

  const { allProducts, categories } = useDemoProducts()

  const currentCategory = useMemo(() => {
    return (
      categories.find((c) => c.handle === handle || c.name.toLowerCase() === handle.toLowerCase()) || {
        id: "cat_default",
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        handle,
        description: "Explore our contemporary British smart-casual clothing.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      }
    )
  }, [categories, handle])

  const productsInCategory = useMemo(() => {
    return allProducts.filter((p) =>
      p.categoryNames.some(
        (c) =>
          c.toLowerCase() === handle.toLowerCase() ||
          c.toLowerCase().replace(/\s+/g, "-") === handle.toLowerCase()
      )
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
          Department
        </Link>
        <span>/</span>
        <span className="text-brand-primary font-medium">{currentCategory.name}</span>
      </nav>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 bg-brand-primary text-white overflow-hidden border border-brand-border">
        <Image
          src={currentCategory.image || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80"}
          alt={currentCategory.name}
          fill
          className="object-cover object-center opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary via-brand-primary/80 to-transparent" />
        <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 max-w-xl space-y-2 z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">
            Department Catalog
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-grey-30 leading-relaxed">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-3 text-xs text-grey-50">
          <span>
            Showing <strong>{productsInCategory.length}</strong> garments in {currentCategory.name}
          </span>
          <Link
            href="/shop"
            className="text-brand-primary hover:text-brand-accent font-semibold uppercase tracking-wider"
          >
            Browse All Clothing →
          </Link>
        </div>

        <ProductGrid
          products={productsInCategory}
          emptyMessage={`No garments currently categorized under "${currentCategory.name}".`}
        />
      </div>
    </div>
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Department...</div>}>
      <CategoryContent />
    </Suspense>
  )
}
