"use client"

import React, { useMemo, useState } from "react"
import {
  DEFAULT_MEDUSA_CAPABILITIES,
  ProductView,
} from "@dtc/commerce-contracts"
import { ProductDetailView } from "@dtc/storefront-ui"
import { addToCart } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

interface MedusaProductDetailClientProps {
  product: ProductView
  countryCode: string
  children?: React.ReactNode
}

export default function MedusaProductDetailClient({
  product,
  countryCode,
  children,
}: MedusaProductDetailClientProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    return product.variants[0]?.options || {}
  })
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const routes = createMedusaRoutes(countryCode)

  const handleSelectOption = (title: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [title.toLowerCase()]: value,
    }))
  }

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((v) => {
        return Object.entries(selectedOptions).every(
          ([optKey, optVal]) =>
            v.options[optKey.toLowerCase()]?.toLowerCase() === optVal.toLowerCase()
        )
      }) || product.variants[0]
    )
  }, [product.variants, selectedOptions])

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    try {
      setIsAdding(true)
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })
    } catch (error) {
      console.error("Failed to add to bag:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <ProductDetailView
      product={product}
      selectedOptions={selectedOptions}
      onSelectOption={handleSelectOption}
      selectedVariant={selectedVariant}
      quantity={quantity}
      onQuantityChange={setQuantity}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAdding}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    >
      {children}
    </ProductDetailView>
  )
}
