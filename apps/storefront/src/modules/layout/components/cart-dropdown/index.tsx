"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    itemRef.current = totalItems
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, pathname])

  return (
    <div
      className="h-full z-50 flex items-center"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full flex items-center">
        <PopoverButton className="h-full flex items-center focus:outline-none">
          <LocalizedClientLink
            className="flex items-center gap-2 p-2 text-xs font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors group"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Shopping bag with ${totalItems} items`}
          >
            <div className="relative">
              <svg
                className="w-5 h-5 text-brand-primary group-hover:text-brand-accent transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-brand-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-heading">
              Bag ({totalItems})
            </span>
          </LocalizedClientLink>
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border border-brand-border w-[400px] text-brand-primary shadow-2xl rounded-none z-50"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 border-b border-brand-border/60 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-sm tracking-wider uppercase">Shopping Bag ({totalItems})</h3>
              <span className="text-[11px] text-brand-accent font-medium">Inside Dhaka ৳60</span>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-auto max-h-[380px] p-4 space-y-4 no-scrollbar divide-y divide-brand-border/40">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="pt-3 first:pt-0 grid grid-cols-[80px_1fr] gap-x-3.5"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 bg-brand-secondary overflow-hidden block"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-brand-primary hover:underline line-clamp-1">
                                <LocalizedClientLink
                                  href={`/products/${item.product_handle}`}
                                  data-testid="product-link"
                                >
                                  {item.title}
                                </LocalizedClientLink>
                              </h4>
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                            <div className="text-[11px] text-brand-primary/70 mt-1">
                              <LineItemOptions
                                variant={item.variant}
                                data-testid="cart-item-variant"
                                data-value={item.variant}
                              />
                            </div>
                            <div className="text-[11px] text-brand-muted mt-0.5">
                              Qty: {item.quantity}
                            </div>
                          </div>

                          <div className="pt-2 flex justify-start">
                            <DeleteButton
                              id={item.id}
                              className="text-[11px] text-brand-accent-alt hover:underline"
                              data-testid="cart-item-remove-button"
                            >
                              Remove
                            </DeleteButton>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 bg-brand-secondary/40 border-t border-brand-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-brand-primary/80">
                      Subtotal
                    </span>
                    <span
                      className="font-bold text-sm text-brand-primary"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink
                    href="/cart"
                    onClick={close}
                    className="block w-full py-3 bg-brand-primary hover:bg-black text-white text-center text-xs font-semibold tracking-wider uppercase transition-colors"
                    data-testid="go-to-cart-button"
                  >
                    Proceed to Bag &amp; Checkout
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-brand-secondary flex items-center justify-center text-brand-primary/50 text-sm">
                  0
                </div>
                <p className="text-xs text-brand-primary font-medium">Your shopping bag is empty.</p>
                <LocalizedClientLink
                  href="/store"
                  onClick={close}
                  className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Explore Collection
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
