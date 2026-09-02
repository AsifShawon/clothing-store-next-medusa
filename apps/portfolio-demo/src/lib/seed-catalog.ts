import {
  DemoStoreState,
  DemoProduct,
  DemoCategory,
  DemoCollection,
  DemoShippingOption,
  DemoPromotion,
  DemoCustomer,
  DemoOrder,
  DemoSettings,
  DemoInventoryEvent,
  DemoActivityEvent,
} from "./types"

export const DEMO_SCHEMA_VERSION = 1

export const SEED_CATEGORIES: DemoCategory[] = [
  {
    id: "cat_new_arrivals",
    name: "New Arrivals",
    handle: "new-arrivals",
    description: "The latest British-tailored drops engineered for modern everyday elegance.",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "cat_men",
    name: "Men",
    handle: "men",
    description: "Structured smart-casuals, premium heavy cottons, and refined British silhouettes.",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "cat_women",
    name: "Women",
    handle: "women",
    description: "Effortless French flax linens, relaxed shirts, and timeless smart tailoring.",
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "cat_accessories",
    name: "Accessories",
    handle: "accessories",
    description: "Brushed twill caps, refined accents, and premium finishing touches.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80",
  },
]

export const SEED_COLLECTIONS: DemoCollection[] = [
  {
    id: "col_new_arrivals",
    title: "New Arrivals",
    handle: "new-arrivals",
    description: "Curated seasonal pieces and fresh silhouettes crafted for Bangladesh.",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "col_best_sellers",
    title: "Best Sellers",
    handle: "best-sellers",
    description: "Our most coveted heavy tees, oxford shirts, and mercerized pique polos.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "col_essentials",
    title: "Essentials",
    handle: "essentials",
    description: "Foundational wardrobe investments built with high-density longevity.",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
  },
]

export const SEED_SHIPPING_OPTIONS: DemoShippingOption[] = [
  {
    id: "so_dhaka_inside",
    name: "Standard Delivery (Inside Dhaka)",
    price: 60,
    description: "Delivered within 24-48 hours via Dhaka Express network.",
    estimatedDelivery: "24-48 Hours",
  },
  {
    id: "so_dhaka_suburban",
    name: "Dhaka Suburban Delivery",
    price: 100,
    description: "Delivered in 2-3 business days (Gazipur, Savar, Narayanganj).",
    estimatedDelivery: "2-3 Business Days",
  },
  {
    id: "so_dhaka_outside",
    name: "Standard Delivery (Outside Dhaka)",
    price: 130,
    description: "Nationwide delivery across Bangladesh in 3-5 business days.",
    estimatedDelivery: "3-5 Business Days",
  },
]

export const SEED_PROMOTIONS: DemoPromotion[] = [
  {
    id: "promo_london10",
    code: "LONDON10",
    type: "percentage",
    value: 10,
    description: "10% off entire order for London Boy community members",
    isActive: true,
  },
  {
    id: "promo_welcome500",
    code: "WELCOME500",
    type: "fixed",
    value: 500,
    minOrderAmount: 2000,
    description: "৳500 flat discount on orders above ৳2,000",
    isActive: true,
  },
]

