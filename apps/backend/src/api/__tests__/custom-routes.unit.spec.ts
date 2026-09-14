import { GET as healthGet } from "../health/route"
import { GET as adminGet, POST as adminPost } from "../admin/custom/route"
import { GET as storeGet, POST as storePost } from "../store/custom/route"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function createMockResponse() {
  const res: Partial<MedusaResponse> & { statusCode: number; body: unknown } = {
    statusCode: 200,
    body: null,
    status(code: number) {
      this.statusCode = code
      return this as unknown as MedusaResponse
    },
    json(data: unknown) {
      this.body = data
      return this as unknown as MedusaResponse
    },
    sendStatus(code: number) {
      this.statusCode = code
      return this as unknown as MedusaResponse
    },
  }
  return res as unknown as MedusaResponse & { statusCode: number; body: any }
}

describe("API Custom Route Handlers", () => {
  describe("/health Endpoint", () => {
    it("returns HTTP 200 with service status and uptime", async () => {
      const req = {} as MedusaRequest
      const res = createMockResponse()

      await healthGet(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.body.status).toBe("ok")
      expect(res.body.service).toBe("@dtc/backend")
      expect(typeof res.body.uptime).toBe("number")
    })
  })

  describe("/admin/custom Endpoint", () => {
    it("handles GET requests with admin scope", async () => {
      const req = {} as MedusaRequest
      const res = createMockResponse()

      await adminGet(req, res)
      expect(res.statusCode).toBe(200)
      expect(res.body.scope).toBe("admin")
    })

    it("accepts valid POST payloads", async () => {
      const req = {
        body: { action: "sync_inventory", metadata: { batchId: "123" } },
      } as unknown as MedusaRequest
      const res = createMockResponse()

      await adminPost(req, res)
      expect(res.statusCode).toBe(200)
      expect(res.body.received.action).toBe("sync_inventory")
    })

    it("rejects invalid POST payloads with HTTP 400", async () => {
      const req = {
        body: { action: "" }, // min length 1 required
      } as unknown as MedusaRequest
      const res = createMockResponse()

      await adminPost(req, res)
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("Invalid admin payload")
    })
  })

  describe("/store/custom Endpoint", () => {
    it("handles GET requests with store scope", async () => {
      const req = {} as MedusaRequest
      const res = createMockResponse()

      await storeGet(req, res)
      expect(res.statusCode).toBe(200)
      expect(res.body.scope).toBe("store")
    })

    it("accepts valid customer inquiry POST payloads", async () => {
      const req = {
        body: { email: "customer@londonboy.co.uk", inquiry: "When will the hoodie restock?" },
      } as unknown as MedusaRequest
      const res = createMockResponse()

      await storePost(req, res)
      expect(res.statusCode).toBe(200)
      expect(res.body.email).toBe("customer@londonboy.co.uk")
    })

    it("rejects malformed customer inquiries with HTTP 400", async () => {
      const req = {
        body: { email: "not-an-email", inquiry: "hi" }, // invalid email, inquiry too short
      } as unknown as MedusaRequest
      const res = createMockResponse()

      await storePost(req, res)
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("Invalid store payload")
    })
  })
})
