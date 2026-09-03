import { HttpTypes } from "@medusajs/types"
import { toCartView } from "../../../adapters/medusa/cart"
import MedusaCartClient from "../components/cart-client"

const CartTemplate = ({
  cart,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const cartView = cart ? toCartView(cart) : null

  return <MedusaCartClient cart={cartView} />
}

export default CartTemplate
