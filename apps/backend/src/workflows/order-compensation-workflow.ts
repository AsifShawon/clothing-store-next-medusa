import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"

export type ReserveInventoryInput = {
  sku: string
  quantity: number
}

export type PaymentAuthorizationInput = {
  amount: number
  currency: string
  failAuthorization?: boolean
}

export type CheckoutWorkflowInput = {
  inventory: ReserveInventoryInput
  payment: PaymentAuthorizationInput
}

// In-memory state tracking to test and demonstrate compensation behavior
export const inventoryAuditLog: { action: string; sku: string; quantity: number }[] = []

export const reserveInventory = createStep(
  "reserve-inventory",
  async (input: ReserveInventoryInput) => {
    inventoryAuditLog.push({
      action: "RESERVE",
      sku: input.sku,
      quantity: input.quantity,
    })

    return new StepResponse(
      { reserved: true, sku: input.sku, quantity: input.quantity },
      { sku: input.sku, quantity: input.quantity }
    )
  },
  async (compensationData) => {
    if (compensationData) {
      inventoryAuditLog.push({
        action: "RELEASE_COMPENSATION",
        sku: compensationData.sku,
        quantity: compensationData.quantity,
      })
    }
  }
)

export const authorizePayment = createStep(
  "authorize-payment",
  async (input: PaymentAuthorizationInput) => {
    if (input.failAuthorization) {
      throw new MedusaError(
        MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
        `Payment authorization failed for ${input.amount} ${input.currency}`
      )
    }

    return new StepResponse({
      authorized: true,
      amount: input.amount,
      currency: input.currency,
    })
  }
)

export const orderCompensationWorkflow = createWorkflow(
  "order-compensation",
  (input: CheckoutWorkflowInput) => {
    const reserved = reserveInventory(input.inventory)
    const payment = authorizePayment(input.payment)

    return new WorkflowResponse({
      inventory: reserved,
      payment,
    })
  }
)
