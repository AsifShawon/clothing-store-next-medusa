import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { generatePasswordResetEmail } from "../modules/email-notifications/templates/password-reset"
import { emailService } from "../modules/email-notifications/email-service"

export default async function authPasswordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type?: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  try {
    const email = data.entity_id
    const token = data.token

    if (!email || !token) {
      logger.warn(`[Subscriber: auth.password_reset] Missing email or token in payload.`)
      return
    }

    logger.info(`[Subscriber: auth.password_reset] Preparing password reset email for ${email}`)

    const emailContent = generatePasswordResetEmail({
      email,
      token,
    })

    await emailService.sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.error(`[Subscriber: auth.password_reset] Failed to process password reset email: ${msg}`)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
