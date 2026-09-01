import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { generateOrderPlacedEmail, OrderPlacedTemplateData } from "../modules/email-notifications/templates/order-placed"
import { emailService } from "../modules/email-notifications/email-service"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "currency_code",
        "total",
        "subtotal",
        "shipping_total",
        "discount_total",
        "tax_total",
        "items.*",
        "shipping_address.*",
      ],
      filters: {
        id: data.id,
      },
    })

    const order = orders[0]
    if (!order || !order.email) {
      logger.warn(`[Subscriber: order.placed] Order ${data.id} has no email address or was not found.`)
      return
    }

    logger.info(`[Subscriber: order.placed] Preparing order confirmation email for order #${order.display_id} (${order.email})`)

    const emailContent = generateOrderPlacedEmail({ order: order as unknown as OrderPlacedTemplateData["order"] })

    await emailService.sendEmail({
      to: order.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.error(`[Subscriber: order.placed] Failed to process order confirmation email: ${msg}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