export const SEED_PRODUCTS: DemoProduct[] = [
  // 1. London Boy Signature Heavyweight T-Shirt (8 variants)
  {
    id: "prod_heavyweight_t_shirt",
    title: "London Boy Signature Heavyweight T-Shirt",
    handle: "heavyweight-t-shirt",
    subtitle: "240 GSM Premium Combed Cotton",
    description:
      "The quintessential smart-casual staple. Crafted from 240 GSM high-density combed compact cotton, offering an impeccable structured drape, reinforced ribbed crew neckline, and clean minimal British styling.",
    material: "100% Combed Compact Cotton (240 GSM)",
    status: "published",
    collectionHandle: "essentials",
    categoryNames: ["Men", "New Arrivals"],
    tags: ["t-shirt", "heavyweight", "smart-casual", "signature"],
    thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_1", title: "Size", values: ["S", "M", "L", "XL"] },
      { id: "opt_color_1", title: "Color", values: ["Black", "White"] },
    ],
    variants: [
      { id: "var_tee_blk_s", title: "S / Black", sku: "LB-TEE-HVY-BLK-S", options: { Size: "S", Color: "Black" }, price: 1250, usdPrice: 15, inventoryQuantity: 25, manageInventory: true },
      { id: "var_tee_blk_m", title: "M / Black", sku: "LB-TEE-HVY-BLK-M", options: { Size: "M", Color: "Black" }, price: 1250, usdPrice: 15, inventoryQuantity: 40, manageInventory: true },
      { id: "var_tee_blk_l", title: "L / Black", sku: "LB-TEE-HVY-BLK-L", options: { Size: "L", Color: "Black" }, price: 1250, usdPrice: 15, inventoryQuantity: 35, manageInventory: true },
      { id: "var_tee_blk_xl", title: "XL / Black", sku: "LB-TEE-HVY-BLK-XL", options: { Size: "XL", Color: "Black" }, price: 1250, usdPrice: 15, inventoryQuantity: 20, manageInventory: true },
      { id: "var_tee_wht_s", title: "S / White", sku: "LB-TEE-HVY-WHT-S", options: { Size: "S", Color: "White" }, price: 1250, usdPrice: 15, inventoryQuantity: 30, manageInventory: true },
      { id: "var_tee_wht_m", title: "M / White", sku: "LB-TEE-HVY-WHT-M", options: { Size: "M", Color: "White" }, price: 1250, usdPrice: 15, inventoryQuantity: 45, manageInventory: true },
      { id: "var_tee_wht_l", title: "L / White", sku: "LB-TEE-HVY-WHT-L", options: { Size: "L", Color: "White" }, price: 1250, usdPrice: 15, inventoryQuantity: 30, manageInventory: true },
      { id: "var_tee_wht_xl", title: "XL / White", sku: "LB-TEE-HVY-WHT-XL", options: { Size: "XL", Color: "White" }, price: 1250, usdPrice: 15, inventoryQuantity: 15, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Machine wash cold at 30°C inside out. Reshape while damp. Do not tumble dry. Medium warm iron on reverse.",
      fit: "Modern Regular / Structured Fit",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 2. Oxford Button-Down Smart Shirt (8 variants)
  {
    id: "prod_oxford_smart_shirt",
    title: "Oxford Button-Down Smart Shirt",
    handle: "oxford-smart-shirt",
    subtitle: "100% Cotton Oxford Weave",
    description:
      "Classic British tailoring meets everyday versatility. Cut from durable 180 GSM two-ply Oxford weave cotton, featuring a refined button-down collar, mother-of-pearl finish buttons, and a curved hem.",
    material: "100% Cotton Oxford Weave (180 GSM)",
    status: "published",
    collectionHandle: "essentials",
    categoryNames: ["Men"],
    tags: ["shirt", "oxford", "formal", "smart-casual"],
    thumbnail: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_2", title: "Size", values: ["S", "M", "L", "XL"] },
      { id: "opt_color_2", title: "Color", values: ["Sky Blue", "White"] },
    ],
    variants: [
      { id: "var_oxf_blu_s", title: "S / Sky Blue", sku: "LB-SHT-OXF-BLU-S", options: { Size: "S", Color: "Sky Blue" }, price: 2250, usdPrice: 25, inventoryQuantity: 20, manageInventory: true },
      { id: "var_oxf_blu_m", title: "M / Sky Blue", sku: "LB-SHT-OXF-BLU-M", options: { Size: "M", Color: "Sky Blue" }, price: 2250, usdPrice: 25, inventoryQuantity: 35, manageInventory: true },
      { id: "var_oxf_blu_l", title: "L / Sky Blue", sku: "LB-SHT-OXF-BLU-L", options: { Size: "L", Color: "Sky Blue" }, price: 2250, usdPrice: 25, inventoryQuantity: 25, manageInventory: true },
      { id: "var_oxf_blu_xl", title: "XL / Sky Blue", sku: "LB-SHT-OXF-BLU-XL", options: { Size: "XL", Color: "Sky Blue" }, price: 2250, usdPrice: 25, inventoryQuantity: 15, manageInventory: true },
      { id: "var_oxf_wht_s", title: "S / White", sku: "LB-SHT-OXF-WHT-S", options: { Size: "S", Color: "White" }, price: 2250, usdPrice: 25, inventoryQuantity: 25, manageInventory: true },
      { id: "var_oxf_wht_m", title: "M / White", sku: "LB-SHT-OXF-WHT-M", options: { Size: "M", Color: "White" }, price: 2250, usdPrice: 25, inventoryQuantity: 40, manageInventory: true },
      { id: "var_oxf_wht_l", title: "L / White", sku: "LB-SHT-OXF-WHT-L", options: { Size: "L", Color: "White" }, price: 2250, usdPrice: 25, inventoryQuantity: 30, manageInventory: true },
      { id: "var_oxf_wht_xl", title: "XL / White", sku: "LB-SHT-OXF-WHT-XL", options: { Size: "XL", Color: "White" }, price: 2250, usdPrice: 25, inventoryQuantity: 20, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Warm machine wash at 40°C with like colors. Line dry in shade. Warm iron.",
      fit: "Tailored Slim Fit",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 3. Regent Knit Pique Polo (6 variants)
  {
    id: "prod_regent_knit_polo",
    title: "Regent Knit Pique Polo",
    handle: "regent-knit-polo",
    subtitle: "220 GSM Mercerized Pique Cotton",
    description:
      "Elevated smart-casual polo crafted from silky-smooth mercerized pique cotton. Finished with a clean self-fabric collar, ribbed cuffs, and understated tonal London Boy embroidery on the chest.",
    material: "100% Mercerized Pique Cotton (220 GSM)",
    status: "published",
    collectionHandle: "best-sellers",
    categoryNames: ["Men", "New Arrivals"],
    tags: ["polo", "knitwear", "smart-casual"],
    thumbnail: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_3", title: "Size", values: ["M", "L", "XL"] },
      { id: "opt_color_3", title: "Color", values: ["Forest Green", "Midnight Navy"] },
    ],
    variants: [
      { id: "var_polo_grn_m", title: "M / Forest Green", sku: "LB-POLO-RGT-GRN-M", options: { Size: "M", Color: "Forest Green" }, price: 1850, usdPrice: 20, inventoryQuantity: 30, manageInventory: true },
      { id: "var_polo_grn_l", title: "L / Forest Green", sku: "LB-POLO-RGT-GRN-L", options: { Size: "L", Color: "Forest Green" }, price: 1850, usdPrice: 20, inventoryQuantity: 25, manageInventory: true },
      { id: "var_polo_grn_xl", title: "XL / Forest Green", sku: "LB-POLO-RGT-GRN-XL", options: { Size: "XL", Color: "Forest Green" }, price: 1850, usdPrice: 20, inventoryQuantity: 15, manageInventory: true },
      { id: "var_polo_nvy_m", title: "M / Midnight Navy", sku: "LB-POLO-RGT-NVY-M", options: { Size: "M", Color: "Midnight Navy" }, price: 1850, usdPrice: 20, inventoryQuantity: 35, manageInventory: true },
      { id: "var_polo_nvy_l", title: "L / Midnight Navy", sku: "LB-POLO-RGT-NVY-L", options: { Size: "L", Color: "Midnight Navy" }, price: 1850, usdPrice: 20, inventoryQuantity: 30, manageInventory: true },
      { id: "var_polo_nvy_xl", title: "XL / Midnight Navy", sku: "LB-POLO-RGT-NVY-XL", options: { Size: "XL", Color: "Midnight Navy" }, price: 1850, usdPrice: 20, inventoryQuantity: 20, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Cold gentle machine wash. Lay flat to dry to preserve knit structure. Do not wring.",
      fit: "Modern Regular Fit",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 4. Mayfair Tailored Chino Trousers (8 variants)
  {
    id: "prod_mayfair_tailored_chinos",
    title: "Mayfair Tailored Chino Trousers",
    handle: "mayfair-tailored-chinos",
    subtitle: "Stretch Cotton Twill (260 GSM)",
    description:
      "The quintessential British chino engineered with 2% elastane for maximum comfort from boardroom to dinner. Features slanted front pockets, buttoned welt rear pockets, and a clean tapered leg.",
    material: "98% Cotton Twill, 2% Elastane (260 GSM)",
    status: "published",
    collectionHandle: "essentials",
    categoryNames: ["Men"],
    tags: ["trousers", "chinos", "bottoms", "tailored"],
    thumbnail: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_4", title: "Size", values: ["30", "32", "34", "36"] },
      { id: "opt_color_4", title: "Color", values: ["Khaki", "Charcoal"] },
    ],
    variants: [
      { id: "var_trs_khk_30", title: "30 / Khaki", sku: "LB-TRS-MAY-KHK-30", options: { Size: "30", Color: "Khaki" }, price: 2650, usdPrice: 30, inventoryQuantity: 15, manageInventory: true },
      { id: "var_trs_khk_32", title: "32 / Khaki", sku: "LB-TRS-MAY-KHK-32", options: { Size: "32", Color: "Khaki" }, price: 2650, usdPrice: 30, inventoryQuantity: 30, manageInventory: true },
      { id: "var_trs_khk_34", title: "34 / Khaki", sku: "LB-TRS-MAY-KHK-34", options: { Size: "34", Color: "Khaki" }, price: 2650, usdPrice: 30, inventoryQuantity: 25, manageInventory: true },
      { id: "var_trs_khk_36", title: "36 / Khaki", sku: "LB-TRS-MAY-KHK-36", options: { Size: "36", Color: "Khaki" }, price: 2650, usdPrice: 30, inventoryQuantity: 15, manageInventory: true },
      { id: "var_trs_chc_30", title: "30 / Charcoal", sku: "LB-TRS-MAY-CHC-30", options: { Size: "30", Color: "Charcoal" }, price: 2650, usdPrice: 30, inventoryQuantity: 20, manageInventory: true },
      { id: "var_trs_chc_32", title: "32 / Charcoal", sku: "LB-TRS-MAY-CHC-32", options: { Size: "32", Color: "Charcoal" }, price: 2650, usdPrice: 30, inventoryQuantity: 35, manageInventory: true },
      { id: "var_trs_chc_34", title: "34 / Charcoal", sku: "LB-TRS-MAY-CHC-34", options: { Size: "34", Color: "Charcoal" }, price: 2650, usdPrice: 30, inventoryQuantity: 25, manageInventory: true },
      { id: "var_trs_chc_36", title: "36 / Charcoal", sku: "LB-TRS-MAY-CHC-36", options: { Size: "36", Color: "Charcoal" }, price: 2650, usdPrice: 30, inventoryQuantity: 15, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Machine wash at 30°C with similar darks. Iron inside out on medium heat.",
      fit: "Tapered Slim Fit",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 5. Chelsea Relaxed Linen-Blend Shirt (6 variants)
  {
    id: "prod_chelsea_relaxed_linen_shirt",
    title: "Chelsea Relaxed Linen-Blend Shirt",
    handle: "chelsea-relaxed-linen-shirt",
    subtitle: "French Linen & Organic Cotton",
    description:
      "An effortless warm-weather statement piece. Woven from breathable French flax linen and premium organic cotton for a soft hand-feel that softens with every wash. Designed with a camp collar and boxy silhouette.",
    material: "55% French Linen, 45% Organic Cotton",
    status: "published",
    collectionHandle: "new-arrivals",
    categoryNames: ["Women", "New Arrivals"],
    tags: ["shirt", "linen", "summer", "relaxed"],
    thumbnail: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_5", title: "Size", values: ["S", "M", "L"] },
      { id: "opt_color_5", title: "Color", values: ["Olive", "Sand"] },
    ],
    variants: [
      { id: "var_lin_olv_s", title: "S / Olive", sku: "LB-W-SHT-LIN-OLV-S", options: { Size: "S", Color: "Olive" }, price: 2450, usdPrice: 28, inventoryQuantity: 20, manageInventory: true },
      { id: "var_lin_olv_m", title: "M / Olive", sku: "LB-W-SHT-LIN-OLV-M", options: { Size: "M", Color: "Olive" }, price: 2450, usdPrice: 28, inventoryQuantity: 30, manageInventory: true },
      { id: "var_lin_olv_l", title: "L / Olive", sku: "LB-W-SHT-LIN-OLV-L", options: { Size: "L", Color: "Olive" }, price: 2450, usdPrice: 28, inventoryQuantity: 15, manageInventory: true },
      { id: "var_lin_snd_s", title: "S / Sand", sku: "LB-W-SHT-LIN-SND-S", options: { Size: "S", Color: "Sand" }, price: 2450, usdPrice: 28, inventoryQuantity: 25, manageInventory: true },
      { id: "var_lin_snd_m", title: "M / Sand", sku: "LB-W-SHT-LIN-SND-M", options: { Size: "M", Color: "Sand" }, price: 2450, usdPrice: 28, inventoryQuantity: 35, manageInventory: true },
      { id: "var_lin_snd_l", title: "L / Sand", sku: "LB-W-SHT-LIN-SND-L", options: { Size: "L", Color: "Sand" }, price: 2450, usdPrice: 28, inventoryQuantity: 20, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Cold gentle cycle. Do not bleach. Dry in shade. Iron while slightly damp for crisp look.",
      fit: "Relaxed Boxy Fit",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },

  // 6. Soho Structured Cotton Twill Cap (2 variants)
  {
    id: "prod_soho_cotton_twill_cap",
    title: "Soho Structured Cotton Twill Cap",
    handle: "soho-cotton-twill-cap",
    subtitle: "Heavy Brushed Cotton Twill",
    description:
      "Minimal 6-panel baseball cap built from durable brushed cotton twill. Features an antique brass adjustable buckle, stitched ventilation eyelets, and tonal London Boy crown insignia.",
    material: "100% Brushed Cotton Twill",
    status: "published",
    collectionHandle: "essentials",
    categoryNames: ["Accessories"],
    tags: ["accessories", "cap", "headwear"],
    thumbnail: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    ],
    options: [
      { id: "opt_size_6", title: "Size", values: ["One Size"] },
      { id: "opt_color_6", title: "Color", values: ["Black", "Forest Green"] },
    ],
    variants: [
      { id: "var_cap_blk_os", title: "One Size / Black", sku: "LB-ACC-CAP-BLK-OS", options: { Size: "One Size", Color: "Black" }, price: 850, usdPrice: 10, inventoryQuantity: 50, manageInventory: true },
      { id: "var_cap_grn_os", title: "One Size / Forest Green", sku: "LB-ACC-CAP-GRN-OS", options: { Size: "One Size", Color: "Forest Green" }, price: 850, usdPrice: 10, inventoryQuantity: 40, manageInventory: true },
    ],
    metadata: {
      careInstructions: "Spot clean with a damp cloth and mild detergent. Do not submerge or machine wash.",
      fit: "Adjustable One Size",
      origin: "Designed in UK, crafted in Bangladesh",
    },
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z",
  },
]

export const SEED_CUSTOMER: DemoCustomer = {
  id: "cust_demo_londonboy",
  firstName: "Asif",
  lastName: "Shawon",
  email: "customer@londonboy.uk",
  phone: "+880 1712 345678",
  ordersCount: 2,
  totalSpent: 4850,
  defaultAddress: {
    firstName: "Asif",
    lastName: "Shawon",
    email: "customer@londonboy.uk",
    phone: "+880 1712 345678",
    address1: "Road 11, Block D, Banani",
    address2: "Apartment 4B",
    city: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
  },
  createdAt: "2026-08-15T08:00:00.000Z",
}

export const SEED_ORDERS: DemoOrder[] = [
  {
    id: "ord_demo_1001",
    displayId: "LB-ORD-1001",
    createdAt: "2026-08-28T14:30:00.000Z",
    status: "delivered",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    paymentMethod: "cod",
    items: [
      {
        id: "item_ord_1",
        productId: "prod_heavyweight_t_shirt",
        productTitle: "London Boy Signature Heavyweight T-Shirt",
        productHandle: "heavyweight-t-shirt",
        variantId: "var_tee_blk_l",
        variantTitle: "L / Black",
        sku: "LB-TEE-HVY-BLK-L",
        quantity: 2,
        unitPrice: 1250,
        totalPrice: 2500,
        thumbnail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      },
    ],
    customer: {
      id: "cust_demo_londonboy",
      firstName: "Asif",
      lastName: "Shawon",
      email: "customer@londonboy.uk",
      phone: "+880 1712 345678",
    },
    shippingAddress: {
      firstName: "Asif",
      lastName: "Shawon",
      email: "customer@londonboy.uk",
      phone: "+880 1712 345678",
      address1: "Road 11, Block D, Banani",
      address2: "Apartment 4B",
      city: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",
    },
    shippingOption: SEED_SHIPPING_OPTIONS[0],
    itemSubtotal: 2500,
    discountTotal: 0,
    shippingTotal: 60,
    total: 2560,
    notes: "Please call before delivery.",
  },
  {
    id: "ord_demo_1002",
    displayId: "LB-ORD-1002",
    createdAt: "2026-08-30T16:15:00.000Z",
    status: "shipped",
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    paymentMethod: "test_card",
    items: [
      {
        id: "item_ord_2",
        productId: "prod_oxford_smart_shirt",
        productTitle: "Oxford Button-Down Smart Shirt",
        productHandle: "oxford-smart-shirt",
        variantId: "var_oxf_blu_m",
        variantTitle: "M / Sky Blue",
        sku: "LB-SHT-OXF-BLU-M",
        quantity: 1,
        unitPrice: 2250,
        totalPrice: 2250,
        thumbnail: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      },
    ],
    customer: {
      id: "cust_demo_londonboy",
      firstName: "Asif",
      lastName: "Shawon",
      email: "customer@londonboy.uk",
      phone: "+880 1712 345678",
    },
    shippingAddress: {
      firstName: "Asif",
      lastName: "Shawon",
      email: "customer@londonboy.uk",
      phone: "+880 1712 345678",
      address1: "Road 11, Block D, Banani",
      address2: "Apartment 4B",
      city: "Dhaka",
      postalCode: "1213",
      country: "Bangladesh",
    },
    shippingOption: SEED_SHIPPING_OPTIONS[0],
    itemSubtotal: 2250,
    discountTotal: 0,
    shippingTotal: 60,
    total: 2310,
  },
]

export const SEED_SETTINGS: DemoSettings = {
  storeName: "London Boy",
  currencyCode: "BDT",
  countryCode: "BD",
  warehouseName: "Dhaka Central Warehouse",
  warehouseAddress: "Tejgaon Industrial Area, Dhaka 1208, Bangladesh",
  supportEmail: "care@londonboy.uk",
  supportPhone: "+880 1712 345678",
  lowStockThreshold: 20,
}

export const SEED_INVENTORY_EVENTS: DemoInventoryEvent[] = [
  {
    id: "inv_evt_init",
    variantId: "var_tee_blk_l",
    sku: "LB-TEE-HVY-BLK-L",
    change: -2,
    previousStock: 37,
    newStock: 35,
    reason: "order_placement",
    referenceId: "ord_demo_1001",
    timestamp: "2026-08-28T14:30:00.000Z",
  },
  {
    id: "inv_evt_init_2",
    variantId: "var_oxf_blu_m",
    sku: "LB-SHT-OXF-BLU-M",
    change: -1,
    previousStock: 36,
    newStock: 35,
    reason: "order_placement",
    referenceId: "ord_demo_1002",
    timestamp: "2026-08-30T16:15:00.000Z",
  },
]

export const SEED_ACTIVITY_EVENTS: DemoActivityEvent[] = [
  {
    id: "act_evt_init",
    type: "store_reset",
    description: "London Boy seed catalog and Bangladesh regional settings initialized.",
    timestamp: "2026-08-15T08:00:00.000Z",
  },
  {
    id: "act_evt_order_1001",
    type: "order_created",
    description: "Order LB-ORD-1001 placed for Asif Shawon (৳2,560).",
    timestamp: "2026-08-28T14:30:00.000Z",
    metadata: { orderId: "ord_demo_1001" },
  },
  {
    id: "act_evt_order_1002",
    type: "order_created",
    description: "Order LB-ORD-1002 placed for Asif Shawon (৳2,310).",
    timestamp: "2026-08-30T16:15:00.000Z",
    metadata: { orderId: "ord_demo_1002" },
  },
]

/**
 * Generate fresh initial seed store state
 */
export function createInitialSeedState(): DemoStoreState {
  const seedTimestamp = "2026-09-01T10:00:00.000Z"
  return {
    schemaVersion: DEMO_SCHEMA_VERSION,
    initializedAt: seedTimestamp,
    updatedAt: seedTimestamp,
    products: JSON.parse(JSON.stringify(SEED_PRODUCTS)),
    categories: JSON.parse(JSON.stringify(SEED_CATEGORIES)),
    collections: JSON.parse(JSON.stringify(SEED_COLLECTIONS)),
    customers: [JSON.parse(JSON.stringify(SEED_CUSTOMER))],
    currentCustomerId: SEED_CUSTOMER.id,
    cart: {
      items: [],
      appliedPromotionCode: undefined,
      updatedAt: seedTimestamp,
    },
    orders: JSON.parse(JSON.stringify(SEED_ORDERS)),
    promotions: JSON.parse(JSON.stringify(SEED_PROMOTIONS)),
    shippingOptions: JSON.parse(JSON.stringify(SEED_SHIPPING_OPTIONS)),
    settings: JSON.parse(JSON.stringify(SEED_SETTINGS)),
    inventoryEvents: JSON.parse(JSON.stringify(SEED_INVENTORY_EVENTS)),
    activityEvents: JSON.parse(JSON.stringify(SEED_ACTIVITY_EVENTS)),
  }
}
