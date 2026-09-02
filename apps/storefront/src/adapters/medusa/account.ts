import { createMoneyView, CustomerAddressView, CustomerView } from "@dtc/commerce-contracts"
import { HttpTypes } from "@medusajs/types"

export function toCustomerView(
  customer: HttpTypes.StoreCustomer,
  ordersCount = 0,
  totalSpent = 0
): CustomerView {
  const addresses: CustomerAddressView[] = (customer.addresses || []).map((addr) => ({
    id: addr.id,
    firstName: addr.first_name || "",
    lastName: addr.last_name || "",
    address1: addr.address_1 || "",
    address2: addr.address_2 || "",
    city: addr.city || "Dhaka",
    postalCode: addr.postal_code || "",
    province: addr.province || "",
    country: addr.country_code || "Bangladesh",
    phone: addr.phone || "",
    isDefaultShipping: addr.is_default_shipping ?? false,
    isDefaultBilling: addr.is_default_billing ?? false,
  }))

  const defaultAddr = addresses.find((a) => a.isDefaultShipping) || addresses[0]

  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.first_name || "",
    lastName: customer.last_name || "",
    phone: customer.phone || undefined,
    defaultAddress: defaultAddr,
    addresses,
    lifetimeOrdersCount: ordersCount,
    totalSpent: createMoneyView(totalSpent, "bdt"),
    isSimulatedDemo: false,
  }
}
