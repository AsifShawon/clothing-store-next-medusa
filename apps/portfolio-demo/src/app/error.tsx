"use client"

import React, { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Demo runtime error:", error)
  }, [error])

  return (
    <div className="content-container py-24 flex flex-col items-center justify-center text-center space-y-6">
      <span className="badge-tag bg-rose-50 text-rose-800 border-rose-200">Encountered an issue</span>
      <h2 className="font-display text-3xl text-brand-primary">Something went wrong</h2>
      <p className="text-sm text-grey-60 max-w-md">
        An unexpected error occurred during demo execution. You can attempt to refresh the view or reset demo data.
      </p>
      <div className="flex gap-4">
        <button type="button" onClick={() => reset()} className="contrast-btn">
          Try Again
        </button>
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
