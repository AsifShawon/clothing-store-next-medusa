import {
  AddressView,
  CartLineView,
  CartTotalsView,
  CartView,
  createMoneyView,
  OrderLineView,
  OrderStatusView,
  OrderPaymentStatusView,
  OrderView,
  PromotionView,
  ShippingOptionView,
} from "@dtc/commerce-contracts"
import {
  DemoAddress,
  DemoCartItem,
  DemoOrder,
  DemoShippingOption,
} from "../../lib/types"

export function toCartItemView(item: DemoCartItem): CartLineView {
  const lineTotal = item.unitPrice * item.quantity

  return {
    id: item.id,
    productId: item.productId,
    productTitle: item.productTitle,
    productHandle: item.productHandle,
    variantId: item.variantId,
    variantTitle: item.variantTitle,
    sku: item.sku,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.productTitle,
        }
      : undefined,
    unitPrice: createMoneyView(item.unitPrice, "bdt"),
    totalPrice: createMoneyView(lineTotal, "bdt"),
    quantity: item.quantity,
    options: item.options || {},
  }
}

export function toCartTotalsView(
  subtotalAmount: number,
  discountAmount: number,
  shippingAmount?: number
): CartTotalsView {
  const finalTotal = Math.max(0, subtotalAmount - discountAmount + (shippingAmount || 0))

  return {
    subtotal: createMoneyView(subtotalAmount, "bdt"),
    discount: discountAmount > 0 ? createMoneyView(discountAmount, "bdt") : createMoneyView(0, "bdt"),
    shipping: shippingAmount !== undefined ? createMoneyView(shippingAmount, "bdt") : createMoneyView(0, "bdt"),
    total: createMoneyView(finalTotal, "bdt"),
  }
}

export function toCartView(
  items: DemoCartItem[],
  subtotal: number,
  discount: number,
  shipping?: number,
  appliedPromoCode?: string
): CartView {
  const itemViews = items.map(toCartItemView)
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const totals = toCartTotalsView(subtotal, discount, shipping)

  const appliedPromotions: PromotionView[] = appliedPromoCode
    ? [
        {
          id: `promo-${appliedPromoCode}`,
          code: appliedPromoCode,
          description: "Portfolio Demo Promotion",
          discountType: "percentage",
          amount: discount,
          formattedDiscount: `-${totals.discount?.formatted || "৳0"}`,
        },
      ]
    : []

  return {
    id: "demo-cart-id",
    items: itemViews,
    itemsCount,
    totals,
    appliedPromotions,
    promotions: appliedPromotions,
    currencyCode: "BDT",
    regionName: "Bangladesh (BDT)",
  }
}

export function toShippingMethodView(option: DemoShippingOption): ShippingOptionView {
  return {
    id: option.id,
    name: option.name,
    description: option.description,
    price: createMoneyView(option.price, "bdt"),
    estimatedDelivery: option.estimatedDelivery,
  }
}

export function toAddressFormView(address?: Partial<DemoAddress>): AddressView {
  return {
    firstName: address?.firstName || "",
    lastName: address?.lastName || "",
    address1: address?.address1 || "",
    address2: address?.address2 || "",
    city: address?.city || "Dhaka",
    postalCode: address?.postalCode || "",
    province: "",
    country: "Bangladesh",
    phone: address?.phone || "",
    email: address?.email || "",
  }
}

export function toOrderView(order: DemoOrder): OrderView {
  const items: OrderLineView[] = order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productTitle: item.productTitle,
    productHandle: item.productHandle,
    variantTitle: item.variantTitle,
    sku: item.sku,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.productTitle,
        }
      : undefined,
    unitPrice: createMoneyView(item.unitPrice, "bdt"),
    totalPrice: createMoneyView(item.totalPrice, "bdt"),
    quantity: item.quantity,
  }))

  const totals = toCartTotalsView(order.itemSubtotal, order.discountTotal, order.shippingTotal)

  const statusMap: Record<string, OrderStatusView> = {
    pending: "pending",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    canceled: "canceled",
  }

  const paymentStatusMap: Record<string, OrderPaymentStatusView> = {
    pending: "pending",
    authorized: "authorized",
    paid: "captured",
    refunded: "refunded",
  }

  const shippingOption = order.shippingOption
    ? toShippingMethodView(order.shippingOption)
    : {
        id: "default",
        name: "Standard Delivery",
        price: createMoneyView(order.shippingTotal || 60, "bdt"),
      }

  return {
    id: order.id,
    displayId: order.displayId,
    status: statusMap[order.status] || "pending",
    paymentStatus: paymentStatusMap[order.paymentStatus] || "captured",
    fulfillmentStatus: order.fulfillmentStatus || "not_fulfilled",
    createdAt: order.createdAt,
    email: order.customer.email,
    items,
    shippingAddress: toAddressFormView(order.shippingAddress),
    shippingOption,
    shippingMethod: shippingOption,
    paymentMethod: order.paymentMethod,
    itemSubtotal: totals.subtotal,
    discountTotal: totals.discount || createMoneyView(0, "bdt"),
    shippingTotal: totals.shipping || createMoneyView(0, "bdt"),
    total: totals.total,
    totals,
    appliedPromotionCode: order.appliedPromotionCode,
  }
}
