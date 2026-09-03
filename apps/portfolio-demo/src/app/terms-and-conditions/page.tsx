"use client"

import React from "react"
import Link from "next/link"
import { PolicyView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

const TERMS_SECTIONS = [
  {
    title: "1. Order Acceptance & Contract Formation",
    content: (
      <p>
        Placing an order constitutes an offer to purchase our garments. A binding sales contract is formed when you receive an order confirmation email and SMS containing your order ID and dispatch confirmation.
      </p>
    ),
  },
  {
    title: "2. Pricing & Payment Terms",
    content: (
      <p>
        All prices are listed in Bangladeshi Taka (BDT) and are inclusive of applicable VAT. Payment may be settled via Cash on Delivery (COD) or approved electronic payment channels.
      </p>
    ),
  },
  {
    title: "3. Product Descriptions & Color Accuracy",
    content: (
      <p>
        We make every effort to display our garments, fabric colors, and textures as accurately as possible. Slight variations may occur depending on display calibrations.
      </p>
    ),
  },
  {
    title: "4. Governing Law",
    content: (
      <p>
        These terms and conditions are governed by and construed in accordance with the laws of Bangladesh. Any dispute arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <PolicyView
      badge="Legal & Store Terms"
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before placing an order on londonboy.uk."
      sections={TERMS_SECTIONS}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}
