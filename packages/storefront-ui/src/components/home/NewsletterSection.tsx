"use client"

import React, { useState } from "react"
import { CheckIcon, EnvelopeIcon } from "../icons"

export interface NewsletterSectionProps {
  title?: string
  description?: string
  onSubscribe?: (email: string) => Promise<{ success: boolean; message?: string }>
}

export function NewsletterSection({
  title = "The London Boy Dispatch",
  description = "Join our private registry for seasonal capsule releases, archive access, and 10% off your initial order.",
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
    <section className="py-16 sm:py-20 bg-brand-secondary border-b border-brand-border text-center">
      <div className="content-container max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <span className="badge-tag">Private Dispatch</span>
          <h2 className="font-display text-2xl sm:text-3xl text-brand-primary font-normal">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {isSubscribed ? (
          <div className="p-4 bg-brand-accent/15 border border-brand-accent text-brand-accent text-xs font-medium max-w-md mx-auto flex items-center justify-center gap-2 animate-enter">
            <CheckIcon className="w-4 h-4 text-brand-accent flex-shrink-0" />
            <span>Thank you for subscribing. Use code <strong>LONDON10</strong> at checkout.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <EnvelopeIcon className="w-4 h-4 text-brand-muted/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full pl-10 pr-3 py-3 bg-white border border-brand-border text-xs text-brand-primary placeholder:text-brand-muted/70 focus:outline-none focus:border-brand-primary"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="contrast-btn text-xs uppercase tracking-wider disabled:opacity-50"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
