"use client"

import React from "react"
import Link from "next/link"
import { SizeGuideView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function SizeGuidePage() {
  return <SizeGuideView routes={demoRoutes} linkComponent={Link} />
}
