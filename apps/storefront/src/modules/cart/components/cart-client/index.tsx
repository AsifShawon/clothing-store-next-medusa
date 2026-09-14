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
  const [cartError, setCartError] = useState<string | null>(null)
  const [activeMutationId, setActiveMutationId] = useState<string | null>(null)

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    if (activeMutationId) {
      return
    }

    setActiveMutationId(lineId)
    setCartError(null)

    try {
      await updateLineItem({ lineId, quantity })
      router.refresh()
    } catch (error: unknown) {
      const msg = getErrorMessage(error)
      setCartError(`Unable to update quantity: ${msg}`)
      console.error("Error updating quantity:", msg)
    } finally {
      setActiveMutationId(null)
    }
  }

  const handleRemoveItem = async (lineId: string) => {
    if (activeMutationId) {
      return
    }

    setActiveMutationId(lineId)
    setCartError(null)

    try {
      await deleteLineItem(lineId)
      router.refresh()
    } catch (error: unknown) {
      const msg = getErrorMessage(error)
      setCartError(`Unable to remove item: ${msg}`)
      console.error("Error removing item:", msg)
    } finally {
      setActiveMutationId(null)
    }
  }

  const handleApplyPromoCode = async (code: string) => {
    try {
      setPromoError(undefined)
      setCartError(null)
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
    <div>
      {cartError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between"
        >
          <span>{cartError}</span>
          <button
            type="button"
            onClick={() => setCartError(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-2"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
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
    </div>
  )
}
