import React from "react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="content-container py-32 flex flex-col items-center justify-center text-center space-y-6">
      <span className="badge-tag bg-brand-secondary text-brand-accent">404 • Not Found</span>
      <h1 className="font-display text-4xl sm:text-5xl text-brand-primary">Garment Or Page Not Found</h1>
      <p className="text-sm text-grey-60 max-w-md">
        The requested URL or catalog piece could not be located in this portfolio demonstration.
      </p>
      <div className="flex gap-4">
        <Link href="/shop" className="contrast-btn">
          Explore Catalog
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-brand-primary text-sm font-medium text-brand-primary hover:bg-grey-10 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
