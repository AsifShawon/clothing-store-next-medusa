import { getBaseURL } from "./env"
import { Metadata } from "next"
import { HttpTypes } from "@medusajs/types"

export const DEFAULT_STORE_NAME = "London Boy"
export const DEFAULT_STORE_TAGLINE = "Modern British Clothing | Tailored for Bangladesh"
export const DEFAULT_STORE_DESCRIPTION =
  "Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing crafted with 240 GSM combed cotton for Bangladesh."

/**
 * Ensures absolute canonical URL with correct base domain
 */
export function getCanonicalUrl(path: string = ""): string {
  const base = getBaseURL().replace(/\/$/, "")
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${base}${cleanPath}`
}

/**
 * Builds standard OpenGraph and Twitter card metadata
 */
export function constructMetadata({
  title,
  description = DEFAULT_STORE_DESCRIPTION,
  image,
  canonical,
  noIndex = false,
}: {
  title: string
  description?: string
  image?: string
  canonical?: string
  noIndex?: boolean
}): Metadata {
  const base = getBaseURL()
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${base}${image.startsWith("/") ? image : `/${image}`}`
    : `${base}/opengraph-image.jpg`

  const canonicalUrl = canonical ? getCanonicalUrl(canonical) : undefined

  return {
    title,
    description,
    metadataBase: new URL(base),
    ...(canonicalUrl && {
      alternates: {
        canonical: canonicalUrl,
      },
    }),
    openGraph: {
      title,
      description,
      url: canonicalUrl || base,
      siteName: DEFAULT_STORE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
      locale: "en_BD",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
        noarchive: true,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    }),
  }
}

/**
 * Schema.org Organization JSON-LD
 */
export function getOrganizationSchema() {
  const base = getBaseURL().replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: DEFAULT_STORE_NAME,
    url: base,
    logo: `${base}/opengraph-image.jpg`,
    description: DEFAULT_STORE_DESCRIPTION,
    email: "londonboy@mack.com.bd",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tejgaon Industrial Area",
      addressLocality: "Dhaka",
      addressRegion: "Dhaka Division",
      postalCode: "1208",
      addressCountry: "BD",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "londonboy@mack.com.bd",
        areaServed: "BD",
        availableLanguage: ["English", "Bengali"],
      },
    ],
  }
}

/**
 * Schema.org Product JSON-LD
 */
export function getProductSchema({
  product,
  region,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  const base = getBaseURL().replace(/\/$/, "")
  const canonicalUrl = `${base}/${countryCode}/products/${product.handle}`
  const images = (product.images || [])
    .map((img) => img.url)
    .filter(Boolean) as string[]
  if (product.thumbnail && !images.includes(product.thumbnail)) {
    images.unshift(product.thumbnail)
  }

  // Calculate cheapest price or price from variants
  let minPrice = 0
  let inStock = false
  const currency = region.currency_code.toUpperCase()

  if (product.variants && product.variants.length > 0) {
    const prices = product.variants
      .map((v) => v.calculated_price?.calculated_amount)
      .filter((p): p is number => typeof p === "number")
    if (prices.length > 0) {
      minPrice = Math.min(...prices)
    }

    inStock = product.variants.some((v) => {
      if (!v.manage_inventory) return true
      if (v.allow_backorder) return true
      return (v.inventory_quantity || 0) > 0
    })
  }

  const defaultSku = product.variants?.[0]?.sku || `LB-${product.id.slice(-6).toUpperCase()}`

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.subtitle || product.title,
    image: images.length > 0 ? images : [`${base}/opengraph-image.jpg`],
    sku: defaultSku,
    brand: {
      "@type": "Brand",
      name: DEFAULT_STORE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: currency,
      price: minPrice.toString(),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: DEFAULT_STORE_NAME,
      },
    },
  }
}

/**
 * Schema.org BreadcrumbList JSON-LD
 */
export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  const base = getBaseURL().replace(/\/$/, "")
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith("http")
        ? item.url
        : `${base}${item.url.startsWith("/") ? item.url : `/${item.url}`}`
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: fullUrl,
      }
    }),
  }
}

/**
 * Schema.org FAQPage JSON-LD
 */
export function getFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
