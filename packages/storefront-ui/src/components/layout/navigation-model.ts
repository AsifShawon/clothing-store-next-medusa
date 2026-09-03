import { StoreRoutes } from "@dtc/commerce-contracts"

export interface NavEditorialCard {
  title: string
  description: string
  image: string
  imageAlt?: string
  ctaText: string
  href: string
}

export interface NavSubLink {
  label: string
  href: string
  badge?: string
}

export interface NavGroup {
  title: string
  links: NavSubLink[]
}

export interface MegaNavItem {
  id: string
  label: string
  href: string
  isActive?: boolean
  shopAllHref: string
  shopAllLabel?: string
  featuredLinks: NavSubLink[]
  categoryGroups: NavGroup[]
  editorialCards: NavEditorialCard[]
}

export function createStoreNavigation(routes: StoreRoutes): MegaNavItem[] {
  return [
    {
      id: "new-arrivals",
      label: "New & Trending",
      href: routes.collection("new-arrivals"),
      shopAllHref: routes.collection("new-arrivals"),
      shopAllLabel: "Shop All New Arrivals",
      featuredLinks: [
        { label: "Latest Seasonal Drops", href: routes.collection("new-arrivals"), badge: "Fresh" },
        { label: "Iconic Bestsellers", href: routes.collection("best-sellers") },
        { label: "French Flax Linen", href: routes.category("women") },
        { label: "Heavyweight Essentials", href: routes.collection("essentials") },
      ],
      categoryGroups: [
        {
          title: "Trending Silhouettes",
          links: [
            { label: "240 GSM Heavyweight T-Shirt", href: routes.product("heavyweight-t-shirt") },
            { label: "Oxford Button-Down Shirt", href: routes.product("oxford-smart-shirt") },
            { label: "Regent Knit Pique Polo", href: routes.product("regent-knit-polo") },
            { label: "Mayfair Tailored Chinos", href: routes.product("mayfair-tailored-chinos") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "The Summer Linen Edit",
          description: "Breathable French flax woven for tropical heat, designed with camp collars and relaxed drape.",
          image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
          imageAlt: "French Flax Linen Shirt",
          ctaText: "Shop New Arrivals",
          href: routes.collection("new-arrivals"),
        },
      ],
    },
    {
      id: "shirts",
      label: "Shirts",
      href: routes.catalog({ category: "shirts" }),
      shopAllHref: routes.catalog({ category: "shirts" }),
      shopAllLabel: "Shop All Shirts",
      featuredLinks: [
        { label: "Oxford Button-Downs", href: routes.product("oxford-smart-shirt"), badge: "Signature" },
        { label: "Relaxed Linen Shirts", href: routes.product("chelsea-relaxed-linen-shirt") },
        { label: "Smart-Casual Tailoring", href: routes.catalog({ category: "shirts" }) },
      ],
      categoryGroups: [
        {
          title: "Collar & Silhouette",
          links: [
            { label: "Tailored Oxford Button-Down", href: routes.product("oxford-smart-shirt") },
            { label: "Camp Collar Relaxed Linen", href: routes.product("chelsea-relaxed-linen-shirt") },
            { label: "Formal Spread Collar", href: routes.catalog({ category: "shirts" }) },
          ],
        },
        {
          title: "Natural Fibers",
          links: [
            { label: "Two-Ply Oxford Weave (180 GSM)", href: routes.product("oxford-smart-shirt") },
            { label: "French Flax & Organic Cotton", href: routes.product("chelsea-relaxed-linen-shirt") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Two-Ply Oxford Weave",
          description: "180 GSM high-density British weave finished with mother-of-pearl buttons and curved hem.",
          image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          imageAlt: "Oxford Button-Down Shirt",
          ctaText: "Explore Shirts",
          href: routes.product("oxford-smart-shirt"),
        },
      ],
    },
    {
      id: "polos-tees",
      label: "Polos & Tees",
      href: routes.catalog(),
      shopAllHref: routes.catalog(),
      shopAllLabel: "Shop All Polos & Tees",
      featuredLinks: [
        { label: "240 GSM Heavyweight Tee", href: routes.product("heavyweight-t-shirt"), badge: "Bestseller" },
        { label: "Regent Mercerized Pique Polo", href: routes.product("regent-knit-polo") },
        { label: "Minimal Crewneck Basics", href: routes.catalog() },
      ],
      categoryGroups: [
        {
          title: "Core Silhouettes",
          links: [
            { label: "Structured Crewneck T-Shirt", href: routes.product("heavyweight-t-shirt") },
            { label: "Mercerized Pique Polo", href: routes.product("regent-knit-polo") },
            { label: "Everyday Foundation Knitwear", href: routes.collection("essentials") },
          ],
        },
        {
          title: "Fabric Engineering",
          links: [
            { label: "240 GSM Combed Compact Cotton", href: routes.product("heavyweight-t-shirt") },
            { label: "220 GSM Mercerized Pique", href: routes.product("regent-knit-polo") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Signature 240 GSM Tee",
          description: "High-density combed compact yarn providing permanent structure and zero body cling.",
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          imageAlt: "240 GSM Heavyweight T-Shirt",
          ctaText: "Discover Tees",
          href: routes.product("heavyweight-t-shirt"),
        },
      ],
    },
    {
      id: "trousers",
      label: "Trousers",
      href: routes.catalog(),
      shopAllHref: routes.catalog(),
      shopAllLabel: "Shop All Trousers",
      featuredLinks: [
        { label: "Mayfair Tailored Chinos", href: routes.product("mayfair-tailored-chinos"), badge: "Essential" },
        { label: "Stretch Twill Bottoms", href: routes.catalog() },
        { label: "Smart Tapered Fits", href: routes.catalog() },
      ],
      categoryGroups: [
        {
          title: "Styles & Cuts",
          links: [
            { label: "Mayfair Tapered Chinos", href: routes.product("mayfair-tailored-chinos") },
            { label: "Slim-Straight Everyday Twill", href: routes.catalog() },
          ],
        },
        {
          title: "Color Palette",
          links: [
            { label: "Classic British Khaki", href: routes.product("mayfair-tailored-chinos") },
            { label: "Deep Charcoal Twill", href: routes.product("mayfair-tailored-chinos") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Mayfair Tailored Chinos",
          description: "Built with 2% elastane flex for seamless comfort from Dhaka boardroom to evening.",
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
          imageAlt: "Mayfair Tailored Chinos",
          ctaText: "Shop Chinos",
          href: routes.product("mayfair-tailored-chinos"),
        },
      ],
    },
    {
      id: "linen",
      label: "Outerwear & Linen",
      href: routes.category("women"),
      shopAllHref: routes.category("women"),
      shopAllLabel: "Shop Linen & Outerwear",
      featuredLinks: [
        { label: "French Flax Linen Shirt", href: routes.product("chelsea-relaxed-linen-shirt") },
        { label: "Women's Summer Edit", href: routes.category("women"), badge: "Featured" },
        { label: "Breathable Layering", href: routes.collection("new-arrivals") },
      ],
      categoryGroups: [
        {
          title: "Seasonal Edits",
          links: [
            { label: "Chelsea Relaxed Linen Shirt", href: routes.product("chelsea-relaxed-linen-shirt") },
            { label: "Relaxed Boxy Camp Collars", href: routes.product("chelsea-relaxed-linen-shirt") },
            { label: "French Flax Earth Tones", href: routes.category("women") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Pure French Flax Linen",
          description: "Pre-washed for instantaneous soft drape, becoming softer and more characterful with every wear.",
          image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
          imageAlt: "French Flax Linen Shirt",
          ctaText: "Shop Linen",
          href: routes.product("chelsea-relaxed-linen-shirt"),
        },
      ],
    },
    {
      id: "accessories",
      label: "Accessories",
      href: routes.category("accessories"),
      shopAllHref: routes.category("accessories"),
      shopAllLabel: "Shop All Accessories",
      featuredLinks: [
        { label: "Soho Brushed Twill Cap", href: routes.product("soho-cotton-twill-cap"), badge: "Signature" },
        { label: "Antique Brass Hardware", href: routes.product("soho-cotton-twill-cap") },
        { label: "Full Accessories Range", href: routes.category("accessories") },
      ],
      categoryGroups: [
        {
          title: "Curated Accents",
          links: [
            { label: "6-Panel Twill Cap in Black", href: routes.product("soho-cotton-twill-cap") },
            { label: "6-Panel Twill Cap in Forest Green", href: routes.product("soho-cotton-twill-cap") },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Brushed Cotton Twill",
          description: "Minimalist British six-panel profile featuring embroidered eyelets and antique brass buckle.",
          image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
          imageAlt: "Soho Cotton Twill Cap",
          ctaText: "Shop Accessories",
          href: routes.product("soho-cotton-twill-cap"),
        },
      ],
    },
    {
      id: "collections",
      label: "Collections",
      href: routes.catalog(),
      shopAllHref: routes.catalog(),
      shopAllLabel: "Shop All Collections",
      featuredLinks: [
        { label: "The Wardrobe Essentials", href: routes.collection("essentials") },
        { label: "Iconic Bestsellers", href: routes.collection("best-sellers"), badge: "Top Rated" },
        { label: "Summer New Arrivals", href: routes.collection("new-arrivals") },
      ],
      categoryGroups: [
        {
          title: "Curated Silhouettes",
          links: [
            { label: "British Smart-Casual Tailoring", href: routes.category("men") },
            { label: "French Linen Warm-Weather Edit", href: routes.category("women") },
            { label: "Dhaka Craftsmanship Archive", href: routes.about() },
          ],
        },
      ],
      editorialCards: [
        {
          title: "Wardrobe Essentials",
          description: "Foundational garments cut from heavy natural fibers designed to anchor your weekly rotation.",
          image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
          imageAlt: "The Wardrobe Essentials Collection",
          ctaText: "Explore Essentials",
          href: routes.collection("essentials"),
        },
      ],
    },
  ]
}
