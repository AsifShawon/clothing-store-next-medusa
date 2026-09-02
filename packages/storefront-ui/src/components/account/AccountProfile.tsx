"use client"

import React, { useState } from "react"
import { CustomerView } from "@dtc/commerce-contracts"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export interface AccountProfileProps {
  customer: CustomerView
  isEmailReadOnly?: boolean
  onUpdateProfile: (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }) => Promise<void> | void
}

export function AccountProfile({
  customer,
  isEmailReadOnly = false,
  onUpdateProfile,
}: AccountProfileProps) {
  const [formData, setFormData] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage("")
    setErrorMessage("")
    setIsSaving(true)

    try {
      await onUpdateProfile(formData)
      setSuccessMessage("Profile updated successfully.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile."
      setErrorMessage(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white border border-brand-border p-6 space-y-6">
      <div className="border-b border-brand-border pb-4">
        <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
          Profile Information
        </h2>
        <p className="text-xs text-brand-muted mt-0.5">
          Update your account details and contact information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
          />
        </div>

        <div>
          <Input
            label={isEmailReadOnly ? "Email Address (Account Credential - Read Only)" : "Email Address"}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={isEmailReadOnly}
          />
          {isEmailReadOnly && (
            <p className="text-[11px] text-brand-muted mt-1">
              Email is tied to your login identity and cannot be changed here.
            </p>
          )}
        </div>


        <Input
          label="Phone Number (Courier Handover)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+880 1700-000000"
        />

        {successMessage && (
          <p className="text-xs text-emerald-700 font-medium">{successMessage}</p>
        )}
        {errorMessage && (
          <p className="text-xs text-rose-700 font-medium">{errorMessage}</p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="medium"
            isLoading={isSaving}
            className="uppercase tracking-wider text-xs font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
