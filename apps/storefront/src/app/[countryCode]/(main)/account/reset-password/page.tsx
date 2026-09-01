"use client"

import React, { useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { resetPassword } from "@lib/data/customer"
import Spinner from "@modules/common/icons/spinner"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  params: Promise<{ countryCode: string }>
}

export default function ResetPasswordPage({ params }: Props) {
  const { countryCode } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      setErrorMessage("Reset token is missing or invalid.")
      return
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const res = await resetPassword(token, password)
    setIsLoading(false)

    if (res.success) {
      setIsSuccess(true)
      setTimeout(() => {
        router.push(`/${countryCode}/account`)
      }, 2500)
    } else {
      setErrorMessage(res.error || "Failed to reset password. The link may have expired.")
    }
  }

  return (
    <div className="bg-white py-16 min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-brand-secondary/50 border border-brand-border space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl uppercase tracking-wider text-brand-primary">
            Set New Password
          </h1>
          <p className="text-xs text-brand-primary/70">
            {email ? `Updating credentials for ${email}` : "Enter your new password below."}
          </p>
        </div>

        {isSuccess ? (
          <div className="p-4 bg-green-50 border border-brand-accent/30 text-brand-accent text-xs text-center space-y-3">
            <p className="font-semibold text-sm">✓ Password Reset Successfully!</p>
            <p>Redirecting you to your account sign-in...</p>
            <LocalizedClientLink
              href="/account"
              className="inline-block mt-2 px-4 py-2 bg-brand-primary text-white text-[11px] font-heading font-semibold uppercase tracking-wider"
            >
              Sign In Now
            </LocalizedClientLink>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            {!token && (
              <div className="p-3 bg-red-50 border border-brand-accent-alt/30 text-brand-accent-alt text-[11px]">
                No reset token provided. Please request a new password reset link.
              </div>
            )}

            <div>
              <label htmlFor="new-password" className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary mb-1">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                disabled={isLoading || !token}
                className="w-full px-3 py-2.5 bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-primary mb-1">
                Confirm New Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                disabled={isLoading || !token}
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
              disabled={isLoading || !token || !password || !confirmPassword}
              className="w-full py-3.5 bg-brand-primary hover:bg-black text-white text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner className="animate-spin text-white" />}
              <span>{isLoading ? "Updating..." : "Update Password &rarr;"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
