import { Metadata } from "next"
import { notFound } from "next/navigation"
import { constructMetadata } from "@lib/util/seo"
import { retrieveCustomer } from "@lib/data/customer"
import { toCustomerView } from "@adapters/medusa/account"
import MedusaAddressesClient from "@modules/account/components/addresses-client"

export const metadata: Metadata = constructMetadata({
  title: "Shipping Addresses | London Boy",
  description: "View and update your London Boy delivery addresses.",
  noIndex: true,
})

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const customerView = toCustomerView(customer)

  return <MedusaAddressesClient customer={customerView} countryCode={countryCode} />
}
