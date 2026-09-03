"use client"

import React from "react"
import Link from "next/link"
import { CartView, StoreRoutes } from "@dtc/commerce-contracts"
import { Drawer } from "../ui/drawer"
import { CartItemRow } from "./CartItemRow"
import { Button } from "../ui/button"
import { ShoppingBagIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart?: CartView
  onUpdateQuantity?: (id: string, qty: number) => void
  onRemoveItem?: (id: string) => void
  routes: StoreRoutes
  linkComponent?: LinkComponent
  onProceedToCheckout?: () => void
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  routes,
  linkComponent: LinkComp = Link,
  onProceedToCheckout,
}: CartDrawerProps) {
  const itemsCount = cart?.itemsCount || 0
  const items = cart?.items || []

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Shopping Bag (${itemsCount})`}
      position="right"
      maxWidth="md"
    >
      <div className="flex flex-col h-full">
        {/* Items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-brand-border pr-1">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ShoppingBagIcon className="w-10 h-10 text-brand-muted mx-auto" />
              <p className="font-heading font-semibold text-sm text-brand-primary">
                Your bag is empty
              </p>
              <p className="text-xs text-brand-muted max-w-xs mx-auto">
                Explore our British tailoring and heavyweight cotton essentials.
              </p>
              <div className="pt-2">
                <LinkComp
                  href={routes.catalog()}
                  onClick={onClose}
                  className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Start Shopping
                </LinkComp>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity ? (qty) => onUpdateQuantity(item.id, qty) : undefined}
                onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
                linkComponent={LinkComp}
                productHref={item.productHandle ? routes.product(item.productHandle) : undefined}
              />
            ))
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {items.length > 0 && cart && (
          <div className="border-t border-brand-border pt-4 space-y-4 bg-white mt-auto">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-heading uppercase tracking-wider text-brand-muted">
                Subtotal
              </span>
              <span className="font-heading font-bold text-sm text-brand-primary">
                {cart.totals.subtotal.formatted}
              </span>
            </div>
            <p className="text-[11px] text-brand-muted">
              Shipping &amp; promotions calculated at checkout.
            </p>

            <div className="space-y-2">
              {onProceedToCheckout ? (
                <Button
                  type="button"
                  onClick={() => {
                    onClose()
                    onProceedToCheckout()
                  }}
                  variant="primary"
                  className="w-full h-11 text-xs font-bold uppercase tracking-wider"
                >
                  Proceed to Checkout
                </Button>
              ) : (
                <LinkComp
                  href={routes.checkout()}
                  onClick={onClose}
                  className="w-full h-11 bg-brand-primary hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  Proceed to Checkout
                </LinkComp>
              )}

              <LinkComp
                href={routes.cart()}
                onClick={onClose}
                className="w-full h-10 border border-brand-border hover:border-brand-primary text-brand-primary text-xs font-heading font-semibold uppercase tracking-wider flex items-center justify-center transition-colors"
              >
                View Full Bag
              </LinkComp>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  )
}
