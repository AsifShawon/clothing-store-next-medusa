"use client"

import React from "react"
import { LinkComponent } from "../../types"

export interface AuthShellProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  linkComponent?: LinkComponent
}

export function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="w-full flex justify-center px-4 sm:px-8 py-12 sm:py-16 bg-white min-h-[60vh]">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="text-center mb-8 space-y-2">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-brand-muted">
            London Boy Atelier
          </span>
          <h1 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-brand-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  )
}
