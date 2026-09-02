import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"
import { toCustomerView } from "@adapters/medusa/account"
import { toOrderView } from "@adapters/medusa/cart"
import MedusaAccountOverviewClient from "@modules/account/components/overview-client"

export const metadata: Metadata = constructMetadata({
  title: "Account Dashboard | London Boy",
  description: "Overview of your London Boy account activity.",
  noIndex: true,
})

export default async function OverviewTemplate() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => [])) || []

  if (!customer) {
    notFound()
  }

  const orderViews = orders.map(toOrderView)
  const totalSpent = orders.reduce((acc, curr) => acc + (curr.total ?? 0), 0)
  const customerView = toCustomerView(customer, orders.length, totalSpent)

  return (
    <MedusaAccountOverviewClient
      customer={customerView}
      recentOrders={orderViews}
    />
  )
}
