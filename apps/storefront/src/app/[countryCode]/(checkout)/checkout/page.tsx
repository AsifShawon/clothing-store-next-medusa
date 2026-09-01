import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { constructMetadata } from "@lib/util/seo"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
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

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 content-container gap-10 lg:gap-14 py-10 sm:py-14 items-start">
        <div className="lg:col-span-7">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <CheckoutSummary cart={cart} />
        </div>
      </div>
    </div>
  )
}
