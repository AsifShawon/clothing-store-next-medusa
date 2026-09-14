import {
  orderCompensationWorkflow,
  inventoryAuditLog,
} from "../order-compensation-workflow"

describe("Medusa v2 Workflows & Step Compensation Invariants", () => {
  beforeEach(() => {
    inventoryAuditLog.length = 0
  })

  it("executes steps in sequence on successful checkout workflow", async () => {
    const { result, errors } = await orderCompensationWorkflow().run({
      input: {
        inventory: { sku: "LB-TEE-HVY-BLK-S", quantity: 2 },
        payment: { amount: 4800, currency: "bdt", failAuthorization: false },
      },
    })

    expect(errors).toHaveLength(0)
    expect(result.inventory.reserved).toBe(true)
    expect(result.inventory.quantity).toBe(2)
    expect(result.payment.authorized).toBe(true)

    expect(inventoryAuditLog).toEqual([
      { action: "RESERVE", sku: "LB-TEE-HVY-BLK-S", quantity: 2 },
    ])
  })

  it("triggers compensation rollback when a downstream payment step fails", async () => {
    const { errors } = await orderCompensationWorkflow().run({
      input: {
        inventory: { sku: "LB-HOODIE-OVS-GREY-M", quantity: 1 },
        payment: { amount: 3500, currency: "bdt", failAuthorization: true },
      },
      throwOnError: false,
    })

    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0].error.message).toContain("Payment authorization failed")

    // The compensation handler must have fired to release the reserved inventory
    expect(inventoryAuditLog).toEqual([
      { action: "RESERVE", sku: "LB-HOODIE-OVS-GREY-M", quantity: 1 },
      { action: "RELEASE_COMPENSATION", sku: "LB-HOODIE-OVS-GREY-M", quantity: 1 },
    ])
  })
})
