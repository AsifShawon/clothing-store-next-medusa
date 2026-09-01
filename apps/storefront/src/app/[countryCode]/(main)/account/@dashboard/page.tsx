import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = constructMetadata({
  title: "Account Dashboard | London Boy",
  description: "Overview of your London Boy account activity.",
  noIndex: true,
})

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
