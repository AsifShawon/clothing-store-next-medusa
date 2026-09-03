import React from "react"

export default function Loading() {
  return (
    <div className="content-container py-24 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-widest text-grey-50 font-medium">Loading Garments...</p>
    </div>
  )
}
