import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

// Stripe Payment Provider Configuration
const stripeApiKey = process.env.STRIPE_API_KEY
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

const paymentProviders: {
  resolve: string
  id: string
  options: Record<string, unknown>
}[] = []

if (stripeApiKey) {
  paymentProviders.push({
    resolve: "@medusajs/medusa/payment-stripe",
    id: "stripe",
    options: {
      apiKey: stripeApiKey,
      webhookSecret: stripeWebhookSecret,
      capture: true,
    },
  })
}

// Object Storage (Cloudflare R2 / S3-Compatible) Configuration
const s3Url = process.env.S3_URL
const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY
const s3Bucket = process.env.S3_BUCKET
const s3Region = process.env.S3_REGION || "auto"
const s3Endpoint = process.env.S3_ENDPOINT

const fileProviders = [
  s3Url && s3AccessKeyId && s3SecretAccessKey && s3Bucket
    ? {
        resolve: "@medusajs/medusa/file-s3",
        id: "s3",
        options: {
          fileUrl: s3Url,
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
          region: s3Region,
          bucket: s3Bucket,
          endpoint: s3Endpoint,
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
          backend_url: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
        },
      },
]

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
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
