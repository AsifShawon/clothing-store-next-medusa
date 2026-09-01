import { HttpTypes } from "@medusajs/types"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str?: string) => {
    if (!str) return "Processing"
    const formatted = str.split("_").join(" ")
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-border/60 gap-2">
        <div>
          <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-brand-accent block">
            Order Reference
          </span>
          <span className="font-heading font-extrabold text-base text-brand-primary" data-testid="order-id">
            #{order.display_id}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-brand-primary/60 uppercase tracking-wider block">
            Order Date
          </span>
          <span className="font-medium text-brand-primary" data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div>
          <span className="text-[10px] text-brand-primary/60 uppercase tracking-wider block">
            Confirmation Sent To
          </span>
          <span className="font-semibold text-brand-primary" data-testid="order-email">
            {order.email}
          </span>
        </div>

        {showStatus && (
          <>
            <div>
              <span className="text-[10px] text-brand-primary/60 uppercase tracking-wider block">
                Fulfillment Status
              </span>
              <span className="inline-block px-2 py-0.5 bg-brand-secondary border border-brand-border font-heading font-bold text-[10px] uppercase text-brand-accent" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-brand-primary/60 uppercase tracking-wider block">
                Payment Status
              </span>
              <span className="inline-block px-2 py-0.5 bg-brand-secondary border border-brand-border font-heading font-bold text-[10px] uppercase text-brand-primary" data-testid="order-payment-status">
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
