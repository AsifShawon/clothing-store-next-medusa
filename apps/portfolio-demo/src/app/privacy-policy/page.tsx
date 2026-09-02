"use client"

import React from "react"
import Link from "next/link"
import { PolicyView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

const PRIVACY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content: (
      <p>
        When you purchase or interact with London Boy, we collect necessary contact information (name, delivery address, phone number, and email address) required for courier dispatch and delivery confirmations.
      </p>
    ),
  },
  {
    title: "2. Payment Data Security",
    content: (
      <p>
        In this demonstration environment, transactions are simulated and stored in local storage. In our production environment, all transactions are securely encrypted and processed by licensed payment gateways.
      </p>
    ),
  },
  {
    title: "3. Logistics & Delivery Sharing",
    content: (
      <p>
        Your name, phone number, and shipping address are securely shared with our vetted courier partners exclusively to fulfill your doorstep delivery and communicate tracking status.
      </p>
    ),
  },
  {
    title: "4. Your Rights",
    content: (
      <p>
        You have the right to request access to, correction of, or deletion of your personal data stored with London Boy. Contact us at <strong>care@londonboy.uk</strong> for any data privacy requests.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <PolicyView
      badge="Data Protection & Security"
      title="Privacy Policy"
      subtitle="Your privacy and data security are fundamental to how we build our clothing brand."
      sections={PRIVACY_SECTIONS}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}
