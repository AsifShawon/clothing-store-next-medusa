"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import { useDemoCart, useDemoCustomer, useDemoOrders, useDemoStore } from "@lib/demo-store-context"
import { CheckoutView, SparklesIcon } from "@dtc/storefront-ui"
import { AddressFormView, DEFAULT_DEMO_CAPABILITIES } from "@dtc/commerce-contracts"
import {
  toAddressFormView,
  toCartItemView,
  toCartTotalsView,
  toShippingMethodView,
} from "../../adapters/local-storage/cart"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, discount, total, appliedPromo, clearCart } = useDemoCart()
  const { customer, isLoggedIn } = useDemoCustomer()
  const { placeOrder } = useDemoOrders()
  const { state, showToast } = useDemoStore()

  const [email, setEmail] = useState("")
  const [shippingAddress, setShippingAddress] = useState<AddressFormView>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "Dhaka",
    postalCode: "1213",
    province: "",
    country: "Bangladesh",
    phone: "",
  })
  const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof AddressFormView, string>>>({})

  const [shippingOptionId, setShippingOptionId] = useState<string>(
    state.shippingOptions[0]?.id || "so_dhaka_inside"
  )
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "test_card" | "mobile_banking">("cod")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // Prepopulate if demo customer is logged in
  useEffect(() => {
    if (isLoggedIn && customer) {
      setEmail(customer.email || "customer@londonboy.uk")
      setShippingAddress(toAddressFormView(customer.defaultAddress || {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
      }))
    }
  }, [isLoggedIn, customer])

  const shippingMethods = useMemo(
    () => state.shippingOptions.map(toShippingMethodView),
    [state.shippingOptions]
  )

  const selectedShipping = state.shippingOptions.find((so) => so.id === shippingOptionId) || state.shippingOptions[0]
  const cartItemViews = useMemo(() => items.map(toCartItemView), [items])
  const cartTotals = useMemo(
    () => toCartTotalsView(subtotal, discount, selectedShipping?.price ?? 60),
    [subtotal, discount, selectedShipping]
  )

  if (items.length === 0) {
    return (
      <div className="content-container py-20 text-center max-w-md mx-auto space-y-4">
        <h1 className="font-display text-3xl text-brand-primary">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-brand-muted">Please add garments to your bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setErrorMessage("")
    const errors: Partial<Record<keyof AddressFormView, string>> = {}

    const firstName = (shippingAddress.firstName || "").trim()
    const lastName = (shippingAddress.lastName || "").trim()
    const phone = (shippingAddress.phone || "").trim()
    const address1 = (shippingAddress.address1 || "").trim()
    const city = (shippingAddress.city || "").trim()

    if (!firstName) errors.firstName = "First name is required"
    if (!lastName) errors.lastName = "Last name is required"
    if (!phone) errors.phone = "Phone number is required for Dhaka courier"
    if (!address1) errors.address1 = "Delivery address is required"
    if (!city) errors.city = "City / District is required"
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please provide a valid email address.")
      return
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors)
      setErrorMessage("Please fill in all required shipping address fields.")
      return
    }

    setIsSubmitting(true)
    try {
      const order = placeOrder({
        customer: {
          firstName,
          lastName,
          email,
          phone,
        },
        shippingAddress: {
          firstName,
          lastName,
          email,
          phone,
          address1,
          address2: shippingAddress.address2 || "",
          city,
          postalCode: shippingAddress.postalCode || "",
          country: "Bangladesh",
        },
        shippingOptionId,
        paymentMethod,
        isGuestOrder: !isLoggedIn,
      })

      showToast("Order Placed", `Order #${order.displayId} confirmed!`, "success")
      router.push(`/order?id=${order.id}`)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to place order. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <CheckoutView
      email={email}
      onEmailChange={setEmail}
      shippingAddress={shippingAddress}
      onShippingAddressChange={setShippingAddress}
      addressErrors={addressErrors}
      shippingMethods={shippingMethods}
      selectedShippingMethodId={shippingOptionId}
      onSelectShippingMethod={setShippingOptionId}
      paymentSlot={
        <div className="space-y-4">
          <div className="p-3 bg-brand-secondary/60 border border-brand-border text-xs flex items-center gap-2 text-brand-primary">
            <SparklesIcon className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Portfolio Demo Mode: Transactions are safely simulated in browser localStorage. No real funds are charged.</span>
          </div>

          <div className="space-y-3">
            <label className={clsx("flex items-start gap-3 p-4 border cursor-pointer transition-colors", paymentMethod === "cod" ? "border-brand-primary bg-white ring-1 ring-brand-primary" : "border-brand-border bg-white hover:border-brand-primary/60")}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-heading font-bold text-xs text-brand-primary">Cash on Delivery (Dhaka &amp; Nationwide)</span>
                <p className="text-[11px] text-brand-muted">Pay with physical cash when the courier hands over your parcel.</p>
              </div>
            </label>

            <label className={clsx("flex items-start gap-3 p-4 border cursor-pointer transition-colors", paymentMethod === "test_card" ? "border-brand-primary bg-white ring-1 ring-brand-primary" : "border-brand-border bg-white hover:border-brand-primary/60")}>
              <input
                type="radio"
                name="paymentMethod"
                value="test_card"
                checked={paymentMethod === "test_card"}
                onChange={() => setPaymentMethod("test_card")}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-heading font-bold text-xs text-brand-primary">Simulated Visa / Mastercard</span>
                <p className="text-[11px] text-brand-muted">Test instant card authorization simulation.</p>
              </div>
            </label>

            <label className={clsx("flex items-start gap-3 p-4 border cursor-pointer transition-colors", paymentMethod === "mobile_banking" ? "border-brand-primary bg-white ring-1 ring-brand-primary" : "border-brand-border bg-white hover:border-brand-primary/60")}>
              <input
                type="radio"
                name="paymentMethod"
                value="mobile_banking"
                checked={paymentMethod === "mobile_banking"}
                onChange={() => setPaymentMethod("mobile_banking")}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <span className="font-heading font-bold text-xs text-brand-primary">Simulated bKash / Nagad Mobile Banking</span>
                <p className="text-[11px] text-brand-muted">Simulate mobile financial service checkout.</p>
              </div>
            </label>
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-700 font-medium pt-2">{errorMessage}</p>
          )}
        </div>
      }
      items={cartItemViews}
      totals={cartTotals}
      promotions={appliedPromo ? [{ code: appliedPromo.code }] : []}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      onPlaceOrder={handlePlaceOrder}
      isPlacingOrder={isSubmitting}
      linkComponent={Link}
    />
  )
}
