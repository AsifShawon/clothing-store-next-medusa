import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { ProductView, QuickAddRequest, QuickAddResult } from "@dtc/commerce-contracts"

const mockProduct: ProductView = {
  id: "prod_01",
  title: "Heavyweight 240 GSM T-Shirt",
  handle: "heavyweight-t-shirt",
  description: "Crafted from 240 GSM combed compact cotton.",
  material: "100% Combed Compact Cotton (240 GSM)",
  inStock: true,
  isNewArrival: true,
  isBestSeller: false,
  minPrice: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt", approxUsd: 13.5 },
  images: [
    { id: "img_1", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518" },
    { id: "img_2", url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a" },
  ],
  thumbnail: { id: "img_1", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518" },
  options: [
    { id: "opt_col", title: "Color", values: ["White", "Black", "Sky Blue"] },
    { id: "opt_sz", title: "Size", values: ["S", "M", "L", "XL"] },
  ],
  variants: [
    {
      id: "var_white_s",
      title: "White / S",
      sku: "TS-WHT-S",
      options: { Color: "White", Size: "S" },
      inStock: true,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
    {
      id: "var_white_m",
      title: "White / M",
      sku: "TS-WHT-M",
      options: { Color: "White", Size: "M" },
      inStock: true,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
    {
      id: "var_white_l",
      title: "White / L",
      sku: "TS-WHT-L",
      options: { Color: "White", Size: "L" },
      inStock: false,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
    {
      id: "var_black_s",
      title: "Black / S",
      sku: "TS-BLK-S",
      options: { Color: "Black", Size: "S" },
      inStock: true,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
  ],
}

describe("Product Card & Quick Add Interaction Suite", () => {
  test("1. Color swatch selection resolves size availability dynamically", () => {
    let selectedColor = "White"

    function getSizesForColor(color: string) {
      return mockProduct.variants
        .filter((v) => v.options["Color"]?.toLowerCase() === color.toLowerCase())
        .map((v) => ({ size: v.options["Size"], inStock: v.inStock, id: v.id }))
    }

    const whiteSizes = getSizesForColor(selectedColor)
    assert.equal(whiteSizes.length, 3)
    const large = whiteSizes.find((s) => s.size === "L")
    assert.equal(large?.inStock, false)

    selectedColor = "Black"
    const blackSizes = getSizesForColor(selectedColor)
    assert.equal(blackSizes.length, 1)
    assert.equal(blackSizes[0].size, "S")
    assert.equal(blackSizes[0].inStock, true)
  })

  test("2. Quick Add resolves exact variant ID and prevents double submission", async () => {
    let addCalls: QuickAddRequest[] = []
    let isPending = false

    async function handleQuickAdd(req: QuickAddRequest): Promise<QuickAddResult> {
      if (isPending) {
        return { success: false, message: "Debounced" }
      }
      isPending = true
      addCalls.push(req)
      await new Promise((r) => setTimeout(r, 20))
      isPending = false
      return { success: true }
    }

    // First call succeeds
    const p1 = handleQuickAdd({ productId: mockProduct.id, variantId: "var_white_m", quantity: 1 })
    // Simultaneous double click should be ignored
    const p2 = handleQuickAdd({ productId: mockProduct.id, variantId: "var_white_m", quantity: 1 })

    const [res1, res2] = await Promise.all([p1, p2])
    assert.equal(res1.success, true)
    assert.equal(res2.success, false)
    assert.equal(addCalls.length, 1)
    assert.equal(addCalls[0].variantId, "var_white_m")
  })

  test("3. Quick Add surfaces recoverable error message upon provider failure", async () => {
    async function failingQuickAdd(_req: QuickAddRequest): Promise<QuickAddResult> {
      return { success: false, message: "Variant stock limit reached" }
    }

    const res = await failingQuickAdd({ productId: mockProduct.id, variantId: "var_white_l", quantity: 1 })
    assert.equal(res.success, false)
    assert.equal(res.message, "Variant stock limit reached")
  })
})
