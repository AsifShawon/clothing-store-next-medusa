import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"

export const storeCustomSchema = z.object({
  email: z.string().email(),
  inquiry: z.string().min(5),
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  res.status(200).json({ status: "ok", scope: "store" })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const result = storeCustomSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      message: "Invalid store payload",
      errors: result.error.issues,
    })
    return
  }

  res.status(200).json({
    status: "received",
    email: result.data.email,
  })
}
