import { retrieveOrder } from "@lib/data/orders"
import { constructMetadata } from "@lib/util/seo"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = constructMetadata({
  title: "Order Confirmed | London Boy",
  description: "Your London Boy order was confirmed successfully.",
  noIndex: true,
})

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
