"use client"

import React, { useState } from "react"
import { requestPasswordReset } from "@lib/data/customer"
import Spinner from "@modules/common/icons/spinner"

type ForgotPasswordProps = {
  setCurrentView: (view: "log-in" | "register") => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setCurrentView }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setMessage(null)
    setErrorMessage(null)

    const res = await requestPasswordReset(email)

    setIsLoading(false)
    if (res.success) {
      setMessage("If an account exists with this email, a password reset link has been sent.")
      setEmail("")
    } else {
      setErrorMessage(res.error || "Unable to process request.")
    }
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center">
      <h1 className="font-display text-2xl uppercase tracking-wider text-brand-primary mb-2">
        Reset Password
      </h1>
      <p className="text-center text-xs text-brand-primary/70 mb-6 leading-relaxed">
        Enter the email address associated with your London Boy account to receive a secure reset link.
      </p>

      {message ? (
        <div className="w-full p-4 bg-green-50 border border-brand-accent/30 text-brand-accent text-xs space-y-3 text-center">
          <p className="font-medium">{message}</p>
          <button
            type="button"
            onClick={() => setCurrentView("log-in")}
            className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary underline"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary mb-1">
              Email Address
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={isLoading}
              className="w-full px-3 py-2.5 bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-primary"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-brand-accent-alt/30 text-brand-accent-alt text-[11px]">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full py-3.5 bg-brand-primary hover:bg-black text-white text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Spinner className="animate-spin text-white" />}
            <span>{isLoading ? "Sending..." : "Send Reset Link &rarr;"}</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setCurrentView("log-in")}
              className="text-xs text-brand-primary/70 hover:text-brand-primary underline transition-colors"
            >
              Remember your password? Sign in
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default ForgotPassword
