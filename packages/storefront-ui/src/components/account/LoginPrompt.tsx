"use client"

import React, { useState } from "react"
import { ArrowRightIcon, UserIcon } from "../icons"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export interface LoginPromptProps {
  isSimulatedDemo?: boolean
  onDemoLogin?: () => void
  demoSlot?: React.ReactNode
  onLogin?: (email: string, pass: string) => Promise<void> | void
  onRegister?: (data: {
    email: string
    password?: string
    firstName: string
    lastName: string
    phone?: string
  }) => Promise<void> | void
}

export function LoginPrompt({
  isSimulatedDemo = false,
  onDemoLogin,
  demoSlot,
  onLogin,
  onRegister,
}: LoginPromptProps) {
  const [tab, setTab] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onLogin) return
    setErrorMessage("")
    setIsLoading(true)
    try {
      await onLogin(email, password)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in. Please verify your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onRegister) return
    setErrorMessage("")
    setIsLoading(true)
    try {
      await onRegister({ email, password, firstName, lastName, phone })
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.")
    } finally {
      setIsLoading(false)
    }
  }

  // Portfolio Demo Mode Login
  if (isSimulatedDemo) {
    return (
      <div className="content-container py-16 sm:py-24 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-brand-primary border border-brand-border">
          <UserIcon className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl text-brand-primary">Customer Portal</h1>
          <p className="text-xs text-brand-muted leading-relaxed">
            This is a portfolio demonstration environment. No real credentials are required. Click below to continue with the seeded demo customer session.
          </p>
        </div>

        {demoSlot || (
          <div className="p-5 bg-brand-surface border border-brand-border space-y-4">
            <div className="text-xs text-left space-y-1.5 text-brand-primary">
              <p>
                <strong>Customer:</strong> Asif Shawon
              </p>
              <p className="text-brand-muted">
                <strong>Email:</strong> customer@londonboy.uk
              </p>
              <p className="text-brand-muted">
                <strong>Default Destination:</strong> Banani, Dhaka 1213
              </p>
            </div>
            {onDemoLogin && (
              <Button
                type="button"
                onClick={onDemoLogin}
                variant="primary"
                className="w-full h-11 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Continue as Demo Customer</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Real Production Login / Register Form
  return (
    <div className="content-container py-16 sm:py-24 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl text-brand-primary">
          {tab === "login" ? "Sign In to Your Account" : "Create Customer Account"}
        </h1>
        <p className="text-xs text-brand-muted">
          {tab === "login"
            ? "Access your saved addresses, track Dhaka dispatches, and manage details."
            : "Sign up to track orders and save your preferred delivery locations."}
        </p>
      </div>

      <div className="flex border-b border-brand-border">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`flex-1 py-3 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
            tab === "login"
              ? "border-b-2 border-brand-primary text-brand-primary"
              : "text-brand-muted hover:text-brand-primary"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 py-3 text-xs font-heading font-semibold uppercase tracking-wider transition-colors ${
            tab === "register"
              ? "border-b-2 border-brand-primary text-brand-primary"
              : "text-brand-muted hover:text-brand-primary"
          }`}
        >
          Create Account
        </button>
      </div>

      {tab === "login" ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          {errorMessage && (
            <p className="text-xs text-rose-700 font-medium">{errorMessage}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full h-11 text-xs font-bold uppercase tracking-wider"
          >
            Sign In
          </Button>
        </form>
      ) : (
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+880 1700-000000"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          {errorMessage && (
            <p className="text-xs text-rose-700 font-medium">{errorMessage}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full h-11 text-xs font-bold uppercase tracking-wider"
          >
            Register
          </Button>
        </form>
      )}
    </div>
  )
}
