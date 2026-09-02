import { Metadata } from "next"
import { constructMetadata } from "@lib/util/seo"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import { toOrderView } from "@adapters/medusa/cart"
import MedusaOrdersClient from "@modules/account/components/orders-client"

export const metadata: Metadata = constructMetadata({
  title: "Orders | London Boy",
  description: "Overview of your previous London Boy orders.",
  noIndex: true,
})

export default async function Orders() {
  const orders = await listOrders().catch(() => [])

  if (!orders) {
    notFound()
  }

  const orderViews = (orders || []).map(toOrderView)

  return <MedusaOrdersClient orders={orderViews} />
}
