export type EmailVerificationTemplateData = {
  email: string
  token: string
  verificationUrl?: string
}

export function generateEmailVerificationEmail(data: EmailVerificationTemplateData): {
  subject: string
  html: string
  text: string
} {
  const { email, token, verificationUrl } = data
  const storefrontUrl = process.env.STORE_CORS?.split(",")[0] || "http://localhost:8000"
  const url = verificationUrl || `${storefrontUrl}/bd/verify-account?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - London Boy</title>
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
                Welcome to London Boy
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; color: #111111; font-weight: 600;">
                Verify Your Customer Account
              </h2>
              <p style="margin: 0 0 20px; color: #555555; font-size: 14px; line-height: 1.6;">
                Thank you for creating an account with London Boy. Please verify your email address (<strong>${email}</strong>) to activate your account.
              </p>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${url}" style="background-color: #1E4937; color: #FFFFFF; padding: 14px 32px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; display: inline-block;">
                  Verify Email Address &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; text-align: center; background-color: #FAF8F5; border-top: 1px solid #E5E0D8;">
              <p style="margin: 0; font-size: 12px; color: #666666;">
                Need assistance? Contact <a href="mailto:londonboy@mack.com.bd" style="color: #111111; text-decoration: underline;">londonboy@mack.com.bd</a>
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
LONDON BOY - VERIFY YOUR EMAIL
Please verify your email address (${email}) by clicking the link below:
${url}

Support: londonboy@mack.com.bd
`

  return {
    subject: "Verify Your Email - London Boy",
    html,
    text,
  }
}
