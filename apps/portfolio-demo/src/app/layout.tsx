import React from "react"
import type { Metadata } from "next"
import { DM_Serif_Display, Manrope, Inter } from "next/font/google"
import { DemoProvider } from "@lib/demo-context"
import { DemoBanner } from "@components/common/demo-banner"
import { StorefrontHeader } from "@components/common/header"
import { StorefrontFooter } from "@components/common/footer"
import { CartDrawer } from "@components/store/cart-drawer"
import { ToastContainer } from "@components/common/toast"
import { StorageInspector } from "@components/common/storage-inspector"
import "@styles/globals.css"

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "London Boy | Modern British Clothing (Portfolio Demo)",
    template: "%s | London Boy (Portfolio Demo)",
  },
  description:
    "Free standalone portfolio demonstration of the London Boy direct-to-consumer clothing e-commerce experience. Browser-only simulated local storage with zero cloud dependencies.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${manrope.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-white text-brand-primary font-sans antialiased min-h-screen flex flex-col selection:bg-brand-accent selection:text-white"
        suppressHydrationWarning
      >
        <DemoProvider>
          <DemoBanner />
          <StorefrontHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <StorefrontFooter />
          <CartDrawer />
          <ToastContainer />
          <StorageInspector />
        </DemoProvider>
      </body>
    </html>
  )
}
