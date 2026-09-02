import React from "react"
import Link from "next/link"

export function AnnouncementBar() {
  return (
    <aside
      aria-label="Store Announcement"
      className="bg-brand-primary text-brand-secondary border-b border-brand-primary/40 px-4 py-2 text-[11px] font-medium tracking-wide uppercase text-center flex items-center justify-center gap-3 transition-colors"
    >
      <span>Complimentary Delivery Across Bangladesh On Orders Over ৳3,000</span>
      <span className="hidden sm:inline text-brand-accent">•</span>
      <span className="hidden sm:inline">
        Use Code <strong className="text-white font-bold tracking-wider">LONDON10</strong> for 10% Off
      </span>
      <Link
        href="/shop"
        className="hidden md:inline text-brand-sand underline underline-offset-4 hover:text-white transition-colors"
      >
        Shop New Season
      </Link>
    </aside>
  )
}
