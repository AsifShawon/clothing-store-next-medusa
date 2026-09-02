"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useDemoCart, useDemoCustomer, useDemoOrders, useDemoStore } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { CheckoutNotice } from "@components/store/checkout-notice"
import {
  ShieldCheck,
  TruckFast,
  CreditCard,
  Cash,
  ArrowRight,
  Check,
  User,
  ExclamationCircle,
  XMark,
  ArrowPath,
} from "@medusajs/icons"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, discount, total, appliedPromo } = useDemoCart()
  const { customer, isLoggedIn, loginAsDemoCustomer } = useDemoCustomer()
  const { placeOrder } = useDemoOrders()
  const { state, showToast } = useDemoStore()

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
  })

  const [shippingOptionId, setShippingOptionId] = useState<string>(
    state.shippingOptions[0]?.id || "so_dhaka_inside"
  )
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "test_card" | "mobile_banking">("cod")
  const [mobileProvider, setMobileProvider] = useState<"bKash" | "Nagad">("bKash")
  const [notes, setNotes] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [paymentFailedModal, setPaymentFailedModal] = useState(false)

  // Sync logged in demo customer details
  useEffect(() => {
    if (isLoggedIn && customer) {
      setFormData({
        firstName: customer.firstName || "Asif",
        lastName: customer.lastName || "Shawon",
        email: customer.email || "customer@londonboy.uk",
        phone: customer.phone || "+880 1712 345678",
        address1: customer.defaultAddress?.address1 || "Road 11, Block D, Banani",
        address2: customer.defaultAddress?.address2 || "Apartment 4B",
        city: customer.defaultAddress?.city || "Dhaka",
        postalCode: customer.defaultAddress?.postalCode || "1213",
        country: "Bangladesh",
      })
    }
  }, [isLoggedIn, customer])

  const selectedShipping =
    state.shippingOptions.find((so) => so.id === shippingOptionId) || state.shippingOptions[0]
  const grandTotal = total + (selectedShipping ? selectedShipping.price : 60)

  if (items.length === 0) {
    return (
      <div className="content-container py-20 text-center max-w-md mx-auto space-y-4">
        <h1 className="font-display text-3xl text-brand-primary">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-grey-50">Please add garments to your bag before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
        >
          Browse Catalog
        </Link>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = async (simulateFailure = false) => {
    setErrorMessage("")

    // Basic Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Please enter both your first and last name.")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.")
      return
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a contact phone number for Bangladesh courier delivery.")
      return
    }
    if (!formData.address1.trim()) {
      setErrorMessage("Please provide a full delivery street address.")
      return
    }

    if (simulateFailure) {
      setPaymentFailedModal(true)
      return
    }

    setIsSubmitting(true)

    try {
      // Build simulated payment details
      let paymentDetails = undefined
      if (paymentMethod === "test_card") {
        paymentDetails = {
          simulatedMethod: "Demo Visa/Mastercard (Simulated Authorization)",
          transactionReference: `SIM-CARD-${Math.floor(100000 + Math.random() * 900000)}`,
        }
      } else if (paymentMethod === "mobile_banking") {
        paymentDetails = {
          simulatedMethod: `Demo ${mobileProvider} Mobile Banking (Simulated)`,
          transactionReference: `TRX-${mobileProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
        }
      } else {
        paymentDetails = {
          simulatedMethod: "Cash on Delivery (Pending Courier Collection)",
        }
      }

      const order = placeOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        shippingOptionId,
        paymentMethod,
        paymentDetails,
        isGuestOrder: !isLoggedIn,
        notes,
      })

      showToast("Order Placed Successfully", `Order ${order.displayId} confirmed`, "success")
      router.push(`/order?id=${order.id}`)
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to place order. Please check item stock.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-container py-10 sm:py-16 space-y-8 max-w-6xl">
      {/* Permanent Notice */}
      <CheckoutNotice />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: 5-Step Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer Contact & One-Click Login */}
          <div className="bg-white border border-brand-border p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                  Contact Information
                </h2>
              </div>

              {!isLoggedIn ? (
                <button
                  type="button"
                  onClick={loginAsDemoCustomer}
                  className="px-3 py-1.5 bg-brand-secondary border border-brand-border text-xs font-semibold text-brand-accent hover:bg-brand-sand flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>1-Click Demo Customer</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Logged In as Demo Customer</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-primary">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. Asif"
                  required
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-primary">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Shawon"
                  required
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-primary">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. customer@londonboy.uk"
                  required
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-brand-primary">Phone Number (Bangladesh) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+880 1712 345678"
                  required
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div className="bg-white border border-brand-border p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                Delivery Address in Bangladesh
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-brand-primary">Street Address / House / Road *</label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="House 24, Road 11, Block D, Banani"
                  required
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-brand-primary">Apartment / Suite (Optional)</label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-primary">City / District *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    required
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-brand-primary">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="1213"
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Options */}
          <div className="bg-white border border-brand-border p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                Delivery Zone & Timing
              </h2>
            </div>

            <div className="space-y-3">
              {state.shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                    shippingOptionId === opt.id
                      ? "border-brand-primary bg-brand-secondary/60 ring-1 ring-brand-primary"
                      : "border-brand-border bg-white hover:bg-brand-surface"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={shippingOptionId === opt.id}
                      onChange={() => setShippingOptionId(opt.id)}
                      className="mt-0.5 text-brand-accent focus:ring-brand-accent"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-brand-primary block">{opt.name}</span>
                      <p className="text-[11px] text-grey-50">{opt.description}</p>
                      <span className="text-[10px] text-brand-accent font-semibold block">
                        Estimated: {opt.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-brand-primary font-mono">
                    {formatBDT(opt.price)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Step 4: Simulated Payment Options */}
          <div className="bg-white border border-brand-border p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                Simulated Payment Mode
              </h2>
            </div>

            <div className="space-y-3">
              {/* COD Option */}
              <label
                className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "border-brand-primary bg-brand-secondary/60 ring-1 ring-brand-primary"
                    : "border-brand-border bg-white hover:bg-brand-surface"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 text-brand-accent focus:ring-brand-accent"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-primary">
                    <Cash className="w-4 h-4 text-brand-accent" />
                    <span>Cash on Delivery (COD)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                      Standard
                    </span>
                  </div>
                  <p className="text-[11px] text-grey-50">
                    Pay upon parcel delivery across all 64 districts in Bangladesh.
                  </p>
                </div>
              </label>

              {/* Demo Card Option */}
              <label
                className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                  paymentMethod === "test_card"
                    ? "border-brand-primary bg-brand-secondary/60 ring-1 ring-brand-primary"
                    : "border-brand-border bg-white hover:bg-brand-surface"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "test_card"}
                  onChange={() => setPaymentMethod("test_card")}
                  className="mt-1 text-brand-accent focus:ring-brand-accent"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-brand-primary">
                    <CreditCard className="w-4 h-4 text-brand-accent" />
                    <span>Demo Card (Simulated Instant Approval)</span>
                  </div>
                  <p className="text-[11px] text-grey-50">
                    Simulates credit/debit card authorization with zero card inputs required.
                  </p>
                </div>
              </label>

              {/* Demo Mobile Banking (bKash / Nagad) */}
              <label
                className={`flex items-start gap-3 p-4 border rounded cursor-pointer transition-colors ${
                  paymentMethod === "mobile_banking"
                    ? "border-brand-primary bg-brand-secondary/60 ring-1 ring-brand-primary"
                    : "border-brand-border bg-white hover:bg-brand-surface"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "mobile_banking"}
                  onChange={() => setPaymentMethod("mobile_banking")}
                  className="mt-1 text-brand-accent focus:ring-brand-accent"
                />
                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xs text-brand-primary">
                      <TruckFast className="w-4 h-4 text-brand-accent" />
                      <span>Demo Mobile Banking (bKash / Nagad)</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-grey-50">
                    Simulated wallet transaction generated on order confirmation.
                  </p>
                  {paymentMethod === "mobile_banking" && (
                    <div className="pt-2 flex items-center gap-3">
                      {(["bKash", "Nagad"] as const).map((prov) => (
                        <button
                          key={prov}
                          type="button"
                          onClick={() => setMobileProvider(prov)}
                          className={`px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                            mobileProvider === prov
                              ? "bg-brand-primary text-white border-brand-primary"
                              : "bg-white text-grey-70 border-brand-border"
                          }`}
                        >
                          {prov} Wallet
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Special simulation test buttons */}
            {paymentMethod === "test_card" && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-2 text-xs text-amber-900">
                <span className="font-bold block">Portfolio Payment Simulation Actions:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(false)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-emerald-700 text-white font-semibold hover:bg-emerald-800 transition-colors"
                  >
                    Simulate Successful Card Authorization
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmitOrder(true)}
                    disabled={isSubmitting}
                    className="px-3 py-1.5 bg-rose-700 text-white font-semibold hover:bg-rose-800 transition-colors"
                  >
                    Simulate Card Payment Failure
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 5: Notes & Submit */}
          <div className="bg-white border border-brand-border p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-brand-border pb-3">
              <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                Special Delivery Instructions
              </h2>
            </div>

            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please ring bell upon arrival, leave at reception..."
              rows={2}
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-primary"
            />

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded">
                <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => handleSubmitOrder(false)}
              disabled={isSubmitting}
              className={`w-full py-4 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-brand-accent transition-all shadow-lg ${
                isSubmitting ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span>Placing Demo Order...</span>
              ) : (
                <>
                  <span>Confirm & Place Order ({formatBDT(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 bg-brand-surface border border-brand-border p-6 space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
              Order Summary
            </h3>
            <span className="text-xs text-grey-50">{items.reduce((s, i) => s + i.quantity, 0)} Items</span>
          </div>

          {/* Mini Items List */}
          <div className="divide-y divide-brand-border max-h-60 overflow-y-auto space-y-3">
            {items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-3 items-center">
                <div className="relative w-14 h-16 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                  <Image src={item.thumbnail} alt={item.productTitle} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <h4 className="font-bold text-brand-primary truncate">{item.productTitle}</h4>
                  <p className="text-[11px] text-grey-50">
                    {item.variantTitle} × {item.quantity}
                  </p>
                  <p className="font-mono text-[10px] text-grey-40">SKU: {item.sku}</p>
                </div>
                <span className="text-xs font-bold text-brand-primary font-mono">
                  {formatBDT(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-grey-70 pt-4 border-t border-brand-border">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-brand-primary">{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-accent font-semibold">
                <span>Promo Discount ({appliedPromo?.code})</span>
                <span>-{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee ({selectedShipping?.name})</span>
              <span className="font-semibold text-brand-primary">{formatBDT(selectedShipping.price)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-brand-primary pt-3 border-t border-brand-border">
              <span>Total Payable (BDT)</span>
              <span>{formatBDT(grandTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-brand-secondary rounded text-[11px] text-grey-60 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-brand-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-accent" />
              <span>Simulated Order Security</span>
            </div>
            <p>
              Order updates will sync locally to the Demo Admin panel with instant inventory adjustments.
            </p>
          </div>
        </div>
      </div>

      {/* Simulated Payment Failure Modal */}
      {paymentFailedModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment Simulation Error"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPaymentFailedModal(false)}
          />
          <div className="relative bg-white border border-rose-200 p-6 max-w-md w-full shadow-2xl space-y-4 z-10 animate-enter">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-base">
                <ExclamationCircle className="w-5 h-5" />
                <span>Simulated Payment Declined</span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentFailedModal(false)}
                className="text-grey-40 hover:text-brand-primary p-1"
              >
                <XMark className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-grey-70 leading-relaxed">
              This is a simulated payment failure demonstration. Your cart and entered address have been preserved. You can retry with another simulated payment mode or select Cash on Delivery.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentFailedModal(false)
                  setPaymentMethod("cod")
                }}
                className="flex-1 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
              >
                Switch to Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => setPaymentFailedModal(false)}
                className="px-4 py-2 bg-brand-secondary border border-brand-border text-xs font-semibold text-brand-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
