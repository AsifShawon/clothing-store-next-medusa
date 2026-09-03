import { createMoneyView, CustomerView } from "@dtc/commerce-contracts"
import { DemoCustomer } from "../../lib/types"

export function toCustomerView(
  customer: DemoCustomer,
  ordersCount = 0,
  totalSpent = 0
): CustomerView {
  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    defaultAddress: customer.defaultAddress
      ? {
          firstName: customer.defaultAddress.firstName,
          lastName: customer.defaultAddress.lastName,
          address1: customer.defaultAddress.address1,
          address2: customer.defaultAddress.address2,
          city: customer.defaultAddress.city,
          postalCode: customer.defaultAddress.postalCode,
          country: customer.defaultAddress.country,
          phone: customer.defaultAddress.phone,
          email: customer.defaultAddress.email,
        }
      : undefined,
    lifetimeOrdersCount: ordersCount || customer.ordersCount,
    totalSpent: createMoneyView(totalSpent || customer.totalSpent, "bdt"),
    isSimulatedDemo: true,
  }
}
