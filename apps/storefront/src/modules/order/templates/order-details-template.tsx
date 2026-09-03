"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { toOrderView } from "../../../adapters/medusa/cart"
import MedusaOrderCompletedClient from "../components/order-completed-client"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const orderView = toOrderView(order)
  return <MedusaOrderCompletedClient order={orderView} />
}

export default OrderDetailsTemplate
