"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ResetDemoModal } from "./reset-demo-modal"
import { ArrowPath, Check, Envelope } from "@medusajs/icons"

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

  return (
    <footer className="bg-brand-primary text-brand-secondary border-t border-brand-primary/80 mt-auto">
      {/* Top Value Strip */}
      <div className="border-b border-white/10 py-10 bg-[#0c0c0c]">
        <div className="content-container grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              240 GSM Combed Compact Cotton
            </h4>
            <p className="text-xs text-grey-40">
              Heavyweight architectural structure designed for long-lasting drape and softness.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Dhaka Express Fulfillment (24-48h)
            </h4>
            <p className="text-xs text-grey-40">
              Direct dispatch from our Tejgaon fulfillment hub with nationwide courier coverage.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              24-Hour Size Exchange
            </h4>
            <p className="text-xs text-grey-40">
              Guaranteed size exchanges within 24 hours of parcel delivery inside Dhaka.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="content-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-display text-2xl tracking-tight text-white uppercase">
                London Boy
              </span>
              <span className="text-[10px] font-sans font-semibold tracking-widest text-grey-40 uppercase block">
                British Tailoring • Dhaka
              </span>
            </Link>
            <p className="text-xs text-grey-40 leading-relaxed max-w-sm">
              Contemporary British smart-casual clothing crafted with high-density natural fabrics, engineered specifically for modern daily wear in Bangladesh.
            </p>

            {/* Newsletter Simulation */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white block">
                Join the London Boy Society
              </span>
              <p className="text-xs text-grey-40">
                Receive private access to capsule drops and enjoy 10% off your first order.
              </p>

              {isSubscribed ? (
                <div className="p-3 bg-brand-accent/20 border border-brand-accent text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Welcome! Use code <strong>LONDON10</strong> at checkout for 10% off.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Envelope className="w-4 h-4 text-grey-50 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/20 text-xs text-white placeholder:text-grey-50 focus:outline-none focus:border-brand-accent"
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
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              Catalog
            </h5>
            <ul className="space-y-2.5 text-xs text-grey-40">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Garments
                </Link>
              </li>
              <li>
                <Link href="/collection?handle=new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category?handle=men" className="hover:text-white transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category?handle=women" className="hover:text-white transition-colors">
                  Women&apos;s Linen
                </Link>
              </li>
              <li>
                <Link href="/collection?handle=essentials" className="hover:text-white transition-colors">
                  Wardrobe Essentials
                </Link>
              </li>
              <li>
                <Link href="/category?handle=accessories" className="hover:text-white transition-colors">
                  Caps & Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-4">
            <h5 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-grey-40">
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Measurement Guide
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-white transition-colors">
                  Shipping & Rates
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Care Team
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Account Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Demonstration Controls */}
          <div className="md:col-span-3 space-y-4">
            <h5 className="font-heading font-bold text-xs uppercase tracking-widest text-white">
              Portfolio Demonstration
            </h5>
            <div className="p-3.5 bg-white/5 border border-white/10 rounded space-y-2 text-xs text-grey-40">
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
                  onClick={() => setIsResetOpen(true)}
                  className="text-left text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1 mt-1 transition-colors"
                >
                  <ArrowPath className="w-3.5 h-3.5" />
                  <span>Reset Demo Store Data</span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-grey-50">
                <li>
                  <Link href="/privacy-policy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-and-conditions" className="hover:text-white">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-grey-50">
          <div>
            © {new Date().getFullYear()} London Boy Clothing. Designed in UK, tailored in Bangladesh.
          </div>
          <div className="text-[11px] text-grey-40">
            Portfolio Demo • Zero Server Dependencies
          </div>
        </div>
      </div>

      <ResetDemoModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </footer>
  )
}
