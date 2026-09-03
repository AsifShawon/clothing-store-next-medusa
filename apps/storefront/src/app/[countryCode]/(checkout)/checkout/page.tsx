import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { constructMetadata } from "@lib/util/seo"
import MedusaCheckoutClient from "@modules/checkout/components/checkout-client"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = constructMetadata({
  title: "Checkout | London Boy",
  description: "Secure checkout for London Boy clothing.",
  noIndex: true,
})

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Checkout(props: Props) {
  const { countryCode } = await props.params
  const cart = await retrieveCart()

  if (!cart || !cart.items || cart.items.length === 0) {
    redirect(`/${countryCode}/cart`)
  }

  const customer = await retrieveCustomer()
  const shippingMethods = await listCartShippingMethods(cart.id).catch(() => [])
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "").catch(() => [])

  return (
    <MedusaCheckoutClient
      cart={cart}
      customer={customer}
      availableShippingMethods={shippingMethods || []}
      availablePaymentMethods={paymentMethods || []}
      countryCode={countryCode}
    />
  )
}
