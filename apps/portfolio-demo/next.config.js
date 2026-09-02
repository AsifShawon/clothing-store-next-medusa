const path = require("path")

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactStrictMode: true,
  transpilePackages: ["@dtc/commerce-contracts", "@dtc/storefront-ui"],
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
