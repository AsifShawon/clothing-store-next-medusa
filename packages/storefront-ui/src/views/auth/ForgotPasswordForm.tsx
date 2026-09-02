"use client"

import React, { useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export interface ForgotPasswordFormProps {
  initialEmail?: string
  onSubmit?: (email: string) => void | Promise<void>
  onNavigateToLogin?: () => void
  isLoading?: boolean
  errorMessage?: string | null
  successMessage?: string | null
}

export function ForgotPasswordForm({
  initialEmail = "",
  onSubmit,
  onNavigateToLogin,
  isLoading = false,
  errorMessage,
  successMessage,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(email)
    }
  }

  return (
    <div className="w-full space-y-6" data-testid="forgot-password-page">
      {successMessage ? (
        <div className="w-full p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-3">
          <p className="font-semibold text-sm">✓ Reset Link Dispatched</p>
          <p>{successMessage}</p>
          {onNavigateToLogin && (
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="inline-block mt-2 px-4 py-2 bg-brand-primary text-white text-[11px] font-heading font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
            >
              Back to Sign In
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-brand-muted leading-relaxed">
            Enter the email address tied to your account. We will dispatch a secure reset link.
          </p>

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            disabled={isLoading}
            data-testid="forgot-password-email-input"
          />

          {errorMessage && (
            <div
              className="p-3 bg-red-50 border border-rose-300 text-rose-800 text-xs font-medium"
              data-testid="forgot-password-error"
            >
              {errorMessage}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || !email}
              className="w-full h-12 text-xs font-bold uppercase tracking-widest shadow-sm"
              data-testid="forgot-password-submit-button"
            >
              Send Password Reset Link &rarr;
            </Button>
          </div>
        </form>
      )}

      {onNavigateToLogin && !successMessage && (
        <div className="text-center pt-2 text-xs text-brand-muted">
          Remembered your password?{" "}
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-semibold text-brand-primary underline hover:text-brand-accent transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  )
}
