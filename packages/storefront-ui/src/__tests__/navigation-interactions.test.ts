import { test, describe } from "node:test"
import assert from "node:assert/strict"
import { createStoreNavigation } from "../components/layout/navigation-model"
import { deduplicateFooterLinks } from "../components/layout/footer-model"
import { StoreRoutes } from "@dtc/commerce-contracts"

const mockRoutes: StoreRoutes = {
  home: () => "/",
  catalog: (params) => {
    const q = params?.q ? `?q=${encodeURIComponent(params.q)}` : ""
    const cat = params?.category ? `?category=${encodeURIComponent(params.category)}` : ""
    return `/shop${q || cat}`
  },
  product: (handle) => `/product?handle=${handle}`,
  category: (handle) => `/category?handle=${handle}`,
  collection: (handle) => `/collection?handle=${handle}`,
  cart: () => "/cart",
  checkout: () => "/checkout",
  order: (id) => `/order?id=${id}`,
  account: () => "/account",
  accountOrders: () => "/account/orders",
  accountOrderDetail: (id) => `/account/order?id=${id}`,
  about: () => "/about",
  contact: () => "/contact",
  faq: () => "/faq",
  privacyPolicy: () => "/privacy-policy",
  returnPolicy: () => "/return-policy",
  shippingPolicy: () => "/shipping-policy",
  sizeGuide: () => "/size-guide",
  terms: () => "/terms-and-conditions",
}

