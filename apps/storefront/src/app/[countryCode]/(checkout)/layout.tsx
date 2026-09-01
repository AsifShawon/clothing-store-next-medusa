import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      <div className="h-16 bg-white border-b ">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base ">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-display text-xl tracking-[0.18em] text-brand-primary font-bold hover:opacity-90"
            data-testid="store-link"
          >
            LONDON BOY
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <main id="main-content" className="relative flex-1" data-testid="checkout-container">
        {children}
      </main>
      <footer className="py-6 w-full flex items-center justify-center border-t border-brand-border/40 text-xs text-brand-primary/60">
        <div className="flex items-center gap-2">
          <span>🔒 256-Bit SSL Encrypted Checkout</span>
          <span>•</span>
          <span>London Boy Dhaka Fulfillment</span>
        </div>
      </footer>
    </div>
  )
}
