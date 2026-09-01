import React from "react"

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-brand-primary focus:text-white focus:text-xs focus:font-heading focus:font-semibold focus:uppercase focus:tracking-wider focus:shadow-xl focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all duration-150"
    >
      Skip to main content
    </a>
  )
}
