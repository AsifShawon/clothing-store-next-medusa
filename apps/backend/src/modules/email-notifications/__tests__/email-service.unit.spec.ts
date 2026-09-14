import { EmailService } from "../email-service"
import { generateOrderPlacedEmail } from "../templates/order-placed"
import { generatePasswordResetEmail } from "../templates/password-reset"
import { generateEmailVerificationEmail } from "../templates/email-verification"

describe("Email Notification Service & Templates", () => {
  describe("EmailService Dispatcher", () => {
    let originalFetch: typeof global.fetch

    beforeEach(() => {
      originalFetch = global.fetch
    })

    afterEach(() => {
      global.fetch = originalFetch
    })

    it("falls back to local development logging when no API key is provided", async () => {
      const service = new EmailService()
      const result = await service.sendEmail({
        to: "customer@londonboy.co.uk",
        subject: "Order Confirmation",
        html: "<p>Thank you for your order!</p>",
        text: "Thank you for your order!",
      })

      expect(result.success).toBe(true)
      expect(result.id).toMatch(/^dev_mock_/)
    })

    it("dispatches HTTP request to Resend when API key is set", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "resend_msg_12345" }),
      })
      global.fetch = mockFetch as unknown as typeof global.fetch

      process.env.RESEND_API_KEY = "re_valid_live_api_key_123"
      const service = new EmailService()

      const result = await service.sendEmail({
        to: "customer@londonboy.co.uk",
        subject: "Order Confirmation",
        html: "<p>Thank you for your order!</p>",
        text: "Thank you for your order!",
      })

      expect(result.success).toBe(true)
      expect(result.id).toBe("resend_msg_12345")
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.resend.com/emails",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer re_valid_live_api_key_123",
          }),
        })
      )

      delete process.env.RESEND_API_KEY
    })

    it("handles Resend HTTP errors gracefully without throwing unhandled exceptions", async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: "Domain not verified in Resend" }),
      })
      global.fetch = mockFetch as unknown as typeof global.fetch

      process.env.RESEND_API_KEY = "re_valid_live_api_key_123"
      const service = new EmailService()

      const result = await service.sendEmail({
        to: "customer@londonboy.co.uk",
        subject: "Order Confirmation",
        html: "<p>Thank you</p>",
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain("Domain not verified")

      delete process.env.RESEND_API_KEY
    })
  })

  describe("Transactional Templates", () => {
    it("generates correct order placed email structure", () => {
      const email = generateOrderPlacedEmail({
        order: {
          id: "order_1001",
          display_id: 1001,
          email: "customer@londonboy.co.uk",
          currency_code: "bdt",
          total: 2500,
          subtotal: 2400,
          shipping_total: 100,
          discount_total: 0,
          tax_total: 0,
          items: [
            {
              title: "Heavyweight T-Shirt",
              variant_title: "Black / S",
              quantity: 1,
              unit_price: 2400,
            },
          ],
          shipping_address: {
            first_name: "Asif",
            last_name: "Shawon",
            address_1: "Road 11, Banani",
            city: "Dhaka",
            postal_code: "1213",
          },
        },
      })

      expect(email.subject).toContain("#1001")
      expect(email.html).toContain("Heavyweight T-Shirt")
      expect(email.text).toContain("2,500 BDT")
    })

    it("generates correct password reset email structure", () => {
      const email = generatePasswordResetEmail({
        email: "customer@londonboy.co.uk",
        token: "reset_token_xyz_987",
      })

      expect(email.subject).toContain("Reset Your Password")
      expect(email.html).toContain("reset_token_xyz_987")
      expect(email.text).toContain("customer@londonboy.co.uk")
    })

    it("generates correct email verification structure", () => {
      const email = generateEmailVerificationEmail({
        email: "customer@londonboy.co.uk",
        token: "verify_token_abc_123",
      })

      expect(email.subject).toContain("Verify Your Email")
      expect(email.html).toContain("verify_token_abc_123")
      expect(email.text).toContain("customer@londonboy.co.uk")
    })
  })
})
