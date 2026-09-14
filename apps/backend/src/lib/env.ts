import { z } from "@medusajs/framework/zod"
import { MedusaError } from "@medusajs/framework/utils"

const WEAK_SECRETS_BLACKLIST = [
  "supersecret",
  "changeme",
  "placeholder",
  "secret",
  "password",
  "admin",
  "test",
  "jwt_secret",
  "cookie_secret",
  "medusa",
]

function isWeakSecret(value: string): boolean {
  const lower = value.toLowerCase()
  return WEAK_SECRETS_BLACKLIST.some((term) => lower.includes(term))
}

function isValidOrigin(origin: string): boolean {
  try {
    const parsed = new URL(origin)
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      (parsed.pathname === "" || parsed.pathname === "/") &&
      !parsed.search &&
      !parsed.hash
    )
  } catch {
    return false
  }
}

function validateCorsOrigins(corsString: string, isProduction: boolean): string[] {
  const origins = corsString
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)

  if (origins.length === 0) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "CORS configuration cannot be empty."
    )
  }

  for (const origin of origins) {
    if (!isValidOrigin(origin)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid CORS origin "${origin}". Must be a valid http or https URL without path/query/fragment.`
      )
    }
    if (isProduction && origin.includes("docs.medusajs.com")) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Insecure CORS origin "${origin}". Documentation domains must not be present in production CORS.`
      )
    }
  }

  return origins
}

export type ValidatedBackendEnv = {
  NODE_ENV: "development" | "production" | "test"
  DATABASE_URL: string
  REDIS_URL: string
  STORE_CORS: string
  ADMIN_CORS: string
  AUTH_CORS: string
  JWT_SECRET: string
  COOKIE_SECRET: string
  MEDUSA_BACKEND_URL: string
  STOREFRONT_URL: string
  stripe: {
    enabled: boolean
    apiKey?: string
    webhookSecret?: string
    capture: boolean
  }
  storage: {
    provider: "s3" | "local"
    s3?: {
      url: string
      bucket: string
      region: string
      endpoint?: string
      accessKeyId: string
      secretAccessKey: string
    }
  }
  email: {
    enabled: boolean
    apiKey?: string
    fromEmail: string
    replyToEmail: string
  }
}

export class EnvValidationError extends MedusaError {
  public issues: string[]

  constructor(issues: string[]) {
    const formatted = issues.map((i) => `  - ${i}`).join("\n")
    super(
      MedusaError.Types.INVALID_DATA,
      `\n[FATAL] Production Environment Validation Failed:\n${formatted}\nApplication startup halted to prevent insecure runtime operation.\n`
    )
    this.name = "EnvValidationError"
    this.issues = issues
  }
}

