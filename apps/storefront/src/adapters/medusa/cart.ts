import {
  AddressFormView,
  AddressView,
  CartItemView,
  CartLineView,
  CartTotalsView,
  CartView,
  createMoneyView,
  CurrencyCode,
  OrderLineView,
  OrderPaymentStatusView,
  OrderStatusView,
  OrderView,
  PromotionView,
  ShippingMethodView,
  ShippingOptionView,
} from "@dtc/commerce-contracts"
import { HttpTypes } from "@medusajs/types"

export function toCartItemView(
  item: HttpTypes.StoreCartLineItem,
  currencyCode = "bdt"
): CartItemView {
  return {
    id: item.id,
    productId: item.product_id || item.product?.id || "",
    productTitle: item.product_title || item.title || "Garment",
    title: item.title || item.product_title || "Garment",
    subtitle: item.subtitle || item.variant_title || "",
    productHandle: item.product_handle || "",
    variantId: item.variant_id || item.variant?.id || "",
    variantTitle: item.variant_title || "",
    sku: item.variant_sku || item.variant?.sku || item.id,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.title || "Garment",
        }
      : undefined,
    unitPrice: createMoneyView(item.unit_price ?? 0, currencyCode),
    totalPrice: createMoneyView(item.total ?? 0, currencyCode),
    originalTotalPrice: item.original_total
      ? createMoneyView(item.original_total, currencyCode)
      : undefined,
    quantity: item.quantity,
    options: {},
  }
}

export function toCartTotalsView(
  cart: HttpTypes.StoreCart | HttpTypes.StoreOrder,
  currencyCode = "bdt"
): CartTotalsView {
  const subtotal = cart.subtotal ?? 0
  const discount = cart.discount_total ?? 0
  const shipping = cart.shipping_total ?? 0
  const tax = cart.tax_total ?? 0
  const total = cart.total ?? 0

  return {
    subtotal: createMoneyView(subtotal, currencyCode),
    discount: discount > 0 ? createMoneyView(discount, currencyCode) : undefined,
    shipping: shipping > 0 ? createMoneyView(shipping, currencyCode) : undefined,
    tax: tax > 0 ? createMoneyView(tax, currencyCode) : undefined,
    total: createMoneyView(total, currencyCode),
  }
}

export function toCartView(cart: HttpTypes.StoreCart): CartView {
  const currencyCode = (cart.currency_code || "bdt") as CurrencyCode
  const items: CartLineView[] = (cart.items || []).map((item) =>
    toCartItemView(item, currencyCode)
  )
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totals = toCartTotalsView(cart, currencyCode)

  const appliedPromotions: PromotionView[] = (cart.promotions || []).map((p) => {
    const promo = p as any
    return {
      id: promo.id,
      code: promo.code || "PROMO",
      description: promo.application_method?.description || undefined,
      discountType: "percentage" as const,
      amount: cart.discount_total ?? 0,
      formattedDiscount: `-${totals.discount?.formatted || "৳0"}`,
    }
  })

  return {
    id: cart.id,
    items,
    itemsCount,
    totals,
    appliedPromotions,
    promotions: appliedPromotions,
    currencyCode,
    regionName: cart.region?.name || "Bangladesh",
  }
}

export function toShippingMethodView(
  method: HttpTypes.StoreCartShippingOption,
  currencyCode = "bdt"
): ShippingMethodView {
  return {
    id: method.id,
    name: method.name,
    description: method.price_type === "flat" ? "Standard courier dispatch" : undefined,
    price: createMoneyView(method.amount ?? 0, currencyCode),
  }
}

export function toAddressFormView(address?: HttpTypes.StoreCartAddress | null): AddressFormView {
  return {
    firstName: address?.first_name || "",
    lastName: address?.last_name || "",
    address1: address?.address_1 || "",
    address2: address?.address_2 || "",
    city: address?.city || "Dhaka",
    postalCode: address?.postal_code || "",
    province: address?.province || "",
    country: address?.country_code || "Bangladesh",
    phone: address?.phone || "",
  }
}

export function toOrderView(order: HttpTypes.StoreOrder): OrderView {
  const currencyCode = order.currency_code || "bdt"
  const items: OrderLineView[] = (order.items || []).map((item: any) => ({
    id: item.id,
    productId: item.product_id || "",
    productTitle: item.product_title || item.title || "Garment",
    productHandle: item.product_handle || "",
    variantTitle: item.variant_title || "",
    sku: item.variant_sku || item.id,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.title || "Garment",
        }
      : undefined,
    unitPrice: createMoneyView(item.unit_price ?? 0, currencyCode),
    totalPrice: createMoneyView(item.total ?? 0, currencyCode),
    quantity: item.quantity,
  }))

  const totals = toCartTotalsView(order, currencyCode)

  const paymentStatusMap: Record<string, OrderPaymentStatusView> = {
    not_paid: "pending",
    awaiting: "pending",
    authorized: "authorized",
    partially_authorized: "authorized",
    captured: "captured",
    partially_captured: "captured",
    canceled: "failed",
    requires_action: "pending",
    refunded: "refunded",
    partially_refunded: "refunded",
  }

  const orderStatusMap: Record<string, OrderStatusView> = {
    pending: "pending",
    completed: "delivered",
    draft: "pending",
    archived: "delivered",
    canceled: "canceled",
    requires_action: "pending",
  }

  const defaultShipping: ShippingOptionView = {
    id: "medusa-shipping",
    name: "Standard Dispatch",
    price: totals.shipping || createMoneyView(0, currencyCode),
  }

  return {
    id: order.id,
    displayId: String(order.display_id ?? order.id),
    status: orderStatusMap[order.status] || "processing",
    paymentStatus: paymentStatusMap[order.payment_status] || "captured",
    fulfillmentStatus: (order as any).fulfillment_status || "confirmed",
    createdAt:
      typeof order.created_at === "string"
        ? order.created_at
        : new Date(order.created_at).toISOString(),
    email: order.email || "",
    items,
    shippingAddress: toAddressFormView(order.shipping_address),
    shippingOption: defaultShipping,
    shippingMethod: defaultShipping,
    paymentMethod: "Electronic Payment",
    itemSubtotal: totals.subtotal,
    discountTotal: totals.discount || createMoneyView(0, currencyCode),
    shippingTotal: totals.shipping || createMoneyView(0, currencyCode),
    total: totals.total,
    totals: {
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      tax: totals.tax,
      total: totals.total,
    },
  }
}
