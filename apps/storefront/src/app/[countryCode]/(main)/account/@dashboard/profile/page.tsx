import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { toCustomerView } from "@adapters/medusa/account"
import MedusaProfileClient from "@modules/account/components/profile-client"

export const metadata: Metadata = constructMetadata({
  title: "Profile | London Boy",
  description: "View and edit your London Boy customer profile.",
  noIndex: true,
})

export default async function Profile() {
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const customerView = toCustomerView(customer)

  return <MedusaProfileClient customer={customerView} />
}
