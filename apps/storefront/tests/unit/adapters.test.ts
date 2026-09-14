import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { toCartItemView, toCartTotalsView } from "../../src/adapters/medusa/cart"
import { toProductView, toImageView } from "../../src/adapters/medusa/catalog"
import { HttpTypes } from "@medusajs/types"

describe("Storefront Commerce Contracts Adapters Tests", () => {
  it("1. toImageView generates fallback alt text and preserves id/url", () => {
    const img = toImageView({ id: "img_123", url: "https://example.com/tee.jpg" })
    assert.strictEqual(img.id, "img_123")
    assert.strictEqual(img.url, "https://example.com/tee.jpg")
    assert.strictEqual(img.altText, "London Boy Garment")
  })

  it("2. toProductView maps Medusa product variants and calculates price bounds", () => {
    const medusaProduct = {
      id: "prod_1",
      title: "Signature Heavyweight T-Shirt",
      handle: "heavyweight-t-shirt",
      description: "240 GSM Combed Cotton",
      thumbnail: "https://example.com/thumb.jpg",
      images: [{ id: "img_1", url: "https://example.com/img1.jpg" }],
      options: [
        {
          id: "opt_size",
          title: "Size",
          product_id: "prod_1",
          values: [{ id: "val_s", value: "S" }, { id: "val_m", value: "M" }],
        },
      ],
      variants: [
        {
          id: "var_1",
          title: "S",
          sku: "LB-TEE-BLK-S",
          inventory_quantity: 15,
          manage_inventory: true,
          options: [{ id: "optval_1", option_id: "opt_size", value: "S" }],
          calculated_price: {
            id: "price_1",
            calculated_amount: 1250,
            original_amount: 1500,
            currency_code: "bdt",
          },
        },
        {
          id: "var_2",
          title: "M",
          sku: "LB-TEE-BLK-M",
          inventory_quantity: 0,
          manage_inventory: true,
          options: [{ id: "optval_2", option_id: "opt_size", value: "M" }],
          calculated_price: {
            id: "price_2",
            calculated_amount: 1250,
            original_amount: 1500,
            currency_code: "bdt",
          },
        },
      ],
    }

    const view = toProductView(medusaProduct as unknown as HttpTypes.StoreProduct, "bdt")
    assert.strictEqual(view.id, "prod_1")
    assert.strictEqual(view.title, "Signature Heavyweight T-Shirt")
    assert.strictEqual(view.variants.length, 2)
    assert.strictEqual(view.variants[0].inStock, true)
    assert.strictEqual(view.variants[1].inStock, false)
    assert.strictEqual(view.minPrice.amount, 1250)
  })

  it("3. toCartItemView correctly calculates unit and total money views", () => {
    const medusaLineItem: Partial<HttpTypes.StoreCartLineItem> = {
      id: "item_1",
      product_id: "prod_1",
      title: "Signature Heavyweight T-Shirt",
      unit_price: 1250,
      total: 2500,
      quantity: 2,
      thumbnail: "https://example.com/thumb.jpg",
    }

    const view = toCartItemView(medusaLineItem as HttpTypes.StoreCartLineItem, "bdt")
    assert.strictEqual(view.id, "item_1")
    assert.strictEqual(view.quantity, 2)
    assert.strictEqual(view.unitPrice.amount, 1250)
    assert.strictEqual(view.totalPrice.amount, 2500)
    assert.strictEqual(view.unitPrice.currencyCode, "bdt")
  })

  it("4. toCartTotalsView safely aggregates subtotal, discounts, shipping, and total", () => {
    const cart: Partial<HttpTypes.StoreCart> = {
      subtotal: 2500,
      discount_total: 250,
      shipping_total: 60,
      tax_total: 0,
      total: 2310,
    }

    const totals = toCartTotalsView(cart as HttpTypes.StoreCart, "bdt")
    assert.strictEqual(totals.subtotal.amount, 2500)
    assert.strictEqual(totals.discount?.amount, 250)
    assert.strictEqual(totals.shipping?.amount, 60)
    assert.strictEqual(totals.total.amount, 2310)
  })
})
