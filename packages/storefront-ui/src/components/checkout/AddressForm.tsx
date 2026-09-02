"use client"

import React from "react"
import { AddressFormView } from "@dtc/commerce-contracts"
import { Input } from "../ui/input"

export interface AddressFormProps {
  formData: AddressFormView
  onChange: (data: AddressFormView) => void
  errors?: Partial<Record<keyof AddressFormView, string>>
  disabled?: boolean
}

export function AddressForm({
  formData,
  onChange,
  errors = {},
  disabled = false,
}: AddressFormProps) {
  const updateField = (field: keyof AddressFormView, value: string) => {
    onChange({
      ...formData,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
          error={errors.firstName}
          required
          disabled={disabled}
          autoComplete="given-name"
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => updateField("lastName", e.target.value)}
          error={errors.lastName}
          required
          disabled={disabled}
          autoComplete="family-name"
        />
      </div>

      <Input
        label="Phone Number (Required for Courier Handover)"
        value={formData.phone}
        onChange={(e) => updateField("phone", e.target.value)}
        error={errors.phone}
        placeholder="+880 1700-000000"
        required
        disabled={disabled}
        autoComplete="tel"
      />

      <Input
        label="Street Address, House & Road No."
        value={formData.address1}
        onChange={(e) => updateField("address1", e.target.value)}
        error={errors.address1}
        placeholder="e.g. House 42, Road 11, Block D, Banani"
        required
        disabled={disabled}
        autoComplete="street-address"
      />

      <Input
        label="Apartment, Suite, Unit (Optional)"
        value={formData.address2 || ""}
        onChange={(e) => updateField("address2", e.target.value)}
        disabled={disabled}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City / District"
          value={formData.city}
          onChange={(e) => updateField("city", e.target.value)}
          error={errors.city}
          placeholder="e.g. Dhaka"
          required
          disabled={disabled}
          autoComplete="address-level2"
        />
        <Input
          label="Postal Code (Optional)"
          value={formData.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          error={errors.postalCode}
          placeholder="e.g. 1213"
          disabled={disabled}
          autoComplete="postal-code"
        />
      </div>
    </div>
  )
}
