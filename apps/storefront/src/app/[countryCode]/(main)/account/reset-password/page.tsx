"use client"

import React, { useState, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthShell, ResetPasswordForm } from "@dtc/storefront-ui"
import { resetPassword } from "@lib/data/customer"
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

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleReset = async (password: string) => {
    if (!token) {
      setErrorMessage("Reset token is missing or invalid.")
      return
    }

    setIsLoading(true)
    setErrorMessage(null)

    const res = await resetPassword(token, password)
    setIsLoading(false)

    if (res.success) {
      setSuccessMessage("Your password has been reset successfully. Redirecting you to sign in...")
      setTimeout(() => {
        router.push(`/${countryCode}/account`)
      }, 2000)
    } else {
      setErrorMessage(res.error || "Failed to reset password. The link may have expired.")
    }
  }

  return (
    <AuthShell
      title="Set New Password"
      subtitle="Enter and confirm your new secure credentials below."
      linkComponent={LocalizedClientLink}
    >
      <ResetPasswordForm
        email={email}
        token={token}
        onSubmit={handleReset}
        isLoading={isLoading}
        errorMessage={errorMessage}
        successMessage={successMessage}
        linkComponent={LocalizedClientLink}
        loginHref={`/${countryCode}/account`}
      />
    </AuthShell>
  )
}
