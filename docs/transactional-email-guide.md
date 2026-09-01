# Transactional Email System Guide (Resend & Local Fallback)

This guide documents the transactional email infrastructure, Resend provider integration, templates, and error handling for **London Boy** (`londonboy.uk`).

---

## 1. Provider & Architecture

- **Provider**: Resend (`https://resend.com`) with local development logger fallback.
- **Sender Domain**: `londonboy.uk` / `send.londonboy.uk`
- **Sender Address**: `London Boy <orders@send.londonboy.uk>`
- **Support & Reply-To**: `londonboy@mack.com.bd`

### Environment Variables (`apps/backend/.env`):
```env
RESEND_API_KEY=re_123456789...
RESEND_FROM_EMAIL=London Boy <orders@send.londonboy.uk>
RESEND_REPLY_TO=londonboy@mack.com.bd
```

---

## 2. Branded Responsive Email Templates

1. **Order Confirmation (`order.placed`)**:
   - Sent immediately upon order placement.
   - Includes London Boy brand banner, order reference number (`#1001`), line items with variant sizes, colors, and SKUs, BDT subtotal, shipping rate (Inside Dhaka ৳60 / Outside Dhaka ৳130), grand total, customer delivery address, courier delivery timeline (24-48 hours), and 24-hour return policy guarantee.
   - **Security**: Raw payment method credentials and credit card numbers are strictly omitted.

2. **Password Reset (`auth.password_reset`)**:
   - Sent when a customer requests password recovery.
   - Contains a secure, one-time time-limited password reset link directing to the Next.js storefront reset page (`/bd/account/reset-password?token=...`).

3. **Email Verification (`auth.email_verification`)**:
   - Sent to new customer accounts for identity verification.

---

## 3. Safe Failure Handling & Logging

- If `RESEND_API_KEY` is not configured (e.g. during offline development or test runs), the service logs a clean, sanitized preview to the server console rather than crashing.
- Failed deliveries are logged to the Medusa logger with sanitized error messages without leaking secrets or auth headers.
