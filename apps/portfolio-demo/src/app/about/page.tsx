"use client"

import React from "react"
import Link from "next/link"
import { AboutView } from "@dtc/storefront-ui"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function AboutPage() {
  return <AboutView routes={demoRoutes} linkComponent={Link} />
}
