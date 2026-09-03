"use client"

import React from "react"
import { useParams, usePathname } from "next/navigation"
import { CustomerView } from "@dtc/commerce-contracts"
import { AccountShell } from "@dtc/storefront-ui"
import { signout } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

interface MedusaAccountLayoutClientProps {
  customer: CustomerView
  children: React.ReactNode
}

export default function MedusaAccountLayoutClient({
  customer,
  children,
}: MedusaAccountLayoutClientProps) {
  const pathname = usePathname()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"
  const routes = createMedusaRoutes(countryCode)

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <AccountShell
      customer={customer}
      currentPath={pathname}
      routes={routes}
      onLogout={handleLogout}
      linkComponent={LocalizedClientLink}
    >
      {children}
    </AccountShell>
  )
}
