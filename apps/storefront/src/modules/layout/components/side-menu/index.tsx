"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import useToggleState from "@lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Fragment, useState } from "react"
import CountrySelect from "../country-select"
import { Locale } from "@lib/data/locales"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const [categoriesOpen, setCategoriesOpen] = useState(true)

  return (
    <div className="h-full flex items-center">
      <Popover className="h-full flex items-center">
        {({ open, close }) => (
          <>
            <Popover.Button
              data-testid="nav-menu-button"
              className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-brand-primary hover:text-brand-accent transition-colors p-2 focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="hidden sm:inline">Menu</span>
            </Popover.Button>

            {open && (
              <div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={close}
                data-testid="side-menu-backdrop"
              />
            )}

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-300 transform"
              enterFrom="-translate-x-full opacity-0"
              enterTo="translate-x-0 opacity-100"
              leave="transition ease-in duration-200 transform"
              leaveFrom="translate-x-0 opacity-100"
              leaveTo="-translate-x-full opacity-0"
            >
              <PopoverPanel className="fixed top-0 left-0 bottom-0 w-full max-w-sm z-[70] bg-brand-primary text-brand-secondary shadow-2xl flex flex-col justify-between overflow-y-auto">
                {/* Header inside drawer */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-display text-xl tracking-wider text-white">LONDON BOY</span>
                    <span className="text-[10px] text-brand-muted tracking-widest uppercase">British Smart-Casual</span>
                  </div>
                  <button
                    data-testid="close-menu-button"
                    onClick={close}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="p-6 space-y-6 flex-1">
                  {/* Primary Links */}
                  <div className="space-y-3">
                    <LocalizedClientLink
                      href="/"
                      onClick={close}
                      className="block text-lg font-heading font-semibold hover:text-brand-accent transition-colors"
                    >
                      Home
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/store"
                      onClick={close}
                      className="block text-lg font-heading font-semibold text-white hover:text-brand-accent transition-colors"
                    >
                      Shop All Collection
                    </LocalizedClientLink>
                  </div>

                  {/* Collections */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted font-semibold block">
                      Curated Collections
                    </span>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <LocalizedClientLink
                          href="/collections/new-arrivals"
                          onClick={close}
                          className="hover:text-brand-accent transition-colors block py-1"
                        >
                          ✨ New Arrivals
                        </LocalizedClientLink>
                      </li>
                      <li>
                        <LocalizedClientLink
                          href="/collections/best-sellers"
                          onClick={close}
                          className="hover:text-brand-accent transition-colors block py-1"
                        >
                          🔥 Best Sellers
                        </LocalizedClientLink>
                      </li>
                      <li>
                        <LocalizedClientLink
                          href="/collections/essentials"
                          onClick={close}
                          className="hover:text-brand-accent transition-colors block py-1"
                        >
                          👔 The Essentials
                        </LocalizedClientLink>
                      </li>
                    </ul>
                  </div>

                  {/* Categories Accordion */}
                  <div className="pt-4 border-t border-white/10 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setCategoriesOpen(!categoriesOpen)}
                      className="w-full flex items-center justify-between text-[10px] uppercase tracking-widest text-brand-muted font-semibold"
                    >
                      <span>Categories</span>
                      <span>{categoriesOpen ? "−" : "+"}</span>
                    </button>
                    {categoriesOpen && (
                      <ul className="space-y-2 text-sm pl-2 border-l border-white/10">
                        <li>
                          <LocalizedClientLink
                            href="/categories/men"
                            onClick={close}
                            className="hover:text-brand-accent transition-colors block py-1"
                          >
                            Men&apos;s Clothing
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink
                            href="/categories/women"
                            onClick={close}
                            className="hover:text-brand-accent transition-colors block py-1"
                          >
                            Women&apos;s Edit
                          </LocalizedClientLink>
                        </li>
                        <li>
                          <LocalizedClientLink
                            href="/categories/accessories"
                            onClick={close}
                            className="hover:text-brand-accent transition-colors block py-1"
                          >
                            Accessories &amp; Caps
                          </LocalizedClientLink>
                        </li>
                      </ul>
                    )}
                  </div>

                  {/* Customer Care Links */}
                  <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-brand-muted">
                    <span className="text-[10px] uppercase tracking-widest text-brand-muted/70 font-semibold block">
                      Customer Service
                    </span>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <LocalizedClientLink href="/about" onClick={close} className="hover:text-white transition-colors">
                        About London Boy
                      </LocalizedClientLink>
                      <LocalizedClientLink href="/contact" onClick={close} className="hover:text-white transition-colors">
                        Contact Care
                      </LocalizedClientLink>
                      <LocalizedClientLink href="/shipping-policy" onClick={close} className="hover:text-white transition-colors">
                        Shipping Rates
                      </LocalizedClientLink>
                      <LocalizedClientLink href="/return-policy" onClick={close} className="hover:text-white transition-colors">
                        24h Returns
                      </LocalizedClientLink>
                    </div>
                  </div>
                </div>

                {/* Footer inside drawer */}
                <div className="p-6 bg-black/40 border-t border-white/10 space-y-4">
                  {regions && (
                    <div className="flex items-center justify-between text-xs text-brand-muted">
                      <span>Delivery Region:</span>
                      <CountrySelect toggleState={countryToggleState} regions={regions} />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-brand-muted/70 pt-2 border-t border-white/5">
                    <span>© {new Date().getFullYear()} London Boy</span>
                    <LocalizedClientLink href="/account" onClick={close} className="text-white hover:underline">
                      My Account
                    </LocalizedClientLink>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
