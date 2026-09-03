"use client"

import React, { useState } from "react"
import { CheckIcon, EnvelopeIcon } from "../icons"

export interface NewsletterSectionProps {
  title?: string
  description?: string
  onSubscribe?: (email: string) => Promise<{ success: boolean; message?: string }>
}

export function NewsletterSection({
  title = "Private Members Registry",
  description = "Join our intimate registry for advance capsule releases, Dhaka tailoring archives, and a 10% welcome privilege.",
  onSubscribe,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) return

    setIsLoading(true)
    if (onSubscribe) {
      await onSubscribe(email)
    }
    setIsLoading(false)
    setIsSubscribed(true)
  }

  return (
    <section className="py-16 sm:py-24 bg-brand-surface border-b border-brand-border/80 text-center">
      <div className="editorial-container max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-accent block">
            Private Members Club
          </span>
          <h2 className="font-display text-2xl sm:text-4xl text-brand-primary font-normal tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed font-sans">
            {description}
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 rounded-xl bg-brand-secondary border border-brand-border text-brand-primary text-xs font-heading font-semibold max-w-md mx-auto flex items-center justify-center gap-2.5 animate-mega-enter shadow-xs">
            <CheckIcon className="w-4 h-4 text-brand-accent flex-shrink-0" />
            <span>Welcome to the Private Club. Use code <strong>LONDON10</strong> on your inaugural order.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <EnvelopeIcon className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-brand-border rounded-full text-xs font-heading text-brand-primary placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary shadow-xs"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="pill-btn px-7 py-3.5 disabled:opacity-50"
            >
              {isLoading ? "Enrolling..." : "Join Registry"}
            </button>
          </form>
        )}

        <p className="text-[10px] text-brand-muted uppercase tracking-wider font-heading">
          Zero spam. Unsubscribe at any time. Read our Privacy Policy.
        </p>
      </div>
    </section>
  )
}
