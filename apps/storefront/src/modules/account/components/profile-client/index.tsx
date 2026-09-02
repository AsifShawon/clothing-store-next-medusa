"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { CustomerView } from "@dtc/commerce-contracts"
import { AccountProfile } from "@dtc/storefront-ui"
import { updateCustomer } from "@lib/data/customer"

interface MedusaProfileClientProps {
  customer: CustomerView
}

export default function MedusaProfileClient({ customer }: MedusaProfileClientProps) {
  const router = useRouter()

  const handleUpdateProfile = async (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }) => {
    await updateCustomer({
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
    })
    router.refresh()
  }

  return (
    <AccountProfile
      customer={customer}
      onUpdateProfile={handleUpdateProfile}
    />
  )
}