export function validateBackendEnv(rawEnv: NodeJS.ProcessEnv = process.env): ValidatedBackendEnv {
  const nodeEnv = (rawEnv.NODE_ENV || "development") as "development" | "production" | "test"
  const isProduction = nodeEnv === "production"
  const issues: string[] = []

  // 1. Database URL
  let databaseUrl = rawEnv.DATABASE_URL?.trim()
  if (!databaseUrl) {
    if (isProduction) {
      issues.push("DATABASE_URL is required in production and must point to a reachable PostgreSQL instance.")
    } else {
      databaseUrl = "postgres://postgres:postgres@localhost:5432/medusa-backend"
    }
  } else if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
    issues.push("DATABASE_URL must be a valid PostgreSQL connection string starting with postgres:// or postgresql://")
  }

  // 2. Redis URL
  let redisUrl = rawEnv.REDIS_URL?.trim()
  if (!redisUrl) {
    if (isProduction) {
      issues.push("REDIS_URL is required in production for event bus and caching.")
    } else {
      redisUrl = "redis://localhost:6379"
    }
  } else if (!redisUrl.startsWith("redis://") && !redisUrl.startsWith("rediss://")) {
    issues.push("REDIS_URL must be a valid Redis connection string starting with redis:// or rediss://")
  }

  // 3. Secrets (JWT & Cookie)
  let jwtSecret = rawEnv.JWT_SECRET?.trim()
  let cookieSecret = rawEnv.COOKIE_SECRET?.trim()

  if (isProduction) {
    if (!jwtSecret) {
      issues.push("JWT_SECRET is required in production.")
    } else {
      if (jwtSecret.length < 32) {
        issues.push("JWT_SECRET must be at least 32 characters long for production security.")
      }
      if (isWeakSecret(jwtSecret)) {
        issues.push("JWT_SECRET contains forbidden weak or placeholder phrases (e.g. supersecret, changeme). Generate a secure 64+ char random secret.")
      }
    }

    if (!cookieSecret) {
      issues.push("COOKIE_SECRET is required in production.")
    } else {
      if (cookieSecret.length < 32) {
        issues.push("COOKIE_SECRET must be at least 32 characters long for production security.")
      }
      if (isWeakSecret(cookieSecret)) {
        issues.push("COOKIE_SECRET contains forbidden weak or placeholder phrases (e.g. supersecret, changeme). Generate a secure 64+ char random secret.")
      }
    }
  } else {
    jwtSecret = jwtSecret || "supersecret_dev_jwt_secret_key_32bytes"
    cookieSecret = cookieSecret || "supersecret_dev_cookie_secret_key_32bytes"
  }

  // 4. CORS settings
  let storeCors = rawEnv.STORE_CORS?.trim()
  let adminCors = rawEnv.ADMIN_CORS?.trim()
  let authCors = rawEnv.AUTH_CORS?.trim()

  if (isProduction) {
    if (!storeCors) issues.push("STORE_CORS is required in production.")
    else {
      try {
        validateCorsOrigins(storeCors, true)
      } catch (err) {
        issues.push(`STORE_CORS error: ${(err as Error).message}`)
      }
    }

    if (!adminCors) issues.push("ADMIN_CORS is required in production.")
    else {
      try {
        validateCorsOrigins(adminCors, true)
      } catch (err) {
        issues.push(`ADMIN_CORS error: ${(err as Error).message}`)
      }
    }

    if (!authCors) issues.push("AUTH_CORS is required in production.")
    else {
      try {
        validateCorsOrigins(authCors, true)
      } catch (err) {
        issues.push(`AUTH_CORS error: ${(err as Error).message}`)
      }
    }
  } else {
    storeCors = storeCors || "http://localhost:8000"
    adminCors = adminCors || "http://localhost:9000,http://localhost:5173"
    authCors = authCors || "http://localhost:9000,http://localhost:8000,http://localhost:5173"
  }

  // 5. Backend URL & Storefront URL
  let backendUrl = rawEnv.MEDUSA_BACKEND_URL?.trim()
  if (!backendUrl) {
    if (isProduction) {
      issues.push("MEDUSA_BACKEND_URL is required in production.")
    } else {
      backendUrl = "http://localhost:9000"
    }
  } else if (!isValidOrigin(backendUrl)) {
    issues.push(`MEDUSA_BACKEND_URL "${backendUrl}" must be a valid origin (http or https URL without path/trailing slash).`)
  }

  const storefrontUrl = rawEnv.STOREFRONT_URL?.trim() || storeCors?.split(",")[0]?.trim() || "http://localhost:8000"

  // 6. Stripe Payment Provider (Atomic validation)
  const stripeApiKey = rawEnv.STRIPE_API_KEY?.trim()
  const stripeWebhookSecret = rawEnv.STRIPE_WEBHOOK_SECRET?.trim()
  const stripeCapture = rawEnv.STRIPE_CAPTURE !== "false"

  let stripeEnabled = false

  if (stripeApiKey || stripeWebhookSecret) {
    if (!stripeApiKey || isWeakSecret(stripeApiKey) || stripeApiKey.includes("placeholder")) {
      issues.push("STRIPE_API_KEY is configured with an invalid or placeholder value.")
    }
    if (!stripeWebhookSecret || isWeakSecret(stripeWebhookSecret) || stripeWebhookSecret.includes("placeholder")) {
      issues.push("STRIPE_WEBHOOK_SECRET is required when Stripe is enabled, and must not be a placeholder value.")
    }

    if (stripeApiKey && stripeWebhookSecret && !issues.some((i) => i.includes("STRIPE_"))) {
      stripeEnabled = true
    }
  }

  // 7. Object Storage (S3 / R2 vs Local)
  const s3Url = rawEnv.S3_URL?.trim()
  const s3Bucket = rawEnv.S3_BUCKET?.trim()
  const s3Region = rawEnv.S3_REGION?.trim() || "auto"
  const s3Endpoint = rawEnv.S3_ENDPOINT?.trim()
  const s3AccessKeyId = rawEnv.S3_ACCESS_KEY_ID?.trim()
  const s3SecretAccessKey = rawEnv.S3_SECRET_ACCESS_KEY?.trim()

  const hasAnyS3Config = Boolean(s3Url || s3Bucket || s3AccessKeyId || s3SecretAccessKey || s3Endpoint)
  const isCompleteS3Config = Boolean(
    s3Url &&
    s3Bucket &&
    s3AccessKeyId &&
    s3SecretAccessKey &&
    !s3AccessKeyId.includes("placeholder") &&
    !s3SecretAccessKey.includes("placeholder")
  )

  let storageProvider: "s3" | "local" = "local"

  if (isProduction) {
    if (!isCompleteS3Config) {
      issues.push(
        "Production file storage requires a complete Cloudflare R2 / S3 configuration (S3_URL, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY). Silent fallback to ephemeral local storage is prohibited in production."
      )
    } else {
      storageProvider = "s3"
    }
  } else {
    if (isCompleteS3Config) {
      storageProvider = "s3"
    } else if (hasAnyS3Config) {
      console.warn(
        "[WARN] Incomplete S3 configuration detected in development; falling back to local file storage (@medusajs/medusa/file-local)."
      )
      storageProvider = "local"
    } else {
      storageProvider = "local"
    }
  }

  // 8. Transactional Email (Resend)
  const disableEmail = rawEnv.DISABLE_EMAIL_NOTIFICATIONS === "true"
  const resendApiKey = rawEnv.RESEND_API_KEY?.trim()
  const resendFromEmail = rawEnv.RESEND_FROM_EMAIL?.trim() || "London Boy <orders@send.londonboy.uk>"
  const resendReplyTo = rawEnv.RESEND_REPLY_TO?.trim() || "londonboy@mack.com.bd"

  let emailEnabled = false

  if (!disableEmail && resendApiKey && !resendApiKey.includes("placeholder")) {
    emailEnabled = true
  }

  if (isProduction && !disableEmail) {
    if (!resendApiKey || resendApiKey.includes("placeholder")) {
      issues.push(
        "RESEND_API_KEY is required in production for order confirmations and password resets (or set DISABLE_EMAIL_NOTIFICATIONS=true if emails are intentionally handled off-server)."
      )
    }
  }

  // Fast-fail if any issues found
  if (issues.length > 0) {
    throw new EnvValidationError(issues)
  }

  return {
    NODE_ENV: nodeEnv,
    DATABASE_URL: databaseUrl!,
    REDIS_URL: redisUrl!,
    STORE_CORS: storeCors!,
    ADMIN_CORS: adminCors!,
    AUTH_CORS: authCors!,
    JWT_SECRET: jwtSecret!,
    COOKIE_SECRET: cookieSecret!,
    MEDUSA_BACKEND_URL: backendUrl!,
    STOREFRONT_URL: storefrontUrl,
    stripe: {
      enabled: stripeEnabled,
      apiKey: stripeEnabled ? stripeApiKey : undefined,
      webhookSecret: stripeEnabled ? stripeWebhookSecret : undefined,
      capture: stripeCapture,
    },
    storage: {
      provider: storageProvider,
      s3:
        storageProvider === "s3"
          ? {
              url: s3Url!,
              bucket: s3Bucket!,
              region: s3Region,
              endpoint: s3Endpoint,
              accessKeyId: s3AccessKeyId!,
              secretAccessKey: s3SecretAccessKey!,
            }
          : undefined,
    },
    email: {
      enabled: emailEnabled,
      apiKey: emailEnabled ? resendApiKey : undefined,
      fromEmail: resendFromEmail,
      replyToEmail: resendReplyTo,
    },
  }
}
