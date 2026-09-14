import { sanitizeHeaders } from "../../api/middlewares"

describe("Logging & Header Sanitization", () => {
  it("redacts authorization bearer tokens", () => {
    const headers = {
      authorization: "Bearer secret_customer_jwt_token_12345",
      "content-type": "application/json",
    }
    const sanitized = sanitizeHeaders(headers)
    expect(sanitized.authorization).toBe("[REDACTED]")
    expect(sanitized["content-type"]).toBe("application/json")
  })

  it("redacts cookie session secrets", () => {
    const headers = {
      cookie: "medusa_session=session_secret_data_here; other=value",
      accept: "application/json",
    }
    const sanitized = sanitizeHeaders(headers)
    expect(sanitized.cookie).toBe("[REDACTED]")
    expect(sanitized.accept).toBe("application/json")
  })

  it("redacts Stripe webhook signatures and Medusa tokens", () => {
    const headers = {
      "stripe-signature": "t=1600000000,v1=secret_signature_hash",
      "x-medusa-access-token": "secret_admin_token",
      "x-request-id": "req_12345",
    }
    const sanitized = sanitizeHeaders(headers)
    expect(sanitized["stripe-signature"]).toBe("[REDACTED]")
    expect(sanitized["x-medusa-access-token"]).toBe("[REDACTED]")
    expect(sanitized["x-request-id"]).toBe("req_12345")
  })
})
