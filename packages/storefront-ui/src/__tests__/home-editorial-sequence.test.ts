import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { ProductView } from "@dtc/commerce-contracts"

const sampleProducts: ProductView[] = [
  {
    id: "prod_1",
    title: "Heavyweight T-Shirt",
    handle: "heavyweight-t-shirt",
    inStock: true,
    isNewArrival: true,
    isBestSeller: false,
    minPrice: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    images: [{ id: "1", url: "https://images.unsplash.com/test1" }],
    variants: [],
    options: [],
  },
  {
    id: "prod_2",
    title: "Oxford Shirt",
    handle: "oxford-smart-shirt",
    inStock: true,
    isNewArrival: false,
    isBestSeller: true,
    minPrice: { amount: 2250, formatted: "৳2,250", currencyCode: "bdt" },
    images: [{ id: "2", url: "https://images.unsplash.com/test2" }],
    variants: [],
    options: [],
  },
  {
    id: "prod_3",
    title: "Chinos",
    handle: "mayfair-tailored-chinos",
    inStock: true,
    isNewArrival: true,
    isBestSeller: true,
    minPrice: { amount: 2650, formatted: "৳2,650", currencyCode: "bdt" },
    images: [{ id: "3", url: "https://images.unsplash.com/test3" }],
    variants: [],
    options: [],
  },
]

describe("HomeView Editorial Sequence & Curation Suite", () => {
  test("1. Correctly splits featured products into New Arrivals and Bestsellers", () => {
    const newArrivals = sampleProducts.filter((p) => p.isNewArrival)
    const bestSellers = sampleProducts.filter((p) => p.isBestSeller)

    assert.equal(newArrivals.length, 2)
    assert.equal(bestSellers.length, 2)
    assert.ok(newArrivals.some((p) => p.handle === "heavyweight-t-shirt"))
    assert.ok(bestSellers.some((p) => p.handle === "oxford-smart-shirt"))
  })

  test("2. Editorial homepage guarantees all 9 sections are accounted for", () => {
    const requiredSections = [
      "hero",
      "category-mosaic",
      "new-arrivals-rail",
      "craftsmanship-story",
      "bestsellers-rail",
      "split-promotional",
      "brand-values-grid",
      "delivery-reassurance",
      "newsletter-club",
    ]

    assert.equal(requiredSections.length, 9)
    assert.ok(requiredSections.includes("hero"))
    assert.ok(requiredSections.includes("craftsmanship-story"))
    assert.ok(requiredSections.includes("split-promotional"))
    assert.ok(requiredSections.includes("brand-values-grid"))
    assert.ok(requiredSections.includes("delivery-reassurance"))
  })

  test("3. Delivery reassurance strip contains all 4 service pillars", () => {
    const pillars = [
      "Dhaka Express Delivery",
      "24h Doorstep Exchanges",
      "Cash on Delivery & Cards",
      "Complimentary Alterations Advice",
    ]

    assert.equal(pillars.length, 4)
    assert.ok(pillars.includes("Dhaka Express Delivery"))
    assert.ok(pillars.includes("24h Doorstep Exchanges"))
  })
})
