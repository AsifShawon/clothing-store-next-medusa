"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  AddressFormView,
  DEFAULT_MEDUSA_CAPABILITIES,
} from "@dtc/commerce-contracts"
import { CheckoutView } from "@dtc/storefront-ui"
import { placeOrder, setShippingMethod } from "@lib/data/cart"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentWrapper from "../payment-wrapper"
import Payment from "../payment"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"
import {
  toAddressFormView,
  toCartItemView,
  toCartTotalsView,
  toShippingMethodView,
} from "../../../../adapters/medusa/cart"

interface MedusaCheckoutClientProps {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreCartShippingOption[]
  availablePaymentMethods: { id: string }[]
  countryCode: string
}

export default function MedusaCheckoutClient({
  cart,
  customer,
  availableShippingMethods,
  availablePaymentMethods,
  countryCode,
}: MedusaCheckoutClientProps) {
  const routes = createMedusaRoutes(countryCode)
  const currencyCode = cart.currency_code || "bdt"

  const [email, setEmail] = useState(cart.email || customer?.email || "")
  const [shippingAddress, setShippingAddress] = useState<AddressFormView>(
    toAddressFormView(cart.shipping_address)
  )
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<string | undefined>(
    cart.shipping_methods?.[0]?.shipping_option_id || availableShippingMethods[0]?.id
  )
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [addressErrors] = useState<Record<string, string>>({})

  const items = (cart.items || []).map((item) => toCartItemView(item, currencyCode))
  const totals = toCartTotalsView(cart, currencyCode)
  const shippingMethods = (availableShippingMethods || []).map((method) =>
    toShippingMethodView(method, currencyCode)
  )

  const handleSelectShippingMethod = async (id: string) => {
    setSelectedShippingMethodId(id)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (error) {
      console.error("Failed to select shipping method:", error)
    }
  }

  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true)
      await placeOrder(cart.id)
    } catch (error) {
      console.error("Failed to place order:", error)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const paymentSlot = (
    <PaymentWrapper cart={cart}>
      <Payment cart={cart} availablePaymentMethods={availablePaymentMethods} />
    </PaymentWrapper>
  )

  return (
    <CheckoutView
      email={email}
      onEmailChange={setEmail}
      shippingAddress={shippingAddress}
      onShippingAddressChange={setShippingAddress}
      addressErrors={addressErrors}
      shippingMethods={shippingMethods}
      selectedShippingMethodId={selectedShippingMethodId}
      onSelectShippingMethod={handleSelectShippingMethod}
      paymentSlot={paymentSlot}
      items={items}
      totals={totals}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      onPlaceOrder={handlePlaceOrder}
      isPlacingOrder={isPlacingOrder}
      linkComponent={LocalizedClientLink}
    />
  )
}
