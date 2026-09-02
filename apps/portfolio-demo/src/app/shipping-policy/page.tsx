"use client"

import React from "react"
import Link from "next/link"
import { PolicyView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

const SHIPPING_SECTIONS = [
  {
    title: "1. Tiered Shipping Rate Structure",
    content: (
      <div className="space-y-2">
        <p>
          All orders are dispatched directly from our Dhaka Central Warehouse. We offer standard tiered flat rates across Bangladesh:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Inside Dhaka Metro:</strong> ৳60 (Free on orders above ৳2,000)</li>
          <li><strong>Dhaka Suburbs (Gazipur, Savar, Keraniganj):</strong> ৳100</li>
          <li><strong>Outside Dhaka (All other 63 districts):</strong> ৳130</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2. Delivery Timelines & Schedules",
    content: (
      <div className="space-y-2">
        <p>
          Orders placed before 2:00 PM BST Sunday through Thursday are processed the same business day:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Inside Dhaka:</strong> 24–48 hours from dispatch</li>
          <li><strong>Dhaka Suburbs:</strong> 2–3 business days</li>
          <li><strong>Divisional Cities & Nationwide:</strong> 3–5 business days</li>
        </ul>
      </div>
    ),
  },
  {
    title: "3. Cash on Delivery (COD) Guidelines",
    content: (
      <p>
        Cash on Delivery is available across all 64 districts of Bangladesh. Customers may inspect the outer parcel before payment handover. Any size exchanges or returns are covered under our 24-Hour Door-to-Door Exchange Guarantee.
      </p>
    ),
  },
  {
    title: "4. Tracking & Courier Notification",
    content: (
      <p>
        Once your package leaves our warehouse, you will receive an SMS and email with live courier tracking details from our logistics partners.
      </p>
    ),
  },
]

export default function ShippingPolicyPage() {
  return (
    <PolicyView
      badge="Delivery Standards"
      title="Shipping & Delivery Policy"
      subtitle="Direct dispatch from our Dhaka Central Warehouse with transparent tiered pricing across all 64 districts of Bangladesh."
      sections={SHIPPING_SECTIONS}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}
