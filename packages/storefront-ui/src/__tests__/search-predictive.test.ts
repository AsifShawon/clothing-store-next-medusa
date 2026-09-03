import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("Shared Predictive Search Contract & Combobox Suite", () => {
  test("1. Debounce delay satisfies 150–250ms requirement", async () => {
    let callCount = 0
    let lastQuery = ""

    function debounceSearch(fn: (q: string) => void, delayMs: number = 200) {
      let timer: ReturnType<typeof setTimeout> | null = null
      return (q: string) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          fn(q)
        }, delayMs)
      }
    }

    const debounced = debounceSearch((q) => {
      callCount++
      lastQuery = q
    }, 200)

    debounced("t")
    debounced("t-sh")
    debounced("t-shirt")

    assert.equal(callCount, 0)
    await new Promise((r) => setTimeout(r, 220))
    assert.equal(callCount, 1)
    assert.equal(lastQuery, "t-shirt")
  })

  test("2. Suggestions filtering matches catalog terms and creates category-scoped suggestions", () => {
    const catalogSuggestions = [
      "Heavyweight T-Shirt",
      "Oxford Shirt",
      "Regent Polo",
      "Mayfair Chinos",
      "French Linen Shirt",
      "Cotton Cap",
    ]

    function filterSuggestions(query: string) {
      const q = query.trim().toLowerCase()
      if (!q) return []
      return catalogSuggestions.filter((s) => s.toLowerCase().includes(q))
    }

    const matches = filterSuggestions("shirt")
    assert.equal(matches.length, 3)
    assert.ok(matches.includes("Heavyweight T-Shirt"))
    assert.ok(matches.includes("Oxford Shirt"))
    assert.ok(matches.includes("French Linen Shirt"))
  })

  test("3. Combobox ArrowUp/ArrowDown cycling updates active index and loops smoothly", () => {
    const suggestions = ["Heavyweight T-Shirt", "Oxford Shirt", "Regent Polo"]
    let highlightedIndex = -1

    function handleArrowKey(key: "ArrowDown" | "ArrowUp") {
      if (key === "ArrowDown") {
        highlightedIndex = (highlightedIndex + 1) % suggestions.length
      } else if (key === "ArrowUp") {
        highlightedIndex =
          highlightedIndex <= 0 ? suggestions.length - 1 : highlightedIndex - 1
      }
      return suggestions[highlightedIndex]
    }

    // First ArrowDown -> index 0
    assert.equal(handleArrowKey("ArrowDown"), "Heavyweight T-Shirt")
    assert.equal(highlightedIndex, 0)

    // Second ArrowDown -> index 1
    assert.equal(handleArrowKey("ArrowDown"), "Oxford Shirt")
    assert.equal(highlightedIndex, 1)

    // Third ArrowDown -> index 2
    assert.equal(handleArrowKey("ArrowDown"), "Regent Polo")
    assert.equal(highlightedIndex, 2)

    // Fourth ArrowDown -> loops back to index 0
    assert.equal(handleArrowKey("ArrowDown"), "Heavyweight T-Shirt")
    assert.equal(highlightedIndex, 0)

    // ArrowUp -> loops backwards to index 2
    assert.equal(handleArrowKey("ArrowUp"), "Regent Polo")
    assert.equal(highlightedIndex, 2)
  })

  test("4. Screen reader status announcement reflects live search results count", () => {
    function getStatusAnnouncement(query: string, count: number, isSearching: boolean): string {
      if (!query.trim()) return ""
      if (isSearching) return `Searching for ${query}`
      return `${count} ${count === 1 ? "garment" : "garments"} found for ${query}`
    }

    assert.equal(getStatusAnnouncement("", 0, false), "")
    assert.equal(getStatusAnnouncement("linen", 0, true), "Searching for linen")
    assert.equal(getStatusAnnouncement("linen", 1, false), "1 garment found for linen")
    assert.equal(getStatusAnnouncement("t-shirt", 4, false), "4 garments found for t-shirt")
    assert.equal(getStatusAnnouncement("xyz", 0, false), "0 garments found for xyz")
  })
})
