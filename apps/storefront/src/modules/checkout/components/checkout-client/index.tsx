"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  AddressFormView,
  DEFAULT_MEDUSA_CAPABILITIES,
} from "@dtc/commerce-contracts"
import { CheckoutView } from "@dtc/storefront-ui"
import {
  initiatePaymentSession,
  placeOrder,
  setShippingMethod,
  updateCart,
} from "@lib/data/cart"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { getErrorMessage } from "@lib/util/get-error-message"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentWrapper from "../payment-wrapper"
import Payment from "../payment"
import PaymentButton from "../payment-button"
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
  const [currentCart, setCurrentCart] = useState<HttpTypes.StoreCart>(cart)
  const currencyCode = currentCart.currency_code || "bdt"

  const [email, setEmail] = useState(
    currentCart.email || customer?.email || ""
  )
  const [shippingAddress, setShippingAddress] = useState<AddressFormView>(
    toAddressFormView(currentCart.shipping_address)
  )
  const [shippingOptions, setShippingOptions] = useState<
    HttpTypes.StoreCartShippingOption[]
  >(availableShippingMethods)
  const [selectedShippingMethodId, setSelectedShippingMethodId] = useState<
    string | undefined
  >(
    currentCart.shipping_methods?.at(-1)?.shipping_option_id ||
      availableShippingMethods[0]?.id
  )
  const [selectedPaymentProviderId, setSelectedPaymentProviderId] = useState<
    string
  >(
    currentCart.payment_collection?.payment_sessions?.find(
      (s) => s.status === "pending"
    )?.provider_id || availablePaymentMethods[0]?.id || ""
  )

  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isSelectingShipping, setIsSelectingShipping] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})

  // Progressive Step Gating
  const hasSavedAddress = Boolean(
    currentCart.shipping_address?.address_1 &&
    currentCart.shipping_address?.first_name &&
    currentCart.email
  )
  const hasSelectedShipping = Boolean(
    currentCart.shipping_methods && currentCart.shipping_methods.length > 0
  )
  const hasPaymentSession = Boolean(
    currentCart.payment_collection?.payment_sessions &&
    currentCart.payment_collection.payment_sessions.length > 0
  )

  const items = (currentCart.items || []).map((item) =>
    toCartItemView(item, currencyCode)
  )
  const totals = toCartTotalsView(currentCart, currencyCode)
  const shippingMethods = (shippingOptions || []).map((method) =>
    toShippingMethodView(method, currencyCode)
  )

  // Step 2 Action: Save Contact & Address to Medusa Cart
  const handleSaveContactAndAddress = async (
    addr: AddressFormView,
    mail: string
  ) => {
    setCheckoutError(null)
    const errors: Record<string, string> = {}

    if (!addr.firstName?.trim()) errors.firstName = "First name is required"
    if (!addr.lastName?.trim()) errors.lastName = "Last name is required"
    if (!addr.phone?.trim())
      errors.phone = "Phone number is required for courier delivery"
    if (!addr.address1?.trim()) errors.address1 = "Delivery address is required"
    if (!addr.city?.trim()) errors.city = "City / District is required"
    if (!mail?.trim() || !mail.includes("@"))
      errors.email = "Valid email address is required"

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors)
      setCheckoutError("Please fill in all required contact and address fields.")
      return
    }

    setAddressErrors({})
    setIsSavingAddress(true)

    try {
      // Must map country to valid 2-letter ISO code supported by cart region
      const isoCountryCode = (countryCode || "bd").toLowerCase()
      const updated = await updateCart({
        email: mail.trim().toLowerCase(),
        shipping_address: {
          first_name: addr.firstName.trim(),
          last_name: addr.lastName.trim(),
          address_1: addr.address1.trim(),
          address_2: addr.address2?.trim() || "",
          city: addr.city.trim(),
          country_code: isoCountryCode,
          postal_code: addr.postalCode?.trim() || "",
          province: addr.province?.trim() || "",
          phone: addr.phone?.trim() || "",
        },
        billing_address: {
          first_name: addr.firstName.trim(),
          last_name: addr.lastName.trim(),
          address_1: addr.address1.trim(),
          address_2: addr.address2?.trim() || "",
          city: addr.city.trim(),
          country_code: isoCountryCode,
          postal_code: addr.postalCode?.trim() || "",
          province: addr.province?.trim() || "",
          phone: addr.phone?.trim() || "",
        },
      })

      if (updated) {
        setCurrentCart(updated)
      }

      // Refresh fulfillment options for saved shipping destination
      const freshMethods = await listCartShippingMethods(currentCart.id).catch(
        () => []
      )
      if (freshMethods && freshMethods.length > 0) {
        setShippingOptions(freshMethods)
      }
    } catch (err: unknown) {
      setCheckoutError(getErrorMessage(err))
    } finally {
      setIsSavingAddress(false)
    }
  }

  // Step 3 Action: Select Shipping Method
  const handleSelectShippingMethod = async (id: string) => {
    if (!hasSavedAddress) {
      setCheckoutError("Please save your shipping address first.")
      return
    }

    setCheckoutError(null)
    setIsSelectingShipping(true)
    setSelectedShippingMethodId(id)

    try {
      const updated = await setShippingMethod({
        cartId: currentCart.id,
        shippingMethodId: id,
      })

      if (updated) {
        setCurrentCart(updated)
      }

      // When shipping changes, initialize payment session if method chosen
      if (selectedPaymentProviderId) {
        await initiatePaymentSession(updated || currentCart, {
          provider_id: selectedPaymentProviderId,
        }).catch(() => undefined)
      }
    } catch (err: unknown) {
      setCheckoutError(getErrorMessage(err))
    } finally {
      setIsSelectingShipping(false)
    }
  }

  // Step 4 Action: Select Payment Provider
  const handleSelectPaymentMethod = async (providerId: string) => {
    setSelectedPaymentProviderId(providerId)
    setCheckoutError(null)

    try {
      await initiatePaymentSession(currentCart, {
        provider_id: providerId,
      })
    } catch (err: unknown) {
      setCheckoutError(getErrorMessage(err))
    }
  }

  // Step 5 Action: Fallback manual place order
  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return
    setIsPlacingOrder(true)
    setCheckoutError(null)

    try {
      await placeOrder(currentCart.id)
    } catch (err: unknown) {
      setCheckoutError(getErrorMessage(err))
      setIsPlacingOrder(false)
    }
  }

  // Provider Payment Slot (Step 4)
  const paymentSlot = (
    <PaymentWrapper cart={currentCart}>
      <Payment
        cart={currentCart}
        availablePaymentMethods={availablePaymentMethods}
        hideSubmitButton={true}
        isOpen={true}
        onPaymentMethodChange={handleSelectPaymentMethod}
      />
    </PaymentWrapper>
  )

  // Single Operational Final Order Button (Step 5)
  const submitButtonSlot = (
    <PaymentWrapper cart={currentCart}>
      <PaymentButton cart={currentCart} data-testid="submit-order-button" />
    </PaymentWrapper>
  )

  return (
    <CheckoutView
      email={email}
      onEmailChange={setEmail}
      shippingAddress={shippingAddress}
      onShippingAddressChange={setShippingAddress}
      addressErrors={addressErrors}
      onSaveContactAndAddress={handleSaveContactAndAddress}
      isSavingAddress={isSavingAddress}
      canContinueToShipping={hasSavedAddress}
      shippingMethods={shippingMethods}
      selectedShippingMethodId={selectedShippingMethodId}
      onSelectShippingMethod={handleSelectShippingMethod}
      isSelectingShipping={isSelectingShipping}
      canContinueToPayment={hasSavedAddress && hasSelectedShipping}
      selectedPaymentMethodId={selectedPaymentProviderId}
      onSelectPaymentMethod={handleSelectPaymentMethod}
      paymentSlot={paymentSlot}
      items={items}
      totals={totals}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      checkoutError={checkoutError}
      onPlaceOrder={handlePlaceOrder}
      isPlacingOrder={isPlacingOrder}
      canPlaceOrder={hasSavedAddress && hasSelectedShipping && hasPaymentSession}
      submitButtonSlot={submitButtonSlot}
      linkComponent={LocalizedClientLink}
    />
  )
}
