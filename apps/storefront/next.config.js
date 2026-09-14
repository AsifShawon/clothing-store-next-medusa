const path = require("path")
const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Custom Cloud & Object Storage hostnames
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https:;
  font-src 'self' data: https://fonts.gstatic.com;
  frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
  connect-src 'self' https: http://localhost:9000 http://127.0.0.1:9000 https://api.stripe.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, " ").trim()

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy,
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  transpilePackages: ["@dtc/commerce-contracts", "@dtc/storefront-ui"],
  ...(process.env.NODE_ENV === "development"
    ? {
        logging: {
          fetches: {
            fullUrl: true,
          },
        },
      }
    : {}),
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "media.londonboy.uk",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
