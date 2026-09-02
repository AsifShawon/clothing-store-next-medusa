"use client"

import React from "react"
import Link from "next/link"
import { FaqView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function FAQPage() {
  return <FaqView routes={demoRoutes} linkComponent={Link} />
}
