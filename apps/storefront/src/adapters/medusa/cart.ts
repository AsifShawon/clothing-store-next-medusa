import {
  AddressFormView,
  CartItemView,
  CartTotalsView,
  CartView,
  createMoneyView,
  OrderView,
  ShippingMethodView,
} from "@dtc/commerce-contracts"
import { HttpTypes } from "@medusajs/types"

export function toCartItemView(
  item: HttpTypes.StoreCartLineItem,
  currencyCode = "bdt"
): CartItemView {
  return {
    id: item.id,
    title: item.title || item.product_title || "Garment",
    subtitle: item.subtitle || item.variant_title,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.title,
        }
      : undefined,
    variantTitle: item.variant_title,
    quantity: item.quantity,
    unitPrice: createMoneyView(item.unit_price ?? 0, currencyCode),
    totalPrice: createMoneyView(item.total ?? 0, currencyCode),
    originalTotalPrice: item.original_total
      ? createMoneyView(item.original_total, currencyCode)
      : undefined,
    productHandle: item.product_handle,
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
  const currencyCode = cart.currency_code || "bdt"
  const items = (cart.items || []).map((item) => toCartItemView(item, currencyCode))
  const itemsCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totals = toCartTotalsView(cart, currencyCode)

  const promotions = (cart.promotions || []).map((p) => {
    const promo = p as HttpTypes.StorePromotion
    return {
      id: promo.id,
      code: promo.code || "PROMO",
      description: promo.application_method?.description,
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
    promotions,
    region: cart.region?.name || "Bangladesh",
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
    countryCode: address?.country_code || "bd",
    phone: address?.phone || "",
  }
}

export function toOrderView(order: HttpTypes.StoreOrder): OrderView {
  const currencyCode = order.currency_code || "bdt"
  const items: CartItemView[] = (order.items || []).map((item: HttpTypes.StoreOrderLineItem) => ({
    id: item.id,
    title: item.title || item.product_title || "Garment",
    subtitle: item.subtitle || item.variant_title,
    thumbnail: item.thumbnail
      ? {
          id: `${item.id}-thumb`,
          url: item.thumbnail,
          altText: item.title,
        }
      : undefined,
    variantTitle: item.variant_title,
    quantity: item.quantity,
    unitPrice: createMoneyView(item.unit_price ?? 0, currencyCode),
    totalPrice: createMoneyView(item.total ?? 0, currencyCode),
    productHandle: item.product_handle,
  }))

  const totals = toCartTotalsView(order, currencyCode)

  const paymentStatusMap: Record<string, OrderView["paymentStatus"]> = {
    not_paid: "awaiting",
    awaiting: "awaiting",
    authorized: "captured",
    partially_authorized: "captured",
    captured: "captured",
    partially_captured: "captured",
    canceled: "failed",
    requires_action: "awaiting",
    refunded: "refunded",
    partially_refunded: "refunded",
  }

  const fulfillmentStatusMap: Record<string, OrderView["fulfillmentStatus"]> = {
    not_fulfilled: "not_fulfilled",
    partially_fulfilled: "fulfilled",
    fulfilled: "fulfilled",
    partially_shipped: "shipped",
    shipped: "shipped",
    partially_delivered: "delivered",
    delivered: "delivered",
    canceled: "not_fulfilled",
  }

  return {
    id: order.id,
    displayId: order.display_id,
    status: order.status === "canceled" ? "canceled" : "completed",
    paymentStatus: paymentStatusMap[order.payment_status] || "captured",
    fulfillmentStatus: fulfillmentStatusMap[order.fulfillment_status] || "fulfilled",
    createdAt: order.created_at,
    email: order.email || "",
    currencyCode,
    items,
    shippingAddress: toAddressFormView(order.shipping_address),
    totals,
  }
}
