"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SquaresPlus,
  Tag,
  ShoppingBag,
  Users,
  ReceiptPercent,
  CogSixTooth,
  ArrowLeft,
  XMark,
} from "@medusajs/icons"

interface MobileAdminNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileAdminNav({ isOpen, onClose }: MobileAdminNavProps) {
  const pathname = usePathname()

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

  const links = [
    { label: "Dashboard", href: "/demo-admin", icon: SquaresPlus, exact: true },
    { label: "Products", href: "/demo-admin/products", icon: Tag },
    { label: "Orders", href: "/demo-admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/demo-admin/customers", icon: Users },
    { label: "Promotions", href: "/demo-admin/promotions", icon: ReceiptPercent },
    { label: "Settings", href: "/demo-admin/settings", icon: CogSixTooth },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Admin Navigation"
      className="fixed inset-0 z-50 flex lg:hidden"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-4/5 max-w-xs bg-brand-primary text-white h-full shadow-2xl flex flex-col z-10 animate-enter">
        {/* Header */}
        <div className="p-5 border-b border-grey-80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-base tracking-wider uppercase text-brand-secondary">
                LONDON BOY
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-brand-accent text-white">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] text-grey-40 mt-0.5">Simulated Operations Console</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-grey-40 hover:text-white rounded"
            aria-label="Close menu"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium rounded transition-colors ${
                  isActive
                    ? "bg-brand-accent text-white font-semibold"
                    : "text-grey-30 hover:bg-grey-90 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 text-brand-muted" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Link */}
        <div className="p-4 border-t border-grey-80">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-grey-30 hover:text-white hover:bg-grey-90 rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
