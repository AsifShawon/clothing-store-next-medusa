import { validateBackendEnv, EnvValidationError } from "../env"

describe("Environment Validation Layer", () => {
  const validProductionEnv = {
    NODE_ENV: "production",
    DATABASE_URL: "postgres://medusa_user:StrongProdPassword123!@postgres:5432/medusa_prod",
    REDIS_URL: "redis://:RedisProdPassword123!@redis:6379",
    JWT_SECRET: "9f8e7d6c5b4a3928172635445362718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
    COOKIE_SECRET: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    STORE_CORS: "https://londonboy.co.uk",
    ADMIN_CORS: "https://admin.londonboy.co.uk",
    AUTH_CORS: "https://londonboy.co.uk,https://admin.londonboy.co.uk",
    MEDUSA_BACKEND_URL: "https://api.londonboy.co.uk",
    STOREFRONT_URL: "https://londonboy.co.uk",
    S3_URL: "https://media.londonboy.co.uk",
    S3_BUCKET: "londonboy-media",
    S3_REGION: "auto",
    S3_ENDPOINT: "https://account123.r2.cloudflarestorage.com",
    S3_ACCESS_KEY_ID: "real_r2_access_key_id",
    S3_SECRET_ACCESS_KEY: "real_r2_secret_access_key_string",
    STRIPE_API_KEY: "stripe_api_key_fixture_1234567890abcdefghijklmnop",
    STRIPE_WEBHOOK_SECRET: "whsec_1234567890abcdefghijklmnop",
    RESEND_API_KEY: "re_1234567890_abcdefghijklmnop",
  }

  describe("Development Mode", () => {
    it("applies safe local defaults when optional dev variables are omitted", () => {
      const result = validateBackendEnv({
        NODE_ENV: "development",
      })

      expect(result.NODE_ENV).toBe("development")
      expect(result.DATABASE_URL).toBe("postgres://postgres:postgres@localhost:5432/medusa-backend")
      expect(result.REDIS_URL).toBe("redis://localhost:6379")
      expect(result.JWT_SECRET.length).toBeGreaterThanOrEqual(32)
      expect(result.COOKIE_SECRET.length).toBeGreaterThanOrEqual(32)
      expect(result.storage.provider).toBe("local")
      expect(result.stripe.enabled).toBe(false)
      expect(result.stripe.capture).toBe(true)
    })

    it("allows local file storage fallback in development", () => {
      const result = validateBackendEnv({
        NODE_ENV: "development",
        S3_URL: "https://incomplete-s3.example.com",
        // missing bucket, keys etc.
      })
      expect(result.storage.provider).toBe("local")
    })
  })

  describe("Production Mode - Security Fail-Fast", () => {
    it("passes validation with complete, secure production configuration", () => {
      const result = validateBackendEnv(validProductionEnv)
      expect(result.NODE_ENV).toBe("production")
      expect(result.storage.provider).toBe("s3")
      expect(result.storage.s3?.bucket).toBe("londonboy-media")
      expect(result.stripe.enabled).toBe(true)
      expect(result.stripe.capture).toBe(true)
    })

    it("fails fast when DATABASE_URL is missing in production", () => {
      const env = { ...validProductionEnv, DATABASE_URL: "" }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("fails fast when REDIS_URL is missing in production", () => {
      const env = { ...validProductionEnv, REDIS_URL: "" }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("fails fast when JWT_SECRET uses weak placeholder 'supersecret'", () => {
      const env = { ...validProductionEnv, JWT_SECRET: "supersecret" }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("fails fast when COOKIE_SECRET is shorter than 32 characters", () => {
      const env = { ...validProductionEnv, COOKIE_SECRET: "short_secret_only_24_chars!" }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("prohibits silent fallback to local file storage in production", () => {
      const env = { ...validProductionEnv, S3_ACCESS_KEY_ID: "" }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("rejects placeholder S3 credentials in production", () => {
      const env = {
        ...validProductionEnv,
        S3_ACCESS_KEY_ID: "r2_placeholder_access_key",
      }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("enforces atomic Stripe configuration: fails if API key present without webhook secret", () => {
      const env = {
        ...validProductionEnv,
        STRIPE_API_KEY: "stripe_api_key_fixture_1234567890abcdefghijklmnop",
        STRIPE_WEBHOOK_SECRET: "",
      }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("rejects documentation domains in production CORS", () => {
      const env = {
        ...validProductionEnv,
        STORE_CORS: "https://londonboy.co.uk,https://docs.medusajs.com",
      }
      expect(() => validateBackendEnv(env)).toThrow(EnvValidationError)
    })

    it("supports configurable Stripe capture strategy", () => {
      const env = {
        ...validProductionEnv,
        STRIPE_CAPTURE: "false",
      }
      const result = validateBackendEnv(env)
      expect(result.stripe.capture).toBe(false)
    })

    it("allows disabling transactional emails explicitly via DISABLE_EMAIL_NOTIFICATIONS", () => {
      const env = {
        ...validProductionEnv,
        RESEND_API_KEY: "",
        DISABLE_EMAIL_NOTIFICATIONS: "true",
      }
      const result = validateBackendEnv(env)
      expect(result.email.enabled).toBe(false)
    })
  })
})
