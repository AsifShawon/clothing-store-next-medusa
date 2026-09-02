"use client"

import React from "react"
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
} from "@medusajs/icons"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { label: "Dashboard", href: "/demo-admin", icon: SquaresPlus, exact: true },
    { label: "Products", href: "/demo-admin/products", icon: Tag },
    { label: "Orders", href: "/demo-admin/orders", icon: ShoppingBag },
    { label: "Customers", href: "/demo-admin/customers", icon: Users },
    { label: "Promotions", href: "/demo-admin/promotions", icon: ReceiptPercent },
    { label: "Settings", href: "/demo-admin/settings", icon: CogSixTooth },
  ]

  return (
    <aside className="w-64 bg-brand-primary text-white flex-col min-h-screen flex-shrink-0 border-r border-grey-80 hidden lg:flex sticky top-0 h-screen overflow-y-auto">
      {/* Brand Header */}
      <div className="p-5 border-b border-grey-80">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg tracking-wider uppercase text-brand-secondary">
            LONDON BOY
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-brand-accent text-white rounded">
            DEMO ADMIN
          </span>
        </div>
        <p className="text-[11px] text-grey-40 mt-1">Simulated Operations Console</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)

          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded transition-colors ${
                isActive
                  ? "bg-brand-accent text-white shadow-sm"
                  : "text-grey-30 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 text-brand-sand" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Return to Storefront */}
      <div className="p-4 border-t border-grey-80 mt-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-grey-30 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </aside>
  )
}
