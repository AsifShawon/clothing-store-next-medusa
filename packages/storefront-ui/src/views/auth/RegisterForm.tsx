"use client"

import React, { useState } from "react"
import Link from "next/link"
import { RegisterFormData } from "@dtc/commerce-contracts"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { LinkComponent } from "../../types"

export interface RegisterFormProps {
  initialData?: Partial<RegisterFormData>
  onSubmit?: (e: React.FormEvent) => void
  action?: (formData: FormData) => void
  onNavigateToLogin?: () => void
  isLoading?: boolean
  errorMessage?: string | null
  verificationEmail?: string | null
  submitButtonSlot?: React.ReactNode
  linkComponent?: LinkComponent
  privacyPolicyHref?: string
  termsHref?: string
}

export function RegisterForm({
  initialData,
  onSubmit,
  action,
  onNavigateToLogin,
  isLoading = false,
  errorMessage,
  verificationEmail,
  submitButtonSlot,
  linkComponent: LinkComp = Link,
  privacyPolicyHref = "/privacy-policy",
  termsHref = "/terms-and-conditions",
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    password: initialData?.password || "",
  })

  return (
    <div className="w-full space-y-6" data-testid="register-page">
      {verificationEmail && (
        <div
          className="w-full p-4 bg-brand-surface border border-brand-border text-xs text-brand-primary text-center space-y-1"
          data-testid="register-verification-message"
        >
          <p>
            We sent a verification link to <strong>{verificationEmail}</strong>.
          </p>
          <p className="text-brand-muted text-[11px]">
            Please check your inbox to verify your email, then sign in below.
          </p>
        </div>
      )}

      <form action={action} onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="first_name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </div>

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            required
            autoComplete="email"
            data-testid="email-input"
          />

          <Input
            label="Phone Number (Required for Courier Handover)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+880 1700-000000"
            autoComplete="tel"
            data-testid="phone-input"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <div className="text-[11px] text-brand-muted leading-relaxed">
          By creating an account, you agree to London Boy&apos;s{" "}
          <LinkComp href={privacyPolicyHref} className="underline text-brand-primary">
            Privacy Policy
          </LinkComp>{" "}
          and{" "}
          <LinkComp href={termsHref} className="underline text-brand-primary">
            Terms of Use
          </LinkComp>
          .
        </div>

        {errorMessage && (
          <div
            className="p-3 bg-red-50 border border-rose-300 text-rose-800 text-xs font-medium"
            data-testid="register-error"
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
              data-testid="register-button"
            >
              Create Customer Account &rarr;
            </Button>
          )}
        </div>
      </form>

      {onNavigateToLogin && (
        <div className="text-center pt-2 text-xs text-brand-muted">
          Already have an account?{" "}
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
