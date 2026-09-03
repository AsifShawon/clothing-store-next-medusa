"use client"

import React from "react"
import { useDemo } from "@lib/demo-context"
import { CheckCircle, XCircle, InformationCircleSolid } from "@medusajs/icons"

export function ToastContainer() {
  const { toasts, removeToast } = useDemo()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-brand-primary text-white p-4 shadow-xl border border-brand-accent/40 flex items-start gap-3 animate-slide-in"
          role="alert"
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === "success" && <CheckCircle className="text-emerald-400 w-5 h-5" />}
            {toast.type === "error" && <XCircle className="text-rose-400 w-5 h-5" />}
            {toast.type === "info" && <InformationCircleSolid className="text-brand-muted w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
            {toast.description && <p className="text-xs text-grey-30 mt-0.5">{toast.description}</p>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-grey-40 hover:text-white text-xs px-1 py-0.5"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
