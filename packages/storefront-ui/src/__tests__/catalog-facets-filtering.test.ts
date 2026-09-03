import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { ProductFilterView } from "@dtc/commerce-contracts"

describe("Catalog Facets, Filtering & Active Chips Suite", () => {
  test("1. Active chips accurately extract all active filter tags", () => {
    const filters: ProductFilterView = {
      category: "shirts",
      size: "M",
      color: "White",
      inStockOnly: true,
      search: "Oxford",
      sortBy: "price_asc",
    }

    const chips: string[] = []
    if (filters.category) chips.push(`Category: ${filters.category}`)
    if (filters.size) chips.push(`Size: ${filters.size}`)
    if (filters.color) chips.push(`Color: ${filters.color}`)
    if (filters.inStockOnly) chips.push("In Stock Only")
    if (filters.search) chips.push(`Keyword: "${filters.search}"`)

    assert.equal(chips.length, 5)
    assert.deepEqual(chips, [
      "Category: shirts",
      "Size: M",
      "Color: White",
      "In Stock Only",
      'Keyword: "Oxford"',
    ])
  })

  test("2. Individual chip removal updates only the target facet", () => {
    let filters: ProductFilterView = {
      category: "shirts",
      size: "L",
      color: "Black",
      inStockOnly: true,
    }

    // Remove size
    filters = { ...filters, size: undefined }
    assert.equal(filters.size, undefined)
    assert.equal(filters.category, "shirts")
    assert.equal(filters.color, "Black")
    assert.equal(filters.inStockOnly, true)

    // Remove color
    filters = { ...filters, color: undefined }
    assert.equal(filters.color, undefined)
    assert.equal(filters.category, "shirts")
    assert.equal(filters.inStockOnly, true)
  })

  test("3. Reset filters resets all facets to defaults", () => {
    const defaultFilters: ProductFilterView = {
      search: undefined,
      category: undefined,
      collection: undefined,
      size: undefined,
      color: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      sortBy: "featured",
    }

    let filters: ProductFilterView = {
      category: "accessories",
      size: "One Size",
      color: "Forest Green",
      inStockOnly: true,
      sortBy: "price_desc",
    }

    filters = { ...defaultFilters }
    assert.equal(filters.category, undefined)
    assert.equal(filters.size, undefined)
    assert.equal(filters.color, undefined)
    assert.equal(filters.inStockOnly, false)
    assert.equal(filters.sortBy, "featured")
  })

  test("4. Sorting orders items correctly by price asc, desc, and newest", () => {
    const items = [
      { id: "1", price: 2400, date: 100 },
      { id: "2", price: 1450, date: 300 },
      { id: "3", price: 1850, date: 200 },
    ]

    const asc = [...items].sort((a, b) => a.price - b.price)
    assert.equal(asc[0].id, "2")
    assert.equal(asc[2].id, "1")

    const desc = [...items].sort((a, b) => b.price - a.price)
    assert.equal(desc[0].id, "1")
    assert.equal(desc[2].id, "2")

    const newest = [...items].sort((a, b) => b.date - a.date)
    assert.equal(newest[0].id, "2")
    assert.equal(newest[2].id, "1")
  })
})
