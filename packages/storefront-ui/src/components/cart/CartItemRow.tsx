"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { CartItemView, OrderLineView } from "@dtc/commerce-contracts"
import { TrashIcon } from "../icons"
import { LinkComponent } from "../../types"

export type DisplayItemView = CartItemView | OrderLineView

export interface CartItemRowProps {
  item: DisplayItemView
  onUpdateQuantity?: (qty: number) => void
  onRemove?: () => void
  disabled?: boolean
  linkComponent?: LinkComponent
  productHref?: string
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false,
  linkComponent: LinkComp = Link,
  productHref,
}: CartItemRowProps) {
  const title = ("title" in item && item.title) ? item.title : (item.productTitle || "Garment")
  const href = productHref || (item.productHandle ? `/products/${item.productHandle}` : undefined)


  return (
    <div className="py-4 sm:py-6 border-b border-brand-border flex gap-4 sm:gap-6 items-start">
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] w-20 sm:w-24 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
        {item.thumbnail?.url ? (
          href ? (
            <LinkComp href={href}>
              <Image
                src={item.thumbnail.url}
                alt={item.thumbnail.altText || title}
                fill
                sizes="96px"
                className="object-cover object-center hover:scale-105 transition-transform"
              />
            </LinkComp>
          ) : (
            <Image
              src={item.thumbnail.url}
              alt={item.thumbnail.altText || title || "Garment"}
              fill
              sizes="96px"
              className="object-cover object-center"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-heading font-bold text-sm text-brand-primary line-clamp-1">
              {href ? (
                <LinkComp href={href} className="hover:text-brand-accent transition-colors">
                  {title}
                </LinkComp>
              ) : (
                title
              )}
            </h4>
            {(item.variantTitle || ("subtitle" in item && item.subtitle)) && (
              <p className="text-xs text-brand-muted font-medium">
                {item.variantTitle || ("subtitle" in item ? item.subtitle : undefined)}
              </p>
            )}
          </div>

          {/* Line Total */}
          <div className="text-right">
            <span className="font-heading font-bold text-sm text-brand-primary">
              {item.totalPrice.formatted}
            </span>
            {("originalTotalPrice" in item && item.originalTotalPrice) && (
              <p className="text-xs text-brand-muted line-through font-mono">
                {item.originalTotalPrice.formatted}
              </p>
            )}
          </div>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between pt-2">
          {onUpdateQuantity ? (
            <div className="flex items-center border border-brand-border bg-white h-8 text-xs">
              <button
                type="button"
                onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                disabled={disabled || item.quantity <= 1}
                className="w-7 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center font-heading font-semibold text-xs">
                {item.quantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                disabled={disabled}
                className="w-7 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <span className="text-xs text-brand-muted">Qty: {item.quantity}</span>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="text-xs text-brand-muted hover:text-rose-700 flex items-center gap-1 transition-colors p-1"
              aria-label={`Remove ${title}`}
            >
              <TrashIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
