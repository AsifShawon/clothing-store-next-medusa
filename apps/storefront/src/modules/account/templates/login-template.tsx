"use client"

import React, { useState, useActionState } from "react"
import {
  AuthShell,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from "@dtc/storefront-ui"
import { login, signup, requestPasswordReset } from "@lib/data/customer"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)
  const [loginMessage, loginFormAction] = useActionState(login, null)
  const [registerMessage, registerFormAction] = useActionState(signup, null)
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState<string | null>(null)
  const [forgotError, setForgotError] = useState<string | null>(null)

  const handleForgotPassword = async (email: string) => {
    setForgotLoading(true)
    setForgotMessage(null)
    setForgotError(null)
    const res = await requestPasswordReset(email)
    setForgotLoading(false)
    if (res.success) {
      setForgotMessage("If an account exists with this email, a password reset link has been dispatched.")
    } else {
      setForgotError(res.error || "Unable to process password reset request.")
    }
  }

  return (
    <div className="w-full">
      {currentView === LOGIN_VIEW.SIGN_IN && (
        <AuthShell
          title="Customer Portal"
          subtitle="Sign in to access your London Boy orders, addresses, and wardrobe."
          linkComponent={LocalizedClientLink}
        >
          <LoginForm
            action={loginFormAction}
            errorMessage={loginMessage?.state === "error" ? loginMessage.error : null}
            verificationEmail={
              loginMessage?.state === "verification_required" ? loginMessage.email : null
            }
            onNavigateToRegister={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            onNavigateToForgotPassword={() => setCurrentView(LOGIN_VIEW.FORGOT_PASSWORD)}
            submitButtonSlot={
              <SubmitButton
                data-testid="sign-in-button"
                className="w-full h-12 text-xs font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-accent transition-colors"
              >
                Sign In &rarr;
              </SubmitButton>
            }
          />
        </AuthShell>
      )}

      {currentView === LOGIN_VIEW.REGISTER && (
        <AuthShell
          title="Create Account"
          subtitle="Register your customer profile for express checkout and order history."
          linkComponent={LocalizedClientLink}
        >
          <RegisterForm
            action={registerFormAction}
            errorMessage={registerMessage?.state === "error" ? registerMessage.error : null}
            verificationEmail={
              registerMessage?.state === "verification_required" ? registerMessage.email : null
            }
            onNavigateToLogin={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            linkComponent={LocalizedClientLink}
            submitButtonSlot={
              <SubmitButton
                data-testid="register-button"
                className="w-full h-12 text-xs font-bold uppercase tracking-widest bg-brand-primary text-white hover:bg-brand-accent transition-colors"
              >
                Create Account &rarr;
              </SubmitButton>
            }
          />
        </AuthShell>
      )}


      {currentView === LOGIN_VIEW.FORGOT_PASSWORD && (
        <AuthShell
          title="Reset Password"
          subtitle="Enter your account email to receive a secure recovery link."
          linkComponent={LocalizedClientLink}
        >
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            isLoading={forgotLoading}
            successMessage={forgotMessage}
            errorMessage={forgotError}
            onNavigateToLogin={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          />
        </AuthShell>
      )}
    </div>
  )
}

export default LoginTemplate
