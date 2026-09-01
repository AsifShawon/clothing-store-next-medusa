"use client"

import { Table, clx } from "@modules/common/components/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    if (quantity < 1) return
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQuantity = 10

  return (
    <Table.Row className="w-full border-b border-brand-border/40 hover:bg-brand-secondary/20 transition-colors" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24 align-top">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex border border-brand-border overflow-hidden bg-brand-secondary", {
            "w-16": type === "preview",
            "w-20 sm:w-24": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left align-top py-4">
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="font-heading font-semibold text-sm text-brand-primary hover:text-brand-accent transition-colors block"
          data-testid="product-title"
        >
          {item.product_title}
        </LocalizedClientLink>
        <LineItemOptions variant={item.variant} data-testid="product-variant" />
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="align-top py-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <DeleteButton id={item.id} data-testid="product-delete-button" />
              
              <div className="relative flex items-center">
                <CartItemSelect
                  value={item.quantity}
                  disabled={updating}
                  onChange={(value) => changeQuantity(parseInt(value.target.value))}
                  className="w-16 h-9 px-2 text-xs font-semibold bg-white border border-brand-border text-brand-primary focus:border-brand-primary"
                  data-testid="product-select-button"
                >
                  {Array.from(
                    {
                      length: maxQuantity,
                    },
                    (_, i) => (
                      <option value={i + 1} key={i}>
                        {i + 1}
                      </option>
                    )
                  )}
                </CartItemSelect>
                {updating && (
                  <div className="ml-2">
                    <Spinner className="animate-spin text-brand-accent" />
                  </div>
                )}
              </div>
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </div>
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell align-top py-4 text-xs font-sans text-brand-primary/80">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0 align-top py-4 text-right">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 text-xs text-brand-primary/60">
              <span>{item.quantity}x </span>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <div className="font-heading font-bold text-sm text-brand-primary">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
