import { getBaseURL } from "@lib/util/env"
import { getOrganizationSchema } from "@lib/util/seo"
import JsonLd from "@modules/common/components/json-ld"
import SkipLink from "@modules/layout/components/skip-link"
import { Metadata } from "next"
import { DM_Serif_Display, Manrope } from "next/font/google"
import "styles/globals.css"

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "London Boy | Modern British Clothing",
    template: "%s | London Boy",
  },
  description:
    "Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing crafted with high-density fabrics for Bangladesh.",
  openGraph: {
    title: "London Boy | Modern British Clothing",
    description:
      "Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing crafted with high-density fabrics for Bangladesh.",
    siteName: "London Boy",
    type: "website",
    locale: "en_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "London Boy | Modern British Clothing",
    description:
      "Modern British-inspired, confident, minimal and premium-accessible smart-casual clothing crafted with high-density fabrics for Bangladesh.",
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const organizationSchema = getOrganizationSchema()

  return (
    <html
      lang="en"
      data-mode="light"
      className={`${dmSerif.variable} ${manrope.variable}`}
    >
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="bg-white text-brand-primary font-sans antialiased selection:bg-brand-accent selection:text-white">
        <SkipLink />
        <div className="relative min-h-screen flex flex-col">{props.children}</div>
      </body>
    </html>
  )
}
