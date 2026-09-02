"use client"

import React, { useState, useEffect, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useDemoAdmin } from "@lib/demo-store-context"
import { DemoProduct, DemoProductVariant } from "@lib/types"
import {
  ArrowLeft,
  Trash,
  Plus,
  BuildingStorefront,
  ExclamationCircle,
} from "@medusajs/icons"

function ProductEditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("id")
  const { state, addProduct, updateProduct } = useDemoAdmin()
  const { products, categories, collections } = state

  const existing = useMemo(() => {
    if (!productId) return null
    return products.find((p) => p.id === productId) || null
  }, [products, productId])

  const [formData, setFormData] = useState({
    title: "",
    handle: "",
    subtitle: "",
    description: "",
    material: "",
    careInstructions: "",
    status: "published" as "published" | "draft",
    collectionHandle: "new-arrivals",
    categoryNames: ["Men"],
    tags: "signature, heavyweight",
    thumbnail: "",
    images: "",
    variants: [
      {
        id: "var_init_1",
        title: "Black / M",
        sku: "LB-NEW-BLK-M",
        options: { Color: "Black", Size: "M" },
        price: 1500,
        usdPrice: 18,
        inventoryQuantity: 25,
        manageInventory: true,
      },
    ] as DemoProductVariant[],
  })

  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (existing) {
      setFormData({
        title: existing.title,
        handle: existing.handle,
        subtitle: existing.subtitle || "",
        description: existing.description,
        material: existing.material,
        careInstructions: existing.metadata?.careInstructions || "",
        status: existing.status,
        collectionHandle: existing.collectionHandle || "new-arrivals",
        categoryNames: existing.categoryNames.length > 0 ? existing.categoryNames : ["Men"],
        tags: existing.tags.join(", "),
        thumbnail: existing.thumbnail,
        images: existing.images.join("\n"),
        variants: existing.variants,
      })
    }
  }, [existing])

  const handleVariantChange = (index: number, field: keyof DemoProductVariant, value: any) => {
    setValidationError("")
    setFormData((prev) => {
      const updated = [...prev.variants]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, variants: updated }
    })
  }

  const handleAddVariant = () => {
    setValidationError("")
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var_${Date.now()}_${prev.variants.length}`,
          title: `Custom Variant ${prev.variants.length + 1}`,
          sku: `LB-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          options: { Size: "L" },
          price: prev.variants[0]?.price || 1500,
          usdPrice: prev.variants[0]?.usdPrice || 18,
          inventoryQuantity: 20,
          manageInventory: true,
        },
      ],
    }))
  }

  const handleDeleteVariant = (index: number) => {
    if (formData.variants.length <= 1) {
      setValidationError("A garment must have at least one variant.")
      return
    }
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")

    const cleanHandle = formData.handle.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-")

    if (!cleanHandle) {
      setValidationError("Product handle (URL slug) cannot be empty.")
      return
    }

    // 1. Validate unique handle across all OTHER products
    const handleConflict = products.find(
      (p) => p.handle.toLowerCase() === cleanHandle && p.id !== existing?.id
    )
    if (handleConflict) {
      setValidationError(
        `The handle "${cleanHandle}" is already used by "${handleConflict.title}". Handles must be unique.`
      )
      return
    }

    // 2. Validate SKUs and non-negative constraints
    const skuSet = new Set<string>()
    for (let i = 0; i < formData.variants.length; i++) {
      const v = formData.variants[i]
      const cleanSku = v.sku.trim().toUpperCase()

      if (!cleanSku) {
        setValidationError(`Variant #${i + 1} must have a valid SKU.`)
        return
      }

      if (skuSet.has(cleanSku)) {
        setValidationError(`Duplicate SKU "${cleanSku}" within this product's variants.`)
        return
      }
      skuSet.add(cleanSku)

      // Validate SKU uniqueness across OTHER products
      const skuConflict = products.find(
        (p) => p.id !== existing?.id && p.variants.some((pv) => pv.sku.toUpperCase() === cleanSku)
      )
      if (skuConflict) {
        setValidationError(
          `SKU "${cleanSku}" is already assigned to "${skuConflict.title}". SKUs must be globally unique.`
        )
        return
      }

      if (v.price < 0) {
        setValidationError(`Variant "${v.title}" cannot have a negative price.`)
        return
      }

      if (v.inventoryQuantity < 0) {
        setValidationError(`Variant "${v.title}" cannot have negative inventory.`)
        return
      }
    }

    const rawImages = formData.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)

    const imagesList =
      rawImages.length > 0
        ? rawImages
        : [formData.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"]
    const tagsList = formData.tags
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)

    const payload: Omit<DemoProduct, "id" | "createdAt" | "updatedAt"> = {
      title: formData.title.trim(),
      handle: cleanHandle,
      subtitle: formData.subtitle.trim(),
      description: formData.description.trim(),
      material: formData.material.trim() || "100% Combed Cotton",
      status: formData.status,
      collectionHandle: formData.collectionHandle,
      categoryNames: formData.categoryNames,
      tags: tagsList,
      thumbnail: formData.thumbnail || imagesList[0],
      images: imagesList,
      options: [
        { id: "opt_size", title: "Size", values: ["S", "M", "L", "XL", "One Size"] },
      ],
      variants: formData.variants.map((v) => ({
        ...v,
        sku: v.sku.trim().toUpperCase(),
        price: Number(v.price),
        inventoryQuantity: Number(v.inventoryQuantity),
      })),
      metadata: {
        origin: "Crafted in Bangladesh",
        careInstructions: formData.careInstructions || "Machine wash cold at 30°C",
        fit: "Modern Structured Fit",
      },
    }

    if (existing) {
      updateProduct(existing.id, payload)
    } else {
      addProduct(payload)
    }

    router.push("/demo-admin/products")
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/demo-admin/products"
          className="text-xs text-grey-50 hover:text-brand-primary flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Garments Catalog</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <h1 className="font-display text-3xl text-brand-primary">
              {existing ? `Edit Garment: ${existing.title}` : "Add New Garment"}
            </h1>
            <p className="text-xs text-grey-50 mt-1">
              Configure product details, category associations, and Dhaka warehouse SKU allocations.
            </p>
          </div>

          {existing && (
            <Link
              href={`/product?handle=${existing.handle}`}
              target="_blank"
              className="px-3.5 py-2 bg-white border border-brand-border text-xs font-semibold text-brand-primary hover:bg-brand-secondary flex items-center gap-1.5 rounded"
            >
              <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
              <span>Preview on Storefront</span>
            </Link>
          )}
        </div>
      </div>

      {validationError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 rounded">
          <ExclamationCircle className="w-5 h-5 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Details */}
        <div className="bg-white border border-brand-border p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Garment Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Regent Knit Pique Polo"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">URL Handle (Slug) *</label>
              <input
                type="text"
                required
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="e.g. regent-knit-pique-polo"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary font-mono focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Subtitle / Fabric Tagline</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. 240 GSM Combed Compact Cotton"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Material Composition</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. 100% Mercerized Pique Cotton"
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-primary block">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the garment's craftsmanship, fit, and origin..."
              className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              >
                <option value="published">Published (Visible on storefront)</option>
                <option value="draft">Draft / Archived (Hidden)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Collection</label>
              <select
                value={formData.collectionHandle}
                onChange={(e) => setFormData({ ...formData, collectionHandle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              >
                {collections.map((col) => (
                  <option key={col.id} value={col.handle}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-primary block">Primary Department</label>
              <select
                value={formData.categoryNames[0] || "Men"}
                onChange={(e) => setFormData({ ...formData, categoryNames: [e.target.value] })}
                className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-primary block">Tags (Comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. signature, heavyweight, polo"
              className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Media Assets */}
        <div className="bg-white border border-brand-border p-6 space-y-4">
          <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
            Media Assets (Static Image URLs)
          </h2>
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-primary block">Primary Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none font-mono text-[11px]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-primary block">Gallery Images (One URL per line)</label>
            <textarea
              rows={3}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
              className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Section 3: Variants & Inventory Matrix */}
        <div className="bg-white border border-brand-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <div>
              <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
                Variants & Inventory Matrix
              </h2>
              <p className="text-xs text-grey-50">
                Configure prices in BDT and allocated stock at Dhaka Central Warehouse.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddVariant}
              className="px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent flex items-center gap-1 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-brand-surface text-grey-60 font-semibold border-b border-brand-border uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Variant Title *</th>
                  <th className="p-2.5">SKU *</th>
                  <th className="p-2.5">Price (BDT) *</th>
                  <th className="p-2.5">Stock Quantity *</th>
                  <th className="p-2.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {formData.variants.map((variant, index) => (
                  <tr key={variant.id || index}>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required
                        value={variant.title}
                        onChange={(e) => handleVariantChange(index, "title", e.target.value)}
                        placeholder="e.g. Black / M"
                        className="w-full px-2 py-1.5 border border-brand-border bg-white text-xs"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        required
                        value={variant.sku}
                        onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                        placeholder="LB-TSH-BLK-M"
                        className="w-full px-2 py-1.5 border border-brand-border bg-white text-xs font-mono uppercase"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        required
                        min={0}
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", Number(e.target.value))}
                        className="w-28 px-2 py-1.5 border border-brand-border bg-white text-xs font-mono"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="number"
                        required
                        min={0}
                        value={variant.inventoryQuantity}
                        onChange={(e) =>
                          handleVariantChange(index, "inventoryQuantity", Number(e.target.value))
                        }
                        className="w-28 px-2 py-1.5 border border-brand-border bg-white text-xs font-mono"
                      />
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(index)}
                        disabled={formData.variants.length <= 1}
                        className="text-grey-40 hover:text-rose-600 disabled:opacity-20 p-1 rounded"
                        title="Delete variant"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
          <Link
            href="/demo-admin/products"
            className="px-6 py-3 border border-brand-border bg-white text-xs font-semibold text-grey-70 hover:bg-brand-secondary rounded transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-8 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent rounded transition-colors shadow-md"
          >
            {existing ? "Save Garment Changes" : "Create Garment"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function DemoAdminProductPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-grey-50">Loading product editor...</div>}>
      <ProductEditorContent />
    </Suspense>
  )
}
