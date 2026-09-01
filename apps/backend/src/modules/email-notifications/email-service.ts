export type SendEmailOptions = {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
  reply_to?: string
}

export class EmailService {
  private resendApiKey: string | undefined
  private fromEmail: string
  private replyToEmail: string

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY
    this.fromEmail = process.env.RESEND_FROM_EMAIL || "London Boy <orders@send.londonboy.uk>"
    this.replyToEmail = process.env.RESEND_REPLY_TO || "londonboy@mack.com.bd"
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
    const from = options.from || this.fromEmail
    const replyTo = options.reply_to || this.replyToEmail

    if (this.resendApiKey && !this.resendApiKey.includes("placeholder")) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.resendApiKey}`,
          },
          body: JSON.stringify({
            from,
            to: [options.to],
            reply_to: replyTo,
            subject: options.subject,
            html: options.html,
            text: options.text,
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          const errorMsg = (errData as { message?: string }).message || `Resend HTTP error ${response.status}`
          console.error(`[EmailService] Resend delivery failed for ${options.to}:`, errorMsg)
          return { success: false, error: errorMsg }
        }

        const data = (await response.json()) as { id?: string }
        console.log(`[EmailService] Email dispatched via Resend to ${options.to} (ID: ${data.id})`)
        return { success: true, id: data.id }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`[EmailService] Error connecting to Resend:`, message)
        return { success: false, error: message }
      }
    }

    // Local / Development logging fallback
    console.log("------------------------------------------------------------------")
    console.log(`[EmailService: DEV FALLBACK] Transactional Email Generated`)
    console.log(`To: ${options.to}`)
    console.log(`From: ${from}`)
    console.log(`Subject: ${options.subject}`)
    console.log(`Preview: ${options.text?.slice(0, 150)}...`)
    console.log("------------------------------------------------------------------")

    return {
      success: true,
      id: `dev_mock_${Date.now()}`,
    }
  }
}

export const emailService = new EmailService()
