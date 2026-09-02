"use client"

import { CartItemView, OrderLineView } from "@dtc/commerce-contracts"
import { CartItemRow } from "./CartItemRow"
import { LinkComponent } from "../../types"

export interface CartItemListProps {
  items: Array<CartItemView | OrderLineView | any>
  onUpdateQuantity?: (id: string, qty: number) => void
  onRemoveItem?: (id: string) => void
  disabled?: boolean
  linkComponent?: LinkComponent
  getItemHref?: (item: any) => string
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onRemoveItem,
  disabled = false,
  linkComponent,
  getItemHref,
}: CartItemListProps) {
  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-brand-muted">
        Your shopping bag is currently empty.
      </div>
    )
  }

  return (
    <div className="divide-y divide-brand-border">
      {items.map((item) => (
        <CartItemRow
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity ? (qty) => onUpdateQuantity(item.id, qty) : undefined}
          onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
          disabled={disabled}
          linkComponent={linkComponent}
          productHref={getItemHref ? getItemHref(item) : undefined}
        />
      ))}
    </div>
  )
}
