import { HttpTypes } from "@medusajs/types"
import { toOrderView } from "../../../adapters/medusa/cart"
import MedusaOrderCompletedClient from "../components/order-completed-client"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const orderView = toOrderView(order)
  return <MedusaOrderCompletedClient order={orderView} />
}
