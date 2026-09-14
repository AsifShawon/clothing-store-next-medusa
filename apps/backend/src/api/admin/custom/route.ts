import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"

export const adminCustomSchema = z.object({
  action: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.status(200).json({ status: "ok", scope: "admin" })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const result = adminCustomSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      message: "Invalid admin payload",
      errors: result.error.issues,
    })
    return
  }

  res.status(200).json({
    status: "ok",
    received: result.data,
  })
}
