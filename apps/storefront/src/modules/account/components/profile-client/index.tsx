"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { CustomerView } from "@dtc/commerce-contracts"
import { AccountProfile } from "@dtc/storefront-ui"
import { updateCustomer } from "@lib/data/customer"

import { getErrorMessage } from "@lib/util/get-error-message"

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
    try {
      await updateCustomer({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      })
      router.refresh()
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error))
    }
  }

  return (
    <AccountProfile
      customer={customer}
      isEmailReadOnly={true}
      onUpdateProfile={handleUpdateProfile}
    />
  )
}
