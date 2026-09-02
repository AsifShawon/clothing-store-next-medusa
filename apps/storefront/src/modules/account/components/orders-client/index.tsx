"use client"

import React from "react"
import { useParams } from "next/navigation"
import { OrderView } from "@dtc/commerce-contracts"
import { AccountOrders } from "@dtc/storefront-ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

interface MedusaOrdersClientProps {
  orders: OrderView[]
}

export default function MedusaOrdersClient({ orders }: MedusaOrdersClientProps) {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"
  const routes = createMedusaRoutes(countryCode)

  return (
    <AccountOrders
      orders={orders}
      routes={routes}
      linkComponent={LocalizedClientLink}
      getOrderDetailHref={(id) => `/${countryCode}/account/orders/details/${id}`}
    />
  )
}
