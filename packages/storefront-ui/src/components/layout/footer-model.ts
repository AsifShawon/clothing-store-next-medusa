export interface FooterLinkItem {
  label: string
  href: string
}

export const DEFAULT_CATEGORIES: FooterLinkItem[] = [
  { label: "Shirts & Tailoring", href: "/category?handle=shirts" },
  { label: "Polos & Heavyweight Tees", href: "/shop" },
  { label: "Mayfair Chinos & Trousers", href: "/category?handle=chinos" },
  { label: "French Linen Collection", href: "/category?handle=women" },
  { label: "Caps & Accessories", href: "/category?handle=accessories" },
]

export const DEFAULT_COLLECTIONS: FooterLinkItem[] = [
  { label: "New Arrivals", href: "/collection?handle=new-arrivals" },
  { label: "Iconic Bestsellers", href: "/collection?handle=best-sellers" },
  { label: "The Wardrobe Essentials", href: "/collection?handle=essentials" },
  { label: "All Garments", href: "/shop" },
]

export const DEFAULT_CUSTOMER_CARE: FooterLinkItem[] = [
  { label: "Size & Fit Guide", href: "/size-guide" },
  { label: "Frequently Asked Questions (FAQ)", href: "/faq" },
  { label: "Our Story & Craftsmanship", href: "/about" },
  { label: "Customer Concierge", href: "/contact" },
  { label: "Shipping & Delivery Rates", href: "/shipping-policy" },
  { label: "24-Hour Easy Exchanges", href: "/return-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
]

export function deduplicateFooterLinks(links: FooterLinkItem[] = []): FooterLinkItem[] {
  const seen = new Set<string>()
  return links.filter((link) => {
    if (!link?.href || seen.has(link.href)) {
      return false
    }
    seen.add(link.href)
    return true
  })
}
