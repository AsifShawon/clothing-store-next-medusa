export type OrderPlacedTemplateData = {
  order: {
    id: string
    display_id: number | string
    email: string
    created_at?: string
    currency_code: string
    total: number
    subtotal?: number
    shipping_total?: number
    discount_total?: number
    tax_total?: number
    items?: {
      title?: string
      product_title?: string
      quantity: number
      unit_price: number
      variant_sku?: string
      variant_title?: string
      thumbnail?: string
    }[]
    shipping_address?: {
      first_name?: string
      last_name?: string
      address_1?: string
      address_2?: string
      city?: string
      postal_code?: string
      phone?: string
      country_code?: string
    }
  }
}

export function generateOrderPlacedEmail(data: OrderPlacedTemplateData): {
  subject: string
  html: string
  text: string
} {
  const { order } = data
  const currency = (order.currency_code || "bdt").toUpperCase()
  const displayId = order.display_id || order.id.slice(-6)
  const items = order.items || []

  const formattedTotal = `${(order.total || 0).toLocaleString()} ${currency}`
  const formattedSubtotal = `${(order.subtotal || 0).toLocaleString()} ${currency}`
  const formattedShipping = `${(order.shipping_total || 0).toLocaleString()} ${currency}`

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E0D8;">
          <strong style="color: #111111; font-size: 14px;">${item.product_title || item.title || "Garment"}</strong>
          ${item.variant_title ? `<br/><span style="color: #666666; font-size: 12px;">Variant: ${item.variant_title}</span>` : ""}
          ${item.variant_sku ? `<br/><span style="color: #888888; font-size: 11px; font-family: monospace;">SKU: ${item.variant_sku}</span>` : ""}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E0D8; text-align: center; color: #111111; font-size: 13px;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #E5E0D8; text-align: right; color: #111111; font-size: 13px; font-weight: 600;">
          ${(item.unit_price * item.quantity).toLocaleString()} ${currency}
        </td>
      </tr>
    `
    )
    .join("")

  const address = order.shipping_address
  const addressText = address
    ? `${address.first_name || ""} ${address.last_name || ""}<br/>${address.address_1 || ""}${address.address_2 ? `<br/>${address.address_2}` : ""}<br/>${address.city || ""}, ${address.postal_code || ""}<br/>Phone: ${address.phone || "N/A"}`
    : "Standard Delivery"

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation #${displayId} - London Boy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F1E8; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F1E8; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #D8D2C4; max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 2px solid #111111; background-color: #111111;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">
                LONDON BOY
              </h1>
              <p style="margin: 4px 0 0; color: #CFC4B5; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">
                Modern British Craftsmanship &bull; Dhaka
              </p>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding: 32px 32px 20px;">
              <div style="display: inline-block; background-color: #E8F0EC; color: #1E4937; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                Order Confirmed
              </div>
              <h2 style="margin: 0 0 8px; font-size: 22px; color: #111111; font-weight: 600;">
                Thank you for your order, ${address?.first_name || "Valued Customer"}
              </h2>
              <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                Your order <strong>#${displayId}</strong> has been received and is currently being prepared at our Dhaka Central Warehouse.
              </p>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #111111;">
                    <th align="left" style="padding: 8px 0; font-size: 11px; color: #111111; text-transform: uppercase; letter-spacing: 1px;">Garment</th>
                    <th align="center" style="padding: 8px 0; font-size: 11px; color: #111111; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                    <th align="right" style="padding: 8px 0; font-size: 11px; color: #111111; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 0 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #111111; padding-top: 12px;">
                <tr>
                  <td style="padding: 4px 0; color: #666666; font-size: 13px;">Subtotal</td>
                  <td style="padding: 4px 0; color: #111111; font-size: 13px; text-align: right;">${formattedSubtotal}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #666666; font-size: 13px;">Estimated Courier Delivery</td>
                  <td style="padding: 4px 0; color: #111111; font-size: 13px; text-align: right;">${formattedShipping}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0; color: #111111; font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Total</td>
                  <td style="padding: 10px 0 0; color: #111111; font-size: 18px; font-weight: 700; text-align: right;">${formattedTotal}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Details & Courier Timeline -->
          <tr>
            <td style="padding: 20px 32px; background-color: #FAF8F5; border-top: 1px solid #E5E0D8; border-bottom: 1px solid #E5E0D8;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 12px;">
                    <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #1E4937; margin-bottom: 6px;">
                      🚚 Shipping Address
                    </strong>
                    <div style="font-size: 12px; color: #333333; line-height: 1.5;">
                      ${addressText}
                    </div>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 12px;">
                    <strong style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #1E4937; margin-bottom: 6px;">
                      🛡️ Delivery &amp; Policy
                    </strong>
                    <div style="font-size: 12px; color: #333333; line-height: 1.5;">
                      &bull; Inside Dhaka: 24–48 hours<br/>
                      &bull; Outside Dhaka: 48–72 hours<br/>
                      &bull; 24-hour return &amp; exchange guarantee
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 32px; text-align: center; background-color: #FFFFFF;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #666666;">
                Need help or wish to modify delivery details?
              </p>
              <p style="margin: 0; font-size: 13px; font-weight: 600;">
                <a href="mailto:londonboy@mack.com.bd" style="color: #111111; text-decoration: underline;">
                  londonboy@mack.com.bd
                </a>
              </p>
              <p style="margin: 16px 0 0; font-size: 11px; color: #999999;">
                &copy; ${new Date().getFullYear()} London Boy. All rights reserved. &bull; Dhaka, Bangladesh
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
LONDON BOY - ORDER CONFIRMATION #${displayId}
Thank you for your order, ${address?.first_name || "Customer"}.

ORDER SUMMARY:
${items.map((i) => `- ${i.product_title || i.title || "Garment"} (${i.variant_title || ""}) x${i.quantity}: ${(i.unit_price * i.quantity).toLocaleString()} ${currency}`).join("\n")}

Subtotal: ${formattedSubtotal}
Shipping: ${formattedShipping}
Total: ${formattedTotal}

SHIPPING ADDRESS:
${address ? `${address.first_name || ""} ${address.last_name || ""}, ${address.address_1 || ""}, ${address.city || ""}` : "Standard Delivery"}

Support: londonboy@mack.com.bd
`

  return {
    subject: `Order Confirmation #${displayId} - London Boy`,
    html,
    text,
  }
}
