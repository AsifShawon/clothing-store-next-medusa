"use client"

import React, { useState } from "react"
import { useDemoAdmin } from "@lib/demo-store-context"
import { ResetConfirmModal } from "@components/admin/reset-confirm-modal"
import { formatBDT } from "@lib/utils"
import {
  ArrowPath,
  ShieldCheck,
  Server,
  DocumentText,
  ArrowDownTray,
  ArrowUpTray,
  ExclamationCircle,
} from "@medusajs/icons"

export default function DemoAdminSettingsPage() {
  const { state, updateSettings, exportStore, importStore } = useDemoAdmin()
  const { settings, products, orders, customers, shippingOptions } = state

  const [isResetOpen, setIsResetOpen] = useState(false)
  const [importJsonText, setImportJsonText] = useState("")
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(
    null
  )

  const [formSettings, setFormSettings] = useState({
    storeName: settings.storeName || "London Boy",
    announcementText: settings.announcementText || "Complimentary Express Delivery on all orders over ৳3,000",
    supportEmail: settings.supportEmail || "care@londonboy.uk",
    lowStockThreshold: settings.lowStockThreshold || 20,
    returnPeriodDays: settings.returnPeriodDays || 24,
  })

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings({
      storeName: formSettings.storeName,
      announcementText: formSettings.announcementText,
      supportEmail: formSettings.supportEmail,
      lowStockThreshold: Number(formSettings.lowStockThreshold),
      returnPeriodDays: Number(formSettings.returnPeriodDays),
    })
  }

  const handleDownloadExport = () => {
    const json = exportStore()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `london-boy-demo-export-${new Date().toISOString().substring(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setImportStatus(null)

    if (!importJsonText.trim()) {
      setImportStatus({ success: false, message: "Please paste a valid JSON export string." })
      return
    }

    const res = importStore(importJsonText)
    if (res.success) {
      setImportStatus({ success: true, message: "State imported and verified successfully." })
      setImportJsonText("")
    } else {
      setImportStatus({ success: false, message: res.error || "Failed to validate JSON state." })
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="border-b border-brand-border pb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
          Store Configuration & Data Management
        </span>
        <h1 className="font-display text-3xl text-brand-primary mt-1">Settings & Local Storage</h1>
        <p className="text-xs text-grey-50 mt-0.5">
          Configure store metadata, fulfillment thresholds, and import/export the browser simulation state.
        </p>
      </div>

      {/* Store Parameters Form */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
          Store Identity & Parameters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-brand-primary">Brand Name</label>
            <input
              type="text"
              value={formSettings.storeName}
              onChange={(e) => setFormSettings({ ...formSettings, storeName: e.target.value })}
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-primary">Support Email Display</label>
            <input
              type="email"
              value={formSettings.supportEmail}
              onChange={(e) => setFormSettings({ ...formSettings, supportEmail: e.target.value })}
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-primary">Low-Stock Reorder Threshold</label>
            <input
              type="number"
              min={1}
              value={formSettings.lowStockThreshold}
              onChange={(e) =>
                setFormSettings({ ...formSettings, lowStockThreshold: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-brand-primary">Exchange Window (Hours)</label>
            <input
              type="number"
              min={1}
              value={formSettings.returnPeriodDays}
              onChange={(e) =>
                setFormSettings({ ...formSettings, returnPeriodDays: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-bold text-brand-primary">Top Announcement Bar Text</label>
          <input
            type="text"
            value={formSettings.announcementText}
            onChange={(e) =>
              setFormSettings({ ...formSettings, announcementText: e.target.value })
            }
            className="w-full px-3 py-2 bg-brand-surface border border-brand-border text-brand-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Bangladesh Shipping Rates Table */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
          Bangladesh Shipping Options
        </h2>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
              <tr>
                <th className="p-3">Delivery Zone Name</th>
                <th className="p-3">Estimated Timing</th>
                <th className="p-3">Rate (BDT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/60">
              {shippingOptions.map((opt) => (
                <tr key={opt.id}>
                  <td className="p-3 font-semibold text-brand-primary">
                    {opt.name}
                    <span className="text-[11px] text-grey-50 block font-normal">{opt.description}</span>
                  </td>
                  <td className="p-3 text-grey-70">{opt.estimatedDelivery}</td>
                  <td className="p-3 font-bold text-brand-primary font-mono">{formatBDT(opt.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* State Export & Import */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
          Demo State Backup & Restore
        </h2>

        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-brand-surface border border-brand-border rounded">
            <div>
              <span className="font-bold text-brand-primary block">Export Demonstration State</span>
              <span className="text-grey-50">
                Download a clean JSON backup of your current catalog, orders, and customer data.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDownloadExport}
              className="px-4 py-2 bg-brand-primary text-white font-semibold flex items-center gap-1.5 rounded hover:bg-brand-accent transition-colors self-start sm:self-auto"
            >
              <ArrowDownTray className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-3 pt-2">
            <span className="font-bold text-brand-primary block">Import Validated JSON State:</span>
            <textarea
              rows={4}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste exported JSON state here..."
              className="w-full px-3 py-2 bg-brand-surface border border-brand-border font-mono text-[11px] focus:outline-none"
            />

            {importStatus && (
              <div
                className={`p-3 text-xs rounded flex items-center gap-2 ${
                  importStatus.success
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border border-rose-200 text-rose-800"
                }`}
              >
                <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
                <span>{importStatus.message}</span>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-brand-secondary border border-brand-border hover:bg-brand-sand text-xs font-semibold text-brand-primary rounded flex items-center gap-1.5 transition-colors"
              >
                <ArrowUpTray className="w-4 h-4" />
                <span>Import & Validate</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Dangerous Reset Zone */}
      <div className="bg-white border border-rose-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
          <div>
            <h2 className="font-heading font-bold text-base text-rose-900">Reset Demo State</h2>
            <p className="text-xs text-rose-700 mt-0.5">
              Revert all products, variants, orders, promotions, and customer data back to the default London Boy seed state.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsResetOpen(true)}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 flex items-center gap-1.5 rounded transition-colors self-start sm:self-auto shadow-sm"
          >
            <ArrowPath className="w-3.5 h-3.5" />
            <span>Reset Demo Store</span>
          </button>
        </div>

        <div className="text-[11px] text-grey-50">
          Current browser storage contains: {products.length} garments, {orders.length} orders, {customers.length} customer records.
        </div>
      </div>

      <ResetConfirmModal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} />
    </div>
  )
}
