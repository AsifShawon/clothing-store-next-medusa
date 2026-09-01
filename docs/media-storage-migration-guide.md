# Production Media Storage & Migration Guide (Cloudflare R2 / S3)

This guide documents the configuration for Cloudflare R2 (or any S3-compatible storage) using the official `@medusajs/medusa/file-s3` provider for **London Boy** (`londonboy.uk`), along with the catalog image migration strategy.

---

## 1. Cloudflare R2 / S3 Architecture

Medusa v2 manages uploaded garment images, thumbnails, and media assets using the official S3 File Module Provider (`@medusajs/medusa/file-s3`) configured in `medusa-config.ts`.

### Storage Architecture
- **Provider**: Cloudflare R2 (S3-compatible, zero egress fees)
- **Bucket**: `londonboy-media`
- **Custom Domain CDN**: `https://media.londonboy.uk`
- **Local Fallback**: Automatically falls back to `@medusajs/medusa/file-local` when S3 credentials are not set during local offline development.

---

## 2. Environment Variables Configuration

Set these variables in your production environment (`apps/backend/.env`):

```env
# Cloudflare R2 / S3-Compatible Object Storage
S3_URL=https://media.londonboy.uk
S3_BUCKET=londonboy-media
S3_REGION=auto
S3_ENDPOINT=https://<CLOUDFLARE_ACCOUNT_ID>.r2.cloudflarestorage.com
S3_ACCESS_KEY_ID=<R2_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY=<R2_SECRET_ACCESS_KEY>
```

> [!CAUTION]
> **Credential Security**: Never commit `S3_SECRET_ACCESS_KEY` to git or expose storage credentials in client-side bundles.

---

## 3. Cloudflare R2 Bucket Setup & CORS Policy

1. In your Cloudflare Dashboard, navigate to **R2 Object Storage** and create bucket `londonboy-media`.
2. Connect your custom domain: **Settings -> Custom Domains -> Connect Domain** -> `media.londonboy.uk`.
3. Apply the following CORS policy in Cloudflare R2:

```json
[
  {
    "AllowedOrigins": [
      "https://londonboy.uk",
      "https://api.londonboy.uk",
      "http://localhost:8000",
      "http://localhost:9000"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 4. Next.js Storefront Remote Patterns

The storefront Next.js configuration (`apps/storefront/next.config.js`) allows images from your Cloudflare R2 CDN:

```javascript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "media.londonboy.uk" },
    { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    { protocol: "https", hostname: "*.r2.dev" },
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "http", hostname: "localhost" },
    { protocol: "http", hostname: "127.0.0.1" }
  ]
}
```

---

## 5. Development Catalog Image Migration Strategy

During development, initial catalog products use high-resolution placeholder URLs or local assets. To migrate existing catalog products to production Cloudflare R2 storage:

### Option A: Uploading via Medusa Admin UI
1. Log in to Medusa Admin at `https://api.londonboy.uk/app` (or `http://localhost:9000/app`).
2. Navigate to **Products -> Select Product (e.g. Signature Heavyweight T-Shirt) -> Media -> Edit**.
3. Drag and drop high-resolution studio garment photos (`.jpg`, `.png`, `.webp`).
4. Medusa uploads the files directly to your Cloudflare R2 bucket via `@medusajs/medusa/file-s3` and sets the thumbnail and image gallery URLs to `https://media.londonboy.uk/...`.

### Option B: Batch Migration Script via Medusa Workflows
Run a migration workflow script using `uploadFilesWorkflow` from `@medusajs/medusa/core-flows` to read a local directory of garment photos and link them to product handles automatically.
