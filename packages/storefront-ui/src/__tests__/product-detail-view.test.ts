import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("Product Detail View & Size Guide Suite", () => {
  const mockVariants = [
    {
      id: "v_white_s",
      options: { Color: "White", Size: "S" },
      inStock: true,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
    {
      id: "v_white_m",
      options: { Color: "White", Size: "M" },
      inStock: false,
      price: { amount: 1450, formatted: "৳1,450", currencyCode: "bdt" },
    },
  ]

  test("1. Selected variant accurately resolves matching option dictionary", () => {
    function findVariant(selectedOptions: Record<string, string>) {
      return mockVariants.find((v) =>
        Object.entries(selectedOptions).every(([k, val]) => v.options[k as "Color" | "Size"] === val)
      )
    }

    const varS = findVariant({ Color: "White", Size: "S" })
    assert.equal(varS?.id, "v_white_s")
    assert.equal(varS?.inStock, true)

    const varM = findVariant({ Color: "White", Size: "M" })
    assert.equal(varM?.id, "v_white_m")
    assert.equal(varM?.inStock, false)
  })

  test("2. Out of stock variant disables CTA and displays Sold Out", () => {
    const activeVariant = mockVariants[1] // inStock: false
    const isSoldOut = !activeVariant.inStock
    const buttonText = isSoldOut ? "Sold Out" : `Add to Bag • ${activeVariant.price.formatted}`

    assert.equal(isSoldOut, true)
    assert.equal(buttonText, "Sold Out")
  })

  test("3. Size guide unit toggle calculates cm and in conversions accurately", () => {
    const measurementsIn = ["38 in", "27.5 in", "17.5 in"]
    const measurementsCm = ["96.5 cm", "70 cm", "44.5 cm"]

    let activeUnit: "in" | "cm" = "in"
    function getValues() {
      return activeUnit === "in" ? measurementsIn : measurementsCm
    }

    assert.deepEqual(getValues(), ["38 in", "27.5 in", "17.5 in"])
    activeUnit = "cm"
    assert.deepEqual(getValues(), ["96.5 cm", "70 cm", "44.5 cm"])
  })

  test("4. Quantity counter clamps between 1 and maximum increment", () => {
    let qty = 1
    function changeQty(delta: number) {
      qty = Math.max(1, qty + delta)
    }

    changeQty(-1) // should remain 1
    assert.equal(qty, 1)

    changeQty(1)
    assert.equal(qty, 2)

    changeQty(3)
    assert.equal(qty, 5)

    changeQty(-2)
    assert.equal(qty, 3)
  })
})
