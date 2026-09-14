"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <section className="py-20 bg-brand-primary text-brand-secondary border-b border-white/10">
      <div className="content-container max-w-3xl mx-auto text-center space-y-6">
        <div className="inline-block px-3 py-1 bg-white/10 text-white text-[10px] font-heading font-semibold uppercase tracking-widest">
          VIP Club
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white">
          Join The London Boy Circle
        </h2>

        <p className="text-xs sm:text-sm text-brand-muted max-w-lg mx-auto leading-relaxed">
          Subscribe to receive private drop announcements, bespoke fabric releases, and 10% off your first order with code <span className="text-white font-mono font-bold">LONDON10</span>.
        </p>

        {submitted ? (
          <div className="p-6 bg-white/10 border border-brand-accent/40 text-center space-y-2 animate-fade-in-top">
            <svg className="w-6 h-6 mx-auto text-brand-accent" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
            </svg>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              Welcome to the Circle
            </h4>
            <p className="text-xs text-brand-muted">
              Use promo code <span className="text-white font-mono font-bold">LONDON10</span> at checkout for 10% off your order.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3.5 bg-white/10 border border-white/20 text-white placeholder:text-brand-muted/60 text-xs focus:outline-none focus:border-white focus:bg-white/15 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-white text-brand-primary hover:bg-brand-secondary text-xs font-heading font-semibold uppercase tracking-widest transition-colors flex items-center justify-center min-w-[120px]"
            >
              {loading ? "Joining..." : "Subscribe"}
            </button>
          </form>
        )}

        <p className="text-[11px] text-brand-muted/60">
          By subscribing, you agree to our{" "}
          <LocalizedClientLink href="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </LocalizedClientLink>
          . Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
