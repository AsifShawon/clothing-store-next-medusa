"use client"

import React from "react"
import Link from "next/link"
import { ContactView } from "@dtc/storefront-ui"
import { useDemo } from "@lib/demo-context"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function ContactPage() {
  const { showToast } = useDemo()

  const handleInquiry = () => {
    showToast("Message Received", "Our customer care concierge will respond shortly.", "success")
  }

  return (
    <ContactView
      routes={demoRoutes}
      onSubmitInquiry={handleInquiry}
      linkComponent={Link}
    />
  )
}
