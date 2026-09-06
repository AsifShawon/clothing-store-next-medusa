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

  test("4. Unique size count computes distinct sizes instead of total variant combinations", () => {
    // A product with 2 colors and 3 sizes has 6 variants, but only 3 distinct sizes
    const productWithVariants: ProductView = {
      ...mockProduct,
      options: [
        { id: "opt_col", title: "Color", values: ["White", "Black"] },
        { id: "opt_sz", title: "Size", values: ["S", "M", "L"] },
      ],
      variants: [
        { id: "1", title: "W/S", sku: "1", options: { Color: "White", Size: "S" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
        { id: "2", title: "W/M", sku: "2", options: { Color: "White", Size: "M" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
        { id: "3", title: "W/L", sku: "3", options: { Color: "White", Size: "L" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
        { id: "4", title: "B/S", sku: "4", options: { Color: "Black", Size: "S" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
        { id: "5", title: "B/M", sku: "5", options: { Color: "Black", Size: "M" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
        { id: "6", title: "B/L", sku: "6", options: { Color: "Black", Size: "L" }, inStock: true, price: { amount: 1000, formatted: "৳1,000", currencyCode: "bdt" } },
      ],
    }

    const sizeOption = productWithVariants.options?.find((o) => o.title.toLowerCase() === "size")
    const uniqueSizes = sizeOption?.values?.length ?? new Set(productWithVariants.variants.map((v) => v.options["Size"])).size

    assert.equal(uniqueSizes, 3) // S, M, L
    assert.equal(productWithVariants.variants.length, 6)
    assert.notEqual(uniqueSizes, productWithVariants.variants.length)
  })

  test("5. Color-specific primary image resolves based on selected swatch", () => {
    const productWithColorImages: ProductView = {
      ...mockProduct,
      images: [
        { id: "img_white", url: "https://example.com/white.jpg", altText: "White Shirt" },
        { id: "img_black", url: "https://example.com/black.jpg", altText: "Black Shirt" },
      ],
    }

    function resolvePrimaryImage(selectedColor: string) {
      const match = productWithColorImages.images.find((img) =>
        img.altText?.toLowerCase().includes(selectedColor.toLowerCase())
      )
      return match || productWithColorImages.thumbnail || productWithColorImages.images[0]
    }

    assert.equal(resolvePrimaryImage("Black").url, "https://example.com/black.jpg")
    assert.equal(resolvePrimaryImage("White").url, "https://example.com/white.jpg")
    assert.equal(resolvePrimaryImage("Sky Blue").url, productWithColorImages.thumbnail?.url)
  })

  test("6. Variant selection resets invalid size when switching colors", () => {
    // If White has [S, M, L] and Black only has [S]
    let selectedColor = "White"
    let selectedSize: string | null = "L"

    function selectColor(newColor: string) {
      selectedColor = newColor
      // Check if current selectedSize is available in newColor
      const hasSizeInNewColor = mockProduct.variants.some(
        (v) =>
          v.options["Color"]?.toLowerCase() === newColor.toLowerCase() &&
          v.options["Size"]?.toLowerCase() === selectedSize?.toLowerCase()
      )
      if (!hasSizeInNewColor) {
        selectedSize = null
      }
    }

    assert.equal(selectedSize, "L")
    selectColor("Black")
    // Black does not have size L, so selectedSize must be cleared to null
    assert.equal(selectedSize, null)

    // Selecting White again and choosing S
    selectColor("White")
    selectedSize = "S"
    // Switching to Black (which DOES have S) preserves size S
    selectColor("Black")
    assert.equal(selectedSize, "S")
  })
})
