import { loadEnv, defineConfig } from "@medusajs/framework/utils"
import { validateBackendEnv } from "./src/lib/env"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

// Validate environment with startup fast-fail guarantees
const env = validateBackendEnv()

// Stripe Payment Provider Configuration (Atomic registration)
const paymentProviders: {
  resolve: string
  id: string
  options: Record<string, unknown>
}[] = []

if (env.stripe.enabled && env.stripe.apiKey && env.stripe.webhookSecret) {
  paymentProviders.push({
    resolve: "@medusajs/medusa/payment-stripe",
    id: "stripe",
    options: {
      apiKey: env.stripe.apiKey,
      webhookSecret: env.stripe.webhookSecret,
      capture: env.stripe.capture,
    },
  })
}

// Object Storage Provider Configuration
const fileProviders = [
  env.storage.provider === "s3" && env.storage.s3
    ? {
        resolve: "@medusajs/medusa/file-s3",
        id: "s3",
        options: {
          fileUrl: env.storage.s3.url,
          accessKeyId: env.storage.s3.accessKeyId,
          secretAccessKey: env.storage.s3.secretAccessKey,
          region: env.storage.s3.region,
          bucket: env.storage.s3.bucket,
          endpoint: env.storage.s3.endpoint,
          additionalClientConfig: {
            forcePathStyle: true,
          },
        },
      }
    : {
        resolve: "@medusajs/medusa/file-local",
        id: "local",
        options: {
          upload_dir: "static",
          backend_url: env.MEDUSA_BACKEND_URL,
        },
      },
]

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    http: {
      storeCors: env.STORE_CORS,
      adminCors: env.ADMIN_CORS,
      authCors: env.AUTH_CORS,
      jwtSecret: env.JWT_SECRET,
      cookieSecret: env.COOKIE_SECRET,
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: fileProviders,
      },
    },
    ...(paymentProviders.length > 0
      ? [
          {
            resolve: "@medusajs/medusa/payment",
            options: {
              providers: paymentProviders,
            },
          },
        ]
      : []),
  ],
})
