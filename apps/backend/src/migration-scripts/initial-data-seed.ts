import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductTagsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  deleteRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  updateStoresWorkflow,
  updateRegionsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  // 1. Production Safety Guard
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_PROD_SEED) {
    logger.warn("Skipping development seed script in production environment.")
    return
  }

  logger.info("Starting London Boy store seed (Bangladesh / BDT)...")

  // 2. Sales Channel
  let defaultSalesChannel: { id: string; name: string }
  const { data: existingSalesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })

  if (existingSalesChannels.length > 0) {
    defaultSalesChannel = existingSalesChannels[0]
    logger.info(`Using existing sales channel: ${defaultSalesChannel.name} (${defaultSalesChannel.id})`)
  } else {
    logger.info("Creating London Boy Default Sales Channel...")
    const {
      result: [channel],
    } = await createSalesChannelsWorkflow(container).run({
      input: {
        salesChannelsData: [
          {
            name: "London Boy Default Channel",
            description: "Default sales channel for London Boy e-commerce storefront",
          },
        ],
      },
    })
    defaultSalesChannel = channel
  }

  // 3. Publishable API Key
  let publishableApiKey: { id: string; token?: string; title: string }
  const { data: existingApiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token", "title", "type"],
  })

  const publishableKeyFound = existingApiKeys.find((k: { type: string }) => k.type === "publishable")
  if (publishableKeyFound) {
    publishableApiKey = publishableKeyFound
    logger.info(`Using existing publishable API key: ${publishableApiKey.title} (${publishableApiKey.id})`)
  } else {
    logger.info("Creating London Boy Storefront Publishable API Key...")
    const {
      result: [key],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "London Boy Storefront Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    })
    publishableApiKey = key
  }

  try {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel.id],
      },
    })
  } catch (err) {
    logger.debug(`Sales channel link to API key already exists or skipped: ${err}`)
  }

  // 4. Store Details
  const { data: existingStores } = await query.graph({
    entity: "store",
    fields: ["id", "name"],
  })

  if (existingStores.length > 0) {
    logger.info("Updating existing store settings for London Boy...")
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: existingStores[0].id },
        update: {
          name: "London Boy",
          supported_currencies: [
            {
              currency_code: "bdt",
              is_default: true,
            },
            {
              currency_code: "usd",
              is_default: false,
            },
          ],
          default_sales_channel_id: defaultSalesChannel.id,
        },
      },
    })
  } else {
    logger.info("Creating London Boy Store...")
    await createStoresWorkflow(container).run({
      input: {
        stores: [
          {
            name: "London Boy",
            supported_currencies: [
              {
                currency_code: "bdt",
                is_default: true,
              },
              {
                currency_code: "usd",
                is_default: false,
              },
            ],
            default_sales_channel_id: defaultSalesChannel.id,
          },
        ],
      },
    })
  }

  // 5. Region (Bangladesh - BDT)
  let region: { id: string; name: string }
  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })

  const nonBdRegions = existingRegions.filter(
    (r: { currency_code: string }) => r.currency_code !== "bdt"
  )
  if (nonBdRegions.length > 0) {
    logger.info(`Cleaning up ${nonBdRegions.length} old non-BD region(s)...`)
    try {
      await deleteRegionsWorkflow(container).run({
        input: { ids: nonBdRegions.map((r: { id: string }) => r.id) },
      })
    } catch (e) {
      logger.debug(`Note on removing old regions: ${e}`)
    }
  }

  const bdRegion = existingRegions.find(
    (r: { currency_code: string }) => r.currency_code === "bdt"
  )

  const desiredPaymentProviders = process.env.STRIPE_API_KEY
    ? ["pp_stripe_stripe", "pp_system_default"]
    : ["pp_system_default"]

  if (bdRegion) {
    region = bdRegion
    logger.info(`Using existing Bangladesh region: ${region.name} (${region.id})`)
    try {
      await updateRegionsWorkflow(container).run({
        input: {
          selector: { id: region.id },
          update: {
            payment_providers: desiredPaymentProviders,
          },
        },
      })
    } catch {
      logger.warn("Could not update region payment providers, proceeding with existing configuration.")
    }
  } else {
    logger.info("Creating Bangladesh Region (BDT)...")
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Bangladesh",
            currency_code: "bdt",
            countries: ["bd"],
            payment_providers: desiredPaymentProviders,
          },
        ],
      },
    })
    region = regionResult[0]
  }

  // 6. Tax Region
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  if (!existingTaxRegions.some((tr: { country_code: string }) => tr.country_code === "bd")) {
    logger.info("Creating Bangladesh Tax Region...")
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: "bd",
          provider_id: "tp_system",
        },
      ],
    })
  }

  // 7. Stock Location
  let stockLocation: { id: string; name: string }
  const { data: existingStockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })

  const dhakaLocation = existingStockLocations.find(
    (sl: { name: string }) => sl.name === "Dhaka Central Warehouse"
  )
  if (dhakaLocation) {
    stockLocation = dhakaLocation
    logger.info(`Using existing stock location: ${stockLocation.name} (${stockLocation.id})`)
  } else {
    logger.info("Creating Dhaka Central Warehouse Stock Location...")
    const { result: stockLocationResult } = await createStockLocationsWorkflow(
      container
    ).run({
      input: {
        locations: [
          {
            name: "Dhaka Central Warehouse",
            address: {
              city: "Dhaka",
              country_code: "BD",
              address_1: "Tejgaon Industrial Area",
            },
          },
        ],
      },
    })
    stockLocation = stockLocationResult[0]

    try {
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_provider_id: "manual_manual",
        },
      })
    } catch (e) {
      logger.debug(`Stock location fulfillment provider link already exists: ${e}`)
    }

    try {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: stockLocation.id,
          add: [defaultSalesChannel.id],
        },
      })
    } catch (e) {
      logger.debug(`Stock location sales channel link already exists: ${e}`)
    }
  }

  // 8. Shipping Profile & Fulfillment Set
  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const { data: existingFulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id", "service_zones.name"],
  })

  let serviceZoneId: string
  const existingBdFulfillment = existingFulfillmentSets.find(
    (fs: { name: string }) => fs.name === "Bangladesh Delivery Network"
  )

  if (existingBdFulfillment && existingBdFulfillment.service_zones?.length > 0) {
    serviceZoneId = existingBdFulfillment.service_zones[0].id
    logger.info("Using existing Bangladesh fulfillment service zone.")
  } else {
    logger.info("Creating Bangladesh Fulfillment Set and Service Zones...")
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
      name: "Bangladesh Delivery Network",
      type: "shipping",
      service_zones: [
        {
          name: "Bangladesh Nationwide",
          geo_zones: [
            {
              country_code: "bd",
              type: "country",
            },
          ],
        },
      ],
    })
    serviceZoneId = fulfillmentSet.service_zones[0].id

    try {
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_set_id: fulfillmentSet.id,
        },
      })
    } catch (e) {
      logger.debug(`Stock location fulfillment set link already exists: ${e}`)
    }

    logger.info("Creating standard shipping options for Bangladesh in BDT...")
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Standard Delivery (Inside Dhaka)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Inside Dhaka",
            description: "Delivered within 24-48 hours.",
            code: "inside_dhaka",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 60,
            },
            {
              currency_code: "usd",
              amount: 1,
            },
            {
              region_id: region.id,
              amount: 60,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Dhaka Suburban Delivery",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Dhaka Suburban",
            description: "Delivered in 2-3 business days (Gazipur, Savar, Narayanganj).",
            code: "dhaka_suburban",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 100,
            },
            {
              currency_code: "usd",
              amount: 1.5,
            },
            {
              region_id: region.id,
              amount: 100,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
        {
          name: "Standard Delivery (Outside Dhaka)",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZoneId,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Outside Dhaka",
            description: "Nationwide delivery across Bangladesh in 3-5 business days.",
            code: "outside_dhaka",
          },
          prices: [
            {
              currency_code: "bdt",
              amount: 130,
            },
            {
              currency_code: "usd",
              amount: 2,
            },
            {
              region_id: region.id,
              amount: 130,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
  }

  // 9. Categories: New Arrivals, Men, Women, Accessories
  logger.info("Setting up product categories...")
  const categoryNames = ["New Arrivals", "Men", "Women", "Accessories"]
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })

  const missingCategories = categoryNames.filter(
    (name) => !existingCategories.some((c: { name: string }) => c.name === name)
  )

  let allCategories: any[] = [...existingCategories]
  if (missingCategories.length > 0) {
    const { result: createdCategories } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: missingCategories.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    allCategories = [...allCategories, ...createdCategories]
  }

  const catMap = Object.fromEntries(allCategories.map((c: { name: string; id: string }) => [c.name, c.id]))

  // 10. Collections: New Arrivals, Best Sellers, Essentials
  logger.info("Setting up product collections...")
  const collectionData = [
    { title: "New Arrivals", handle: "new-arrivals" },
    { title: "Best Sellers", handle: "best-sellers" },
    { title: "Essentials", handle: "essentials" },
  ]
  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"],
  })

  const missingCollections = collectionData.filter(
    (col) => !existingCollections.some((c: { handle: string }) => c.handle === col.handle)
  )

  let allCollections: any[] = [...existingCollections]
  if (missingCollections.length > 0) {
    const { result: createdCollections } = await createCollectionsWorkflow(
      container
    ).run({
      input: {
        collections: missingCollections,
      },
    })
    allCollections = [...allCollections, ...createdCollections]
  }

  const colMap = Object.fromEntries(
    allCollections.map((c: { handle: string; id: string }) => [c.handle, c.id])
  )

  // 11. Clean Up Old Sample Products If Existing
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })

  const oldHandlesToDelete = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
  const oldProductIds = existingProducts
    .filter((p: { handle: string }) => oldHandlesToDelete.includes(p.handle))
    .map((p: { id: string }) => p.id)

  if (oldProductIds.length > 0) {
    logger.info(`Removing old sample products: ${oldProductIds.length} items...`)
    try {
      await deleteProductsWorkflow(container).run({
        input: { ids: oldProductIds },
      })
    } catch (e) {
      logger.debug(`Note on deleting old sample products: ${e}`)
    }
  }

  // 12. Check if London Boy catalog products already exist
  const { data: currentProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const currentHandles = new Set(currentProducts.map((p: { handle: string }) => p.handle))

  // 13. Product Tags Setup
  logger.info("Setting up product tags...")
  const tagValues = [
    "t-shirt",
    "heavyweight",
    "smart-casual",
    "signature",
    "shirt",
    "oxford",
    "formal",
    "polo",
    "knitwear",
    "trousers",
    "chinos",
    "bottoms",
    "tailored",
    "linen",
    "summer",
    "relaxed",
    "accessories",
    "cap",
    "headwear",
  ]
  const { data: existingTags } = await query.graph({
    entity: "product_tag",
    fields: ["id", "value"],
  })

  const missingTags = tagValues.filter(
    (val) => !existingTags.some((t: { value: string }) => t.value === val)
  )

  let allTags: any[] = [...existingTags]
  if (missingTags.length > 0) {
    const { result: createdTags } = await createProductTagsWorkflow(
      container
    ).run({
      input: {
        product_tags: missingTags.map((value) => ({ value })),
      },
    })
    allTags = [...allTags, ...createdTags]
  }

  const tagMap = Object.fromEntries(
    allTags.map((t: { value: string; id: string }) => [t.value, t.id])
  )

  // 14. Stock Allocation Map (SKU -> Units)
  const skuStockMap: Record<string, number> = {
    // 1. Heavyweight T-Shirt (8 variants)
    "LB-TEE-HVY-BLK-S": 25,
    "LB-TEE-HVY-BLK-M": 40,
    "LB-TEE-HVY-BLK-L": 35,
    "LB-TEE-HVY-BLK-XL": 20,
    "LB-TEE-HVY-WHT-S": 30,
    "LB-TEE-HVY-WHT-M": 45,
    "LB-TEE-HVY-WHT-L": 30,
    "LB-TEE-HVY-WHT-XL": 15,
    // 2. Oxford Button-Down Shirt (8 variants)
    "LB-SHT-OXF-BLU-S": 20,
    "LB-SHT-OXF-BLU-M": 35,
    "LB-SHT-OXF-BLU-L": 25,
    "LB-SHT-OXF-BLU-XL": 15,
    "LB-SHT-OXF-WHT-S": 25,
    "LB-SHT-OXF-WHT-M": 40,
    "LB-SHT-OXF-WHT-L": 30,
    "LB-SHT-OXF-WHT-XL": 20,
    // 3. Regent Knit Pique Polo (6 variants)
    "LB-POLO-RGT-GRN-M": 30,
    "LB-POLO-RGT-GRN-L": 25,
    "LB-POLO-RGT-GRN-XL": 15,
    "LB-POLO-RGT-NVY-M": 35,
    "LB-POLO-RGT-NVY-L": 30,
    "LB-POLO-RGT-NVY-XL": 20,
    // 4. Mayfair Tailored Chinos (8 variants)
    "LB-TRS-MAY-KHK-30": 15,
    "LB-TRS-MAY-KHK-32": 30,
    "LB-TRS-MAY-KHK-34": 25,
    "LB-TRS-MAY-KHK-36": 15,
    "LB-TRS-MAY-CHC-30": 20,
    "LB-TRS-MAY-CHC-32": 35,
    "LB-TRS-MAY-CHC-34": 25,
    "LB-TRS-MAY-CHC-36": 15,
    // 5. Chelsea Relaxed Linen Shirt (6 variants)
    "LB-W-SHT-LIN-OLV-S": 20,
    "LB-W-SHT-LIN-OLV-M": 30,
    "LB-W-SHT-LIN-OLV-L": 15,
    "LB-W-SHT-LIN-SND-S": 25,
    "LB-W-SHT-LIN-SND-M": 35,
    "LB-W-SHT-LIN-SND-L": 20,
    // 6. Soho Structured Twill Cap (2 variants)
    "LB-ACC-CAP-BLK-OS": 50,
    "LB-ACC-CAP-GRN-OS": 40,
  }

  // 15. Create London Boy 6 Products
  logger.info("Seeding London Boy clothing products...")

  const productsToCreate: any[] = []

  // Product 1: London Boy Signature Heavyweight T-Shirt (8 variants)
  if (!currentHandles.has("heavyweight-t-shirt")) {
    productsToCreate.push({
      title: "London Boy Signature Heavyweight T-Shirt",
      handle: "heavyweight-t-shirt",
      subtitle: "240 GSM Premium Combed Cotton",
      description:
        "The quintessential smart-casual staple. Crafted from 240 GSM high-density combed compact cotton, offering an impeccable structured drape, reinforced ribbed crew neckline, and clean minimal British styling.",
      material: "100% Combed Compact Cotton (240 GSM)",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["essentials"] || colMap["best-sellers"],
      category_ids: [catMap["Men"], catMap["New Arrivals"]].filter(Boolean),
      tag_ids: [tagMap["t-shirt"], tagMap["heavyweight"], tagMap["smart-casual"], tagMap["signature"]].filter(Boolean),
      metadata: {
        care_instructions: "Machine wash cold at 30°C inside out. Reshape while damp. Do not tumble dry. Medium warm iron on reverse.",
        fit: "Modern Regular / Structured Fit",
        origin: "Designed in UK, crafted in Bangladesh",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        },
        {
          url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Black", "White"] },
      ],
      variants: [
        // Black Variants
        {
          title: "S / Black",
          sku: "LB-TEE-HVY-BLK-S",
          manage_inventory: true,
          options: { Size: "S", Color: "Black" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "M / Black",
          sku: "LB-TEE-HVY-BLK-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Black" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "L / Black",
          sku: "LB-TEE-HVY-BLK-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Black" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "XL / Black",
          sku: "LB-TEE-HVY-BLK-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "Black" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        // White Variants
        {
          title: "S / White",
          sku: "LB-TEE-HVY-WHT-S",
          manage_inventory: true,
          options: { Size: "S", Color: "White" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "M / White",
          sku: "LB-TEE-HVY-WHT-M",
          manage_inventory: true,
          options: { Size: "M", Color: "White" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "L / White",
          sku: "LB-TEE-HVY-WHT-L",
          manage_inventory: true,
          options: { Size: "L", Color: "White" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
        {
          title: "XL / White",
          sku: "LB-TEE-HVY-WHT-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "White" },
          prices: [
            { amount: 1250, currency_code: "bdt" },
            { amount: 15, currency_code: "usd" },
          ],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  // Product 2: Oxford Button-Down Smart Shirt (8 variants)
  if (!currentHandles.has("oxford-smart-shirt")) {
    productsToCreate.push({
      title: "Oxford Button-Down Smart Shirt",
      handle: "oxford-smart-shirt",
      subtitle: "100% Cotton Oxford Weave",
      description:
        "Classic British tailoring meets everyday versatility. Cut from durable 180 GSM two-ply Oxford weave cotton, featuring a refined button-down collar, mother-of-pearl finish buttons, and a curved hem.",
      material: "100% Cotton Oxford Weave (180 GSM)",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["essentials"] || colMap["best-sellers"],
      category_ids: [catMap["Men"]].filter(Boolean),
      tag_ids: [tagMap["shirt"], tagMap["oxford"], tagMap["formal"], tagMap["smart-casual"]].filter(Boolean),
      metadata: {
        care_instructions: "Warm machine wash at 40°C with like colors. Line dry in shade. Warm iron.",
        fit: "Tailored Slim Fit",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["S", "M", "L", "XL"] },
        { title: "Color", values: ["Sky Blue", "White"] },
      ],
      variants: [
        // Sky Blue Variants
        {
          title: "S / Sky Blue",
          sku: "LB-SHT-OXF-BLU-S",
          manage_inventory: true,
          options: { Size: "S", Color: "Sky Blue" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "M / Sky Blue",
          sku: "LB-SHT-OXF-BLU-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Sky Blue" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "L / Sky Blue",
          sku: "LB-SHT-OXF-BLU-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Sky Blue" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "XL / Sky Blue",
          sku: "LB-SHT-OXF-BLU-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "Sky Blue" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        // White Variants
        {
          title: "S / White",
          sku: "LB-SHT-OXF-WHT-S",
          manage_inventory: true,
          options: { Size: "S", Color: "White" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "M / White",
          sku: "LB-SHT-OXF-WHT-M",
          manage_inventory: true,
          options: { Size: "M", Color: "White" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "L / White",
          sku: "LB-SHT-OXF-WHT-L",
          manage_inventory: true,
          options: { Size: "L", Color: "White" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
        {
          title: "XL / White",
          sku: "LB-SHT-OXF-WHT-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "White" },
          prices: [{ amount: 2250, currency_code: "bdt" }, { amount: 25, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  // Product 3: Regent Knit Pique Polo (6 variants)
  if (!currentHandles.has("regent-knit-polo")) {
    productsToCreate.push({
      title: "Regent Knit Pique Polo",
      handle: "regent-knit-polo",
      subtitle: "220 GSM Mercerized Pique Cotton",
      description:
        "Elevated smart-casual polo crafted from silky-smooth mercerized pique cotton. Finished with a clean self-fabric collar, ribbed cuffs, and understated tonal London Boy embroidery on the chest.",
      material: "100% Mercerized Pique Cotton (220 GSM)",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["best-sellers"] || colMap["new-arrivals"],
      category_ids: [catMap["Men"], catMap["New Arrivals"]].filter(Boolean),
      tag_ids: [tagMap["polo"], tagMap["knitwear"], tagMap["smart-casual"]].filter(Boolean),
      metadata: {
        care_instructions: "Cold gentle machine wash. Lay flat to dry to preserve knit structure. Do not wring.",
        fit: "Modern Regular Fit",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["M", "L", "XL"] },
        { title: "Color", values: ["Forest Green", "Midnight Navy"] },
      ],
      variants: [
        // Forest Green Variants
        {
          title: "M / Forest Green",
          sku: "LB-POLO-RGT-GRN-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Forest Green" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
        {
          title: "L / Forest Green",
          sku: "LB-POLO-RGT-GRN-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Forest Green" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
        {
          title: "XL / Forest Green",
          sku: "LB-POLO-RGT-GRN-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "Forest Green" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
        // Midnight Navy Variants
        {
          title: "M / Midnight Navy",
          sku: "LB-POLO-RGT-NVY-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Midnight Navy" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
        {
          title: "L / Midnight Navy",
          sku: "LB-POLO-RGT-NVY-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Midnight Navy" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
        {
          title: "XL / Midnight Navy",
          sku: "LB-POLO-RGT-NVY-XL",
          manage_inventory: true,
          options: { Size: "XL", Color: "Midnight Navy" },
          prices: [{ amount: 1850, currency_code: "bdt" }, { amount: 20, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  // Product 4: Mayfair Tailored Chino Trousers (8 variants)
  if (!currentHandles.has("mayfair-tailored-chinos")) {
    productsToCreate.push({
      title: "Mayfair Tailored Chino Trousers",
      handle: "mayfair-tailored-chinos",
      subtitle: "Stretch Cotton Twill (260 GSM)",
      description:
        "The quintessential British chino engineered with 2% elastane for maximum comfort from boardroom to dinner. Features slanted front pockets, buttoned welt rear pockets, and a clean tapered leg.",
      material: "98% Cotton Twill, 2% Elastane (260 GSM)",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["essentials"],
      category_ids: [catMap["Men"]].filter(Boolean),
      tag_ids: [tagMap["trousers"], tagMap["chinos"], tagMap["bottoms"], tagMap["tailored"]].filter(Boolean),
      metadata: {
        care_instructions: "Machine wash at 30°C with similar darks. Iron inside out on medium heat.",
        fit: "Tapered Slim Fit",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["30", "32", "34", "36"] },
        { title: "Color", values: ["Khaki", "Charcoal"] },
      ],
      variants: [
        // Khaki Variants
        {
          title: "30 / Khaki",
          sku: "LB-TRS-MAY-KHK-30",
          manage_inventory: true,
          options: { Size: "30", Color: "Khaki" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "32 / Khaki",
          sku: "LB-TRS-MAY-KHK-32",
          manage_inventory: true,
          options: { Size: "32", Color: "Khaki" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "34 / Khaki",
          sku: "LB-TRS-MAY-KHK-34",
          manage_inventory: true,
          options: { Size: "34", Color: "Khaki" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "36 / Khaki",
          sku: "LB-TRS-MAY-KHK-36",
          manage_inventory: true,
          options: { Size: "36", Color: "Khaki" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        // Charcoal Variants
        {
          title: "30 / Charcoal",
          sku: "LB-TRS-MAY-CHC-30",
          manage_inventory: true,
          options: { Size: "30", Color: "Charcoal" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "32 / Charcoal",
          sku: "LB-TRS-MAY-CHC-32",
          manage_inventory: true,
          options: { Size: "32", Color: "Charcoal" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "34 / Charcoal",
          sku: "LB-TRS-MAY-CHC-34",
          manage_inventory: true,
          options: { Size: "34", Color: "Charcoal" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
        {
          title: "36 / Charcoal",
          sku: "LB-TRS-MAY-CHC-36",
          manage_inventory: true,
          options: { Size: "36", Color: "Charcoal" },
          prices: [{ amount: 2650, currency_code: "bdt" }, { amount: 30, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  // Product 5: Chelsea Relaxed Linen-Blend Shirt (6 variants)
  if (!currentHandles.has("chelsea-relaxed-linen-shirt")) {
    productsToCreate.push({
      title: "Chelsea Relaxed Linen-Blend Shirt",
      handle: "chelsea-relaxed-linen-shirt",
      subtitle: "French Linen & Organic Cotton",
      description:
        "An effortless warm-weather statement piece. Woven from breathable French flax linen and premium organic cotton for a soft hand-feel that softens with every wash. Designed with a camp collar and boxy silhouette.",
      material: "55% French Linen, 45% Organic Cotton",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["new-arrivals"],
      category_ids: [catMap["Women"], catMap["New Arrivals"]].filter(Boolean),
      tag_ids: [tagMap["shirt"], tagMap["linen"], tagMap["summer"], tagMap["relaxed"]].filter(Boolean),
      metadata: {
        care_instructions: "Cold gentle cycle. Do not bleach. Dry in shade. Iron while slightly damp for crisp look.",
        fit: "Relaxed Boxy Fit",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["S", "M", "L"] },
        { title: "Color", values: ["Olive", "Sand"] },
      ],
      variants: [
        // Olive Variants
        {
          title: "S / Olive",
          sku: "LB-W-SHT-LIN-OLV-S",
          manage_inventory: true,
          options: { Size: "S", Color: "Olive" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
        {
          title: "M / Olive",
          sku: "LB-W-SHT-LIN-OLV-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Olive" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
        {
          title: "L / Olive",
          sku: "LB-W-SHT-LIN-OLV-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Olive" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
        // Sand Variants
        {
          title: "S / Sand",
          sku: "LB-W-SHT-LIN-SND-S",
          manage_inventory: true,
          options: { Size: "S", Color: "Sand" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
        {
          title: "M / Sand",
          sku: "LB-W-SHT-LIN-SND-M",
          manage_inventory: true,
          options: { Size: "M", Color: "Sand" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
        {
          title: "L / Sand",
          sku: "LB-W-SHT-LIN-SND-L",
          manage_inventory: true,
          options: { Size: "L", Color: "Sand" },
          prices: [{ amount: 2450, currency_code: "bdt" }, { amount: 28, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  // Product 6: Soho Structured Cotton Twill Cap (2 variants)
  if (!currentHandles.has("soho-cotton-twill-cap")) {
    productsToCreate.push({
      title: "Soho Structured Cotton Twill Cap",
      handle: "soho-cotton-twill-cap",
      subtitle: "Heavy Brushed Cotton Twill",
      description:
        "Minimal 6-panel baseball cap built from durable brushed cotton twill. Features an antique brass adjustable buckle, stitched ventilation eyelets, and tonal London Boy crown insignia.",
      material: "100% Brushed Cotton Twill",
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      collection_id: colMap["essentials"],
      category_ids: [catMap["Accessories"]].filter(Boolean),
      tag_ids: [tagMap["accessories"], tagMap["cap"], tagMap["headwear"]].filter(Boolean),
      metadata: {
        care_instructions: "Spot clean with a damp cloth and mild detergent. Do not submerge or machine wash.",
        fit: "Adjustable One Size",
        placeholder_asset: "true",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
        },
      ],
      options: [
        { title: "Size", values: ["One Size"] },
        { title: "Color", values: ["Black", "Forest Green"] },
      ],
      variants: [
        {
          title: "One Size / Black",
          sku: "LB-ACC-CAP-BLK-OS",
          manage_inventory: true,
          options: { Size: "One Size", Color: "Black" },
          prices: [{ amount: 850, currency_code: "bdt" }, { amount: 10, currency_code: "usd" }],
        },
        {
          title: "One Size / Forest Green",
          sku: "LB-ACC-CAP-GRN-OS",
          manage_inventory: true,
          options: { Size: "One Size", Color: "Forest Green" },
          prices: [{ amount: 850, currency_code: "bdt" }, { amount: 10, currency_code: "usd" }],
        },
      ],
      sales_channels: [{ id: defaultSalesChannel.id }],
    })
  }

  if (productsToCreate.length > 0) {
    logger.info(`Creating ${productsToCreate.length} London Boy products...`)
    await createProductsWorkflow(container).run({
      input: {
        products: productsToCreate,
      },
    })
    logger.info("Products created successfully.")
  } else {
    logger.info("London Boy products already present in catalog.")
  }

  // 16. Inventory Allocation per Variant
  logger.info("Assigning variant inventory levels to Dhaka Central Warehouse...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku", "location_levels.id", "location_levels.location_id"],
  })

  const inventoryLevelsToCreate: any[] = []
  for (const item of inventoryItems) {
    const hasLevel = item.location_levels?.some(
      (lvl: any) => lvl?.location_id === stockLocation.id
    )
    if (!hasLevel && item.sku) {
      const stockQty = skuStockMap[item.sku] ?? 25
      inventoryLevelsToCreate.push({
        location_id: stockLocation.id,
        stocked_quantity: stockQty,
        inventory_item_id: item.id,
      })
    }
  }

  if (inventoryLevelsToCreate.length > 0) {
    logger.info(`Creating ${inventoryLevelsToCreate.length} inventory location levels...`)
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryLevelsToCreate,
      },
    })
    logger.info("Inventory levels allocated successfully.")
  } else {
    logger.info("All inventory items already have assigned location levels.")
  }

  logger.info("==================================================")
  logger.info("London Boy store seed completed successfully!")
  logger.info(`Publishable Key: ${publishableApiKey.id}`)
  logger.info("==================================================")
}
