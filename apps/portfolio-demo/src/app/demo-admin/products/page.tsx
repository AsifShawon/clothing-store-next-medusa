"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoAdmin } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { StatusBadge } from "@components/admin/status-badge"
import {
  Trash,
  PencilSquare,
  Plus,
  BuildingStorefront,
  ArchiveBox,
  MagnifyingGlass,
  ArrowPath,
} from "@medusajs/icons"

export default function DemoAdminProductsPage() {
  const { state, archiveProduct, publishProduct, deleteProduct } = useDemoAdmin()
  const { products, categories } = state

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Filter products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      // Status
      if (statusFilter !== "all" && p.status !== statusFilter) return false

      // Category
      if (categoryFilter !== "all" && !p.categoryNames.includes(categoryFilter)) return false

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchHandle = p.handle.toLowerCase().includes(q)
        const matchSku = p.variants.some((v) => v.sku.toLowerCase().includes(q))
        const matchCat = p.categoryNames.some((c) => c.toLowerCase().includes(q))
        if (!matchTitle && !matchHandle && !matchSku && !matchCat) return false
      }

      return true
    })
  }, [products, statusFilter, categoryFilter, searchTerm])

  // Summary Metrics
  const totalStockUnits = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + p.variants.reduce((vs, v) => vs + (v.inventoryQuantity || 0), 0),
      0
    )
  }, [products])

  const outOfStockCount = useMemo(() => {
    return products.filter((p) =>
      p.variants.every((v) => v.manageInventory && v.inventoryQuantity <= 0)
    ).length
  }, [products])

  const lowStockCount = useMemo(() => {
    return products.filter((p) =>
      p.variants.some((v) => v.manageInventory && v.inventoryQuantity > 0 && v.inventoryQuantity <= 20)
    ).length
  }, [products])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
            Garment Inventory Catalog
          </span>
          <h1 className="font-display text-3xl text-brand-primary mt-1">Garments & SKUs</h1>
          <p className="text-xs text-grey-50 mt-0.5">
            Manage your London Boy products, variants, SKUs, and Dhaka warehouse inventory allocations.
          </p>
        </div>
        <Link
          href="/demo-admin/product"
          className="px-4 py-2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent inline-flex items-center gap-1.5 rounded transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </Link>
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-brand-border rounded space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-grey-50">
            Total Warehouse Units
          </span>
          <span className="font-mono text-xl font-bold text-brand-primary block">
            {totalStockUnits} Units
          </span>
        </div>
        <div className="p-4 bg-white border border-brand-border rounded space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-grey-50">
            Low Stock Styles
          </span>
          <span className="font-mono text-xl font-bold text-amber-700 block">
            {lowStockCount} Styles
          </span>
        </div>
        <div className="p-4 bg-white border border-brand-border rounded space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-grey-50">
            Sold Out Styles
          </span>
          <span className="font-mono text-xl font-bold text-rose-700 block">
            {outOfStockCount} Styles
          </span>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-brand-border p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="w-4 h-4 text-grey-40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder="Search by garment title, SKU, or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-brand-border bg-white text-xs text-brand-primary focus:outline-none"
          >
            <option value="all">All Statuses ({products.length})</option>
            <option value="published">Published Only</option>
            <option value="draft">Archived / Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-brand-border bg-white text-xs text-brand-primary focus:outline-none"
          >
            <option value="all">All Departments</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-brand-border overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-xs text-grey-50">No garments match your search criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setCategoryFilter("all")
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
                  <th className="p-3.5">Garment Details</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Variants</th>
                  <th className="p-3.5">Price (BDT)</th>
                  <th className="p-3.5">Warehouse Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60 text-grey-70">
                {filtered.map((product) => {
                  const totalStock = product.variants.reduce(
                    (sum, v) => sum + (v.inventoryQuantity || 0),
                    0
                  )
                  const minPrice =
                    product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : 0
                  const maxPrice =
                    product.variants.length > 0 ? Math.max(...product.variants.map((v) => v.price)) : 0
                  const priceLabel =
                    minPrice === maxPrice
                      ? formatBDT(minPrice)
                      : `${formatBDT(minPrice)} - ${formatBDT(maxPrice)}`

                  return (
                    <tr key={product.id} className="hover:bg-brand-surface transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                            <Image
                              src={product.thumbnail || product.images[0] || ""}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/demo-admin/product?id=${product.id}`}
                              className="font-bold text-brand-primary hover:text-brand-accent block truncate max-w-xs"
                            >
                              {product.title}
                            </Link>
                            <span className="text-[11px] text-grey-40 font-mono">
                              /{product.handle}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="flex flex-wrap gap-1">
                          {product.categoryNames.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 bg-brand-secondary text-brand-primary text-[10px] font-semibold rounded"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-3.5 font-bold text-brand-primary">
                        {product.variants.length} SKUs
                      </td>

                      <td className="p-3.5 font-bold text-brand-primary font-mono">{priceLabel}</td>

                      <td className="p-3.5">
                        <span
                          className={`font-semibold ${
                            totalStock === 0
                              ? "text-rose-600 font-bold"
                              : totalStock <= 30
                              ? "text-amber-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>

                      <td className="p-3.5">
                        <StatusBadge status={product.status} type="product" />
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Storefront Preview Link */}
                          <Link
                            href={`/product?handle=${product.handle}`}
                            target="_blank"
                            className="p-1.5 text-grey-50 hover:text-brand-primary hover:bg-brand-secondary rounded"
                            title="Preview on Storefront"
                          >
                            <BuildingStorefront className="w-4 h-4" />
                          </Link>

                          {/* Edit Button */}
                          <Link
                            href={`/demo-admin/product?id=${product.id}`}
                            className="p-1.5 text-grey-50 hover:text-brand-primary hover:bg-brand-secondary rounded"
                            title="Edit Garment"
                          >
                            <PencilSquare className="w-4 h-4" />
                          </Link>

                          {/* Archive / Reactivate Toggle */}
                          <button
                            type="button"
                            onClick={() => {
                              if (product.status === "published") {
                                archiveProduct(product.id)
                              } else {
                                publishProduct(product.id)
                              }
                            }}
                            className="p-1.5 text-grey-50 hover:text-brand-primary hover:bg-brand-secondary rounded"
                            title={product.status === "published" ? "Archive Garment" : "Publish Garment"}
                          >
                            <ArchiveBox className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm(
                                  `Are you sure you want to permanently delete "${product.title}" from the demo catalog?`
                                )
                              ) {
                                deleteProduct(product.id)
                              }
                            }}
                            className="p-1.5 text-grey-40 hover:text-rose-600 hover:bg-rose-50 rounded"
                            title="Delete Garment"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
