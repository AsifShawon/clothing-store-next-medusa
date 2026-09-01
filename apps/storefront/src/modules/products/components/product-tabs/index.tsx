"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Materials & Craftsmanship",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Care & Washing Instructions",
      component: <ProductCareTab product={product} />,
    },
    {
      label: "Bangladesh Shipping & 24h Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full border-t border-brand-border/60 mt-6">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const fit = (product.metadata?.fit as string) || "Modern Regular / Structured British Fit"
  const origin = (product.metadata?.origin as string) || "Designed in UK, crafted in Bangladesh"

  return (
    <div className="text-xs py-4 space-y-4 text-brand-primary">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-brand-secondary/40 border border-brand-border/60 space-y-1">
          <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-primary block">
            Fabric Composition
          </span>
          <p className="text-brand-primary/80">{product.material || "100% Combed Compact Cotton (240 GSM)"}</p>
        </div>

        <div className="p-3 bg-brand-secondary/40 border border-brand-border/60 space-y-1">
          <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-primary block">
            Fit Profile
          </span>
          <p className="text-brand-primary/80">{fit}</p>
        </div>

        <div className="p-3 bg-brand-secondary/40 border border-brand-border/60 space-y-1">
          <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-primary block">
            Provenance &amp; Quality
          </span>
          <p className="text-brand-primary/80">{origin}</p>
        </div>

        <div className="p-3 bg-brand-secondary/40 border border-brand-border/60 space-y-1">
          <span className="font-heading font-bold text-[11px] uppercase tracking-wider text-brand-primary block">
            Inventory Dispatch
          </span>
          <p className="text-brand-primary/80">Dhaka Central Warehouse (Direct Dispatch)</p>
        </div>
      </div>
    </div>
  )
}

const ProductCareTab = ({ product }: ProductTabsProps) => {
  const care =
    (product.metadata?.care_instructions as string) ||
    "Machine wash cold at 30°C inside out with like colors. Do not bleach. Line dry in shade. Warm iron on reverse."

  return (
    <div className="text-xs py-4 space-y-3 text-brand-primary">
      <p className="leading-relaxed text-brand-primary/80">{care}</p>
      <ul className="list-disc pl-5 space-y-1 text-brand-primary/70">
        <li>Wash inside out to protect fabric luster.</li>
        <li>Avoid high-heat tumble drying to prevent shrink.</li>
        <li>Reshape collars and hems while damp.</li>
      </ul>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-xs py-4 space-y-4 text-brand-primary">
      <div className="space-y-2">
        <h5 className="font-heading font-bold uppercase tracking-wider text-xs">
          Delivery Rates (Nationwide Bangladesh)
        </h5>
        <ul className="space-y-1.5 text-brand-primary/80">
          <li className="flex justify-between py-1 border-b border-brand-border/40">
            <span>Inside Dhaka City (24–48 hours)</span>
            <span className="font-bold">৳60</span>
          </li>
          <li className="flex justify-between py-1 border-b border-brand-border/40">
            <span>Dhaka Suburban (Savar, Gazipur, Keraniganj)</span>
            <span className="font-bold">৳100</span>
          </li>
          <li className="flex justify-between py-1 border-b border-brand-border/40">
            <span>Outside Dhaka (Nationwide 3–5 days)</span>
            <span className="font-bold">৳130</span>
          </li>
        </ul>
      </div>

      <div className="p-3 bg-brand-secondary/60 border border-brand-border space-y-1">
        <h5 className="font-heading font-bold uppercase tracking-wider text-[11px] text-brand-accent">
          🛡️ 24-Hour Return &amp; Exchange Policy
        </h5>
        <p className="text-[11px] text-brand-primary/80">
          Size not fitting right? Submit a return or exchange request within 24 hours of delivery. Items must be unworn with original tags attached.
        </p>
      </div>
    </div>
  )
}

export default ProductTabs
