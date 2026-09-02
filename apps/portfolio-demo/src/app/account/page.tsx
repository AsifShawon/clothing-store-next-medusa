"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import {
  User,
  ShoppingBag,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
} from "@medusajs/icons"

export default function AccountPage() {
  const { customer, isLoggedIn, loginAsDemoCustomer, logoutCustomer, updateCustomerProfile } =
    useDemoCustomer()
  const { orders } = useDemoOrders()

  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    address1: customer.defaultAddress?.address1 || "",
    address2: customer.defaultAddress?.address2 || "",
    city: customer.defaultAddress?.city || "Dhaka",
    postalCode: customer.defaultAddress?.postalCode || "1213",
    country: customer.defaultAddress?.country || "Bangladesh",
  })

  // Customer specific orders
  const customerOrders = orders.filter((o) => o.customer.id === customer.id || o.customerId === customer.id)
  const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateCustomerProfile({
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
        address2: profileForm.address2,
        city: profileForm.city,
        postalCode: profileForm.postalCode,
        country: profileForm.country,
      },
    })
    setIsEditing(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="content-container py-16 sm:py-24 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-brand-primary">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl text-brand-primary">Customer Portal</h1>
          <p className="text-xs text-grey-50 leading-relaxed">
            This is a portfolio simulation. No real passwords are used. Click below to continue as the seeded London Boy customer.
          </p>
        </div>
        <div className="p-4 bg-brand-surface border border-brand-border space-y-3">
          <div className="text-xs text-left space-y-1 text-grey-70">
            <p><strong>Sample Customer:</strong> Asif Shawon</p>
            <p><strong>Email:</strong> customer@londonboy.uk</p>
            <p><strong>Location:</strong> Banani, Dhaka 1213</p>
          </div>
          <button
            type="button"
            onClick={loginAsDemoCustomer}
            className="w-full py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue as Demo Customer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-10 sm:py-16 space-y-10 max-w-5xl">
      {/* Header & Session */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
            Simulated Customer Portal
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-primary mt-1">
            Welcome, {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-xs text-grey-50 mt-1">
            Manage your demonstration profile, view order histories, and configure Bangladesh delivery addresses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={logoutCustomer}
            className="px-3.5 py-1.5 bg-white border border-brand-border text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-brand-surface border border-brand-border space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40">
            Lifetime Orders
          </span>
          <span className="font-mono text-2xl font-bold text-brand-primary block">
            {customerOrders.length}
          </span>
        </div>
        <div className="p-5 bg-brand-surface border border-brand-border space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40">
            Total Spent in BDT
          </span>
          <span className="font-mono text-2xl font-bold text-brand-primary block">
            {formatBDT(totalSpent)}
          </span>
        </div>
        <div className="p-5 bg-brand-surface border border-brand-border space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40">
            Primary Location
          </span>
          <span className="text-sm font-bold text-brand-primary block truncate">
            {customer.defaultAddress?.city || "Dhaka"}, Bangladesh
          </span>
        </div>
      </div>

      {/* Profile & Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-6 bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-brand-accent" />
              <span>Customer Profile</span>
            </h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-xs text-brand-accent hover:underline font-semibold"
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-brand-primary block mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                  />
                </div>
                <div>
                  <label className="font-bold text-brand-primary block mb-1">Last Name</label>
                  <input
                    type="text"
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
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                />
              </div>

              <div>
                <label className="font-bold text-brand-primary block mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-brand-surface border border-brand-border"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 bg-brand-secondary text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2.5 text-xs text-grey-70">
              <div>
                <span className="text-grey-40 block">Full Name:</span>
                <span className="font-bold text-brand-primary">
                  {customer.firstName} {customer.lastName}
                </span>
              </div>
              <div>
                <span className="text-grey-40 block">Email Address:</span>
                <span className="font-bold text-brand-primary">{customer.email}</span>
              </div>
              <div>
                <span className="text-grey-40 block">Phone:</span>
                <span className="font-bold text-brand-primary">{customer.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Address Card */}
        <div className="lg:col-span-6 bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-accent" />
              <span>Default Delivery Address</span>
            </h3>
          </div>

          <div className="text-xs text-grey-70 space-y-1.5">
            <p className="font-bold text-brand-primary">
              {customer.defaultAddress?.firstName || customer.firstName} {customer.defaultAddress?.lastName || customer.lastName}
            </p>
            <p>{customer.defaultAddress?.address1 || "Road 11, Block D, Banani"}</p>
            {customer.defaultAddress?.address2 && <p>{customer.defaultAddress.address2}</p>}
            <p>
              {customer.defaultAddress?.city || "Dhaka"} - {customer.defaultAddress?.postalCode || "1213"}, {customer.defaultAddress?.country || "Bangladesh"}
            </p>
            <p className="text-[11px] text-grey-50 pt-1">
              Used automatically as the default shipping location on checkout.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <h3 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-brand-accent" />
            <span>Recent Orders ({customerOrders.length})</span>
          </h3>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-brand-primary hover:text-brand-accent uppercase tracking-wider"
          >
            View All Orders →
          </Link>
        </div>

        {customerOrders.length === 0 ? (
          <div className="p-8 bg-brand-surface border border-brand-border text-center space-y-2">
            <p className="text-xs text-grey-50">You have not placed any demonstration orders yet.</p>
            <Link
              href="/shop"
              className="inline-block text-xs font-bold text-brand-accent underline underline-offset-4"
            >
              Explore London Boy Garments
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-brand-border bg-white border border-brand-border">
            {customerOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-surface transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-brand-primary">{order.displayId}</span>
                    <span className="px-2 py-0.5 bg-brand-secondary text-brand-primary text-[10px] font-bold uppercase rounded">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-grey-50 mt-1">
                    {order.items.length} {order.items.length === 1 ? "garment" : "garments"} • Placed on {order.createdAt.substring(0, 10)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-brand-primary font-mono">
                    {formatBDT(order.total)}
                  </span>
                  <Link
                    href={`/account/order?id=${order.id}`}
                    className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
