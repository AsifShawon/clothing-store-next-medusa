"use client"

import React, { useState } from "react"
import { useDemoAdmin } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { StatusBadge } from "@components/admin/status-badge"
import { Plus, Trash, Tag, ExclamationCircle } from "@medusajs/icons"

export default function DemoAdminPromotionsPage() {
  const { state, addPromotion, togglePromotion, deletePromotion } = useDemoAdmin()
  const { promotions } = state

  const [isAdding, setIsAdding] = useState(false)
  const [newPromo, setNewPromo] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: 10,
    minOrderAmount: 0,
    description: "",
    isActive: true,
  })
  const [error, setError] = useState("")

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const cleanCode = newPromo.code.trim().toUpperCase()
    if (!cleanCode) {
      setError("Coupon code cannot be empty.")
      return
    }

    // Uniqueness validation
    if (promotions.some((p) => p.code.toUpperCase() === cleanCode)) {
      setError(`Coupon code "${cleanCode}" already exists. Coupon codes must be unique.`)
      return
    }

    if (newPromo.value <= 0) {
      setError("Discount value must be greater than zero.")
      return
    }

    if (newPromo.type === "percentage" && newPromo.value > 100) {
      setError("Percentage discount cannot exceed 100%.")
      return
    }

    addPromotion({
      code: cleanCode,
      type: newPromo.type,
      value: Number(newPromo.value),
      minOrderAmount: newPromo.minOrderAmount ? Number(newPromo.minOrderAmount) : undefined,
      description: newPromo.description || `${cleanCode} promotional discount`,
      isActive: newPromo.isActive,
    })

    setNewPromo({
      code: "",
      type: "percentage",
      value: 10,
      minOrderAmount: 0,
      description: "",
      isActive: true,
    })
    setIsAdding(false)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
            Discount & Campaign Center
          </span>
          <h1 className="font-display text-3xl text-brand-primary mt-1">Promotions & Coupons</h1>
          <p className="text-xs text-grey-50 mt-0.5">
            Configure promotional discount codes for customer checkout in the portfolio demo.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError("")
            setIsAdding(!isAdding)
          }}
          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent inline-flex items-center gap-1.5 rounded transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? "Close Creator" : "New Promo Code"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 rounded">
          <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Creator Form */}
      {isAdding && (
        <form onSubmit={handleCreatePromo} className="bg-white border border-brand-border p-6 space-y-4 animate-enter">
          <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
            Create Promotional Code
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Coupon Code *</label>
              <input
                type="text"
                required
                value={newPromo.code}
                onChange={(e) => {
                  setNewPromo({ ...newPromo, code: e.target.value })
                  setError("")
                }}
                placeholder="e.g. SUMMER15"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface font-mono font-bold uppercase text-brand-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Discount Type</label>
              <select
                value={newPromo.type}
                onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              >
                <option value="percentage">Percentage Off (%)</option>
                <option value="fixed">Fixed Amount (BDT ৳)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">
                Discount Value ({newPromo.type === "percentage" ? "%" : "BDT ৳"}) *
              </label>
              <input
                type="number"
                required
                min={1}
                max={newPromo.type === "percentage" ? 100 : 50000}
                value={newPromo.value}
                onChange={(e) => setNewPromo({ ...newPromo, value: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">
                Minimum Order Spend (BDT, Optional)
              </label>
              <input
                type="number"
                value={newPromo.minOrderAmount || ""}
                onChange={(e) => setNewPromo({ ...newPromo, minOrderAmount: Number(e.target.value) })}
                placeholder="e.g. 2000"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Description</label>
              <input
                type="text"
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                placeholder="e.g. 10% off launch discount"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-brand-border">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-brand-border bg-white text-xs font-semibold text-grey-70 hover:bg-brand-secondary rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent rounded transition-colors"
            >
              Create Promo
            </button>
          </div>
        </form>
      )}

      {/* Promotions Table */}
      <div className="bg-white border border-brand-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Coupon Code</th>
                <th className="p-3.5">Discount Rate</th>
                <th className="p-3.5">Minimum Spend</th>
                <th className="p-3.5">Campaign Description</th>
                <th className="p-3.5">Active State</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60 text-grey-70">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-brand-surface transition-colors">
                  <td className="p-3.5 font-bold font-mono text-sm text-brand-primary">
                    <span className="px-2 py-1 bg-brand-secondary text-brand-accent border border-brand-border rounded">
                      {promo.code}
                    </span>
                  </td>

                  <td className="p-3.5 font-bold text-brand-primary">
                    {promo.type === "percentage"
                      ? `${promo.value}% Off Subtotal`
                      : `${formatBDT(promo.value)} Flat Discount`}
                  </td>

                  <td className="p-3.5 text-grey-60 font-mono">
                    {promo.minOrderAmount ? formatBDT(promo.minOrderAmount) : "No minimum"}
                  </td>

                  <td className="p-3.5 text-grey-60">{promo.description}</td>

                  <td className="p-3.5">
                    <StatusBadge status={promo.isActive ? "active" : "inactive"} type="promo" />
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => togglePromotion(promo.id)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded transition-colors ${
                          promo.isActive
                            ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {promo.isActive ? "Deactivate" : "Activate"}
                      </button>

                      {promo.code !== "LONDON10" && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete coupon code ${promo.code}?`)) {
                              deletePromotion(promo.id)
                            }
                          }}
                          className="p-1 text-grey-40 hover:text-rose-600 rounded"
                          title="Delete coupon"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
