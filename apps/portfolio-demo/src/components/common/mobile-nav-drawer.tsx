"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import {
  XMark,
  MagnifyingGlass,
  User,
  ShoppingBag,
  BuildingStorefront,
  ArrowPath,
  ArrowRight,
} from "@medusajs/icons"

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenSearch: () => void
  onOpenReset: () => void
  cartCount: number
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  onOpenSearch,
  onOpenReset,
  cartCount,
}: MobileNavDrawerProps) {
  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-4/5 max-w-sm bg-brand-surface h-full shadow-2xl flex flex-col z-10 border-r border-brand-border animate-enter">
        {/* Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-white">
          <Link
            href="/"
            onClick={onClose}
            className="font-display text-xl tracking-tight text-brand-primary uppercase"
          >
            London Boy
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-grey-50 hover:text-brand-primary rounded hover:bg-black/5"
            aria-label="Close menu"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Trigger */}
        <div className="p-4 border-b border-brand-border bg-brand-secondary/50">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenSearch()
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-white border border-brand-border text-xs text-grey-50 hover:text-brand-primary transition-colors text-left"
          >
            <MagnifyingGlass className="w-4 h-4 text-grey-40" />
            <span>Search garments, colors, fabrics...</span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-grey-40 block mb-2 px-2">
              Collections
            </span>
            <nav className="space-y-1">
              <Link
                href="/shop"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>All Clothing</span>
                <ArrowRight className="w-4 h-4 text-grey-40" />
              </Link>
              <Link
                href="/collection?handle=new-arrivals"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>New Arrivals</span>
                <span className="text-[10px] bg-brand-accent text-white px-1.5 py-0.5 rounded font-bold">
                  Fresh
                </span>
              </Link>
              <Link
                href="/category?handle=men"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>Men&apos;s Tailoring</span>
                <ArrowRight className="w-4 h-4 text-grey-40" />
              </Link>
              <Link
                href="/category?handle=women"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>Women&apos;s Linen</span>
                <ArrowRight className="w-4 h-4 text-grey-40" />
              </Link>
              <Link
                href="/collection?handle=essentials"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>Wardrobe Essentials</span>
                <ArrowRight className="w-4 h-4 text-grey-40" />
              </Link>
              <Link
                href="/category?handle=accessories"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <span>Accessories</span>
                <ArrowRight className="w-4 h-4 text-grey-40" />
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-brand-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-grey-40 block mb-2 px-2">
              Customer Portal & Administration
            </span>
            <div className="space-y-1">
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-grey-70 hover:text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <User className="w-4 h-4 text-grey-50" />
                <span>Demo Customer Account</span>
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-grey-70 hover:text-brand-primary hover:bg-brand-secondary rounded transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-grey-50" />
                  <span>Shopping Bag</span>
                </div>
                {cartCount > 0 && (
                  <span className="px-2 py-0.5 bg-brand-primary text-white text-[10px] font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/demo-admin"
                onClick={onClose}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-brand-accent bg-brand-accent/5 hover:bg-brand-accent/10 border border-brand-accent/20 rounded transition-colors"
              >
                <BuildingStorefront className="w-4 h-4 text-brand-accent" />
                <span>Simulated Demo Admin Panel</span>
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border">
            <span className="text-[10px] font-bold uppercase tracking-widest text-grey-40 block mb-2 px-2">
              Brand & Care
            </span>
            <div className="grid grid-cols-2 gap-1 text-xs text-grey-60">
              <Link href="/about" onClick={onClose} className="px-2 py-1.5 hover:text-brand-primary">
                Our Story
              </Link>
              <Link href="/size-guide" onClick={onClose} className="px-2 py-1.5 hover:text-brand-primary">
                Size Guide
              </Link>
              <Link href="/contact" onClick={onClose} className="px-2 py-1.5 hover:text-brand-primary">
                Customer Care
              </Link>
              <Link href="/faq" onClick={onClose} className="px-2 py-1.5 hover:text-brand-primary">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-border bg-brand-secondary space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenReset()
            }}
            className="w-full py-2 bg-white border border-brand-border hover:bg-rose-50 hover:text-rose-700 text-xs font-medium text-grey-70 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowPath className="w-3.5 h-3.5 text-grey-40" />
            <span>Reset Demo Store Data</span>
          </button>
          <div className="text-[10px] text-center text-grey-40">
            London Boy Portfolio Demo • Zero Backend
          </div>
        </div>
      </div>
    </div>
  )
}
