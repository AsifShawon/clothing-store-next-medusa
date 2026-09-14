import { z } from "zod"

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_MEDUSA_BACKEND_URL: z
    .string()
    .url("NEXT_PUBLIC_MEDUSA_BACKEND_URL must be a valid URL")
    .default("http://localhost:9000"),
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_BASE_URL must be a valid URL")
    .default("http://localhost:8000"),
  NEXT_PUBLIC_DEFAULT_REGION: z
    .string()
    .min(2, "Default region must be at least 2 characters")
    .max(3)
    .default("bd"),
  NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required")
    .refine(
      (key) => key.startsWith("pk_"),
      "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY must start with 'pk_'"
    ),
  NEXT_PUBLIC_STRIPE_KEY: z
    .string()
    .refine(
      (key) => !key || key.startsWith("pk_test_") || key.startsWith("pk_live_"),
      "NEXT_PUBLIC_STRIPE_KEY must be a valid Stripe publishable key starting with pk_test_ or pk_live_"
    )
    .optional(),
})

const ServerEnvSchema = z.object({
  REVALIDATE_SECRET: z
    .string()
    .min(16, "REVALIDATE_SECRET must be at least 16 characters for security")
    .optional(),
  MEDUSA_BACKEND_URL: z
    .string()
    .url("MEDUSA_BACKEND_URL must be a valid URL")
    .optional(),
})

export type StorefrontClientEnv = z.infer<typeof ClientEnvSchema>
export type StorefrontServerEnv = z.infer<typeof ServerEnvSchema>

let cachedClientEnv: StorefrontClientEnv | null = null
let cachedServerEnv: StorefrontServerEnv | null = null

export function getClientEnv(): StorefrontClientEnv {
  if (cachedClientEnv) {
    return cachedClientEnv
  }

  const raw = {
    NEXT_PUBLIC_MEDUSA_BACKEND_URL:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000",
    NEXT_PUBLIC_DEFAULT_REGION:
      process.env.NEXT_PUBLIC_DEFAULT_REGION || "bd",
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
      (process.env.NODE_ENV !== "production"
        ? "pk_test_placeholder_key_for_testing_purposes"
        : ""),
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY || undefined,
  }

  const parsed = ClientEnvSchema.safeParse(raw)

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")

    if (process.env.NODE_ENV !== "test" && process.env.SKIP_ENV_CHECK !== "true") {
      throw new Error(
        `[Storefront Env Validation Error] Invalid client environment:\n${errorDetails}`
      )
    }
    return raw as StorefrontClientEnv
  }

  cachedClientEnv = parsed.data
  return cachedClientEnv
}

export function getServerEnv(): StorefrontServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "[Security Error] getServerEnv() must never be called in client-side bundles."
    )
  }

  if (cachedServerEnv) {
    return cachedServerEnv
  }

  const raw = {
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || undefined,
    MEDUSA_BACKEND_URL: process.env.MEDUSA_BACKEND_URL || undefined,
  }

  const parsed = ServerEnvSchema.safeParse(raw)

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")

    throw new Error(
      `[Storefront Env Validation Error] Invalid server environment:\n${errorDetails}`
    )
  }

  cachedServerEnv = parsed.data
  return cachedServerEnv
}

export function getBaseURL(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
  }
  return "http://localhost:8000"
}

export function getMedusaBackendUrl(): string {
  if (typeof window === "undefined" && process.env.MEDUSA_BACKEND_URL) {
    return process.env.MEDUSA_BACKEND_URL.replace(/\/$/, "")
  }

  if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL.replace(/\/$/, "")
  }

  return "http://localhost:9000"
}

export function validateStorefrontEnv(): {
  client: StorefrontClientEnv
  server?: StorefrontServerEnv
} {
  const client = getClientEnv()
  let server: StorefrontServerEnv | undefined

  if (typeof window === "undefined") {
    server = getServerEnv()
  }

  return { client, server }
}
