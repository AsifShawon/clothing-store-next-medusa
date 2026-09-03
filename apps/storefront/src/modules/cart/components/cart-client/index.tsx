"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  CartView as CartModel,
  createMoneyView,
  DEFAULT_MEDUSA_CAPABILITIES,
} from "@dtc/commerce-contracts"
import { CartView } from "@dtc/storefront-ui"
import { applyPromotions, deleteLineItem, updateLineItem } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

import { getErrorMessage } from "@lib/util/get-error-message"

interface MedusaCartClientProps {
  cart: CartModel | null
}

export default function MedusaCartClient({ cart }: MedusaCartClientProps) {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"
  const routes = createMedusaRoutes(countryCode)

  const [promoError, setPromoError] = useState<string | undefined>()

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    try {
      await updateLineItem({ lineId, quantity })
      router.refresh()
    } catch (error: unknown) {
      console.error("Error updating quantity:", getErrorMessage(error))
    }
  }

  const handleRemoveItem = async (lineId: string) => {
    try {
      await deleteLineItem(lineId)
      router.refresh()
    } catch (error: unknown) {
      console.error("Error removing item:", getErrorMessage(error))
    }
  }

  const handleApplyPromoCode = async (code: string) => {
    try {
      setPromoError(undefined)
      await applyPromotions([code])
      router.refresh()
      return true
    } catch (error: unknown) {
      setPromoError(getErrorMessage(error))
      return false
    }
  }


  const resolvedCart: CartModel = cart || {
    id: "empty",
    items: [],
    itemsCount: 0,
    totals: {
      subtotal: createMoneyView(0, "bdt"),
      total: createMoneyView(0, "bdt"),
    },
    appliedPromotions: [],
    currencyCode: "bdt",
  }

  return (
    <CartView
      cart={resolvedCart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onApplyPromoCode={handleApplyPromoCode}
      promoError={promoError}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    />
  )
}
