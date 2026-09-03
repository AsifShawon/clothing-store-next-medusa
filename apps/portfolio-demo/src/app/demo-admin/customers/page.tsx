"use client"

import React, { useState, useMemo } from "react"
import { useDemoAdmin } from "@lib/demo-store-context"
import { DemoCustomer } from "@lib/types"
import { formatBDT, formatDateTime } from "@lib/utils"
import { User, PencilSquare, XMark, ShoppingBag } from "@medusajs/icons"

export default function DemoAdminCustomersPage() {
  const { state, updateCustomer } = useDemoAdmin()
  const { customers, orders } = state

  const [editingCustomer, setEditingCustomer] = useState<DemoCustomer | null>(null)
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    city: "Dhaka",
  })

  // Aggregate registered customers with guest orders
  const customerList = useMemo(() => {
    const map = new Map<string, {
      id?: string
      name: string
      email: string
      phone: string
      city: string
      ordersCount: number
      totalSpent: number
      lastOrder: string
      isRegistered: boolean
      customerObj?: DemoCustomer
    }>()

    // 1. Registered Customers
    customers.forEach((c) => {
      const emailKey = c.email.toLowerCase()
      map.set(emailKey, {
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        city: c.defaultAddress?.city || "Dhaka",
        ordersCount: c.ordersCount || 0,
        totalSpent: c.totalSpent || 0,
        lastOrder: c.createdAt,
        isRegistered: true,
        customerObj: c,
      })
    })

    // 2. Walk orders to accurately calculate metrics & include guests
    orders.forEach((ord) => {
      const emailKey = (ord.customer.email || "guest@londonboy.uk").toLowerCase()
      const existing = map.get(emailKey)
      if (existing) {
        existing.ordersCount += 1
        existing.totalSpent += ord.total
        if (new Date(ord.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = ord.createdAt
        }
      } else {
        map.set(emailKey, {
          name: `${ord.customer.firstName} ${ord.customer.lastName}`,
          email: ord.customer.email,
          phone: ord.customer.phone,
          city: ord.shippingAddress.city || "Dhaka",
          ordersCount: 1,
          totalSpent: ord.total,
          lastOrder: ord.createdAt,
          isRegistered: false,
        })
      }
    })

    return Array.from(map.values())
  }, [customers, orders])

  const handleOpenEdit = (cust: DemoCustomer) => {
    setEditingCustomer(cust)
    setProfileForm({
      firstName: cust.firstName,
      lastName: cust.lastName,
      email: cust.email,
      phone: cust.phone,
      address1: cust.defaultAddress?.address1 || "",
      city: cust.defaultAddress?.city || "Dhaka",
    })
  }

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCustomer) return

    updateCustomer(editingCustomer.id, {
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      defaultAddress: {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phone: profileForm.phone,
        address1: profileForm.address1,
        city: profileForm.city,
        postalCode: editingCustomer.defaultAddress?.postalCode || "1213",
        country: "Bangladesh",
      },
    })
    setEditingCustomer(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-border pb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
          Customer Relationship Management
        </span>
        <h1 className="font-display text-3xl text-brand-primary mt-1">Customer Directory</h1>
        <p className="text-xs text-grey-50 mt-0.5">
          Review simulated customer records, purchase frequencies, contact information, and delivery destinations.
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-brand-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Customer Name & Email</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Orders Placed</th>
                <th className="p-3.5">Lifetime Spend</th>
                <th className="p-3.5">Last Activity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-grey-70">
              {customerList.map((cust, idx) => (
                <tr key={idx} className="hover:bg-brand-surface transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                        {cust.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-brand-primary block">{cust.name}</span>
                          {cust.isRegistered && (
                            <span className="px-1.5 py-0.2 bg-brand-secondary text-brand-accent text-[9px] font-bold rounded">
                              Demo
                            </span>
                          )}
                        </div>
                        <span className="text-grey-40 text-[11px] font-mono">{cust.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-grey-60">{cust.phone}</td>

                  <td className="p-3.5 font-medium text-brand-primary">{cust.city}</td>

                  <td className="p-3.5 font-bold text-brand-primary">
                    {cust.ordersCount} {cust.ordersCount === 1 ? "order" : "orders"}
                  </td>

                  <td className="p-3.5 font-bold text-brand-primary font-mono">
                    {formatBDT(cust.totalSpent)}
                  </td>

                  <td className="p-3.5 text-grey-50 whitespace-nowrap">
                    {formatDateTime(cust.lastOrder)}
                  </td>

                  <td className="p-3.5 text-right">
                    {cust.customerObj && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cust.customerObj!)}
                        className="px-2.5 py-1 bg-brand-surface hover:bg-brand-secondary text-brand-primary border border-brand-border text-[11px] font-semibold rounded flex items-center gap-1 ml-auto transition-colors"
                      >
                        <PencilSquare className="w-3.5 h-3.5 text-brand-accent" />
                        <span>Edit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Edit Modal */}
      {editingCustomer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Edit Customer Record"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingCustomer(null)}
          />
          <div className="relative bg-white border border-brand-border p-6 max-w-md w-full shadow-2xl space-y-4 z-10 animate-enter">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h3 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-brand-accent" />
                <span>Edit Demo Customer Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="text-grey-40 hover:text-brand-primary p-1"
              >
                <XMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-primary block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                  />
                </div>
                <div>
                  <label className="font-bold text-brand-primary block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-brand-primary block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-brand-primary block mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-brand-primary block mb-1">Street Address</label>
                <input
                  type="text"
                  value={profileForm.address1}
                  onChange={(e) => setProfileForm({ ...profileForm, address1: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-3 py-1.5 border border-brand-border text-xs font-semibold text-grey-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
