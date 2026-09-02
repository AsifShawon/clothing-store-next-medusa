"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useDemoAdmin } from "@lib/demo-store-context"
import { DemoOrderStatus } from "@lib/types"
import { formatBDT, formatDateTime } from "@lib/utils"
import { StatusBadge } from "@components/admin/status-badge"
import { MagnifyingGlass, ArrowUpDown } from "@medusajs/icons"

export default function DemoAdminOrdersPage() {
  const { state, updateOrderStatus, cancelOrder } = useDemoAdmin()
  const { orders } = state

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "total_desc">("newest")

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => {
        // Order Status
        if (statusFilter !== "all" && o.status !== statusFilter) return false

        // Payment Status
        if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) return false

        // Search Term
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase()
          const matchId = o.displayId.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
          const matchName =
            `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q)
          const matchEmail = o.customer.email.toLowerCase().includes(q)
          const matchPhone = o.customer.phone.toLowerCase().includes(q)
          if (!matchId && !matchName && !matchEmail && !matchPhone) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        }
        if (sortBy === "total_desc") {
          return b.total - a.total
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [orders, statusFilter, paymentFilter, searchTerm, sortBy])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
            Fulfillment Center Management
          </span>
          <h1 className="font-display text-3xl text-brand-primary mt-1">Customer Orders</h1>
          <p className="text-xs text-grey-50 mt-0.5">
            Track customer orders, manage parcel fulfillment status, and review simulated payment settlements.
          </p>
        </div>
      </div>

      {/* Filter / Search Controls */}
      <div className="bg-white border border-brand-border p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="w-4 h-4 text-grey-40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search by display ID (LB-ORD-...), customer, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-brand-border bg-white text-xs text-brand-primary focus:outline-none"
          >
            <option value="all">All Order Statuses ({orders.length})</option>
            <option value="pending">Pending Dispatch</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-brand-border bg-white text-xs text-brand-primary focus:outline-none"
          >
            <option value="all">All Payment States</option>
            <option value="pending">Pending Payment (COD)</option>
            <option value="paid">Paid / Settled</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-brand-border bg-white text-xs text-brand-primary focus:outline-none"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="total_desc">Sort: Highest Total</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-brand-border overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <p className="text-xs text-grey-50">No orders match your selected filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPaymentFilter("all")
              }}
              className="text-xs font-semibold text-brand-accent hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Customer & City</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Total (BDT)</th>
                  <th className="p-3.5">Fulfillment Status</th>
                  <th className="p-3.5 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-grey-70">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-brand-surface transition-colors">
                    <td className="p-3.5 font-bold text-brand-primary">
                      <Link href={`/demo-admin/order?id=${ord.id}`} className="hover:underline">
                        {ord.displayId}
                      </Link>
                    </td>

                    <td className="p-3.5 text-grey-50 whitespace-nowrap">
                      {ord.createdAt.substring(0, 10)}
                    </td>

                    <td className="p-3.5">
                      <span className="text-brand-primary font-semibold block truncate max-w-[160px]">
                        {ord.customer.firstName} {ord.customer.lastName}
                      </span>
                      <span className="text-[11px] text-grey-50">
                        {ord.shippingAddress.city} ({ord.shippingOption.name})
                      </span>
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={ord.paymentStatus} type="payment" />
                    </td>

                    <td className="p-3.5 font-bold text-brand-primary font-mono">
                      {formatBDT(ord.total)}
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={ord.status} />
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ord.status !== "canceled" && (
                          <select
                            value={ord.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as DemoOrderStatus
                              if (newStatus === "canceled") {
                                cancelOrder(ord.id)
                              } else {
                                updateOrderStatus(ord.id, newStatus)
                              }
                            }}
                            className="px-2 py-1 text-[11px] border border-brand-border bg-white font-semibold text-brand-primary focus:outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Cancel</option>
                          </select>
                        )}
                        <Link
                          href={`/demo-admin/order?id=${ord.id}`}
                          className="px-2.5 py-1 bg-brand-primary text-white hover:bg-brand-accent text-[11px] font-semibold rounded transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
