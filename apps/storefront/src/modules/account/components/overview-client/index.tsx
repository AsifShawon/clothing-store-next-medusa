"use client"

import React from "react"
import { useParams } from "next/navigation"
import { CustomerView, OrderView } from "@dtc/commerce-contracts"
import { AccountOverview } from "@dtc/storefront-ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

interface MedusaAccountOverviewClientProps {
  customer: CustomerView
  recentOrders: OrderView[]
}

export default function MedusaAccountOverviewClient({
  customer,
  recentOrders,
}: MedusaAccountOverviewClientProps) {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"
  const routes = createMedusaRoutes(countryCode)

  return (
    <AccountOverview
      customer={customer}
      recentOrders={recentOrders}
      routes={routes}
      linkComponent={LocalizedClientLink}
    />
  )
}
