"use client"

import React, { useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"

export interface LoginFormProps {
  initialEmail?: string
  onSubmit?: (e: React.FormEvent) => void
  action?: (formData: FormData) => void
  onNavigateToRegister?: () => void
  onNavigateToForgotPassword?: () => void
  isLoading?: boolean
  errorMessage?: string | null
  verificationEmail?: string | null
  submitButtonSlot?: React.ReactNode
}

export function LoginForm({
  initialEmail = "",
  onSubmit,
  action,
  onNavigateToRegister,
  onNavigateToForgotPassword,
  isLoading = false,
  errorMessage,
  verificationEmail,
  submitButtonSlot,
}: LoginFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState("")

  return (
    <div className="w-full space-y-6" data-testid="login-page">
      {verificationEmail && (
        <div
          className="w-full p-4 bg-brand-surface border border-brand-border text-xs text-brand-primary text-center space-y-1"
          data-testid="login-verification-message"
        >
          <p>
            We sent a verification link to <strong>{verificationEmail}</strong>.
          </p>
          <p className="text-brand-muted text-[11px]">
            Please check your email to verify your account, then sign in below.
          </p>
        </div>
      )}

      <form action={action} onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-3">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            data-testid="email-input"
          />

          <div>
            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              data-testid="password-input"
            />
            {onNavigateToForgotPassword && (
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-[11px] font-medium text-brand-muted hover:text-brand-primary underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div
            className="p-3 bg-red-50 border border-rose-300 text-rose-800 text-xs font-medium"
            data-testid="login-error-message"
          >
            {errorMessage}
          </div>
        )}

        <div className="pt-2">
          {submitButtonSlot || (
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full h-12 text-xs font-bold uppercase tracking-widest shadow-sm"
              data-testid="sign-in-button"
            >
              Sign In &rarr;
            </Button>
          )}
        </div>
      </form>

      {onNavigateToRegister && (
        <div className="text-center pt-2 text-xs text-brand-muted">
          Not a member yet?{" "}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-semibold text-brand-primary underline hover:text-brand-accent transition-colors"
            data-testid="register-button"
          >
            Create an Account
          </button>
        </div>
      )}
    </div>
  )
}
