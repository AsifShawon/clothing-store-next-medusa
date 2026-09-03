import React from "react"
import { HttpTypes } from "@medusajs/types"
import { toCustomerView } from "../../../adapters/medusa/account"
import MedusaAccountLayoutClient from "../components/account-layout-client"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <div className="bg-white min-h-screen py-12">
        <div className="content-container max-w-md mx-auto">{children}</div>
      </div>
    )
  }

  const customerView = toCustomerView(customer)

  return (
    <MedusaAccountLayoutClient customer={customerView}>
      {children}
    </MedusaAccountLayoutClient>
  )
}

export default AccountLayout
