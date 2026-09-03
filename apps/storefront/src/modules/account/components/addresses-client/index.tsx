"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { AddressFormView, CustomerView } from "@dtc/commerce-contracts"
import { AccountAddresses } from "@dtc/storefront-ui"
import { addCustomerAddress, deleteCustomerAddress } from "@lib/data/customer"

interface MedusaAddressesClientProps {
  customer: CustomerView
  countryCode: string
}

export default function MedusaAddressesClient({
  customer,
  countryCode,
}: MedusaAddressesClientProps) {
  const router = useRouter()

  const handleSaveAddress = async (address: AddressFormView) => {
    const formData = new FormData()

    formData.append("first_name", address.firstName)
    formData.append("last_name", address.lastName)
    formData.append("phone", address.phone || "")
    formData.append("address_1", address.address1)
    formData.append("address_2", address.address2 || "")
    formData.append("city", address.city)
    formData.append("postal_code", address.postalCode || "")
    formData.append("country_code", countryCode)
    formData.append("province", address.province || "")

    await addCustomerAddress({}, formData)
    router.refresh()
  }

  const handleDeleteAddress = async (id: string) => {
    await deleteCustomerAddress(id)
    router.refresh()
  }

  return (
    <AccountAddresses
      customer={customer}
      onSaveAddress={handleSaveAddress}
      onDeleteAddress={handleDeleteAddress}
    />
  )
}
