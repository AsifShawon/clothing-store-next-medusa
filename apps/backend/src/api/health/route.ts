import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    service: "@dtc/backend",
  })
}
