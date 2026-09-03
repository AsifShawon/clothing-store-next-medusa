"use client"

import React from "react"
import Link from "next/link"
import { PolicyView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

const RETURN_SECTIONS = [
  {
    title: "1. 24-Hour Door-to-Door Exchange Guarantee",
    content: (
      <p>
        If your garment does not fit as expected, request a size exchange within 24 hours of delivery handover. For addresses inside Dhaka, our courier will deliver the replacement size directly to your doorstep while collecting the original garment.
      </p>
    ),
  },
  {
    title: "2. Eligibility & Garment Condition",
    content: (
      <div className="space-y-2">
        <p>To qualify for a return or exchange, garments must:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Be unworn, unwashed, and undamaged</li>
          <li>Have all original London Boy woven brand tags attached</li>
          <li>Be returned in original brand packaging</li>
        </ul>
      </div>
    ),
  },
  {
    title: "3. Refund Processing",
    content: (
      <p>
        For orders paid online, approved refunds are issued back to the original payment method within 5–7 business days of warehouse inspection. For Cash on Delivery orders, refunds are issued via bKash, Nagad, or bank transfer.
      </p>
    ),
  },
  {
    title: "4. How to Initiate a Return",
    content: (
      <p>
        Email <strong>care@londonboy.uk</strong> or contact our support concierge with your Order ID, photo of the garment tag, and reason for exchange or return.
      </p>
    ),
  },
]

export default function ReturnPolicyPage() {
  return (
    <PolicyView
      badge="Peace of Mind Guarantee"
      title="24-Hour Return & Refund Policy"
      subtitle="We want you to feel confident in every stitch. If the size or fit isn't perfect, we make returns and exchanges straightforward."
      sections={RETURN_SECTIONS}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}