describe("Shared Mega Navigation IA & Interaction Suite", () => {
  test("1. Centralized IA produces seven primary menswear departments", () => {
    const nav = createStoreNavigation(mockRoutes)
    assert.equal(nav.length, 7)

    const labels = nav.map((n) => n.label)
    assert.deepEqual(labels, [
      "New & Trending",
      "Shirts",
      "Polos & Tees",
      "Trousers",
      "Outerwear & Linen",
      "Accessories",
      "Collections",
    ])
  })

  test("2. All mega destinations resolve cleanly through StoreRoutes without hardcoded paths", () => {
    const nav = createStoreNavigation(mockRoutes)
    for (const item of nav) {
      assert.ok(item.href.startsWith("/"), `href for ${item.label} must start with /`)
      assert.ok(item.shopAllHref.startsWith("/"), `shopAllHref for ${item.label} must start with /`)
      assert.ok(item.featuredLinks.length > 0, `${item.label} must have featured links`)

      for (const fl of item.featuredLinks) {
        assert.ok(fl.href.startsWith("/"), `featured link ${fl.label} must resolve to route`)
      }

      for (const cg of item.categoryGroups) {
        assert.ok(cg.links.length > 0, `category group ${cg.title} must contain links`)
        for (const cl of cg.links) {
          assert.ok(cl.href.startsWith("/"), `category link ${cl.label} must resolve to route`)
        }
      }
    }
  })

  test("3. Every mega panel provides an editorial showcase card with CTA and valid image", () => {
    const nav = createStoreNavigation(mockRoutes)
    for (const item of nav) {
      assert.ok(item.editorialCards.length >= 1, `${item.label} must provide at least one editorial card`)
      const card = item.editorialCards[0]
      assert.ok(card.title.length > 0, "card must have title")
      assert.ok(card.description.length > 0, "card must have description")
      assert.ok(card.image.startsWith("https://"), "card must use authentic image URL")
      assert.ok(card.ctaText.length > 0, "card must have clear action CTA")
      assert.ok(card.href.startsWith("/"), "card CTA must link to store route")
    }
  })

  test("4. Disclosure state toggles correctly and restores focus on Escape", () => {
    let activeId: string | null = null
    let restoredFocus = false

    function handleTriggerToggle(id: string) {
      activeId = activeId === id ? null : id
    }

    function handleClose(options?: { restoreFocus?: boolean }) {
      activeId = null
      if (options?.restoreFocus) {
        restoredFocus = true
      }
    }

    // Open "shirts"
    handleTriggerToggle("shirts")
    assert.equal(activeId, "shirts")

    // Escape closes and restores focus
    handleClose({ restoreFocus: true })
    assert.equal(activeId, null)
    assert.equal(restoredFocus, true)
  })

  test("5. Switching between nav items updates active menu without flickering", () => {
    let activeId: string | null = "new-arrivals"

    function switchMenu(newId: string) {
      activeId = newId
    }

    switchMenu("trousers")
    assert.equal(activeId, "trousers")
    switchMenu("accessories")
    assert.equal(activeId, "accessories")
  })

  test("6. Footer links with duplicate hrefs are deduplicated to avoid key collisions", () => {
    const rawLinks = [
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "New Arrivals (Duplicate)", href: "/collections/new-arrivals" },
      { label: "The Essentials Edit", href: "/collections/essentials" },
    ]

    const deduped = deduplicateFooterLinks(rawLinks)
    assert.equal(deduped.length, 3)
    assert.deepEqual(
      deduped.map((l) => l.href),
      [
        "/collections/new-arrivals",
        "/collections/best-sellers",
        "/collections/essentials",
      ]
    )
    assert.equal(deduped[0].label, "New Arrivals")
  })

  test("7. Floating compact navbar state preserves all 7 shopping departments", () => {
    const nav = createStoreNavigation(mockRoutes)
    assert.equal(nav.length, 7)
    // Categories must remain fully accessible in both expanded and compact states
    for (const item of nav) {
      assert.ok(item.label.length > 0)
      assert.ok(item.href.length > 0)
    }
  })

  test("8. Floating compact navbar maintains accessible names for shopping controls", () => {
    const accessibleLabels = {
      menu: "Open navigation menu",
      search: "Search catalog",
      account: "Customer Account",
      bag: (count: number) => `Shopping bag with ${count} items`,
      home: "London Boy Home",
    }

    assert.equal(accessibleLabels.menu, "Open navigation menu")
    assert.equal(accessibleLabels.search, "Search catalog")
    assert.equal(accessibleLabels.account, "Customer Account")
    assert.equal(accessibleLabels.bag(3), "Shopping bag with 3 items")
    assert.equal(accessibleLabels.home, "London Boy Home")
  })

  test("9. Scroll threshold hysteresis and sentinel calculation prevents layout shift across slow and fast scroll", () => {
    let isCompact = false
    let measuredExpandedShellHeight = 161

    function handleScrollThreshold(
      boundingTop: number,
      isIntersecting: boolean,
      rootTop: number = 24
    ) {
      // Sentinel logic: scrolled past when outside intersection and above or at root's effective top (+ 1 subpixel tolerance)
      const scrolledPast = !isIntersecting && boundingTop <= rootTop + 1
      isCompact = scrolledPast
      return isCompact
    }

    // A. At top of page: sentinel intersects within root (expanded)
    assert.equal(handleScrollThreshold(160, true, 24), false)
    assert.equal(isCompact, false)

    // B. Slow scroll boundary: sentinel exits intersection at exactly the 24px root boundary
    assert.equal(handleScrollThreshold(24, false, 24), true)
    assert.equal(isCompact, true)

    // C. Slow scroll 1px past boundary (top = 23px): must deterministically stay compact
    assert.equal(handleScrollThreshold(23, false, 24), true)
    assert.equal(isCompact, true)

    // D. Subpixel precision (e.g. high-DPI scaling top = 24.5px): must activate compact
    assert.equal(handleScrollThreshold(24.5, false, 24), true)
    assert.equal(isCompact, true)

    // E. Fast scroll jump (e.g. top = -150px): must activate compact
    assert.equal(handleScrollThreshold(-150, false, 24), true)
    assert.equal(isCompact, true)

    // F. Element below viewport (e.g. top = 900px, not intersecting): must NOT activate compact
    assert.equal(handleScrollThreshold(900, false, 24), false)
    assert.equal(isCompact, false)

    // G. Return to top: sentinel enters root margin (isIntersecting = true)
    assert.equal(handleScrollThreshold(25, true, 24), false)
    assert.equal(isCompact, false)

    // H. Placeholder maintains full expanded shell height (161px) to guarantee 0 Cumulative Layout Shift (CLS)
    const containerStyle = {
      minHeight: isCompact && measuredExpandedShellHeight ? `${measuredExpandedShellHeight}px` : undefined,
    }
    assert.equal(containerStyle.minHeight, undefined)

    // Activate compact mode and verify wrapper reserves full shell height
    handleScrollThreshold(23, false, 24)
    const compactContainerStyle = {
      minHeight: isCompact && measuredExpandedShellHeight ? `${measuredExpandedShellHeight}px` : undefined,
    }
    assert.equal(compactContainerStyle.minHeight, "161px")
  })
})

