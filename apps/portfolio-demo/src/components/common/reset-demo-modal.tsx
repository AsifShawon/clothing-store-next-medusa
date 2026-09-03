"use client"

import React, { useState } from "react"
import { useDemo } from "@lib/demo-context"
import { ArrowPath, ExclamationCircle } from "@medusajs/icons"

interface ResetDemoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResetDemoModal({ isOpen, onClose }: ResetDemoModalProps) {
  const { resetDemoData } = useDemo()
  const [isResetting, setIsResetting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = () => {
    setIsResetting(true)
    setTimeout(() => {
      resetDemoData()
      setIsResetting(false)
      onClose()
    }, 400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary/60 backdrop-blur-sm animate-enter"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white border border-brand-border max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center flex-shrink-0 text-brand-accent">
            <ArrowPath className="w-5 h-5 animate-spin-reverse" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg text-brand-primary">Reset Demo Data</h3>
            <p className="text-sm text-grey-60 mt-2 leading-relaxed">
              This will reset browser localStorage and restore all initial London Boy products, variants, sample orders,
              promotions, and customer records to their default seed state.
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-brand-card border border-brand-border flex items-center gap-2 text-xs text-grey-70">
          <ExclamationCircle className="w-4 h-4 text-brand-accent flex-shrink-0" />
          <span>Any custom products, orders, or promo codes created in this browser session will be reverted.</span>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-grey-70 hover:text-brand-primary font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isResetting}
            className="contrast-btn flex items-center gap-2"
          >
            {isResetting ? "Resetting..." : "Confirm Reset"}
          </button>
        </div>
      </div>
    </div>
  )
}
