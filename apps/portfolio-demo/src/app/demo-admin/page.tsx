"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoAdmin } from "@lib/demo-store-context"
import { StatCard } from "@components/admin/stat-card"
import { StatusBadge } from "@components/admin/status-badge"
import { formatBDT, formatDateTime } from "@lib/utils"
import {
  Cash,
  ShoppingBag,
  Tag,
  Users,
  ExclamationCircle,
  ArrowRight,
  Plus,
  Sparkles,
  Clock,
} from "@medusajs/icons"

export default function DemoAdminDashboard() {
  const { state } = useDemoAdmin()
  const { products, orders, customers, activityEvents, settings } = state

  // Revenue & Average Order Value (AOV)
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "canceled" && o.paymentStatus !== "refunded")
      .reduce((sum, o) => sum + o.total, 0)
  }, [orders])

  const averageOrderValue = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "canceled")
    if (validOrders.length === 0) return 0
    return Math.round(totalRevenue / validOrders.length)
  }, [orders, totalRevenue])

  // Inventory Metrics
  const lowStockThreshold = settings?.lowStockThreshold || 20
  const lowStockVariants = useMemo(() => {
    const list: {
      productId: string
      productTitle: string
      handle: string
      variantTitle: string
      sku: string
      stock: number
      thumbnail: string
    }[] = []

    products.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.manageInventory && v.inventoryQuantity <= lowStockThreshold) {
          list.push({
            productId: p.id,
            productTitle: p.title,
            handle: p.handle,
            variantTitle: v.title,
            sku: v.sku,
            stock: v.inventoryQuantity,
            thumbnail: p.thumbnail,
          })
        }
      })
    })
    return list.sort((a, b) => a.stock - b.stock)
  }, [products, lowStockThreshold])

  // Order Status Distribution
  const orderStatusCounts = useMemo(() => {
    const map: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      canceled: 0,
    }
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1
    })
    return map
  }, [orders])

  // Top Selling Garments
  const topSellingProducts = useMemo(() => {
    const salesMap = new Map<string, { productTitle: string; handle: string; thumbnail: string; unitsSold: number; revenue: number }>()

    orders
      .filter((o) => o.status !== "canceled")
      .forEach((o) => {
        o.items.forEach((item) => {
          const existing = salesMap.get(item.productId)
          if (existing) {
            existing.unitsSold += item.quantity
            existing.revenue += item.totalPrice
          } else {
            salesMap.set(item.productId, {
              productTitle: item.productTitle,
              handle: item.productHandle,
              thumbnail: item.thumbnail,
              unitsSold: item.quantity,
              revenue: item.totalPrice,
            })
          }
        })
      })

    return Array.from(salesMap.values())
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 4)
  }, [orders])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
            Live Store Analytics
          </span>
          <h1 className="font-display text-3xl text-brand-primary mt-1">Operations Overview</h1>
          <p className="text-xs text-grey-50 mt-0.5">
            Operational snapshot of London Boy Bangladesh sales, Dhaka warehouse allocations, and live orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/demo-admin/product"
            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent flex items-center gap-1.5 rounded transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Garment</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Gross Revenue"
          value={formatBDT(totalRevenue)}
          subtitle="All valid orders"
          icon={<Cash className="w-5 h-5 text-emerald-700" />}
        />
        <StatCard
          title="Orders Placed"
          value={orders.length}
          subtitle={`${orderStatusCounts.pending} pending dispatch`}
          icon={<ShoppingBag className="w-5 h-5 text-brand-accent" />}
        />
        <StatCard
          title="Average Order (AOV)"
          value={formatBDT(averageOrderValue)}
          subtitle="Net revenue / order"
          icon={<Sparkles className="w-5 h-5 text-brand-sand" />}
        />
        <StatCard
          title="Active Garments"
          value={products.filter((p) => p.status === "published").length}
          subtitle={`${products.reduce((s, p) => s + p.variants.length, 0)} total variants`}
          icon={<Tag className="w-5 h-5 text-brand-primary" />}
        />
        <StatCard
          title="Customers"
          value={customers.length}
          subtitle="Registered & guest"
          icon={<Users className="w-5 h-5 text-brand-accent" />}
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStockVariants.length}
          subtitle={`≤ ${lowStockThreshold} units left`}
          icon={<ExclamationCircle className="w-5 h-5 text-amber-700" />}
        />
      </div>

      {/* Order Status Distribution Bar */}
      <div className="bg-white border border-brand-border p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-primary">
          <span>Order Fulfillment Pipeline</span>
          <Link href="/demo-admin/orders" className="text-brand-accent hover:underline lowercase text-xs font-medium">
            view orders &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(["pending", "processing", "shipped", "delivered", "canceled"] as const).map((st) => (
            <div key={st} className="p-3 bg-brand-surface border border-brand-border rounded space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-grey-50 block">
                {st}
              </span>
              <span className="font-mono text-xl font-bold text-brand-primary block">
                {orderStatusCounts[st] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (Left Col) */}
        <div className="lg:col-span-8 bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
              Recent Customer Orders
            </h2>
            <Link
              href="/demo-admin/orders"
              className="text-xs text-brand-accent hover:underline font-semibold flex items-center gap-1"
            >
              <span>Manage All ({orders.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-grey-50 py-10 text-center">No orders recorded in this demo session yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60 text-grey-70">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-surface transition-colors">
                      <td className="p-3 font-bold text-brand-primary">
                        <Link href={`/demo-admin/order?id=${ord.id}`} className="hover:underline">
                          {ord.displayId}
                        </Link>
                      </td>
                      <td className="p-3">
                        <span className="text-brand-primary font-medium block truncate max-w-[140px]">
                          {ord.customer.firstName} {ord.customer.lastName}
                        </span>
                        <span className="text-[10px] text-grey-40">{ord.shippingAddress.city}</span>
                      </td>
                      <td className="p-3 text-grey-50 whitespace-nowrap">{ord.createdAt.substring(0, 10)}</td>
                      <td className="p-3 font-bold text-brand-primary font-mono">{formatBDT(ord.total)}</td>
                      <td className="p-3">
                        <StatusBadge status={ord.status} />
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/demo-admin/order?id=${ord.id}`}
                          className="px-2.5 py-1 bg-brand-secondary text-brand-primary hover:bg-brand-sand text-[11px] font-semibold rounded border border-brand-border"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts (Right Col) */}
        <div className="lg:col-span-4 bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
              Warehouse Stock Alerts
            </h2>
            <Link href="/demo-admin/products" className="text-xs text-brand-accent hover:underline font-semibold">
              Inventory &rarr;
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-grey-50 py-10 text-center">
              All variant inventories are well-stocked at Dhaka Central Warehouse.
            </p>
          ) : (
            <div className="divide-y divide-brand-border/60 space-y-3">
              {lowStockVariants.slice(0, 5).map((item, idx) => (
                <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <Link
                      href={`/demo-admin/product?id=${item.productId}`}
                      className="font-bold text-brand-primary block hover:underline truncate"
                    >
                      {item.productTitle}
                    </Link>
                    <span className="text-[11px] text-grey-50 block font-mono">
                      {item.variantTitle} • {item.sku}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded flex-shrink-0 ${
                      item.stock === 0
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.stock === 0 ? "Out of Stock" : `${item.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Top-Selling Products & Live Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Selling Products */}
        <div className="lg:col-span-6 bg-white border border-brand-border p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3">
            Top-Selling Styles
          </h2>

          {topSellingProducts.length === 0 ? (
            <p className="text-xs text-grey-50 py-8 text-center">
              No sales data aggregated yet. Place orders to see top garments.
            </p>
          ) : (
            <div className="space-y-3">
              {topSellingProducts.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-3.5 p-2 bg-brand-surface rounded border border-brand-border">
                  <div className="relative w-12 h-14 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                    <Image src={prod.thumbnail} alt={prod.productTitle} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold text-brand-primary truncate">{prod.productTitle}</h4>
                    <p className="text-grey-50 text-[11px]">{prod.unitsSold} units sold</p>
                  </div>
                  <span className="font-bold font-mono text-xs text-brand-primary">
                    {formatBDT(prod.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Stream */}
        <div className="lg:col-span-6 bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-accent" />
              <span>Live Operations Activity Log</span>
            </h2>
            <span className="text-[10px] text-grey-40 font-mono">Last 50 Events</span>
          </div>

          {activityEvents.length === 0 ? (
            <p className="text-xs text-grey-50 py-8 text-center">No recorded system events.</p>
          ) : (
            <div className="divide-y divide-brand-border max-h-72 overflow-y-auto space-y-2">
              {activityEvents.slice(0, 6).map((evt) => (
                <div key={evt.id} className="pt-2.5 first:pt-0 text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-brand-accent">
                      {evt.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-grey-40 font-mono">{formatDateTime(evt.timestamp)}</span>
                  </div>
                  <p className="text-grey-70 text-xs">{evt.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
