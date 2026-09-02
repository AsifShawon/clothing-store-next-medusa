"use client"

import React from "react"
import { useParams } from "next/navigation"
import { OrderView } from "@dtc/commerce-contracts"
import { OrderConfirmationView } from "@dtc/storefront-ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

interface MedusaOrderCompletedClientProps {
  order: OrderView
}

export default function MedusaOrderCompletedClient({
  order,
}: MedusaOrderCompletedClientProps) {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"
  const routes = createMedusaRoutes(countryCode)

  return (
    <OrderConfirmationView
      order={order}
      routes={routes}
      linkComponent={LocalizedClientLink}
    />
  )
}
