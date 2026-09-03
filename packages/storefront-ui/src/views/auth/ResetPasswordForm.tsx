"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { LinkComponent } from "../../types"

export interface ResetPasswordFormProps {
  email?: string
  token?: string
  onSubmit?: (password: string, confirmPassword: string) => void | Promise<void>
  isLoading?: boolean
  errorMessage?: string | null
  successMessage?: string | null
  linkComponent?: LinkComponent
  loginHref?: string
}

export function ResetPasswordForm({
  email,
  token,
  onSubmit,
  isLoading = false,
  errorMessage,
  successMessage,
  linkComponent: LinkComp = Link,
  loginHref = "/account",
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.")
      return
    }

    if (onSubmit) {
      onSubmit(password, confirmPassword)
    }
  }

  const effectiveError = errorMessage || localError

  return (
    <div className="w-full space-y-6" data-testid="reset-password-page">
      {email && (
        <p className="text-xs text-brand-muted text-center">
          Updating credentials for <strong>{email}</strong>
        </p>
      )}

      {token === "" && (
        <div className="p-3 bg-red-50 border border-rose-300 text-rose-800 text-xs">
          Reset token is missing or expired. Please request a new password reset link.
        </div>
      )}

      {successMessage ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-3">
          <p className="font-semibold text-sm">✓ Password Updated</p>
          <p>{successMessage}</p>
          <LinkComp
            href={loginHref}
            className="inline-block mt-2 px-5 py-2.5 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
          >
            Sign In Now
          </LinkComp>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            name="new_password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isLoading || token === ""}
            data-testid="new-password-input"
          />

          <Input
            label="Confirm New Password"
            name="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={isLoading || token === ""}
            data-testid="confirm-password-input"
          />

          {effectiveError && (
            <div
              className="p-3 bg-red-50 border border-rose-300 text-rose-800 text-xs font-medium"
              data-testid="reset-password-error"
            >
              {effectiveError}
            </div>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading || token === "" || !password || !confirmPassword}
              className="w-full h-12 text-xs font-bold uppercase tracking-widest shadow-sm"
              data-testid="reset-password-submit-button"
            >
              Set New Password &rarr;
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
