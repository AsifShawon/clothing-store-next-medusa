"use client"

import React, { useState } from "react"
import { AddressFormView, CustomerAddressView, CustomerView } from "@dtc/commerce-contracts"
import { MapPinIcon, PlusIcon, TrashIcon } from "../icons"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export interface AccountAddressesProps {
  customer: CustomerView
  onSaveAddress?: (address: AddressFormView) => Promise<void> | void
  onDeleteAddress?: (id: string) => Promise<void> | void
}


export function AccountAddresses({
  customer,
  onSaveAddress,
  onDeleteAddress,
}: AccountAddressesProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newAddress, setNewAddress] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone || "",
    address1: "",
    address2: "",
    city: "Dhaka",
    postalCode: "1213",
    country: "Bangladesh",
  })

  const addresses: CustomerAddressView[] = customer.addresses?.length
    ? customer.addresses
    : customer.defaultAddress
    ? [
        {
          id: "default-addr",
          firstName: customer.defaultAddress.firstName,
          lastName: customer.defaultAddress.lastName,
          address1: customer.defaultAddress.address1,
          address2: customer.defaultAddress.address2,
          city: customer.defaultAddress.city,
          postalCode: customer.defaultAddress.postalCode,
          country: customer.defaultAddress.country,
          phone: customer.defaultAddress.phone,
          isDefaultShipping: true,
        },
      ]
    : []

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSaveAddress) return
    await onSaveAddress(newAddress)
    setIsAdding(false)
  }

  return (
    <div className="bg-white border border-brand-border p-6 space-y-6">
      <div className="border-b border-brand-border pb-4 flex items-center justify-between">
        <div>
          <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
            Saved Delivery Addresses
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage your delivery destinations across Bangladesh.
          </p>
        </div>
        {onSaveAddress && !isAdding && (
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Address</span>
          </Button>
        )}
      </div>

      {/* Add Address Form inline if toggled */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 border border-brand-border bg-brand-surface space-y-4">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
            New Shipping Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={newAddress.firstName}
              onChange={(e) => setNewAddress({ ...newAddress, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={newAddress.lastName}
              onChange={(e) => setNewAddress({ ...newAddress, lastName: e.target.value })}
              required
            />
          </div>
          <Input
            label="Phone Number"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            required
          />
          <Input
            label="Street Address, House & Road"
            value={newAddress.address1}
            onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / District"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              required
            />
            <Input
              label="Postal Code"
              value={newAddress.postalCode}
              onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="primary" size="small">
              Save Address
            </Button>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={() => setIsAdding(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="py-12 text-center text-xs text-brand-muted">
          No addresses saved yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 border border-brand-border bg-brand-surface space-y-2 text-xs relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-primary">
                  {addr.firstName} {addr.lastName}
                </span>
                {addr.isDefaultShipping && (
                  <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-accent bg-brand-secondary px-2 py-0.5 border border-brand-border">
                    Default
                  </span>
                )}
              </div>
              <p className="text-brand-muted">
                {addr.address1}
                {addr.address2 ? `, ${addr.address2}` : ""},{" "}
                {addr.city} {addr.postalCode}
              </p>
              {addr.phone && <p className="text-brand-muted">{addr.phone}</p>}

              {onDeleteAddress && !addr.isDefaultShipping && (
                <div className="pt-2 border-t border-brand-border flex justify-end">
                  <button
                    type="button"
                    onClick={() => onDeleteAddress(addr.id)}
                    className="text-brand-muted hover:text-rose-700 flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
