"use client"

import React from "react"
import Link from "next/link"
import { DemoProduct } from "@lib/types"
import { ProductCard as SharedProductCard } from "@dtc/storefront-ui"
import { toProductView } from "../../adapters/local-storage/catalog"
import { DEFAULT_DEMO_CAPABILITIES } from "@dtc/commerce-contracts"

interface ProductCardProps {
  product: DemoProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const productView = toProductView(product)

  return (
    <SharedProductCard
      product={productView}
      href={`/product?handle=${product.handle}`}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      linkComponent={Link}
    />
  )
}
