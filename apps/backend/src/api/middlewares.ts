import { randomUUID } from "node:crypto"
import { defineMiddlewares } from "@medusajs/framework/http"
import type {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/framework/http"

/**
 * Sanitize headers to prevent accidental leakage of sensitive tokens,
 * cookies, or credentials into production log aggregators.
 */
export function sanitizeHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...headers }
  const sensitiveKeys = [
    "authorization",
    "cookie",
    "set-cookie",
    "x-medusa-access-token",
    "stripe-signature",
  ]

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = "[REDACTED]"
    }
  }

  return sanitized
}

/**
 * Attaches or propagates a distinct request correlation ID on every request
 * and sets the x-request-id response header.
 */
export async function requestIdMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const incomingId = req.headers["x-request-id"]
  const requestId = typeof incomingId === "string" && incomingId.trim() ? incomingId.trim() : randomUUID()

  req.headers["x-request-id"] = requestId
  res.setHeader("x-request-id", requestId)

  next()
}

/**
 * Emits production-safe structured JSON access and error logs.
 * Sensitive fields and personal credentials are fully redacted.
 */
export async function structuredLoggerMiddleware(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const start = process.hrtime.bigint()
  const requestId = req.headers["x-request-id"] || "unknown"

  res.on("finish", () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000
    const statusCode = res.statusCode

    // Skip verbose logs for health check probe polls to keep logs actionable
    if (req.url === "/health" && statusCode === 200) {
      return
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
      durationMs: Math.round(elapsedMs * 100) / 100,
      userAgent: req.headers["user-agent"] || "unknown",
      ip: req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
    }

    if (statusCode >= 500) {
      console.error(JSON.stringify({ level: "error", ...logEntry }))
      // Integration hook: Trigger external alert (Sentry.captureException, Datadog, etc.)
    } else if (statusCode >= 400) {
      console.warn(JSON.stringify({ level: "warn", ...logEntry }))
    } else {
      console.log(JSON.stringify({ level: "info", ...logEntry }))
    }
  })

  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: "/(.*)",
      middlewares: [requestIdMiddleware, structuredLoggerMiddleware],
    },
  ],
})
