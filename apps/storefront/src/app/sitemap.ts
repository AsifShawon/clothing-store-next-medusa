import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { getBaseURL } from "@lib/util/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL().replace(/\/$/, "")

  try {
    const regions = await listRegions().catch(() => [])
    const countryCodes = (regions || [])
      .map((r) => r.countries?.map((c) => c.iso_2))
      .flat()
      .filter(Boolean) as string[]

    const primaryCountry = countryCodes[0] || "bd"

    // Fetch all catalog entities
    const [{ response: productRes }, { collections }, categories] =
      await Promise.all([
        listProducts({
          countryCode: primaryCountry,
          queryParams: { limit: 100, fields: "id,handle,updated_at" },
        }).catch(() => ({ response: { products: [] } })),
        listCollections({ fields: "id,handle,updated_at" }).catch(() => ({
          collections: [],
        })),
        listCategories().catch(() => []),
      ])

    const currentDate = new Date()

    // 1. Static Core Pages
    const staticRoutes = [
      { path: "", priority: 1.0, changeFrequency: "daily" as const },
      { path: "/store", priority: 0.9, changeFrequency: "daily" as const },
      { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
      { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
      { path: "/shipping-policy", priority: 0.6, changeFrequency: "monthly" as const },
      { path: "/return-policy", priority: 0.6, changeFrequency: "monthly" as const },
      { path: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" as const },
      { path: "/terms-and-conditions", priority: 0.5, changeFrequency: "monthly" as const },
      { path: "/size-guide", priority: 0.7, changeFrequency: "monthly" as const },
      { path: "/faq", priority: 0.7, changeFrequency: "weekly" as const },
    ]

    const staticEntries: MetadataRoute.Sitemap = []

    // Add root entry
    staticEntries.push({
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    })

    for (const country of countryCodes.length > 0 ? countryCodes : ["bd"]) {
      for (const route of staticRoutes) {
        staticEntries.push({
          url: `${baseUrl}/${country}${route.path}`,
          lastModified: currentDate,
          changeFrequency: route.changeFrequency,
          priority: route.priority,
        })
      }
    }

    // 2. Dynamic Product Pages
    const productEntries: MetadataRoute.Sitemap = []
    for (const country of countryCodes.length > 0 ? countryCodes : ["bd"]) {
      for (const product of productRes?.products || []) {
        if (product.handle) {
          productEntries.push({
            url: `${baseUrl}/${country}/products/${product.handle}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : currentDate,
            changeFrequency: "weekly",
            priority: 0.85,
          })
        }
      }
    }

    // 3. Dynamic Collection Pages
    const collectionEntries: MetadataRoute.Sitemap = []
    for (const country of countryCodes.length > 0 ? countryCodes : ["bd"]) {
      for (const collection of collections || []) {
        if (collection.handle) {
          collectionEntries.push({
            url: `${baseUrl}/${country}/collections/${collection.handle}`,
            lastModified: collection.updated_at ? new Date(collection.updated_at) : currentDate,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }

    // 4. Dynamic Category Pages
    const categoryEntries: MetadataRoute.Sitemap = []
    for (const country of countryCodes.length > 0 ? countryCodes : ["bd"]) {
      for (const category of categories || []) {
        if (category.handle) {
          categoryEntries.push({
            url: `${baseUrl}/${country}/categories/${category.handle}`,
            lastModified: category.updated_at ? new Date(category.updated_at) : currentDate,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }

    return [
      ...staticEntries,
      ...productEntries,
      ...collectionEntries,
      ...categoryEntries,
    ]
  } catch (error) {
    console.error("Failed to generate XML sitemap:", error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ]
  }
}
