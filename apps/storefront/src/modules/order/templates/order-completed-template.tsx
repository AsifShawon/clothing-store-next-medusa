import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="content-container max-w-4xl space-y-8" data-testid="order-complete-container">
        {/* Order Confirmed Banner */}
        <div className="p-8 bg-brand-secondary border border-brand-border text-center space-y-3">
          <div className="w-12 h-12 bg-brand-accent text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-accent block">
            Order Confirmed &amp; Dispatched for Tailoring
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
            Thank you for your order
          </h1>
          <p className="text-xs sm:text-sm text-brand-primary/70 max-w-md mx-auto leading-relaxed">
            Your garments are now being prepared at our Dhaka Central Warehouse for delivery.
          </p>
        </div>

        {/* Order Summary & Meta */}
        <div className="p-6 bg-white border border-brand-border space-y-6">
          <OrderDetails order={order} showStatus />
        </div>

        {/* Items List */}
        <div className="p-6 bg-white border border-brand-border space-y-6">
          <h2 className="font-display text-2xl text-brand-primary">
            Ordered Garments
          </h2>
          <Items order={order} />
          <div className="border-t border-brand-border/60 pt-4">
            <CartTotals totals={order} />
          </div>
        </div>

        {/* Logistics & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-brand-border">
            <ShippingDetails order={order} />
          </div>
          <div className="p-6 bg-white border border-brand-border">
            <PaymentDetails order={order} />
          </div>
        </div>

        {/* Help & Return Support */}
        <div className="p-6 bg-brand-secondary/40 border border-brand-border">
          <Help />
        </div>

        <div className="text-center pt-4">
          <LocalizedClientLink
            href="/store"
            className="inline-block px-8 py-3.5 bg-brand-primary text-white hover:bg-black text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-md"
          >
            Continue Shopping →
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
