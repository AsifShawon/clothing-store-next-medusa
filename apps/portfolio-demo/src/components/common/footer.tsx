"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ResetDemoModal } from "./reset-demo-modal"
import { Footer as SharedFooter, ArrowPathIcon, CheckIcon, EnvelopeIcon } from "@dtc/storefront-ui"

export function StorefrontFooter() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)

  // Don't render storefront footer in admin routes
  if (pathname?.startsWith("/demo-admin")) {
    return null
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return
    setIsSubscribed(true)
  }

  const categories = [
    { label: "All Clothing", href: "/shop" },
    { label: "Men's Collection", href: "/category?handle=men" },
    { label: "Women's Linen", href: "/category?handle=women" },
    { label: "Caps & Accessories", href: "/category?handle=accessories" },
  ]

  const collections = [
    { label: "New Arrivals", href: "/collection?handle=new-arrivals" },
    { label: "Best Sellers", href: "/collection?handle=best-sellers" },
    { label: "The Essentials Edit", href: "/collection?handle=essentials" },
  ]

  const customerCareLinks = [
    { label: "Size & Fit Guide", href: "/size-guide" },
    { label: "Frequently Asked Questions (FAQ)", href: "/faq" },
    { label: "About London Boy", href: "/about" },
    { label: "Contact Care Team", href: "/contact" },
    { label: "Shipping & Delivery Rates", href: "/shipping-policy" },
    { label: "24h Return Policy", href: "/return-policy" },
    { label: "Account Portal", href: "/account" },
  ]

  return (
    <>
      <SharedFooter
        homeHref="/"
        categories={categories}
        collections={collections}
        customerCareLinks={customerCareLinks}
        linkComponent={Link}
        customControlsSlot={
          <div className="space-y-4 pt-2">
            {/* Newsletter Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                Join the London Boy Society
              </span>
              <p className="text-xs text-brand-muted">
                Receive private access to capsule drops and enjoy 10% off your first order.
              </p>

              {isSubscribed ? (
                <div className="p-3 bg-brand-accent/20 border border-brand-accent text-emerald-300 text-xs flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Welcome! Use code <strong>LONDON10</strong> at checkout for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <EnvelopeIcon className="w-4 h-4 text-brand-muted/70 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/20 text-xs text-white placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>

            {/* Demonstration Controls */}
            <div className="p-3.5 bg-white/5 border border-white/10 space-y-2 text-xs text-brand-muted">
              <p className="text-[11px] leading-relaxed">
                This is a standalone, browser-only portfolio demonstration running via client-side LocalStorage.
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <Link
                  href="/demo-admin"
                  className="text-xs text-brand-secondary underline underline-offset-4 hover:text-white font-medium"
                >
                  Explore Demo Admin Panel →
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("lb:reopen-demo-banner"))
                    }
                  }}
                  className="text-left text-xs text-brand-sand/80 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Reopen Demo Notice Banner
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="text-left text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 mt-1 transition-colors"
                >
                  <ArrowPathIcon className="w-3.5 h-3.5" />
                  <span>Reset Demo Store Data</span>
                </button>
              </div>
            </div>
          </div>
        }
      />

      <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </>
  )
}
